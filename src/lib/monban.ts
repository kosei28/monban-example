import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { Monban, type Session } from 'monban';
import { GoogleProvider, type GoogleProfile } from 'monban/providers/google/server';

export const monban = new Monban(
    {
        google: new GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    },
    {
        secret: JWT_SECRET,
        callbacks: {
            async session(profile) {
                const session: Session<GoogleProfile> = {
                    id: '',
                    user: profile
                };

                return session;
            }
        }
    }
);

export type MyMonban = typeof monban;
