<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		isOpen: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children?: any;
	}

	let {
		isOpen,
		title = '',
		size = 'md',
		children
	}: Props = $props();

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleClose();
		}
	}

	// Size classes
	let sizeClasses = $derived(() => {
		switch (size) {
			case 'sm':
				return 'max-w-md';
			case 'lg':
				return 'max-w-4xl';
			case 'xl':
				return 'max-w-6xl';
			default:
				return 'max-w-2xl';
		}
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 300 }}
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		tabindex="-1"
		onkeydown={handleKeyDown}
	>
		<!-- Modal Content -->
		<div
			class="modal-neo bg-white border-8 border-black shadow-[20px_20px_0px_0px_#000000] w-full {sizeClasses} max-h-[90vh] overflow-hidden"
			transition:fly={{ y: 50, duration: 500 }}
		>
			<!-- Header -->
			{#if title}
				<div class="flex justify-between items-center p-6 border-b-4 border-black bg-neo-yellow">
					<h2 id="modal-title" class="text-2xl font-black uppercase tracking-wider text-black">
						{title}
					</h2>
					<button
						class="text-black hover:text-neo-red transition-colors bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 p-2"
						onclick={handleClose}
						aria-label="Close modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			{:else}
				<button
					class="absolute top-4 right-4 z-10 text-black hover:text-neo-red transition-colors bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 p-2"
					onclick={handleClose}
					aria-label="Close modal"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			{/if}

			<!-- Content -->
			<div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}