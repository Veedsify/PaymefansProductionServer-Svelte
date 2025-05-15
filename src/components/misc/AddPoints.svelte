<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { LucideLoader, LucideLoader2 } from '@lucide/svelte'; // if you have an icon library
	import type { AuthUserProps } from '../../types/user';
	import { getToken } from '$lib/token';
	import type { Writable } from 'svelte/store';
	import ROUTE from '$lib/config/routes';
	import { POINTS_CONFIG } from '$lib/config/config';
	import { toast } from 'svelte-sonner';
	import type { ExchangeRate } from '../../types/points';

	export let currencyRates: ExchangeRate[] = [
		{ rate: 1, name: 'USD', buyValue: 1, sellValue: 1, symbol: '$' },
		{ rate: 1, name: 'NGN', buyValue: 1503, sellValue: 1632, symbol: '₦' },
		{ rate: 1, name: 'POINTS', buyValue: 16, sellValue: 16, symbol: 'P' },
		{ rate: 1, name: 'KES', buyValue: 120, sellValue: 129.19, symbol: 'Ksh' },
		{ rate: 1, name: 'ZAR', buyValue: 18, sellValue: 18.55, symbol: 'R' },
		{ rate: 1, name: 'GHS', buyValue: 14, sellValue: 14.3, symbol: '₵' }
	];

	let user = getContext<Writable<AuthUserProps | null>>('user'); // update: use Svelte store/derived or context
	let value = '';
	export let loadRates: ExchangeRate[];
	$: rates = loadRates ?? currencyRates;
	let error = false;
	let loading = false;
	let POINTS_PER_NAIRA = 100; // Default value
	const PLATFORM_DEPOSIT_FEE = 0.1;

	//--- Formatters and converters ---
	function formatNumber(num: string) {
		return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	function handleChange(e: Event) {
		let inputValue = (e.target as HTMLInputElement).value.replace(/\D/g, '');
		value = formatNumber(inputValue);
	}

	function calculateFee(value: string) {
		let num = value.replace(/\D/g, '');
		return (parseInt(num) * PLATFORM_DEPOSIT_FEE).toLocaleString();
	}

	function balanceToSettle(value: string) {
		let num = value.replace(/\D/g, '');
		const amount = parseInt(num) || 0;
		const pointsPlusFees = amount / POINTS_PER_NAIRA;
		return pointsPlusFees.toLocaleString();
	}

	function pricePerPoints(value: string) {
		let num = value.replace(/\D/g, '');
		const fee = calculateFee(value);
		const total = parseInt(num) + parseInt(fee.replace(/\D/g, ''));
		return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	function convertCurrency(amount: number, from: string, to: string) {
		if (from === 'POINTS') {
			const usdAmount = amount / (rates.find((rate) => rate.name === 'POINTS')?.buyValue ?? 16);
			const targetRate = rates.find((rate) => rate.name === to)?.buyValue || 1;
			return usdAmount * targetRate;
		}
		if (from === 'USD') {
			const toRate = rates.find((rate) => rate.name === to)?.buyValue || 1;
			return amount * toRate;
		} else if (to === 'USD') {
			const fromRate = rates.find((rate) => rate.name === from)?.buyValue || 1;
			return amount / fromRate;
		} else {
			const fromRate = rates.find((rate) => rate.name === from)?.buyValue || 1;
			const toRate = rates.find((rate) => rate.name === to)?.buyValue || 1;
			const usdAmount = amount / fromRate;
			return usdAmount * toRate;
		}
	}

	function formatConvertedAmount(amount: number, currency: string): string {
		const symbol = rates.find((rate) => rate.name === currency)?.symbol || '';
		return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	//--- Buy handler ---
	async function handlePointBuy() {
		const token = getToken();
		toast.loading(POINTS_CONFIG.POINT_PENDING_PAYMENTS, {
			id: 'add-point'
		});
		const amount = parseInt(value.replace(/\D/g, '')) || 0;
		const minNgn = 2500;
		const userCurrency = $user?.currency || 'USD';
		const minInUserCurrency = 2500;
		const validate = amount < minInUserCurrency;
		if (!value || validate) {
			toast.dismiss();
			toast.error(`Minimum deposit is ${formatConvertedAmount(minInUserCurrency, userCurrency)}`);
			return;
		}
		const usdAmount = convertCurrency(amount, userCurrency, 'USD');
		try {
			const response = await fetch(ROUTE.PURCHASE_POINTS, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					amount,
					currency: userCurrency,
					usd_amount: usdAmount,
					ngn_amount: convertCurrency(amount, userCurrency, 'NGN')
				})
			});
			if (!response.ok) throw new Error('Failed to purchase points');
			const data = await response.json();
			if (data.status) {
				toast.loading(data.message, {
					id: 'add-point'
				});
				setTimeout(() => {
					window.location.href = data.checkout.authorization_url;
				}, 100);
			} else {
				toast.error(data.message, {
					id: 'add-point'
				});
			}
		} catch (err) {
			toast.error(POINTS_CONFIG.POINTS_PURCHASE_FAILED, {
				id: 'add-point'
			});
			console.error(err);
		}
	}

	// Derived props
	$: inputAmount = parseInt(value.replace(/\D/g, '')) || 0;
	$: usdValue = convertCurrency(inputAmount, $user?.currency || 'USD', 'USD');
	$: ngnValue = convertCurrency(inputAmount, 'NGN', 'NGN');
	$: symbol = rates.find((rate) => rate.name === $user?.currency)?.symbol;
</script>

{#if loading}
	<div class="flex h-full w-full items-center justify-center p-6">
		<!-- Replace below with your loader icon -->
		<LucideLoader2 class="animate-spin" />
	</div>
{:else if error}
	<div class="flex h-full w-full items-center justify-center">
		<p class="text-lg font-semibold text-red-500">Error fetching exchange rate</p>
	</div>
{:else}
	<div>
		<div class="mb-3 flex items-start gap-2">
			<div class="text-4xl">{symbol}</div>
			<div class="flex-1">
				<input
					type="text"
					bind:value
					on:input={handleChange}
					pattern="[0-9]*"
					placeholder="0"
					class="w-full border-none p-0 text-6xl font-bold outline-none ring-0 md:text-9xl"
				/>
			</div>
		</div>

		{#if value}
			<div class="mb-6">
				<div class="flex justify-between py-2">
					<p class="text-xl">Platform Fee</p>
					<p class="text-xl font-medium">
						<span class="text-primary-dark-pink">{PLATFORM_DEPOSIT_FEE * 100}%</span>
						({symbol}{calculateFee(value)})
					</p>
				</div>
				<div class="flex justify-between py-2">
					<p class="text-xl">Amount in USD</p>
					<p class="text-xl font-medium">{formatConvertedAmount(usdValue, 'USD')}</p>
				</div>
				<div class="flex justify-between py-2">
					<p class="text-xl">Amount You Receive</p>
					<p class="text-xl font-medium">{formatConvertedAmount(ngnValue, 'NGN')}</p>
				</div>
				<div class="flex justify-between py-2">
					<p class="text-xl">Amout To Pay</p>
					<p class="text-xl font-medium">
						{symbol}{pricePerPoints(value)}
					</p>
				</div>
				<div class="flex justify-between py-2">
					<p class="text-xl">Points Received</p>
					<p class="text-xl font-medium">
						<span class="flex items-center">
							<!-- You may use a normal <img> here or a custom svelte <Image> if you have one -->
							<img
								src="/site/coin.svg"
								alt=""
								width="20"
								height="20"
								class="mr-1 aspect-square h-5 w-auto"
							/>
							{balanceToSettle(value)}
						</span>
					</p>
				</div>
			</div>
		{/if}

		{#if value}
			<div class="mt-5">
				<button
					on:click={handlePointBuy}
					class="w-full rounded-md bg-black py-4 font-bold uppercase text-white"
				>
					Add Points
				</button>
			</div>
		{/if}
	</div>
{/if}
