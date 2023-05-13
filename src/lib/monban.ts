import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { Monban, type Session } from 'monban';
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
            async createSession(user, accountInfo) {
                const session: Session<SessionUser> = {
                    id: undefined,
                    user: {
                        id: user.id,
                        name: accountInfo.name,
                        email: accountInfo.email
                    }
                };

                return session;
            }
        }
    }
);

export type MyMonban = typeof monban;
