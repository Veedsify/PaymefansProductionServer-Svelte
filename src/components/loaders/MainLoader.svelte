<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	const loading = writable(true);

	onMount(() => {
		const timer = setTimeout(() => {
			$loading = false;
		}, 1000);
		return () => clearTimeout(timer); // Cleanup on component destroy
	});
</script>

{#if $loading}
	<div
		class={`${
			$loading ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
		} fixed z-[999] flex min-h-dvh w-full items-center justify-center bg-black duration-300 ease-out`}
		aria-busy="true"
	>
		<div class="animate-bounce">
			<img
				width={200}
				height={200}
				src="/site/logo.svg"
				alt="Loading indicator"
				class="h-auto w-[200px]"
			/>
		</div>
	</div>
{/if}
