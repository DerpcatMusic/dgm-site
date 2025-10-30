<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		items: any[];
		autoPlay?: boolean;
		autoPlayInterval?: number;
		showArrows?: boolean;
		showDots?: boolean;
		infinite?: boolean;
		children?: any;
	}

	let {
		items,
		autoPlay = true,
		autoPlayInterval = 5000,
		showArrows = true,
		showDots = true,
		infinite = true,
		children
	}: Props = $props();

	let currentIndex = $state(0);
	let container: HTMLElement | undefined = $state();
	let autoPlayTimer: ReturnType<typeof setInterval> | undefined = $state();
	let isDragging = $state(false);
	let startX = $state(0);
	let scrollLeft = $state(0);

	let totalItems = $derived(items.length);

	function nextSlide() {
		if (infinite || currentIndex < totalItems - 1) {
			currentIndex = (currentIndex + 1) % totalItems;
		}
	}

	function prevSlide() {
		if (infinite || currentIndex > 0) {
			currentIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
		}
	}

	function goToSlide(index: number) {
		currentIndex = index;
	}

	function startAutoPlay() {
		if (autoPlay && totalItems > 1) {
			autoPlayTimer = setInterval(nextSlide, autoPlayInterval) as ReturnType<typeof setInterval>;
		}
	}

	function stopAutoPlay() {
		if (autoPlayTimer) {
			clearInterval(autoPlayTimer);
			autoPlayTimer = undefined;
		}
	}

	function handleMouseEnter() {
		stopAutoPlay();
	}

	function handleMouseLeave() {
		startAutoPlay();
	}

	function handleTouchStart(event: TouchEvent) {
		stopAutoPlay();
		isDragging = true;
		startX = event.touches[0].clientX;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging || !container) return;
		const x = event.touches[0].clientX;
		const walk = (x - startX) * 2; // Scroll speed multiplier
		container.scrollLeft = scrollLeft - walk;
	}

	function handleTouchEnd(event: TouchEvent) {
		if (!isDragging) return;
		isDragging = false;

		const endX = event.changedTouches[0].clientX;
		const diff = startX - endX;

		if (Math.abs(diff) > 50) {
			// Minimum swipe distance
			if (diff > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}

		startAutoPlay();
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				prevSlide();
				break;
			case 'ArrowRight':
				event.preventDefault();
				nextSlide();
				break;
			case 'Home':
				event.preventDefault();
				goToSlide(0);
				break;
			case 'End':
				event.preventDefault();
				goToSlide(totalItems - 1);
				break;
		}
	}

	onMount(() => {
		startAutoPlay();
	});

	onDestroy(() => {
		stopAutoPlay();
	});
</script>

<div
	class="relative overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_#000000] bg-white"
	role="region"
	aria-label="Image carousel"
	aria-live="polite"
	aria-describedby="carousel-instructions"
	aria-keyshortcuts="ArrowLeft ArrowRight Home End"
>
	<div id="carousel-instructions" class="sr-only">
		Use arrow keys to navigate slides, Home to go to first slide, End to go to last slide
	</div>
	<!-- Carousel Container -->
	<div
		bind:this={container}
		class="flex transition-transform duration-500 ease-out"
		style="transform: translateX(-{currentIndex * 100}%)"
		role="group"
		aria-labelledby="carousel-label"
	>
		<div id="carousel-label" class="sr-only">Carousel slides</div>
		{#each items as item, index}
			<div
				class="flex-shrink-0 w-full transition-all duration-500 ease-out"
				class:opacity-100={index === currentIndex}
				class:opacity-70={index !== currentIndex}
				class:scale-100={index === currentIndex}
				class:scale-90={index !== currentIndex}
				role="img"
				aria-label="Slide {index + 1} of {totalItems}"
				aria-hidden={index !== currentIndex}
				tabindex="-1"
			>
				{@render children(item, index)}
			</div>
		{/each}
	</div>

	<!-- Navigation Arrows -->
	{#if showArrows && totalItems > 1}
		<button
			onclick={prevSlide}
			class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-neo-black text-white p-3 border-2 border-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100 z-10 hover:scale-110 active:scale-95"
			aria-label="Previous slide"
			disabled={!infinite && currentIndex === 0}
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 19l-7-7 7-7"
				></path>
			</svg>
		</button>

		<button
			onclick={nextSlide}
			class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-neo-black text-white p-3 border-2 border-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 transition-all duration-100 z-10 hover:scale-110 active:scale-95"
			aria-label="Next slide"
			disabled={!infinite && currentIndex === totalItems - 1}
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M9 5l7 7-7 7"
				></path>
			</svg>
		</button>
	{/if}

	<!-- Dots Indicator -->
	{#if showDots && totalItems > 1}
		<div
			class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10"
			role="tablist"
			aria-label="Slide indicators"
		>
			{#each items as _, index}
				<button
					onclick={() => goToSlide(index)}
					class="w-4 h-4 border-2 border-black transition-all duration-100 {index === currentIndex
						? 'bg-neo-yellow shadow-[2px_2px_0px_0px_#000000] scale-125'
						: 'bg-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1'} hover:scale-125 active:scale-90"
					role="tab"
					aria-label="Go to slide {index + 1} of {totalItems}"
					aria-selected={index === currentIndex}
					tabindex={index === currentIndex ? 0 : -1}
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Responsive adjustments */
</style>
