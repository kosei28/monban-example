<script lang="ts">
    import { browser } from '$app/environment';
    import type { User } from '$lib/monban';
    import type { Session } from 'monban';
    import { MonbanClient } from 'monban/client';
    import { GoogleClient } from 'monban/providers/google/client';

    const providerClients = {
        google: new GoogleClient()
    };

    const monbanClient = new MonbanClient<User, typeof providerClients>('/monban', providerClients);

    let loading = true;
    let session: Session<User> | undefined = undefined;

    if (browser) {
        monbanClient.onSessionChange((newSession) => {
            loading = false;
            session = newSession;
        });
    }
</script>

<svelte:head>
    <title>Monban Example</title>
</svelte:head>

<h1>Monban Example</h1>

{#if loading}
    <div>Loading</div>
{:else if session === undefined}
    <button
        on:click={() => {
            monbanClient.signIn.google();
        }}
    >
        Login with Google
    </button>
{:else}
    <div>
        <img src={session.user.picture} alt={session.user.name} />
    </div>
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
