<script lang="ts">
	import AddPoints from '../../../components/misc/AddPoints.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div>
	<div class="p-4 md:p-8 dark:text-white">
		<h1 class="mb-10 pt-4 text-2xl font-bold">Add Points</h1>
		<AddPoints loadRates={data.rates} />
	</div>
</div>
