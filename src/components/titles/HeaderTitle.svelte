<script lang="ts">
	import { page } from '$app/state';

	const PATHNAME_TITLES: Record<string, string> = {
		benefits: 'Model Benefits',
		'become-a-model': 'Become a Model',
		'posts/points': 'Points',
		profile: 'Profile',
		points: 'Add Funds',
		wallet: 'Wallet',
		posts: 'Posts',
		live: 'Live',
		models: 'Models/Creators',
		'groups/settings': 'Settings',
		settings: 'Settings & Privacy',
		hookup: 'Hookup',
		verification: 'Public Verification',
		help: 'Help & Support',
		notifications: 'Notifications',
		messages: 'Messages',
		store: 'Store',
		chats: 'Chats',
		search: 'Search',
		story: 'Story',
		groups: 'Groups'
	};

	$: title = (() => {
		const pathname = page.url.pathname;
		if (pathname.startsWith('/live')) return 'Live';
		return Object.entries(PATHNAME_TITLES).find(([key]) => pathname.includes(key))?.[1] || 'Home';
	})();
</script>

<h1 class="hidden text-lg font-bold lg:block">{title}</h1>
