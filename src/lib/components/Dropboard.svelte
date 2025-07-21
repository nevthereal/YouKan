<script lang="ts">
	import { drop, getProjects, newProject } from '$lib/projects.remote';
	import type { Project } from '$lib/server/db/schema';
	import { cn, type STATUS_VALUES } from '$lib/utils';
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import ProjectCard from './ProjectCard.svelte';
	import { Plus } from 'lucide-svelte';

	let { statusValue }: { statusValue: (typeof STATUS_VALUES)[number] } = $props();

	async function handleDrop(state: DragDropState<Project>) {
		const { draggedItem, targetContainer } = state;

		if (!targetContainer) return;

		drop({ id: draggedItem.id, target: targetContainer }).updates(
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
	<div class="mb-4 flex items-center justify-between">
		<h2 class="font-semibold capitalize">
			{statusValue}
		</h2>
		<span class="px-2.5 py-0.5 text-sm">
			<svelte:boundary>
				{#snippet pending()}
					0
				{/snippet}
				{(await getProjects()).filter((p) => p.status === statusValue).length}
			</svelte:boundary>
		</span>
	</div>

	<div class="space-y-3">
		<svelte:boundary>
			{#snippet pending()}
				<p class="font-mono italic">Loading "{statusValue}" projects...</p>
			{/snippet}
			{#each (await getProjects()).filter((p) => p.status === statusValue) as prj (prj.id)}
				<ProjectCard {prj} status={statusValue} />
			{/each}
		</svelte:boundary>
		{#if statusValue === 'To Do'}
			{#if newItem}
				<form
					{...newProject.enhance(async ({ submit }) => {
						submit().updates(getProjects());

						newItem = false;
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
</div>
