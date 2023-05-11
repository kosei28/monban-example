import type { RequestHandler } from './$types';
import { sessionManager, sessionStore } from '$lib/session/server';

export const GET: RequestHandler = async ({ request }) => {
    const session = await sessionManager.getSession(request);

    if (session !== undefined) {
        await sessionStore.delete(session.id);
    }

    const setCookie = await sessionManager.getSetCookie(undefined);

    return new Response(undefined, {
        headers: {
            'set-cookie': setCookie
        }
    });
};
