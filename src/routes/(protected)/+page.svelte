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
</section>
