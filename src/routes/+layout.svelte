<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { DoorOpen, LogOut } from 'lucide-svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { authClient } from '$lib/auth-client';
	import { getUser } from '$lib/projects.remote';

	let { children } = $props();
</script>

<Toaster />

<nav class="flex items-center justify-between p-8">
	<svelte:boundary>
		{#snippet pending()}
			<p class="text-5xl font-black italic">YK</p>
		{/snippet}
		<a href="/" class="text-5xl font-black italic">YK</a>
		{#if await getUser()}
			<Button
				onclick={async () => {
					await authClient.signOut().then(() => getUser().refresh());
				}}><LogOut size={20} /> Sign Out</Button
			>
		{:else}
			<Button
				variant="outline"
				onclick={async () => {
					await authClient.signIn.social({
						provider: 'github',
						callbackURL: '/'
					});
				}}><DoorOpen /> Sign in with GitHub</Button
			>
		{/if}
	</svelte:boundary>
</nav>
<main class="max-w-full overflow-x-hidden">
	{@render children()}
</main>
