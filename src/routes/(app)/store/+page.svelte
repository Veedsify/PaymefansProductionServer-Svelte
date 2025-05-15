<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import ROUTE from '$lib/config/routes';
	import axios from 'axios';
	import { ShoppingCart } from '@lucide/svelte';
	import type { PageProps } from '../$types';
	type PageData = PageProps & {
		data: {
			initialProducts: StoreAllProductsResponse;
		};
	};
	const { data }: PageData = $props();
	let initialPageInfo = { hasMore: false, totalProducts: 0, perPage: 0, page: 1 };

	const products = writable<StoreProduct[]>([]);
	const loading = writable(false);
	const pageInfo = writable({ ...initialPageInfo });

	// On mount, set initial products
	onMount(() => {
		products.set(data.initialProducts.data ?? []);
		pageInfo.set(initialPageInfo);
	});

	// Fetch and accumulate
	let isFetching = false;

	const fetchStoreProducts: (page: number) => Promise<StoreAllProductsResponse> = async (page) => {
		try {
			const res = await axios.get(ROUTE.FETCH_STORE_PRODUCTS(page));
			return res.data as StoreAllProductsResponse;
		} catch (error: any) {
			console.error('Error fetching store products:', error);
			throw new Error('An error occurred while fetching store products. Please try again later.');
		}
	};
	async function getProducts(pageNum = 1) {
		if (isFetching) return;
		isFetching = true;
		loading.set(true);
		try {
			const prod = await fetchStoreProducts(pageNum);

			pageInfo.set({
				hasMore: prod.hasMore,
				totalProducts: prod.totalProducts,
				perPage: prod.perPage,
				page: pageNum
			});

			products.update((prev) =>
				pageNum === 1
					? (prod.data ?? [])
					: [
							...prev,
							...(prod.data ?? []).filter((p: StoreProduct) => !prev.find((pp) => pp.id === p.id))
						]
			);
		} catch (error) {
			toast.error('An error occurred while fetching products', {
				id: 'fetch-store-product'
			});
		} finally {
			loading.set(false);
			isFetching = false;
		}
	}

	function handleLoadMore() {
		if ($pageInfo.hasMore && !get(loading)) {
			const nextPage = $pageInfo.page + 1;
			getProducts(nextPage);
		}
	}
</script>

<section>
	<div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<div class="mb-3 flex-shrink-0 text-xl font-bold md:hidden">Store</div>
		<header>
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold text-gray-900 sm:text-3xl dark:text-white">All Products</h2>
				<a href="/store/cart">
					<ShoppingCart />
				</a>
			</div>
			<p class="mt-4 max-w-md text-gray-500 dark:text-white">
				Paymefans store is a platform where you can buy products and merchandise from your favorite
				models. We offer a wide range of products, including clothing, accessories, and more.
			</p>
		</header>
		<div class="mt-8">
			<p class="text-sm text-gray-500 dark:text-white">
				Showing <span>{$products.length}</span> of {$pageInfo.totalProducts} products
			</p>
		</div>

		{#if $loading && $products.length === 0}
			<div class="mt-4 flex min-h-96 items-center justify-center">
				<!-- <ShoppingCart class="w-8 h-8 text-gray-500 animate-spin" /> -->
				<span class="animate-spin text-4xl text-gray-500">🛒</span>
			</div>
		{:else if $products.length > 0}
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each $products as product}
					<li>
						<a href={`/store/product/${product.product_id}`} class="group block overflow-hidden">
							<img
								src={product.images[0]?.image_url ?? '/site/placeholder.jpg'}
								alt={product.name}
								width="480"
								height="640"
								class="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="relative bg-white p-3 pt-3 dark:bg-slate-900 dark:text-white">
								<p class="mb-2">
									<span class="text-xl tracking-wider text-gray-900 dark:text-white"
										>{product.name}</span
									>
								</p>
								<h3
									class="text-gray-700 group-hover:underline group-hover:underline-offset-4 dark:text-white"
								>
									₦ {product.price.toLocaleString('en-NG', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
								</h3>
							</div>
						</a>
					</li>
				{/each}
			</ul>

			{#if $pageInfo.hasMore}
				<div class="mt-8 flex justify-center">
					<button
						on:click={handleLoadMore}
						disabled={$loading}
						class="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{#if $loading}
							Loading...
						{:else}
							Load More
						{/if}
					</button>
				</div>
			{/if}
		{:else}
			<div class="mt-4 flex min-h-96 items-center justify-center">
				<p class="text-gray-500 dark:text-white">No products available</p>
			</div>
		{/if}
	</div>
</section>
