<script lang="ts">
	import { STATUS_VALUES } from '$lib/utils';
	import Dropboard from '$lib/components/Dropboard.svelte';
	import { getUser } from '$lib/projects.remote';
</script>

{#await getUser()}
	<span>loading auth state</span>
{:then user}
	{#if user}
		<section>
			<div class="mb-4 px-4 text-center">
				<h1 class="text-3xl font-bold">Board View</h1>
				<p>Drag and drop projects.</p>
			</div>
			<div class="flex justify-evenly gap-6 px-8 max-lg:flex-col">
				{#each STATUS_VALUES as val}
					<Dropboard statusValue={val} />
				{/each}
			</div>
		</section>
	{:else}
		<section class="text-center">
			<h1 class="mb-2 text-3xl font-bold">Home</h1>
			<p>I am aware that this homepage is not complete, thanks for asking :)</p>
		</section>
	{/if}
{/await}
