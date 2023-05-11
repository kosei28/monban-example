import type { RequestHandler } from './$types';
import { sessionManager, sessionStore } from '$lib/session/server';

export const GET: RequestHandler = async ({ request }) => {
    const session = await sessionManager.getSession(request);

    if (session === undefined) {
        return new Response(undefined);
    }

    await sessionStore.delete(session.id);

    const setCookie = await sessionManager.getSetCookie(session.user);

    return new Response(JSON.stringify(session.user), {
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'set-cookie': setCookie
        }
    });
};
