<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Facebook, Instagram, LucideCamera, Twitter, X, YoutubeIcon } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getToken } from '$lib/token';
	import type { AuthUserProps, UserUpdateProfileType } from '../../types/user';
	import ROUTE from '$lib/config/routes';
	import { PROFILE_CONFIG } from '$lib/config/config';
	import { countries } from '$lib/locations';
	import BannerComponent from './BannerComponent.svelte';

	export let user: AuthUserProps;

	let open = false;
	let file: File | null = null;
	let userData: UserUpdateProfileType;

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		userData = { ...userData, [target.name]: target.value };
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			file = target.files[0];
			userData = { ...userData, profile_image: target.files[0] };
		}
	}

	async function handleSaveClick() {
		if (!userData) {
			toast.error('No Changes Detected', {
				id: 'profile-update'
			});
			return;
		}
		const formData = new FormData();
		for (const key in userData) {
			if (Object.prototype.hasOwnProperty.call(userData, key)) {
				const value = userData[key as keyof UserUpdateProfileType] as string | File;
				formData.append(key, value);
			}
		}
		try {
			const token = getToken();
			toast.loading(PROFILE_CONFIG.PROFILE_UPDATING_MSG, {
				id: 'profile-update'
			});
			fetch(ROUTE.PROFILE_UPDATE, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: formData
			}).then(async (res) => {
				if (!res.ok) throw new Error(await res.text());
				toast.success(PROFILE_CONFIG.PROFILE_UPDATED_SUCCESS_MSG, {
					id: 'profile-update'
				});
				open = false;
				invalidateAll();
			});
		} catch (error) {
			toast.error(PROFILE_CONFIG.PROFILE_UPDATED_ERROR_MSG, {
				id: 'profile-update'
			});
			console.error(error);
		}
	}
</script>

<div>
	<button
		on:click={() => (open = !open)}
		class="dark:bg-primary-dark-pink text-color rounded border border-black bg-black px-2 py-1 text-sm font-semibold text-white sm:px-4"
	>
		Edit Profile
	</button>
</div>

{#if open}
	<div
		class="pointer-events-auto fixed inset-0 z-[250] flex h-full w-full items-center justify-center bg-black/40 opacity-100 transition-all duration-300 dark:bg-black/70"
		role="button"
		tabindex="0"
		on:click={() => (open = false)}
		on:keydown={(e) => e.key === 'esc' && (open = false)}
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative h-dvh max-h-dvh w-full overflow-y-auto rounded-none bg-white p-6 shadow-2xl md:h-auto md:max-w-2xl md:rounded md:p-8 dark:bg-slate-900"
			role="button"
			tabindex="0"
			on:keydown={(e) => e.key === 'esc' && (open = false)}
			on:click|stopPropagation
		>
			<button
				class="hover:text-primary-dark-pink absolute right-4 top-4 text-gray-500 transition-colors"
				on:click={() => (open = false)}
				aria-label="Close"
				type="button"
			>
				<X size={28} />
			</button>
			<h1 class="mb-6 text-center text-2xl font-bold dark:text-white">Edit Profile</h1>
			<div class="mb-5 rounded-xl">
				<BannerComponent profile_banner={user ? user?.profile_banner : '/site/banner.png'} />
			</div>
			<div class="mb-6 flex flex-col items-center">
				<label for="imageUpload" class="group relative cursor-pointer">
					<div
						class="border-primary-dark-pink/40 group-hover:border-primary-dark-pink relative mb-2 inline-block overflow-hidden rounded-full border-4 border-dotted p-1 transition-all dark:border-slate-700"
					>
						<img
							src={file ? URL.createObjectURL(file) : user?.profile_image || '/site/avatar.png'}
							alt=""
							width="96"
							height="96"
							class="aspect-square h-24 w-24 rounded-full object-cover"
							loading="eager"
						/>
						<div
							class="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-15 transition-opacity group-hover:opacity-100"
						>
							<LucideCamera size={22} class="text-white" />
						</div>
					</div>
				</label>
				<input on:change={handleFileChange} type="file" id="imageUpload" class="hidden" />
			</div>
			<form on:submit|preventDefault={handleSaveClick} class="space-y-4">
				<input
					type="text"
					on:input={handleInputChange}
					name="name"
					value={user?.name}
					class="focus:ring-primary-dark-pink w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					placeholder="Name"
				/>
				<select
					name="location"
					class="focus:ring-primary-dark-pink w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					value={user?.location}
					on:change={handleInputChange}
				>
					{#each countries as location}
						<option value={location.name} selected={user?.location === location.name}>
							{location.name}
						</option>
					{/each}
				</select>
				<input
					type="email"
					value={user?.email}
					class="mb-3 w-full cursor-none select-none rounded-lg border border-gray-300 p-3 text-black outline-none read-only:text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					name="email"
					readonly
					on:input={handleInputChange}
					placeholder="Email"
				/>
				<textarea
					name="bio"
					rows="4"
					on:input={handleInputChange}
					class="focus:ring-primary-dark-pink w-full resize-none rounded-lg border border-gray-300 p-3 text-black outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					placeholder="Bio">{user.bio}</textarea
				>
				<input
					type="text"
					on:input={handleInputChange}
					name="website"
					value={user.website}
					class="focus:ring-primary-dark-pink w-full rounded-lg border border-gray-300 p-3 text-black outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
					placeholder="Website"
				/>
				<div
					class="mb-2 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					>
						<Instagram />
					</div>
					<input
						type="text"
						on:input={handleInputChange}
						name="instagram"
						value={user?.Settings?.instagram_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://instagram.com/@paymefans"
					/>
				</div>
				<div
					class="mb-2 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					>
						<Twitter />
					</div>
					<input
						type="text"
						on:input={handleInputChange}
						name="twitter"
						value={user.Settings?.twitter_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://twitter.com/@paymefans"
					/>
				</div>
				<div
					class="mb-4 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					>
						<Facebook />
					</div>
					<input
						type="text"
						on:input={handleInputChange}
						name="facebook"
						value={user?.Settings?.facebook_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://facebook.com/@paymefans"
					/>
				</div>
				<!-- TikTok -->
				<div
					class="mb-4 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
							/></svg
						>
					</div>
					<input
						type="text"
						on:input={handleInputChange}
						name="tiktok"
						value={user?.Settings?.tiktok_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://tiktok.com/@paymefans"
					/>
				</div>
				<!-- YouTube -->
				<div
					class="mb-4 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					>
						<!-- You can use a YouTube SVG icon here -->
						<YoutubeIcon />
					</div>
					<input
						type="text"
						on:input={handleInputChange}
						name="youtube"
						value={user?.Settings?.youtube_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://youtube.com/@paymefans"
					/>
				</div>
				<!-- Snapchat -->
				<div
					class="mb-4 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					></div>
					<input
						type="text"
						on:input={handleInputChange}
						name="snapchat"
						value={user?.Settings?.snapchat_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://snapchat.com/@paymefans"
					/>
				</div>
				<!-- Telegram -->
				<div
					class="mb-4 grid grid-cols-12 items-center overflow-hidden rounded-lg border border-black/10 bg-gray-50 dark:border-slate-700 dark:bg-slate-800"
				>
					<div
						class="text-primary-dark-pink col-span-2 flex h-full items-center justify-center py-2 dark:text-white"
					></div>
					<input
						type="text"
						on:input={handleInputChange}
						name="telegram"
						value={user?.Settings?.telegram_url}
						class="col-span-10 border-none bg-transparent p-2 text-black outline-none dark:text-white"
						placeholder="https://t.me/@paymefans"
					/>
				</div>
				<!-- Discord -->
				<button
					type="submit"
					class="bg-primary-dark-pink focus:ring-primary-dark-pink w-full rounded-lg py-3 font-semibold text-white shadow transition-colors hover:bg-pink-700 focus:outline-none focus:ring-2"
				>
					Save
				</button>
			</form>
		</div>
	</div>
{/if}
