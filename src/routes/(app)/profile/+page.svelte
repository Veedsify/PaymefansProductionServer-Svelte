<script lang="ts">
	import { LucideCalendar, LucideLink, LucideLock, LucideMapPin } from '@lucide/svelte';

	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { AuthUserProps } from '../../../types/user';
	import { formatNumber } from '../../../utils/formatNumber';
	import EditProfileButton from '../../../components/ui/EditProfileButton.svelte';
	const user = getContext<Writable<AuthUserProps | null>>('user');
	$: isModel = $user?.is_model ?? false;
	$: isVerified = $user?.is_model && $user?.Model?.verification_status;
</script>

<div class="overflow-hidden">
	<div class="relative">
		<img
			src={$user ? $user?.profile_banner : '/site/banner.png'}
			alt="Home Banner"
			width={1950}
			height={650}
			class="aspect-21-9 inset-0 h-full w-full object-cover"
		/>
	</div>
	<div class="relative flex w-full px-4 md:px-5">
		<img
			src={user ? $user?.profile_image.trim() : '/site/avatar.png'}
			alt="proile"
			height={100}
			width={100}
			class="border-primary-dark-pink absolute -top-6 h-20 w-20 rounded-full border-2 object-cover sm:border-4 md:-top-12 md:h-24 md:w-24"
		/>
		<div class="ml-auto flex items-center gap-3 p-3 sm:p-3">
			<EditProfileButton {user} />
		</div>
	</div>
	<div class="mb-12 mt-2 flex flex-col items-start gap-2 px-4 md:px-5">
		<div class="flex flex-col">
			<h1 class="font-bold text-gray-900 dark:text-gray-100">
				{$user?.name ? $user?.name : ''}
			</h1>
			<small class="text-gray-500 dark:text-gray-400">
				{$user?.username}
			</small>
		</div>
		<div class="mb-2 font-medium leading-loose text-gray-700 dark:text-gray-300">
			{@html $user?.bio ? $user?.bio?.replace(/(?:\r\n|\r|\n)/g, '<br>') : ''}
		</div>
		{#if $user?.website}
			<a
				href={$user?.website ? $user?.website : ''}
				target="_blank"
				class="text-primary-text-dark-pink dark:text-primary-dark-pink mb-2 inline-block text-sm font-medium"
			>
				<LucideLink class="text-primary-dark-pink mr-2 inline-block" size={18} />
				{$user?.website ? $user?.website : ''}
			</a>
		{/if}
		<div
			class="mb-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
		>
			<span class="flex items-center gap-2">
				<LucideMapPin class="text-primary-dark-pink" size={18} />
				<span>
					{user && $user?.state ? $user?.state + ',' : ''}
					{$user?.location}
				</span>
			</span>
			{#if $user?.is_model}
				<span class="flex items-center gap-2">
					<LucideLock class="text-primary-dark-pink" size={18} />
					<span>Model</span>
				</span>
			{/if}
			<span class="flex items-center gap-2">
				<LucideCalendar class="text-primary-dark-pink" size={18} />
				<span>
					Joined{' '}
					{$user?.created_at
						? new Date($user?.created_at).toLocaleDateString('en-US', {
								month: 'long',
								year: 'numeric'
							})
						: ''}
				</span>
			</span>
		</div>

		<div class="mb-3 flex flex-wrap gap-2 text-sm sm:text-base">
			<span class="flex items-center gap-2">
				<h1 class="text-sm font-bold text-gray-900 dark:text-gray-100">
					{formatNumber($user?.total_followers!)}
				</h1>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Followers</p>
			</span>
			<span class="flex items-center gap-2">
				<h1 class="text-sm font-bold text-gray-900 dark:text-gray-100">
					{formatNumber($user?.total_following!)}
				</h1>
				<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Following</p>
			</span>
			{#if $user?.is_model}
				<span class="flex items-center gap-2">
					<h1 class="text-sm font-bold text-gray-900 dark:text-gray-100">
						{formatNumber($user?.total_subscribers)}
					</h1>
					<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Subscribers</p>
				</span>
			{/if}
		</div>
	</div>
</div>
