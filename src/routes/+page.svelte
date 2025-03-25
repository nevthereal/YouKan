<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { invalidateAll } from '$app/navigation';
	import type { Project } from '$lib/server/db/schema/project.sql.js';
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import { cn } from '$lib/utils';
	import { Plus } from 'lucide-svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';

	let { data } = $props();

	const { projects, editProjectForm, statusValues } = $derived(data);

	const projectsByStatus = $derived(
		statusValues.map((status) => ({
			status,
			items: projects.filter((prj) => prj.status === status)
		}))
	);

	async function handleDrop(state: DragDropState<Project>) {
		const { draggedItem, targetContainer } = state;
		if (!targetContainer) return; // Prevent self-placement

		await fetch(`/api/drop?id=${draggedItem.id}&target=${targetContainer}`, {
			method: 'POST'
		}).then(() => invalidateAll());
	}

	let newItem = $state(false);

	const { form, enhance, constraints } = superForm(data.newProjectForm, {
		onSubmit: () => {
			newItem = false;
		}
	});

	$effect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'Escape') {
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

	<div class="no-scrollbar flex gap-6 overflow-x-scroll p-2">
		{#each projectsByStatus as { status, items: projects }}
			<div class="w-80 flex-none">
				<div
					class={cn(
						'no-scrollbar overflow-scroll rounded-2xl border-2 p-4',
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
						// The container is the status of the task. e.g. 'todo', 'in-progress', 'done'
						container: status,
						// When a task is dropped, the handleDrop function is called to update the task's status
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
							<ProjectCard editForm={editProjectForm} {prj} {status} />
						{/each}
						{#if status === 'To Do'}
							{#if newItem}
								<form action="/?/new" id="new-form" use:enhance method="post">
									<input
										bind:this={newInput}
										{...$constraints.title}
										bind:value={$form.title}
										class="w-full rounded-2xl border-2 bg-gray-400/10 p-4 text-xl font-bold"
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
								class="flex w-full items-center justify-center gap-2 rounded-2xl border-2 bg-gray-400/10 p-2 text-lg font-bold"
								><Plus size={20} />New Item</button
							>{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
