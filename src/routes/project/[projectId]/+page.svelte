<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	let calendar = $state(false);

	let { project } = $derived(data);
</script>

<section class="px-8">
	<h1 class="mb-4 text-5xl font-bold">
		{project.title}
	</h1>
	<div class="relative flex items-center gap-4">
		<StatusBadge status={project.status} />
		<button onclick={() => (calendar = !calendar)}
			>{#if project.date}
				<span>{project.date}</span>
			{:else}
				<span class="text-muted-foreground font-mono">Set date</span>
			{/if}
		</button>
		{#if calendar}
			<div transition:fade={{ duration: 150, easing: cubicInOut }}>
				<Calendar formProps={data.dateForm} />
			</div>
		{/if}
	</div>
</section>
