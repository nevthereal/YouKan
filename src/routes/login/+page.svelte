<script>
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { DoorOpen } from 'lucide-svelte';
</script>

<button
	onclick={async () => {
		await authClient(page.url.origin).signIn.social({
			provider: 'github',
			callbackURL: '/board'
		});
	}}
	class="flex items-center gap-2 rounded-2xl border-2 p-2 text-lg font-bold"
	><DoorOpen /> Sign in with GitHub</button
>
