<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { invalidateAll } from '$app/navigation';
	import type { Project } from '$lib/server/db/schema/project.sql.js';
	import { droppable, type DragDropState, type DragDropAttributes } from '@thisux/sveltednd';
	import { cn, STATUS_VALUES } from '$lib/utils';
	import { Plus } from 'lucide-svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { type Status } from '$lib/server/db/schema/project.sql';
	import { drop, getProjects, newProject } from '$lib/projects.remote.js';
	import z from 'zod';

	async function handleDrop(state: DragDropState<Project>) {
		const { draggedItem, targetContainer } = state;

		if (!targetContainer) return;

		drop({ id: draggedItem.id, target: targetContainer }).updates(
			getProjects().withOverride((projects) =>
				projects.map((proj) =>
					proj.id === draggedItem.id ? { ...proj, status: targetContainer as Status[number] } : proj
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

<section>
	<div class="mb-4">
		<h1 class="text-2xl font-bold">Board View</h1>
		<p>Drag and drop projects.</p>
	</div>
	<svelte:boundary>
		{#await getProjects()}
			<p>Loading</p>
		{:then projects}
			{@const projectsByStatus = STATUS_VALUES.map((status) => ({
				status,
				items: projects.filter((prj) => prj.status === status)
			}))}
			<div class="no-scrollbar flex gap-6 overflow-x-scroll p-2">
				{#each projectsByStatus as { status, items: projects }}
					<div class="w-80 flex-none">
						<div
							class={cn(
								'no-scrollbar rounded-card overflow-scroll border-2 p-4',
								status === 'To Do'
									? 'bg-todo/35'
									: status === 'Re Record'
										? 'bg-rerecord/35'
										: status === 'In Progress'
											? 'bg-inprogress/35'
											: status === 'Done'
												? 'bg-done/35'
												: 'bg-scrap/35'
							)}
							use:droppable={{
								container: status,
								callbacks: { onDrop: handleDrop }
							}}
						>
							<div class="mb-4 flex items-center justify-between">
								<h2 class="font-semibold capitalize">
									{status}
								</h2>
								<span class="px-2.5 py-0.5 text-sm">
									{projects.length}
								</span>
							</div>

							<div class="space-y-3">
								{#each projects as prj (prj.id)}
									<ProjectCard {prj} {status} />
								{/each}
								{#if status === 'To Do'}
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
					</div>
				{/each}
			</div>
		{/await}
	</svelte:boundary>
</section>
