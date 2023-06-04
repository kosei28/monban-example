import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, REDIS_URL } from '$env/static/private';
import { RedisAdapter } from '@monban/redis-adapter';
import { Redis } from 'ioredis';
import { Monban } from 'monban';
import { GoogleProvider } from 'monban/providers/google/server';

const redis = new Redis(REDIS_URL);

export const monban = new Monban(
    {
        google: new GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    },
    {
        secret: JWT_SECRET,
        maxAge: 60 * 60 * 24 * 180,
        adapter: new RedisAdapter({
            session: redis,
            userSession: redis
        }),
        callbacks: {
            async authenticate(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    picture: profile.picture
                };
            }
        }
    }
);

export type MyMonban = typeof monban;
