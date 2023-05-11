import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import cookie from 'cookie';

declare global {
    // eslint-disable-next-line no-var
    var session: { [K: string]: string } | undefined;
}

abstract class SessionStore {
    abstract create(userId: string): Promise<string>;
    abstract get(sessionId: string): Promise<string | undefined>;
    abstract delete(sessionId: string): Promise<void>;
}

class MemorySessionStore extends SessionStore {
    async create(userId: string) {
        const sessionId = uuidv4();

        if (globalThis.session === undefined) {
            globalThis.session = {};
        }

        globalThis.session[sessionId] = userId;

        return sessionId;
    }

    async get(sessionId: string) {
        if (globalThis.session === undefined) {
            return undefined;
        }

        const userId = globalThis.session[sessionId];

        if (userId === undefined) {
            return undefined;
        }

        return userId;
    }

    async delete(sessionId: string) {
        if (globalThis.session !== undefined) {
            delete globalThis.session[sessionId];
        }
    }
}

type SessionManagerOptions = {
    secret: string;
    maxAge?: number;
    allowOrigins?: string[];
    cookie?: cookie.CookieSerializeOptions;
};

type UserBase = {
    id: string;
};

type Session<T extends UserBase> = {
    id: string;
    user: T;
};

type TokenPayloadInput<T extends UserBase> = {
    sub: string;
    sessionId: string;
    user: T;
};

type TokenPayload<T extends UserBase> = TokenPayloadInput<T> & {
    iat: number;
    exp: number;
};

class SessionManager<T extends UserBase> {
    protected sessionStore: MemorySessionStore;
    protected secret: string;
    protected maxAge = 60 * 60 * 24 * 30;
    protected allowOrigins: string[] = [];
    protected cookieOptions: cookie.CookieSerializeOptions = {
        path: '/',
        sameSite: 'lax',
        secure: true,
        httpOnly: true
    };

    constructor(sessionStore: MemorySessionStore, options: SessionManagerOptions) {
        this.sessionStore = sessionStore;
        this.secret = options.secret;
        this.maxAge = options.maxAge ?? this.maxAge;
        this.allowOrigins = options.allowOrigins ?? this.allowOrigins;

        if (options.cookie !== undefined) {
            this.cookieOptions = {
                ...this.cookieOptions,
                ...options.cookie
            };
        }
    }

    async createToken(user: T) {
        const sessionId = await this.sessionStore.create(user.id);
        const payload: TokenPayloadInput<T> = {
            sub: user.id,
            sessionId: sessionId,
            user
        };
        const token = jwt.sign(payload, this.secret, {
            algorithm: 'HS256',
            expiresIn: this.maxAge
        });

        return token;
    }

    async decodeToken(token: string) {
        try {
            const payload = jwt.verify(token, this.secret, {
                algorithms: ['HS256']
            }) as TokenPayload<T>;

            return payload;
        } catch (e) {
            return undefined;
        }
    }

    async verify(payload: TokenPayloadInput<T>) {
        const userId = await this.sessionStore.get(payload.sessionId);

        if (userId !== undefined && userId === payload.sub) {
            const session: Session<T> = {
                id: payload.sessionId,
                user: payload.user
            };

            return session;
        }

        return undefined;
    }

    async getSetCookie(user: T | undefined) {
        let setCookie: string;

        if (user === undefined) {
            setCookie = cookie.serialize('token', '', {
                path: this.cookieOptions.path,
                maxAge: 0
            });
        } else {
            const token = await this.createToken(user);
            setCookie = cookie.serialize('token', token, {
                ...this.cookieOptions,
                maxAge: this.maxAge
            });
        }

        return setCookie;
    }

    async getSession(req: Request) {
        const allowOrigins = [new URL(req.url).origin, ...this.allowOrigins];
        const origin = req.headers.get('origin');

        if (req.method !== 'GET' && (origin === null || !allowOrigins.includes(origin))) {
            return undefined;
        }

        const cookieHeader = req.headers.get('cookie');
        const { token } = cookie.parse(cookieHeader ?? '');

        if (token === undefined) {
            return undefined;
        } else {
            const payload = await this.decodeToken(token);

            if (payload === undefined) {
                return undefined;
            }

            const session = await this.verify(payload);

            return session;
        }
    }
}

type User = {
    id: string;
    name: string;
    email: string;
    picture: string;
    provider: string;
};

export const sessionStore = new MemorySessionStore();
export const sessionManager = new SessionManager<User>(sessionStore, { secret: 'secret' });
