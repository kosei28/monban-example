<script lang="ts">
    import { browser } from '$app/environment';
    import type { SessionUser } from '$lib/monban';
    import type { Session } from 'monban';
    import { googleSignIn } from 'monban/providers/google/client';

    let session: Session<SessionUser> | undefined = undefined;

    if (browser) {
        getSession();
    }

    async function getSession() {
        const res = await fetch('/monban/me/session');
        session = await res.json();
    }

    async function signIn() {
        await googleSignIn('/monban');
    }

    async function signOut() {
        await fetch('/monban/signout');
        session = undefined;
    }
</script>

<h1>SvelteKit Google Auth</h1>

{#if session === undefined}
    <button on:click={signIn}>Login with Google</button>
{:else}
    <p>{session.user.name}</p>
    <button on:click={signOut}>Logout</button>
{/if}
