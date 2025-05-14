<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { LucideBellRing } from '@lucide/svelte';
	import HeaderTitle from '../titles/HeaderTitle.svelte';
	import HeaderImgClick from './HeaderImgClick.svelte';

	const pathname = page.url.pathname;

	const hideOn = (thisPathname: string[] = [], originPath: string = ''): boolean => {
		return Array.isArray(thisPathname) && thisPathname.some((path) => originPath.startsWith(path));
	};

	function handleHomeClick() {
		if (pathname !== '/') {
			goto('/');
		}
	}
</script>

<header
	class={`bg-primary-dark-pink border-primary-dark-pink/40 absolute z-50 w-full border-b px-4 py-3 lg:bg-white lg:px-8 dark:border-slate-800/100 dark:bg-gray-950 dark:text-white`}
>
	<div class="flex items-center">
		{#if !hideOn(['/live'], pathname)}
			<HeaderTitle />
		{/if}
		<button on:click={handleHomeClick}>
			<img
				width={120}
				height={40}
				src="/site/logo3.png"
				alt="Site Logo"
				class="block h-auto lg:hidden"
			/>
		</button>
		<ul class="ml-auto flex items-center gap-6 lg:hidden">
			<a href="/">
				<LucideBellRing class="text-white" size={22} />
			</a>
			<HeaderImgClick />
		</ul>
	</div>
</header>
