import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { Monban, type TokenPayloadInput } from 'monban';
import { GoogleProvider } from 'monban/providers/google/server';

export type SessionUser = {
    id: string;
    name: string;
    email: string;
};

export const monban = new Monban(
    {
        google: new GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    },
    {
        secret: JWT_SECRET,
        callback: {
            async createToken(userId, authInfo) {
                const payload: TokenPayloadInput<SessionUser> = {
                    sub: userId,
                    sessionId: undefined,
                    user: {
                        id: userId,
                        name: authInfo.name,
                        email: authInfo.email
                    }
                };

                return payload;
            }
        }
    }
);

export type MyMonban = typeof monban;
