<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { cn } from '$lib/utils';

	let { data } = $props();

	let { project } = $derived(data);
</script>

<section class="px-8">
	<h1 class="mb-4 text-5xl font-bold">
		{project.title}
	</h1>
	<p class="flex items-center gap-4">
		<StatusBadge status={project.status} />
		{#if project.date}
			<span>{project.date}</span>
		{:else}
			<span class="text-muted italic">No date set</span>
		{/if}
	</p>
</section>
