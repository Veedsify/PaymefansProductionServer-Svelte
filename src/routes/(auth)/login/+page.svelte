<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { LOGIN_CONFIG } from '$lib/config/config';
	import { toast } from 'svelte-sonner'; // Or your preferred toast library
	import { PUBLIC_TS_EXPRESS_URL } from '$env/static/public';

	let email = '';
	let password = '';
	let remember = false;

	onMount(() => {
		document.title = 'Login | Paymefans';
	});

	async function submitLoginForm(e: Event) {
		e.preventDefault();
		try {
			const res = await axios.post(`${PUBLIC_TS_EXPRESS_URL}/auth/login`, {
				email,
				password
			});
			const data = res.data;
			if (!data?.error) {
				if (data?.token && !data?.tfa) {
					toast.success(LOGIN_CONFIG.LOGIN_SUCCESSFUL_MSG, {
						id: 'login-success'
					});
					document.cookie = `token=${data.token}`;
					const urlParams = new URLSearchParams(window.location.search);
					const redirect = urlParams.get('redirect');
					if (redirect) {
						window.location.href = redirect;
					} else {
						window.location.href = '/';
					}
				} else if (data?.tfa && data?.token === null) {
					goto('/verify');
				}
			} else {
				toast.error(data?.message, {
					id: 'login-error'
				});
			}
		} catch (error: any) {
			console.error('Error while logging in:', error);
			toast.error(error.response?.data.message || 'An error occurred while logging in', {
				id: 'login-error'
			});
		}
	}
</script>

<div class="max-h-dvh bg-black p-5 lg:p-0">
	<div class="mx-auto grid-cols-2 items-start justify-center lg:grid">
		<div class="relative hidden h-dvh overflow-hidden lg:block">
			<img
				width="720"
				height="720"
				src="/images/auth_image.jpeg"
				alt="Login Bear"
				class="absolute inset-0 w-full object-cover object-center"
				loading="eager"
			/>
			<div
				style="position: absolute; inset: 0; background: linear-gradient(to right, transparent 70%, rgba(0,0,0,0.9) 100%); pointer-events: none;"
			></div>
		</div>
		<div class="h-dhv lg:p-14 2xl:p-28">
			<div class="mx-auto mb-24 max-w-screen-xl pt-12 md:mt-16">
				<a href="/">
					<img
						width="150"
						height="150"
						class="h-auto w-[150px]"
						src="/site/logo.svg"
						alt="Logo"
						loading="eager"
					/>
				</a>
			</div>
			<h1 class="mb-5 mt-auto text-2xl font-bold text-white">Sign in</h1>
			<form class="mb-5 w-full flex-1" on:submit|preventDefault={submitLoginForm}>
				<div class="mb-4 flex flex-col gap-3">
					<input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						class="block w-full rounded-lg bg-transparent px-3 py-3 text-sm font-bold text-white outline-1 outline-white md:max-w-lg"
						placeholder="Email"
						required
					/>
				</div>
				<div class="mb-5 flex flex-col gap-3">
					<input
						type="password"
						name="password"
						id="password"
						bind:value={password}
						class="block w-full rounded-lg bg-transparent px-3 py-3 text-sm font-bold text-white outline-1 outline-white md:max-w-lg"
						placeholder="Password"
						required
					/>
				</div>
				<button
					class="bg-primary-dark-pink w-full cursor-pointer rounded-lg px-3 py-3 text-sm font-bold text-white md:max-w-lg"
				>
					Sign in
				</button>
			</form>
			<div class="mt-5 flex w-full items-center md:max-w-lg">
				<div class="flex">
					<input
						type="checkbox"
						name="remember"
						id="remember"
						bind:checked={remember}
						class="accent-primary-dark-pink mr-2 text-sm"
					/>
					<label for="remember" class="cursor-pointer text-sm font-bold text-white">
						Remember me
					</label>
				</div>
				<a href="/reset" class="text-primary-dark-pink ml-auto text-sm font-bold">
					Forgot password?
				</a>
			</div>
			<div class="mt-28">
				<p class="text-sm font-bold text-white">
					Don't have an account?
					<a href="/register" class="text-primary-dark-pink">Sign up</a>
				</p>
			</div>
		</div>
	</div>
</div>
