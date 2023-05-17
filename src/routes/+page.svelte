<script lang="ts">
    import { browser } from '$app/environment';
    import type { MyMonban, SessionUser } from '$lib/monban';
    import type { TokenPayloadInput } from 'monban';
    import { MonbanClient } from 'monban/client';
    import { GoogleClient } from 'monban/providers/google/client';

    const providerClients = {
        google: new GoogleClient()
    };

    const monbanClient = new MonbanClient<MyMonban, typeof providerClients>(
        '/monban',
        providerClients
    );

    let session: TokenPayloadInput<SessionUser> | undefined = undefined;

    if (browser) {
        monbanClient.onSessionChange((newSession) => {
            session = newSession;
        });
    }
</script>

<h1>SvelteKit Google Auth</h1>

{#if session === undefined}
    <button
        on:click={() => {
            monbanClient.signIn.google();
        }}
    >
        Login with Google
    </button>
{:else}
    <div>{session.user.name}</div>
    <div>{session.user.email}</div>
    <button
        on:click={() => {
            monbanClient.signOut();
        }}
    >
        Logout
    </button>
{/if}
