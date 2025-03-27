<script lang="ts">
	import { Calendar } from 'bits-ui';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';

	const isDateUnavailable: Calendar.RootProps['isDateUnavailable'] = (date) => {
		return date.day === 17 || date.day === 18;
	};

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar.Root
	class="border-dark-10 bg-background-alt shadow-card mt-6 rounded-[15px] border p-[22px]"
	{isDateUnavailable}
	weekdayFormat="short"
	fixedWeeks={true}
	type="single"
	bind:value
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between">
			<Calendar.PrevButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98] active:transition-all"
			>
				<ArrowLeft class="size-6" />
			</Calendar.PrevButton>
			<Calendar.Heading class="text-[15px] font-medium" />
			<Calendar.NextButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98] active:transition-all"
			>
				<ArrowRight class="size-6" />
			</Calendar.NextButton>
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse space-y-1 select-none">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day}
								<Calendar.HeadCell
									class="text-muted-foreground w-10 rounded-md text-xs font-normal!"
								>
									<div>{day.slice(0, 2)}</div>
								</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates}
							<Calendar.GridRow class="flex w-full">
								{#each weekDates as date}
									<Calendar.Cell
										{date}
										month={month.value}
										class="relative size-10 p-0! text-center text-sm"
									>
										<Calendar.Day
											class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground group relative inline-flex size-10 items-center justify-center border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through"
										>
											<div
												class="bg-foreground group-data-selected:bg-background absolute top-[5px] hidden size-1 rounded-full group-data-today:block"
											></div>
											{date.day}
										</Calendar.Day>
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</div>
	{/snippet}
</Calendar.Root>
