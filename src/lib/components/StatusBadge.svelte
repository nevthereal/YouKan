<script lang="ts">
	import type { Status } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';
	import Badge from './ui/badge/badge.svelte';

	let { status }: { status: Status[number] } = $props();
</script>

<Badge
	class={cn(
		status === 'To Do'
			? 'bg-todo/50'
			: status === 'Re Record'
				? 'bg-rerecord/50'
				: status === 'In Progress'
					? 'bg-inprogress/50'
					: status === 'Done'
						? 'bg-done/50'
						: 'bg-scrap/50',
		'text-black'
	)}>{status}</Badge
>
