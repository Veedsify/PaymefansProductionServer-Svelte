<script lang="ts">
	import {
		LucideGroup,
		LucideHeart,
		LucideHelpCircle,
		LucideLogOut,
		LucideSettings,
		LucideShieldCheck,
		LucideStore,
		LucideUserPlus,
		MessageCircle,
		User
	} from '@lucide/svelte';
	import PointsCount from './PointsCount.svelte';
	import { sidebarOpen } from '../../contexts/sidebarStrore';
	import NotificationSidebar from './NotificationSidebar.svelte';
	import { getContext, onMount } from 'svelte';
	import type { AuthUserProps } from '../../types/user.d';
	const unreadCount = 23;
	import { writable, type Writable } from 'svelte/store';
	const user = getContext<Writable<AuthUserProps | null>>('user');
	const status = writable({
		isModel: false,
		isVerified: false
	});

	onMount(() => {
		if ($user && $user.Model) {
			status.set({
				isModel: $user?.is_model!,
				isVerified: $user?.is_model && !$user.Model.verification_status
			});
		}
	});
</script>

<div
	class={`smart-width border-primary-dark-pink/40 fixed top-0 z-[100] h-screen overflow-y-auto bg-white p-4 pb-40 shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:z-[50] lg:ml-auto lg:h-screen lg:border-r lg:pb-0 lg:shadow-none dark:border-slate-800/100 dark:bg-gray-950 dark:text-white ${
		$sidebarOpen ? '-translate-x-0' : '-translate-x-full lg:translate-x-0'
	}`}
>
	<div class="mb-16 mt-8">
		<img class="block h-8 w-36" width={150} height={30} src="/site/logo2.png" alt="" />
	</div>
	<div>
		<div class="mb-4 flex items-center gap-4">
			<img
				width={50}
				height={50}
				src={$user ? $user?.profile_image : '/site/avatar.png'}
				class="border-primary-dark-pink h-12 w-12 rounded-full border-2 object-cover"
				alt=""
			/>
			<div class="overflow-hidden">
				<h2 class="mb-0 text-sm font-bold leading-none">
					{#if user}
						<p>{$user?.name}</p>
					{:else}
						<p class="mb-1 h-5 w-32 animate-pulse rounded-sm bg-gray-300"></p>
					{/if}
				</h2>
				<span class="max-w-8 text-wrap text-sm text-gray-600 dark:text-white">
					{#if $user?.username}
						<p>{$user.username}</p>
					{:else}
						<p class="h-3 w-32 animate-pulse rounded-sm bg-gray-300"></p>
					{/if}
				</span>
			</div>
		</div>
		<div class="mb-3 pt-5">
			{#if user}
				<PointsCount user={$user} />
			{:else}
				<div class="w-1/2 animate-pulse rounded-md bg-gray-300 p-2 py-3"></div>
			{/if}
			<span class="text-sm font-medium text-gray-600 dark:text-white"> Your Balance </span>
		</div>
		<div class="mb-5 flex gap-3 pt-4">
			<a
				href="/points"
				class="dark:bg-primary-dark-pink rounded bg-black p-2 px-8 text-xs font-semibold text-white"
			>
				Add Funds
			</a>
			<a
				href="/wallet"
				class="rounded border border-gray-600 bg-white p-2 px-8 text-xs font-semibold text-black"
			>
				Wallet
			</a>
		</div>
		<div class="pt-6">
			<a
				href="/profile"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<User size={25} />
				<p>Profile</p>
			</a>
			<a
				href="/messages"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<MessageCircle size={25} />
				<p>Messages</p>
				<span
					class="bg-primary-text-dark-pink ml-auto flex h-8 w-8 items-center justify-center rounded-full p-0 text-sm font-bold text-white"
				>
					{unreadCount > 99 ? '99+' : unreadCount}
				</span>
			</a>
			<a
				href="/hookup"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<LucideHeart />
				<p>Hook Up</p>
			</a>
			<a
				href="/store"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<LucideStore />
				<p>Store</p>
			</a>

			{#if $user && $status.isModel}
				<a
					href="/groups"
					class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
				>
					<LucideGroup />
					<p>Creator&apos;s Group</p>
				</a>
			{/if}
			<NotificationSidebar />
			{#if $status.isVerified}
				<a
					href="/verification"
					class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
				>
					<LucideShieldCheck />
					<p>Verification</p>
				</a>
			{/if}
			{#if $user && !$status.isModel}
				<a
					href="/models/benefits"
					class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
				>
					<LucideUserPlus />
					<p>Become A Model</p>
				</a>
			{/if}
			<hr class="border-primary-dark-pink/40 mb-8 mt-8 dark:border-slate-800" />
			<a
				href="/help"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<LucideHelpCircle />
				<p>Help</p>
			</a>
			<a
				href="/settings"
				class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<LucideSettings />
				<p>Settings & Privacy</p>
			</a>
			<button
				class="mb-2 flex cursor-pointer select-none items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
			>
				<LucideLogOut />
				<p>Logout</p>
			</button>
		</div>
	</div>
</div>
{#if $sidebarOpen}
	<div
		role="button"
		tabindex="0"
		on:click={() => sidebarOpen.set(false)}
		on:keydown={(e) => e.key === 'esc' && sidebarOpen.set(false)}
		class="loaderFade pointer-events-auto fixed inset-0 z-[64] block w-full bg-black/50 opacity-100 duration-300 ease-in-out md:z-[49] lg:hidden"
	></div>
{/if}
