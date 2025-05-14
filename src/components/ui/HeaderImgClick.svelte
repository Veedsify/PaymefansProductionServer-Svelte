<script lang="ts">
	import { sidebarOpen } from '../../contexts/sidebarStrore';
	function handleOpenSideBar() {
		sidebarOpen.set(true);
	}
</script>

<li>
	<button
		class="block h-12 w-12 cursor-pointer rounded-full outline outline-white"
		on:click={handleOpenSideBar}
		type="button"
	>
		<img
			width={50}
			height={50}
			src={'/site/avatar.png'}
			alt=""
			class="aspect-square h-full w-full rounded-full object-cover"
		/>
	</button>
</li>
