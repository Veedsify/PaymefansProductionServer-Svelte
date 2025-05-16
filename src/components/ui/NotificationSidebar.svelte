<script lang="ts">
	import { Heart, LucideBell, UserPlus } from '@lucide/svelte';
	import notificationStore from '../../contexts/notificationStore';
	let totalNotifications = $notificationStore.totalNotifications;
</script>

<span>
	<a
		href="/notifications"
		class="mb-2 flex items-center gap-5 rounded-xl p-2 transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-900"
	>
		<LucideBell />
		<p>Notifications</p>
		<span
			class="bg-primary-text-dark-pink ml-auto flex h-8 w-8 items-center justify-center rounded-full p-0 font-bold text-white"
		>
			{totalNotifications}
		</span>
	</a>
</span>
