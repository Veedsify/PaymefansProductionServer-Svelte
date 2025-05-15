<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { AuthUserProps } from '../../../../types/user';

	const user = getContext<Writable<AuthUserProps | null>>('user');
	const benefits = [
		{
			icon: '💬',
			benefit: 'Chat with fans and build connections'
		},
		{
			icon: '💲',
			benefit: 'Earn per message sent'
		},
		{
			icon: '🖼️',
			benefit: 'Upload High Quality Image & Videos'
		},
		{
			icon: '💸',
			benefit: 'Unlock subscription-based earnings'
		},
		{
			icon: '👥',
			benefit: 'Engage with active subscribers'
		},
		{
			icon: '🌟',
			benefit: 'Join the exclusive Creators Group'
		},
		{
			icon: '💰',
			benefit: '100% Earnings on your content'
		},
		{
			icon: '🚀',
			benefit: 'Monetize your unique content'
		},
		{
			icon: '👩‍🎤',
			benefit: 'Top Creator Recognition'
		},
		{
			icon: '🎥',
			benefit: 'Unlimited Uploads'
		}
	];
</script>

<div>
	{#if $user && $user.is_model}
		<div>
			<div class="m-3 rounded-2xl p-8 px-12">
				<img
					src="/icons/feeling_sorry.svg"
					width={300}
					height={300}
					alt="Sorry you are already a model"
					class="block w-full"
				/>
				<div>
					<h1 class="mb-8 mt-6 text-center text-2xl font-bold md:text-3xl">
						Sorry you are already a model
					</h1>
					<div class="text-center">
						<a
							href={$user?.Model?.verification_status ? `/profile` : '/verification'}
							class="bg-primary-dark-pink m-3 w-full rounded-md px-4 py-3 text-center text-sm font-bold text-white"
						>
							{$user?.is_model && $user.Model?.verification_status
								? 'Go to your profile'
								: 'Verify your account'}
						</a>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div>
			<div
				class="relative m-3 rounded-2xl border border-black/10 p-8 px-12 dark:border-white/10 dark:bg-gray-800"
			>
				<h2 class="relative z-10 mb-8 text-center text-3xl font-bold dark:text-white">
					Exclusive Benefits of Becoming a Model
				</h2>

				<div class="relative z-10 grid gap-6 md:grid-cols-2">
					{#each benefits as item}
						<div class="flex items-center rounded-xl bg-black/10 p-4 dark:bg-white/10">
							<span class="mr-3 text-2xl">{item.icon}</span>
							<p class="font-medium text-black dark:text-white">
								{item.benefit}
							</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="flex justify-center align-middle">
				<a
					href="/models/payment"
					class="bg-primary-dark-pink m-3 w-full rounded-xl p-4 text-center text-sm font-bold text-white"
				>
					Sign Up
				</a>
			</div>
		</div>
	{/if}
</div>
