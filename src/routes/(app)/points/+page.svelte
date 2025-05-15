<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	console.log(data.rates);
</script>

<div>
	<div class="p-4 md:p-8 dark:text-white">
		<h1 class="mb-10 pt-4 text-2xl font-bold">Add Points</h1>
		<AddPoints rates={data.rates} />
	</div>
</div>
