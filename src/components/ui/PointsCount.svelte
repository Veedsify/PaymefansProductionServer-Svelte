<script lang="ts">
	import { usePointStore } from '../../contexts/userPointsStore';
	import { GetUserPointBalance } from '../../utils/data/fetch/get-user-point-balance';
	const { points, updatePoints } = usePointStore();
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { AuthUserProps } from '../../types/user.d';
	const isLoading = writable(true);
	let intervalId: any;
	export let user: AuthUserProps | null = null;

	// Function for fetching points
	async function fetchPoints() {
		if (!user) {
			isLoading.set(false);
			return;
		}
		try {
			const response = await GetUserPointBalance(user?.id);
			if (response) {
				updatePoints(response.points);
			}
		} finally {
			isLoading.set(false);
		}
	}

	// Run fetchPoints whenever user changes and is not null
	$: if (user) {
		fetchPoints();
		// Optionally, you may want to clear and restart the interval here as well
		clearInterval(intervalId);
		intervalId = setInterval(fetchPoints, 5000);
	}

	onMount(() => {
		if (user) {
			fetchPoints();
			intervalId = setInterval(fetchPoints, 5000);
		}
		return () => {
			clearInterval(intervalId);
		};
	});
</script>

{#if $isLoading}
	<span class="mb-1 flex items-center text-xl font-bold leading-none">
		<span class="h-6 w-16 animate-pulse rounded-md bg-gray-200"></span>
	</span>
{:else if points}
	<h2 class="mb-1 flex items-center text-xl font-bold leading-none">
		{$points.toLocaleString()}
		<span class="ml-2">
			<img width="20" height="20" src="/site/coin.svg" class="aspect-square h-5 w-auto" alt="" />
		</span>
	</h2>
{/if}
