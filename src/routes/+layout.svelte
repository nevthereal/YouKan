<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { LogOut } from 'lucide-svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

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
			<Button
				size="lg"
				onclick={async () => {
					await authClient(page.url.origin)
						.signOut()
						.then(() => goto('/login'));
				}}><LogOut size={20} /> Sign Out</Button
			>
		{/if}
	</svelte:boundary>
</nav>
<main class="max-w-full overflow-x-hidden">
	{@render children()}
</main>
