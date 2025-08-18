<script lang="ts">
	import { clearDate, getProject, updateDate } from '$lib/projects.remote';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import { Calendar } from '$lib/components/ui/calendar';
	import StatusBadge from './StatusBadge.svelte';
	import { getLocalTimeZone, today, type DateValue, DateFormatter } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { Sticker, Calendar as CalendarIcon, Trash2 } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import type { Project } from '$lib/server/db/schema';

	let { project }: { project: Project } = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let date = $state<DateValue>(today(getLocalTimeZone()));
</script>

<Dialog.Root>
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
			<section>
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
										!date && 'text-muted-foreground'
									)}
									{...props}
								>
									<CalendarIcon class="mr-2 size-4" />
									{date ? df.format(date.toDate(getLocalTimeZone())) : 'Select a date'}
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="flex w-auto flex-col items-center p-2">
							<Calendar bind:value={date} type="single" initialFocus />
							<div class="flex w-full gap-2">
								<Button
									class="flex-grow"
									onclick={async () =>
										updateDate({
											newDate: date.toDate(getLocalTimeZone()),
											projectId: project.id
										}).updates(
											getProject(project.id).withOverride((p) =>
												p ? { ...p, date: date.toDate(getLocalTimeZone()) } : undefined
											)
										)}>Update</Button
								>
								{#if project.date}
									<Button
										onclick={async () =>
											await clearDate(project.id).updates(
												getProject(project.id).withOverride((p) =>
													p ? { ...p, date: null } : undefined
												)
											)}
										variant="destructive"><Trash2 /></Button
									>
								{/if}
							</div>
						</Popover.Content>
					</Popover.Root>
				</div>
				<h1 class="mt-8 mb-2 text-xl font-bold">Notes</h1>
			</section>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
