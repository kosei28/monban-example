import { googleProvider } from '$lib/auth/google';
import type { RequestHandler } from './$types';
import { sessionManager } from '$lib/session/server';

export const GET: RequestHandler = async ({ request }) => {
    const user = await googleProvider.authenticate(request);

    if (user === undefined) {
        return new Response(undefined, {
            status: 302,
            headers: {
                location: '/auth/google'
            }
        });
    }

    const setCookie = await sessionManager.getSetCookie(user);

    return new Response(undefined, {
        status: 302,
        headers: {
            location: '/',
            'set-cookie': setCookie
        }
    });
};
