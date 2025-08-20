<script lang="ts">
	import { STATUS_VALUES } from '$lib/utils';
	import Dropboard from '$lib/components/Dropboard.svelte';
</script>

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
