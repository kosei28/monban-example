<script lang="ts">
    import { browser } from '$app/environment';

    type User = {
        id: string;
        name: string;
        email: string;
        picture: string;
        provider: string;
    };

    let user: User | undefined = undefined;

    if (browser) {
        getUser();
    }

    async function getUser() {
        const res = await fetch('/monban/me');
        user = await res.json();
    }

    async function logout() {
        await fetch('/monban/logout');
        user = undefined;
    }
</script>

<h1>SvelteKit Google Auth</h1>

{#if user === undefined}
    <a href="/monban/login/google">Login with Google</a>
{:else}
    <p>{user.name}</p>
    <button on:click={logout}>Logout</button>
{/if}
