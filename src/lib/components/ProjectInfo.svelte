<script lang="ts">
	import { clearDate, getProject, updateDate } from '$lib/projects.remote';
	// import { DatePicker, Dialog, Separator } from 'bits-ui';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import { Calendar } from '$lib/components/ui/calendar';
	import StatusBadge from './StatusBadge.svelte';
	import { getLocalTimeZone, today, type DateValue, DateFormatter } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Sticker, X, Calendar as CalendarIcon } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';

	let { projectId }: { projectId: number } = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue>();
</script>

<Dialog.Root open>
	<Dialog.Trigger
		title="Project Info"
		id="notes"
		class="invisible group-hover:visible active:scale-98"
	>
		<Sticker size={20} />
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>Project Info</Dialog.Title>
			{#await getProject(projectId)}
				<p>Loading...</p>
			{:then project}
				{#if project}
					<section class="px-8">
						<h1 class="mb-4 text-5xl font-bold">
							{project.title}
						</h1>
						<div class="relative flex items-center gap-4">
							<StatusBadge status={project.status} />
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<Button
											variant="outline"
											class={cn(
												'w-[280px] justify-start text-left font-normal',
												!value && 'text-muted-foreground'
											)}
											{...props}
										>
											<CalendarIcon class="mr-2 size-4" />
											{value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date'}
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0">
									<Calendar
										onValueChange={(v) => {
											if (v)
												updateDate({ newDate: v.toDate(getLocalTimeZone()), projectId }).updates(
													getProject(project.id).withOverride((p) =>
														p ? { ...p, date: date.toDate(getLocalTimeZone()) } : undefined
													)
												);
										}}
										bind:value
										type="single"
										initialFocus
									/>
								</Popover.Content>
							</Popover.Root>
						</div>
						<h1 class="mt-8 mb-2 text-xl font-bold">Notes</h1>
					</section>
				{/if}
			{/await}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
