<script lang="ts">
	type Post = {
		userId: number;
		id: number;
		title: string;
		body: string;
	};
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	// Define the type for a Post
	const posts = writable<Post[]>([]);
	const page = writable(1);
	const loading = writable(false);

	onMount(() => {
		async function fetchData() {
			loading.set(true);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const response = await fetch('https://jsonplaceholder.typicode.com/posts?page=1');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			posts.set(data);
			loading.set(false);
		}
		fetchData();
	});
</script>

<h1>
	Paymefans
	<small>Simple SvelteKit application</small>
</h1>
