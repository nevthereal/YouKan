<script lang="ts">
	import type { Status } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';

	let { status }: { status: Status[number] } = $props();
</script>

<span
	class={cn(
		'w-fit rounded-full px-2 py-1 capitalize',
		status === 'To Do'
			? 'bg-todo/50'
			: status === 'Re Record'
				? 'bg-rerecord/50'
				: status === 'In Progress'
					? 'bg-inprogress/50'
					: status === 'Done'
						? 'bg-done/50'
						: 'bg-scrap/50'
	)}
>
	{status}
</span>
