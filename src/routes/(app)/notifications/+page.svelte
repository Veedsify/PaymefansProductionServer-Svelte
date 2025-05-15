<script lang="ts">
	import Notifications from '../../../components/misc/Notifications.svelte';
	import { notificationStore } from '../../../contexts/notificationStore';
	const totalNotifications = $notificationStore.totalNotifications;
</script>

<div>
	<div class="p-3 md:px-8 md:py-5">
		<div class="mb-7 flex items-center">
			<span class="flex-shrink-0 text-xl font-bold dark:text-white"> Notifications </span>
			<div
				class="bg-primary-text-dark-pink ml-auto flex aspect-square h-8 w-8 flex-shrink-0 items-center justify-center rounded-full px-1 py-1 font-bold text-white md:px-3 md:py-3"
			>
				{totalNotifications > 100 ? '99+' : totalNotifications}
			</div>
		</div>
		<Notifications />
	</div>
</div>
