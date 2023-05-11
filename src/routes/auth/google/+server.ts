import type { RequestHandler } from './$types';
import { googleProvider } from '$lib/auth/google';

export const GET: RequestHandler = async () => {
    const authUrl = googleProvider.getAuthUrl();

    return new Response(undefined, {
        status: 302,
        headers: {
            location: authUrl
        }
    });
};
