<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { drop, getProjects, newProject } from '$lib/projects.remote';
	import type { Project } from '$lib/server/db/schema';
	import { cn, type STATUS_VALUES } from '$lib/utils';
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import ProjectCard from './ProjectCard.svelte';
	import { Loader2, Plus } from 'lucide-svelte';

	let { statusValue }: { statusValue: (typeof STATUS_VALUES)[number] } = $props();

	async function handleDrop(state: DragDropState<Project>) {
		const { draggedItem, targetContainer } = state;

		if (!targetContainer) return;

		drop({ id: draggedItem.id, target: targetContainer as (typeof STATUS_VALUES)[number] }).updates(
			getProjects().withOverride((projects) =>
				projects.map((proj) =>
					proj.id === draggedItem.id
						? { ...proj, status: targetContainer as (typeof STATUS_VALUES)[number] }
						: proj
				)
			)
		);
	}

	let newItem = $state(false);

	$effect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && newItem === true) {
				newItem = false;
			}
		};

		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	let newInput = $state() as HTMLInputElement;
</script>

<div
	class={cn(
		'no-scrollbar rounded-card overflow-scroll border-2 p-4',
		statusValue === 'To Do'
			? 'bg-todo/35'
			: statusValue === 'Re Record'
				? 'bg-rerecord/35'
				: statusValue === 'In Progress'
					? 'bg-inprogress/35'
					: statusValue === 'Done'
						? 'bg-done/35'
						: 'bg-scrap/35'
	)}
	use:droppable={{
		container: statusValue,
		callbacks: { onDrop: handleDrop }
	}}
>
	<svelte:boundary>
		{#snippet pending()}
			<div class="flex justify-between">
				{@render statusName(statusValue)}
				<Loader2 class="animate-spin" />
			</div>
		{/snippet}
		<div class="mb-4 flex items-center justify-between">
			{@render statusName(statusValue)}
			<span class="px-2.5 py-0.5 text-sm">
				<svelte:boundary>
					{(await getProjects()).filter((p) => p.status === statusValue).length}
				</svelte:boundary>
			</span>
		</div>

		<div class="space-y-3">
			{#each (await getProjects()).filter((p) => p.status === statusValue) as prj (prj.id)}
				<ProjectCard project={prj} status={statusValue} />
			{/each}
			{#if statusValue === 'To Do'}
				{#if newItem}
					<form
						{...newProject.enhance(async ({ submit, data }) => {
							try {
								newItem = false;

								toast.promise(() => submit().updates(getProjects()), {
									loading: `Creating project`,
									success: `${data.get('title')} created`,
									error: 'Failed to create project'
								});
							} catch (e) {
								console.error(e);
							}
						})}
					>
						<input
							bind:this={newInput}
							class="bg-dark/10 rounded-card w-full border-2 p-4 text-xl font-bold"
							type="text"
							name="title"
							placeholder="New Project"
						/>
					</form>
				{/if}
				<button
					onclick={() => {
						newItem = true;
						setTimeout(() => {
							newInput.focus();
						}, 20);
					}}
					class="bg-dark/10 rounded-input flex w-full items-center justify-center gap-2 border-2 p-2 text-lg font-bold"
					><Plus size={20} />New Item</button
				>{/if}
		</div>
	</svelte:boundary>
</div>

{#snippet statusName(statusValue: string)}
	<h2 class="font-semibold capitalize">
		{statusValue}
	</h2>
{/snippet}
