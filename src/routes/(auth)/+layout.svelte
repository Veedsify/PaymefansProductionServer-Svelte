<script>
	import { Toaster } from 'svelte-sonner';
	import '../../app.css';
	let { children } = $props();
</script>

<Toaster
	richColors={true}
	position="top-center"
	toastOptions={{
		closeButton: true,
		duration: 10000
	}}
/>
<main>
	{@render children()}
</main>
