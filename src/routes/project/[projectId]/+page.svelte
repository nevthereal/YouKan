<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data } = $props();

	let { project } = $derived(data);
</script>

<section class="px-8">
	<h1 class="mb-4 text-5xl font-bold">
		{project.title}
	</h1>
	<div class="flex items-center gap-4">
		<StatusBadge status={project.status} />
		{#if project.date}
			<p>{project.date}</p>
		{:else}
			<p class="text-muted italic">No date set</p>
		{/if}
	</div>
	<Calendar />
</section>
