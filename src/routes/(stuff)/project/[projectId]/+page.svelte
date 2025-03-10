<script lang="ts">
	import { cn } from '$lib/utils';

	let { data } = $props();

	let { project } = $derived(data);
</script>

<h1 class="mb-2 text-4xl font-bold">
	<span class="text-muted font-semibold italic">Project:</span>
	{project.title}
</h1>
<p class="flex items-center gap-2">
	{@render statusBadge()}
	{#if project.date}
		<span>{project.date}</span>
	{:else}
		<span class="text-muted italic">No date set</span>
	{/if}
</p>

{#snippet statusBadge()}
	<span
		class={cn(
			'w-fit rounded-full px-2 py-1 capitalize',
			project.status === 'To Do'
				? 'bg-todo/50'
				: project.status === 'Re Record'
					? 'bg-rerecord/50'
					: project.status === 'In Progress'
						? 'bg-inprogress/50'
						: project.status === 'Done'
							? 'bg-done/50'
							: 'bg-scrap/50'
		)}
	>
		{project.status}
	</span>
{/snippet}
