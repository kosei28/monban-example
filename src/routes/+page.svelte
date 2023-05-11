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
        const res = await fetch('/auth/me');
        user = await res.json();
    }

    async function logout() {
        await fetch('/auth/logout');
        user = undefined;
    }
</script>

<h1>SvelteKit Google Auth</h1>

{#if user === undefined}
    <a href="/auth/google">Login with Google</a>
{:else}
    <p>{user.name}</p>
    <button on:click={logout}>Logout</button>
{/if}
