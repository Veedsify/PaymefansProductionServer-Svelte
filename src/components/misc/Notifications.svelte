<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_TS_EXPRESS_URL } from '$env/static/public';
	import { NotificationIcontypes } from '../../utils/data/static/notification-types';
	import { getToken } from '$lib/token';
	import { notificationStore } from '../../contexts/notificationStore';
	import { LucideLoader } from '@lucide/svelte';
	const { addAllNotifications, updateNotification } = notificationStore;
	let page = 1;
	let hasMore = false;
	let loading = false;
	let error = false;
	const types = NotificationIcontypes;

	// Observe this div for infinite scroll
	let bottomRef: HTMLDivElement;
	let inView = false;
	let observer: IntersectionObserver;

	// Handle visibility changes
	function handleInView(entries: IntersectionObserverEntry[]) {
		if (entries[0].isIntersecting) {
			inView = true;
			loadMore();
		}
	}

	function observe() {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(handleInView, { threshold: 0.5 });
		if (bottomRef) observer.observe(bottomRef);
	}
	async function fetchNotifications() {
		// TOKEN logic
		const token = getToken();
		try {
			loading = true;
			const url = `${PUBLIC_TS_EXPRESS_URL}/notifications/${page}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` }
			});

			if (response.ok) {
				const { data, hasMore: moreData } = await response.json();
				addAllNotifications(data);
				hasMore = moreData;
				error = false;
			} else {
				error = true;
			}
		} catch (err) {
			error = true;
		} finally {
			loading = false;
		}
	}
	// Infinite scroll: Load next page when bottom comes into view
	function loadMore() {
		if (inView && hasMore && !loading) {
			loading = true;
			page += 1;
			fetchNotifications();
		}
	}

	// Mark notification as read and redirect
	async function handleNotificationClick(
		url: string,
		notification_id: string,
		id: number,
		read: boolean
	) {
		const token = getToken();
		if (read) return;
		if (url) {
			const readUrl = `${PUBLIC_TS_EXPRESS_URL}/notifications/read/${id}`;
			const res = await fetch(readUrl, {
				headers: { Authorization: `Bearer ${token}` }
			});
			if (res.ok) {
				updateNotification(notification_id);
				window.location.href = url;
			}
		}
	}

	// On init (mount) fetch first page
	onMount(() => {
		fetchNotifications();
		observe();
		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

{#if !loading && error}
	<div class="py-2 text-center text-sm text-red-500">
		An error occurred while fetching notifications.
	</div>
{:else}
	<div class="space-y-3">
		{#if $notificationStore.notifications.length === 0 && !loading}
			<div class="py-4 text-center text-gray-500 dark:text-gray-400">No Notifications yet</div>
		{:else}
			{#each $notificationStore.notifications as notification, index}
				<div
					on:click={() =>
						handleNotificationClick(
							notification.url,
							notification.notification_id,
							notification.id,
							notification.read
						)}
					on:keydown={(e) =>
						e.key == 'Enter' &&
						handleNotificationClick(
							notification.url,
							notification.notification_id,
							notification.id,
							notification.read
						)}
					role="button"
					tabindex={0}
					class={`group cursor-pointer rounded-lg transition-colors duration-150 ${
						notification.read
							? 'bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900'
							: 'bg-messages-unread hover:bg-messages-unread/90 dark:bg-gray-800 dark:hover:bg-gray-700'
					}`}
				>
					<div
						class="flex items-center gap-5 border-b border-gray-100 p-4 last:border-b-0 dark:border-slate-800"
					>
						<div
							role="img"
							style="color:{types.find((type) => type.type === notification.action)?.color};"
							class="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:border-gray-700 dark:bg-gray-900"
						>
							{#if notification.action}
								{@const iconType = types.find((type) => type.type === notification.action)}
								{#if iconType?.icon}
									<svelte:component this={iconType.icon} {...iconType.params} />
								{/if}
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<p
								class="notification_message_container break-words text-base font-medium leading-snug text-gray-900 dark:text-white"
							>
								<span>{@html notification.message}</span>
							</p>
							<p class="pt-2 text-xs text-gray-500 dark:text-gray-400">
								{new Date(notification.created_at).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric'
								})}
							</p>
						</div>
					</div>
				</div>
			{/each}
		{/if}
		{#if loading}
			<div class="flex items-center justify-center py-5">
				<LucideLoader class="text-primary animate-spin" />
			</div>
		{/if}
		<div bind:this={bottomRef} class="h-1 w-full"></div>
	</div>
{/if}
