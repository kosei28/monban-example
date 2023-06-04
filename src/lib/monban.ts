import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } from '$env/static/private';
import { Monban } from 'monban';
import { GoogleProvider } from 'monban/providers/google/server';

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
            async authenticate(profile) {
                return profile;
            }
        }
    }
);

export type MyMonban = typeof monban;
