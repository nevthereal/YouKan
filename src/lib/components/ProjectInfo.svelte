<script lang="ts">
	import { clearDate, getProject, updateDate } from '$lib/projects.remote';
	import { DatePicker, Dialog, Separator } from 'bits-ui';
	import StatusBadge from './StatusBadge.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { prettyDate } from '$lib/utils';
	import { Calendar, ChevronLeft, ChevronRight, Sticker, Trash2, X } from 'lucide-svelte';

	let { projectId }: { projectId: number } = $props();

	let date = $state(today(getLocalTimeZone()));
	let modalOpen = $state(false);
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
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-5 outline-hidden sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Project Info
			</Dialog.Title>
			<Separator.Root class="bg-muted -mx-5 mt-5 mb-6 block h-px" />
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
							<DatePicker.Root
								bind:value={date}
								fixedWeeks={true}
								closeOnDateSelect={false}
								bind:open={modalOpen}
							>
								<div>
									<DatePicker.Trigger class="flex items-center gap-2">
										{#if project.date}
											<span class="text-xl">{prettyDate(project.date, 'long')}</span>
										{:else}
											<span class="text-xl">Set date </span>
										{/if}
										<Calendar />
									</DatePicker.Trigger>

									<DatePicker.Content sideOffset={6} class="z-50 mt-2">
										<DatePicker.Calendar
											class="border-dark-10 bg-background-alt shadow-popover rounded-[15px] border p-[22px]"
										>
											{#snippet children({ months, weekdays })}
												<DatePicker.Header class="flex items-center justify-between">
													<DatePicker.PrevButton
														class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
													>
														<ChevronLeft class="size-6" />
													</DatePicker.PrevButton>
													<DatePicker.Heading class="text-[15px] font-medium" />
													<DatePicker.NextButton
														class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
													>
														<ChevronRight class="size-6" />
													</DatePicker.NextButton>
												</DatePicker.Header>
												<div
													class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4"
												>
													{#each months as month}
														<DatePicker.Grid class="w-full border-collapse space-y-1 select-none">
															<DatePicker.GridHead>
																<DatePicker.GridRow class="mb-1 flex w-full justify-between">
																	{#each weekdays as day}
																		<DatePicker.HeadCell
																			class="text-muted-foreground w-10 rounded-md text-xs font-normal!"
																		>
																			<div>{day.slice(0, 2)}</div>
																		</DatePicker.HeadCell>
																	{/each}
																</DatePicker.GridRow>
															</DatePicker.GridHead>
															<DatePicker.GridBody>
																{#each month.weeks as weekDates}
																	<DatePicker.GridRow class="flex w-full">
																		{#each weekDates as date}
																			<DatePicker.Cell
																				{date}
																				month={month.value}
																				class="relative size-10 p-0! text-center text-sm"
																			>
																				<DatePicker.Day
																					class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground group relative inline-flex size-10 items-center justify-center border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap transition-all data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through"
																				>
																					<div
																						class="bg-foreground group-data-selected:bg-background absolute top-[5px] hidden size-1 rounded-full transition-all group-data-today:block"
																					></div>
																					{date.day}
																				</DatePicker.Day>
																			</DatePicker.Cell>
																		{/each}
																	</DatePicker.GridRow>
																{/each}
															</DatePicker.GridBody>
														</DatePicker.Grid>
													{/each}
												</div>
												<div class="flex gap-2">
													<button
														onclick={async () => {
															updateDate({
																newDate: date.toDate(getLocalTimeZone()),
																projectId: project.id
															}).updates(
																getProject(project.id).withOverride((p) =>
																	p ? { ...p, date: date.toDate(getLocalTimeZone()) } : undefined
																)
															);
														}}
														class="bg-dark disabled:bg-dark/50 rounded-button mt-4 flex w-full justify-center gap-4 p-2 text-center text-white"
														>Update
													</button>
													{#if project.date}
														<button
															class="rounded-button mt-4 bg-red-400 p-2 text-center text-white"
															onclick={async () =>
																await clearDate(project.id).updates(
																	getProject(project.id).withOverride((p) =>
																		p ? { ...p, date: null } : undefined
																	)
																)}><Trash2 /></button
														>
													{/if}
												</div>
											{/snippet}
										</DatePicker.Calendar>
									</DatePicker.Content>
								</div>
							</DatePicker.Root>
						</div>
						<h1 class="mt-8 mb-2 text-xl font-bold">Notes</h1>
					</section>
				{/if}
			{/await}

			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
