<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { AuthUserProps } from '../../types/user';
	import type {ExchangeRate} from '../../types/points';

	export let rates: ExchangeRate[];
	const user = getContext<Writable<AuthUserProps | null>>('user');

	export const currencyRates = [
		{ rate: 1, name: 'USD', buyValue: 1, sellValue: 1, symbol: '$' },
		{ rate: 1, name: 'NGN', buyValue: 1503, sellValue: 1632, symbol: '₦' },
		{ rate: 1, name: 'KES', buyValue: 120, sellValue: 129.19, symbol: 'Ksh' },
		{ rate: 1, name: 'POINTS', buyValue: 16, sellValue: 16, symbol: 'P' },
		{ rate: 1, name: 'ZAR', buyValue: 18, sellValue: 18.55, symbol: 'R' },
		{ rate: 1, name: 'GHS', buyValue: 14, sellValue: 14.3, symbol: '₵' }
	];
</script>
