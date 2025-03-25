<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { LogOut } from 'lucide-svelte';
	import '../app.css';
	import { goto } from '$app/navigation';

	let { children, data } = $props();
</script>

<nav class="flex items-center justify-between p-8">
	<a href="/" class="text-5xl font-black italic">YK</a>
	{#if data.globalUser}
		<button
			onclick={async () => {
				await authClient(page.url.origin).signOut();
				goto('/');
			}}
			class="flex items-center gap-2 rounded-lg border-2 p-2 text-sm font-bold"
			><LogOut size={20} /> Sign Out</button
		>
	{/if}
</nav>
<main class="px-8">
	{@render children()}
</main>
