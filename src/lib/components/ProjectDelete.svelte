<script lang="ts">
	import { deleteProject, getProjects } from '$lib/projects.remote';
	import { Dialog, Separator } from 'bits-ui';
	import { Trash2, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

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
	<Dialog.Trigger
		onclick={() => console.log('should open')}
		title="Delete"
		id="notes"
		class="invisible group-hover:visible active:scale-98"
	>
		<Trash2 size={20} />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-5 outline-hidden sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Delete project?
			</Dialog.Title>
			<Separator.Root class="bg-muted -mx-5 mt-5 mb-6 block h-px" />

			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
