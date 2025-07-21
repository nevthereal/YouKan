<script lang="ts">
	import { STATUS_VALUES } from '$lib/utils';
	import Dropboard from '$lib/components/Dropboard.svelte';
</script>

<section>
	<div class="mb-4">
		<h1 class="text-2xl font-bold">Board View</h1>
		<p>Drag and drop projects.</p>
	</div>
	<div class="no-scrollbar flex gap-6 overflow-x-scroll p-2">
		{#each STATUS_VALUES as val}
			<div class="w-80 flex-none">
				<Dropboard statusValue={val} />
			</div>
		{/each}
	</div>
	<!-- <svelte:boundary>
		{#await getProjects()}
			<p>Loading</p>
		{:then projects}
			{@const projectsByStatus = STATUS_VALUES.map((status) => ({
				status,
				items: projects.filter((prj) => prj.status === status)
			}))}
			<div class="no-scrollbar flex gap-6 overflow-x-scroll p-2">
				{#each projectsByStatus as { status, items: projects }}
					<div class="w-80 flex-none">
						<div
							class={cn(
								'no-scrollbar rounded-card overflow-scroll border-2 p-4',
								status === 'To Do'
									? 'bg-todo/35'
									: status === 'Re Record'
										? 'bg-rerecord/35'
										: status === 'In Progress'
											? 'bg-inprogress/35'
											: status === 'Done'
												? 'bg-done/35'
												: 'bg-scrap/35'
							)}
							use:droppable={{
								container: status,
								callbacks: { onDrop: handleDrop }
							}}
						>
							<div class="mb-4 flex items-center justify-between">
								<h2 class="font-semibold capitalize">
									{status}
								</h2>
								<span class="px-2.5 py-0.5 text-sm">
									{projects.length}
								</span>
							</div>

							<div class="space-y-3">
								{#each projects as prj (prj.id)}
									<ProjectCard {prj} {status} />
								{/each}
								{#if status === 'To Do'}
									{#if newItem}
										<form
											{...newProject.enhance(async ({ submit }) => {
												submit().updates(getProjects());

												newItem = false;
											})}
										>
											<input
												bind:this={newInput}
												class="bg-dark/10 rounded-card w-full border-2 p-4 text-xl font-bold"
												type="text"
												name="title"
												placeholder="New Project"
											/>
										</form>
									{/if}
									<button
										onclick={() => {
											newItem = true;
											setTimeout(() => {
												newInput.focus();
											}, 20);
										}}
										class="bg-dark/10 rounded-input flex w-full items-center justify-center gap-2 border-2 p-2 text-lg font-bold"
										><Plus size={20} />New Item</button
									>{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/await}
	</svelte:boundary> -->
</section>
