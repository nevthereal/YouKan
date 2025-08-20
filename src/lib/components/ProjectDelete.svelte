<script lang="ts">
	import { deleteProject, getProjects } from '$lib/projects.remote';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';

	let { projectId }: { projectId: number } = $props();

	function handleDelete() {
		toast.promise(
			deleteProject(projectId).updates(
				getProjects().withOverride((p) => p.filter((prj) => prj.id !== projectId))
			),
			{
				loading: 'Deleting project...',
				success: `Project deleted`,
				error: 'Failed to delete project'
			}
		);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger title="Delete" id="notes" class="invisible group-hover:visible active:scale-98">
		<Trash2 size={20} />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="w-min" showCloseButton={false}>
			<Dialog.Title class="mx-auto text-2xl">Delete project?</Dialog.Title>
			<div class="flex gap-2">
				<Dialog.Close class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}
					>Yeah</Dialog.Close
				>
				<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Nevermind</Dialog.Close>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
