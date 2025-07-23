<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { LogOut } from 'lucide-svelte';
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children, data } = $props();
</script>

<Toaster />

<nav class="flex items-center justify-between p-8">
	<a href={data.globalUser != null ? '/' : '/home'} class="text-5xl font-black italic">YK</a>
	{#if data.globalUser}
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
</nav>
<main class="px-8 pb-8">
	{@render children()}
</main>
