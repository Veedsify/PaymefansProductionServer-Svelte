<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { Toaster, toast } from 'svelte-sonner';
	import '../../app.css';
	import SideBar from '../../components/ui/SideBar.svelte';
	import Header from '../../components/ui/Header.svelte';
	import SideModels from '../../components/ui/SideModels.svelte';
	import MenuButtons from '../../components/ui/MenuButtons.svelte';
	import WishList from '../../components/ui/WishList.svelte';
	import { browser } from '$app/environment';
	import { queryClient } from '$lib/queryClient';
	import MainLoader from '../../components/loaders/MainLoader.svelte';
	import { onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store'; // Import writable
	import type { AuthUserProps } from '../../types/user.d';
	import type { LayoutProps } from '../$types';
	interface LayoutData extends LayoutProps {
		data: {
			user: AuthUserProps | null;
		};
		children: any;
	}
	// Destructure props
	let { data, children }: LayoutData = $props();
	const userStore: Writable<AuthUserProps | null> = writable(null);
	setContext('user', userStore);
	$effect(() => {
		userStore.set(data.user);
	});
</script>

<svelte:head>
	<title>Paymefans</title>
	<meta name="description" content="A simple SvelteKit application" />
	<link rel="icon" href="/favicon.png" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>
<Toaster
	richColors={true}
	position="top-right"
	toastOptions={{
		closeButton: true,
		duration: 10000
	}}
/>
<main class="relative grid h-screen lg:grid-cols-8">
	<QueryClientProvider client={queryClient}>
		<MainLoader />
		<div class="col-span-2">
			<SideBar />
		</div>
		<div class="relative col-span-6 h-screen overflow-auto border-r border-pink-50">
			<Header />
			<div class="grid h-screen pt-[66px] lg:grid-cols-6 lg:pt-[48px]">
				<div class="col-span-3 flex h-full flex-col">
					<div
						class="border-primary-dark-pink/40 lg: h-full w-full md:border-r dark:border-slate-800"
					>
						{@render children()}
					</div>
				</div>
				<SideModels />
			</div>
		</div>
		<WishList />
		<MenuButtons />
		<SvelteQueryDevtools />
	</QueryClientProvider>
</main>
