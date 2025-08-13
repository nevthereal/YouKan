<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { LogOut } from 'lucide-svelte';
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const session = authClient(page.url.origin).getSession();
</script>

<Toaster />

<nav class="flex items-center justify-between p-8">
	<svelte:boundary>
		{#snippet pending()}
			<p class="text-5xl font-black italic">YK</p>
		{/snippet}
		<a href={(await session).data != null ? '/' : '/home'} class="text-5xl font-black italic">YK</a>
		{#if (await session).data != null}
			<button
				onclick={async () => {
					await authClient(page.url.origin)
						.signOut()
						.then(() => goto('/login'));
				}}
				class="rounded-button flex items-center gap-2 border-2 p-2 text-sm font-bold"
				><LogOut size={20} /> Sign Out</button
			>
		{/if}
	</svelte:boundary>
</nav>
<main class="px-8 pb-8">
	{@render children()}
</main>
