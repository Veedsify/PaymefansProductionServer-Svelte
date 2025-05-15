<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { getToken } from '$lib/token';
	import ROUTE from '$lib/config/routes';

	export let profile_banner: string;
	let file: File | null = null;
	let imageUrl: string | null = null;
	let imageRef: HTMLImageElement | null = null;
	const token: string | null = getToken();

	// Crop area state
	let cropArea = { x: 0, y: 0, width: 200, height: 65.66 }; // Initial 1980/650 aspect ratio
	let isDragging = false;
	let isResizing = false;
	let dragStart = { x: 0, y: 0 };
	let container: HTMLDivElement | null = null;
	let imageBounds: DOMRect | null = null;
	const aspectRatio = 1980 / 650;

	const handleImageChange = (e: Event): void => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const selectedFile: File = target.files[0];

			if (selectedFile.size > 1024 * 1024 * 10) {
				toast.error('Image size should be less than 10MB');
				return;
			}

			const acceptedImageTypes: string[] = ['image/jpeg', 'image/png'];
			if (!acceptedImageTypes.includes(selectedFile.type)) {
				toast.error('Only .jpeg and .png images are allowed');
				return;
			}

			imageUrl = URL.createObjectURL(selectedFile);
			file = selectedFile;

			// Initialize crop area after image loads
			setTimeout(() => {
				if (imageRef && container) {
					imageBounds = imageRef.getBoundingClientRect();
					const containerBounds = container.getBoundingClientRect();
					const maxWidth = Math.min(imageBounds.width, containerBounds.width * 0.8);
					const maxHeight = maxWidth / aspectRatio;
					cropArea = {
						x: (imageBounds.width - maxWidth) / 2,
						y: (imageBounds.height - maxHeight) / 2,
						width: maxWidth,
						height: maxHeight
					};
				}
			}, 100);
		}
	};

	const startDrag = (e: MouseEvent | TouchEvent) => {
		e.preventDefault();
		isDragging = true;
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		dragStart = { x: clientX, y: clientY };
	};

	const startResize = (e: MouseEvent | TouchEvent) => {
		e.preventDefault();
		isResizing = true;
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
		dragStart = { x: clientX, y: clientY };
	};

	const onMove = (e: MouseEvent | TouchEvent) => {
		if (!isDragging && !isResizing) return;
		e.preventDefault();
		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

		if (isDragging && imageBounds) {
			const dx = clientX - dragStart.x;
			const dy = clientY - dragStart.y;
			const newX = Math.max(0, Math.min(cropArea.x + dx, imageBounds.width - cropArea.width));
			const newY = Math.max(0, Math.min(cropArea.y + dy, imageBounds.height - cropArea.height));
			cropArea = { ...cropArea, x: newX, y: newY };
			dragStart = { x: clientX, y: clientY };
		}

		if (isResizing && imageBounds) {
			const dx = clientX - dragStart.x;
			let newWidth = Math.max(50, cropArea.width + dx);
			const maxWidth = imageBounds.width - cropArea.x;
			if (newWidth > maxWidth) newWidth = maxWidth;
			let newHeight = newWidth / aspectRatio;
			if (cropArea.y + newHeight > imageBounds.height) {
				newHeight = imageBounds.height - cropArea.y;
				newWidth = newHeight * aspectRatio;
			}
			cropArea = { ...cropArea, width: newWidth, height: newHeight };
			dragStart = { x: clientX, y: clientY };
		}
	};

	const stopInteraction = () => {
		isDragging = false;
		isResizing = false;
	};

	const getCroppedImg = async (
		image: HTMLImageElement,
		crop: typeof cropArea
	): Promise<Blob | null> => {
		const canvas: HTMLCanvasElement = document.createElement('canvas');
		const scaleX: number = image.naturalWidth / imageBounds!.width;
		const scaleY: number = image.naturalHeight / imageBounds!.height;
		canvas.width = crop.width * scaleX;
		canvas.height = crop.height * scaleY;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

		if (!ctx) return null;

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			canvas.width,
			canvas.height
		);

		return new Promise<Blob | null>((resolve) => {
			canvas.toBlob((blob) => {
				if (!blob) return resolve(null);
				resolve(blob);
			}, 'image/jpeg');
		});
	};

	const uploadBannerImage = async (): Promise<void> => {
		if (!file || !imageRef || !cropArea) return;

		try {
			toast.loading('Uploading banner image...', {
				id: 'banner-update'
			});
			const croppedImageBlob: Blob | null = await getCroppedImg(imageRef, cropArea);
			if (!croppedImageBlob) {
				toast.error('Failed to crop image');
				return;
			}

			const formData: FormData = new FormData();
			formData.append('banner', new File([croppedImageBlob], file.name, { type: file.type }));

			const response: Response = await fetch(ROUTE.BANNER_IMAGE_UPLOAD, {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				toast.error('Failed to upload banner image', {
					id: 'banner-update'
				});
				return;
			}

			const data: { status: boolean } = await response.json();
			if (data.status) {
				toast.success('Banner image uploaded successfully', {
					id: 'banner-update'
				});
				file = null;
				if (imageUrl) URL.revokeObjectURL(imageUrl);
				imageUrl = null;
				cropArea = { x: 0, y: 0, width: 200, height: 65.66 };
				invalidateAll();
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to upload banner image', {
				id: 'banner-update'
			});
		}
	};

	const cancelCrop = (): void => {
		file = null;
		if (imageUrl) URL.revokeObjectURL(imageUrl);
		imageUrl = null;
		cropArea = { x: 0, y: 0, width: 200, height: 65.66 };
	};

	const selectImage = (): void => {
		const input: HTMLElement | null = document.getElementById('banner_image_upload');
		if (input) input.click();
	};
</script>

<svelte:window
	on:mousemove={onMove}
	on:mouseup={stopInteraction}
	on:touchmove={onMove}
	on:touchend={stopInteraction}
/>

<div class="relative rounded-lg border border-gray-200 shadow-lg">
	{#if imageUrl}
		<div bind:this={container} class="relative flex w-full justify-center bg-gray-50">
			<div class="relative w-full">
				<img
					bind:this={imageRef}
					src={imageUrl}
					alt="Crop source"
					class=" w-full object-contain"
					on:load={() => {
						if (imageRef) imageBounds = imageRef.getBoundingClientRect();
					}}
				/>
				<div
					class="absolute border-2 border-white shadow-lg"
					style="left: {cropArea.x}px; top: {cropArea.y}px; width: {cropArea.width}px; height: {cropArea.height}px;"
				>
					<div
						class="absolute inset-0 cursor-move"
						on:mousedown={startDrag}
						on:touchstart={startDrag}
						role="none"
					></div>
					<div
						class="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize border border-gray-300 bg-white"
						on:mousedown={startResize}
						on:touchstart={startResize}
						role="none"
					></div>
				</div>
			</div>
			<div class="absolute bottom-4 right-4 z-10 flex gap-2">
				<input
					type="file"
					id="banner_image_upload"
					on:change={handleImageChange}
					accept=".jpg,.jpeg,.png"
					class="hidden"
				/>
				<button
					on:click={selectImage}
					class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow transition hover:bg-gray-100"
				>
					Replace
				</button>
				<button
					on:click={cancelCrop}
					class="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-red-600"
				>
					Cancel
				</button>
				<button
					on:click={uploadBannerImage}
					class="flex items-center rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16V4m0 0L3 8m4-4l4 4m10 4v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"
						/>
					</svg>
					Upload
				</button>
			</div>
		</div>
	{:else}
		<div class="relative w-full rounded-lg bg-gray-100">
			<img
				src={profile_banner}
				alt="Home Banner"
				class="h-full w-full rounded-lg object-cover"
				width={1200}
				height={400}
			/>
			<input
				type="file"
				id="banner_image_upload"
				on:change={handleImageChange}
				accept=".jpg,.jpeg,.png"
				class="hidden"
			/>
			<div
				class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 transition hover:bg-black/60"
				on:click={selectImage}
				on:keydown={(e) => e.key === 'Enter' && selectImage()}
				role="button"
				tabindex="0"
			>
				<button
					class="flex items-center rounded-lg bg-white/90 px-5 py-2 font-semibold text-gray-800 shadow hover:bg-white"
				>
					<svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16V4m0 0L3 8m4-4l4 4m10 4v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6"
						/>
					</svg>
					Upload Banner
				</button>
			</div>
		</div>
	{/if}
</div>
