import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    JWT_SECRET,
    UPSTASH_TOKEN,
    UPSTASH_URL
} from '$env/static/private';
import { UpstashRedisAdapter } from '@monban/upstash-redis-adapter';
import { Redis } from '@upstash/redis/cloudflare';
import { Monban } from 'monban';
import { GoogleProvider } from 'monban/providers/google/server';

const redis = new Redis({
    url: UPSTASH_URL,
    token: UPSTASH_TOKEN
});

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
        adapter: new UpstashRedisAdapter({
            session: redis,
            userSession: redis
        }),
        callbacks: {
            async getUser(profile) {
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
