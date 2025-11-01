<script lang="ts">
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import DashboardIcon from '$lib/icons/DashboardIcon.svelte';
	import Button from '$lib/components/general/Button.svelte';
	import TextInput from '$lib/components/general/TextInput.svelte';
	import Dropdown from '$lib/components/general/Dropdown.svelte';
	import UploadIcon from '$lib/icons/UploadIcon.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	import type { Crumb } from '$lib/types/ui';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PUBLIC_USER_ID } from '$env/static/public';

	const segments: Crumb[] = [
		{ label: 'Dashboard', href: '/app/overview', Icon: DashboardIcon },
		{ label: 'Event', href: '/app/events' },
		{ label: 'Add Event' }
	];

	const convex = useConvexClient();

	// Form state
	let title = '';
	let description = '';
	let clientId: string | number = '';
	let startDate: string = '';
	let endDate: string = '';
	let hasPaid = false; // Placeholder for future use
	let imagePreview: string = '';
	let imageFile: File | null = null;
	// Frontend-only video uploads (multiple)
	type VideoItem = {
		file: File;
		url: string;
		name: string;
		sizeText: string;
		status: 'Uploading' | 'Uploaded';
	};
	let videos: VideoItem[] = [];

	let isSubmitting = false;
	// Image constraints
	const MAX_IMAGE_BYTES = 1024 * 1024; // 1MB
	let imageError: string | undefined;
	let titleError: string | undefined;
	let descError: string | undefined;
	let clientError: string | undefined;
	let startDateError: string | undefined;
	let endDateError: string | undefined;
	let videoError: string | undefined;
	// Drag & drop state (video area)
	// removed unused drag state

	// Clients for dropdown
	type Option = { label: string; value: string };
	let clientOptions: Option[] = [];

	onMount(async () => {
		try {
			if (!convex) throw new Error('Convex client not available');
			const clients = await convex.query(api.clients.list, {});
			clientOptions = (clients || []).map((c) => ({ label: c.name, value: c._id }));
		} catch (e) {
			console.error(e);
		}
	});

	function toEpoch(dateStr: string): number | null {
		if (!dateStr) return null;
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return null;
		return d.getTime();
	}

	async function onSubmit() {
		titleError = undefined;
		descError = undefined;
		clientError = undefined;
		startDateError = undefined;
		endDateError = undefined;
		videoError = undefined;
		isSubmitting = true;
		try {
			if (!convex) throw new Error('Convex client not available');
			if (!title.trim()) {
				titleError = 'Please enter a project title.';
			}
			if (!clientId) {
				clientError = 'Please select a client.';
			}
			if (!startDate) {
				startDateError = 'Please select a start date.';
			}
			if (!endDate) {
				endDateError = 'Please select an end date.';
			}
			if (descError) descError = undefined;
			// Video is optional for backend create; UI-only

			if (titleError || clientError || startDateError || endDateError) {
				isSubmitting = false;
				return;
			}

			// Validate image size before encoding (match backend 1MB limit)
			if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
				imageError = 'Image is too large. Max 1MB.';
				isSubmitting = false;
				return;
			}

			// Convert image to data URL if provided
			let image = '';
			if (imageFile) {
				const f: File = imageFile;
				image = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result || ''));
					reader.onerror = () => reject(new Error('Failed to read image'));
					reader.readAsDataURL(f);
				});
			}

			const startEpoch = toEpoch(startDate) ?? Date.now();
			const endEpoch = toEpoch(endDate) ?? startEpoch;

			await convex.mutation(api.events.create, {
				name: title,
				image,
				client: clientId as Id<'clients'>,
				status: 'draft',
				userId: (PUBLIC_USER_ID as unknown as Id<'users'>) ?? undefined,
				description,
				start_date: startEpoch,
				end_date: endEpoch,
				has_paid: hasPaid
			});

			// Navigate back to events list
			goto(resolve('/app/events'));
		} catch (e) {
			console.error(e);
		} finally {
			isSubmitting = false;
		}
	}

	function onImageChange(files: FileList | null) {
		if (!files || !files[0]) return;
		const f = files[0];
		imageError = undefined;
		if (!f.type.startsWith('image/')) {
			imageError = 'Invalid file type. Please choose an image.';
			imageFile = null;
			imagePreview = '';
			return;
		}
		if (f.size > MAX_IMAGE_BYTES) {
			imageError = 'Image is too large. Max 1MB.';
			imageFile = null;
			imagePreview = '';
			return;
		}
		imageFile = f;
		const reader = new FileReader();
		reader.onload = () => (imagePreview = String(reader.result || ''));
		reader.readAsDataURL(f);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		const kb = bytes / 1024;
		if (kb < 1024) return `${kb.toFixed(0)} KB`;
		const mb = kb / 1024;
		return `${mb.toFixed(1)} MB`;
	}

	function onVideoChange(files: FileList | null) {
		if (!files || files.length === 0) return;
		videoError = undefined;
		Array.from(files).forEach((file) => {
			if (!file.type.startsWith('video/')) {
				videoError = 'Invalid file type. Please choose a video.';
				return;
			}
			const url = URL.createObjectURL(file);
			const item: VideoItem = {
				file,
				url,
				name: file.name,
				sizeText: formatSize(file.size),
				status: 'Uploading'
			};
			videos = [...videos, item];
			// Simulate upload completion (UI-only)
			setTimeout(() => {
				item.status = 'Uploaded';
				videos = [...videos]; // trigger Svelte reactivity
			}, 800);
		});
	}

	function handleVideoDragOver(e: DragEvent) {
		e.preventDefault();
	}
	function handleVideoDragLeave(e: DragEvent) {
		e.preventDefault();
	}
	function handleVideoDrop(e: DragEvent) {
		e.preventDefault();
		const dt = e.dataTransfer;
		if (dt && dt.files && dt.files.length) {
			onVideoChange(dt.files);
		}
	}

	function removeVideo(index: number) {
		const [removed] = videos.splice(index, 1);
		if (removed?.url) URL.revokeObjectURL(removed.url);
		videos = [...videos];
	}
</script>

<PageShell>
	<svelte:fragment slot="header">
		<PageHeader {segments} />
	</svelte:fragment>

	<div class="flex w-full items-center justify-between">
		<h1 class="text-[24px] font-semibold text-[var(--color-black-600)]">Add Event</h1>
		<div class="flex items-center gap-2">
			<Button variant="outline" ariaLabel="Cancel" on:click={() => goto(resolve('/app/events'))}
				>Cancel</Button
			>
			<Button variant="primary" ariaLabel="Add Event" on:click={onSubmit} disabled={isSubmitting}
				>{isSubmitting ? 'Saving...' : 'Add Event'}</Button
			>
		</div>
	</div>

	<!-- Removed global error banner; show field-level errors instead -->

	<div class="mt-4 grid w-full grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
		<!-- Left: Form sections -->
		<div class="flex w-full flex-col gap-4">
			<!-- About Project -->
			<section
				class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-5 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
			>
				<h2 class="mb-3 text-[16px] font-semibold text-[var(--color-black-600)]">About Project</h2>
				<div class="flex flex-col gap-3">
					<TextInput
						id="title"
						label="Project Title"
						placeholder="Project title…"
						bind:value={title}
						error={titleError}
						required
						full
						on:input={() => (titleError = undefined)}
					/>
					<div class="flex flex-col">
						<label class="mb-1 text-[14px] font-medium text-[var(--color-black-400)]" for="desc"
							>Description</label
						>
						<textarea
							id="desc"
							bind:value={description}
							rows={5}
							placeholder="Project description…"
							class="w-full resize-y rounded-[var(--radius-10)] border border-[var(--color-black-50)] bg-[var(--color-white)] p-3 text-[14px] text-[var(--color-black-600)] focus:ring-2 focus:ring-[var(--color-black-100)] focus:outline-none"
							on:input={() => (descError = undefined)}
						></textarea>
						{#if descError}
							<p class="mt-1 text-[12px] font-normal text-[var(--color-red-500)]">{descError}</p>
						{/if}
					</div>
				</div>
			</section>

			<!-- Project Details -->
			<section
				class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-5 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
			>
				<h2 class="mb-3 text-[16px] font-semibold text-[var(--color-black-600)]">
					Project Details
				</h2>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
					<div>
						<Dropdown
							id="client"
							label="Client"
							bind:value={clientId}
							options={clientOptions}
							error={clientError}
							stacked
							full
							placeholder="Select name…"
						/>
					</div>
					<div class="flex flex-col space-y-[6px]">
						<label class="text-[14px] font-medium text-[var(--color-black-400)]" for="start"
							>Start Date</label
						>
						<div
							class="rounded-lg border px-3 py-[10px] focus-within:ring-2 focus-within:ring-[var(--color-black-100)] focus-within:ring-offset-1 {startDateError
								? 'border-[var(--color-red-500)] bg-[var(--color-red-50)]'
								: 'border-[var(--color-black-50)] bg-[var(--color-white)]'}"
						>
							<input
								id="start"
								type="date"
								bind:value={startDate}
								required
								aria-invalid={!!startDateError}
								aria-describedby={startDateError ? 'start-error' : undefined}
								class="w-full border-0 bg-transparent text-[14px] text-[var(--color-black-600)] outline-none focus:ring-0"
								on:input={() => (startDateError = undefined)}
							/>
						</div>
						<div class="min-h-[18px]">
							{#if startDateError}
								<p
									id="start-error"
									class="mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]"
								>
									{startDateError}
								</p>
							{/if}
						</div>
					</div>
					<div class="flex flex-col space-y-[6px]">
						<label class="text-[14px] font-medium text-[var(--color-black-400)]" for="end"
							>End Date</label
						>
						<div
							class="rounded-lg border px-3 py-[10px] focus-within:ring-2 focus-within:ring-[var(--color-black-100)] focus-within:ring-offset-1 {endDateError
								? 'border-[var(--color-red-500)] bg-[var(--color-red-50)]'
								: 'border-[var(--color-black-50)] bg-[var(--color-white)]'}"
						>
							<input
								id="end"
								type="date"
								bind:value={endDate}
								required
								aria-invalid={!!endDateError}
								aria-describedby={endDateError ? 'end-error' : undefined}
								class="w-full border-0 bg-transparent text-[14px] text-[var(--color-black-600)] outline-none focus:ring-0"
								on:input={() => (endDateError = undefined)}
							/>
						</div>
						<div class="min-h-[18px]">
							{#if endDateError}
								<p
									id="end-error"
									class="mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]"
								>
									{endDateError}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</section>

			<!-- Video footage (UI only) -->
			<section
				class="rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-5 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
			>
				<h2 class="mb-3 text-[16px] font-semibold text-[var(--color-black-600)]">Video footage</h2>
				{#if videos.length === 0}
					<div
						class="rounded-[var(--radius-10)] border border-dashed"
						class:border-[var(--color-black-100)]={!videoError}
						class:border-[var(--color-red-500)]={!!videoError}
						class:bg-[var(--color-grey-25)]={!videoError}
						class:bg-[var(--color-red-50)]={!!videoError}
					>
						<label
							class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center text-[14px] text-[var(--color-black-400)]"
							on:dragover={handleVideoDragOver}
							on:dragleave={handleVideoDragLeave}
							on:drop={handleVideoDrop}
						>
							<UploadIcon />
							<span
								><span class="font-bold text-[var(--color-purple-500)]">Click to Upload</span> or drag
								and drop</span
							>
							<span class="text-[12px]">MP4, MOV, WEBM less than 500MB</span>
							<input
								type="file"
								accept="video/*"
								multiple
								class="hidden"
								on:change={(e) => onVideoChange((e.target as HTMLInputElement).files)}
							/>
						</label>
					</div>
					<div class="min-h-[18px]">
						{#if videoError}
							<p class="mt-2 text-[12px] font-normal text-[var(--color-red-500)]">{videoError}</p>
						{/if}
					</div>
				{:else}
					<div class="flex flex-col gap-3">
						{#each videos as v, i (v.url)}
							<div
								class="flex items-center justify-between rounded-[12px] border border-[var(--color-black-50)] bg-[var(--color-white)] px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
							>
								<div class="flex min-w-0 items-center gap-3">
									<div class="h-8 w-8 rounded-md bg-[var(--color-purple-50)]"></div>
									<div class="min-w-0">
										<div class="truncate text-[14px] font-semibold text-[var(--color-black-600)]">
											{v.name}
										</div>
										<div class="flex items-center gap-2 text-[12px] text-[var(--color-black-300)]">
											<span>{v.sizeText}</span>
											<span>•</span>
											{#if v.status === 'Uploading'}
												<span class="text-[var(--color-orange-500)]">Uploading</span>
											{:else}
												<span class="text-[var(--color-green-600)]">Uploaded</span>
											{/if}
										</div>
									</div>
								</div>
								<button
									type="button"
									aria-label="Remove video"
									class="flex h-6 items-center justify-center text-[var(--color-red-500)] hover:text-[var(--color-red-600)]"
									on:click={() => removeVideo(i)}
								>
									<span class="inline-flex items-center justify-center">
										<DeleteIcon className="w-6 h-6" />
									</span>
								</button>
							</div>
						{/each}
						<div class="pt-1">
							<label
								class="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[var(--color-black-100)] bg-[var(--color-white)] px-3 py-2 text-[14px] font-semibold text-[var(--color-black-600)] hover:border-[var(--color-black-200)]"
							>
								+ Add File
								<input
									type="file"
									accept="video/*"
									multiple
									class="hidden"
									on:change={(e) => onVideoChange((e.target as HTMLInputElement).files)}
								/>
							</label>
						</div>
					</div>
				{/if}
			</section>
		</div>

		<!-- Right: Image upload -->
		<aside class="flex h-fit w-full flex-col gap-4">
			<div
				class="w-full rounded-[var(--radius-20)] border border-[var(--border-gradient-gray-vertical)] bg-[var(--color-white)] p-5 shadow-[0_8px_20px_0_rgba(77,84,100,0.04)]"
			>
				<h3 class="mb-3 text-[16px] font-semibold text-[var(--color-black-600)]">Image</h3>
				<label
					class="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-10)] border border-dashed p-6 text-center text-[14px]"
					class:border-[var(--color-black-100)]={!imageError}
					class:border-[var(--color-red-500)]={!!imageError}
					class:bg-[var(--color-grey-25)]={!imageError}
					class:bg-[var(--color-red-50)]={!!imageError}
				>
					{#if imagePreview}
						<img
							alt="preview"
							src={imagePreview}
							class="max-h-48 w-full rounded-md object-contain"
						/>
					{:else}
						<UploadIcon />
						<span class="text-[var(--color-black-400)]"
							><span class="font-bold text-[var(--color-purple-500)]">Click to Upload</span> or drag
							and drop</span
						>
						<span class="text-[12px] text-[var(--color-black-300)]"
							>JPG, JPEG, PNG less than 1MB</span
						>
					{/if}
					<input
						type="file"
						accept="image/*"
						class="hidden"
						on:change={(e) => onImageChange((e.target as HTMLInputElement).files)}
					/>
				</label>
				<div class="min-h-[18px]">
					{#if imageError}
						<p class="mt-[4px] text-[12px] font-normal text-[var(--color-red-500)]">{imageError}</p>
					{/if}
				</div>
			</div>
		</aside>
	</div>
</PageShell>
