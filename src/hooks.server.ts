import type { Handle } from '@sveltejs/kit';
import { monban } from '$lib/monban';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/monban')) {
        return await monban.handleRequest(event.request, '/monban');
    }

    return resolve(event);
};
