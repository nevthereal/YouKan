<script>
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { DoorOpen } from 'lucide-svelte';
</script>

<Button
	variant="outline"
	size="lg"
	onclick={async () => {
		await authClient.signIn.social({
			provider: 'github',
			callbackURL: '/'
		});
	}}><DoorOpen /> Sign in with GitHub</Button
>
