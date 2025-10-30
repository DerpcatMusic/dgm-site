<script lang="ts">
	interface Props {
		variant?: 'default' | 'elevated' | 'bordered';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		children?: any;
	}

	let {
		variant = 'default',
		padding = 'md',
		children
	}: Props = $props();

	// Base classes
	let baseClasses = 'card-neo bg-white border-4 border-black';

	// Variant classes
	let variantClasses = $derived(() => {
		switch (variant) {
			case 'elevated':
				return 'shadow-[16px_16px_0px_0px_#000000]';
			case 'bordered':
				return 'border-8 shadow-[12px_12px_0px_0px_#000000]';
			default:
				return 'shadow-[12px_12px_0px_0px_#000000]';
		}
	});

	// Padding classes
	let paddingClasses = $derived(() => {
		switch (padding) {
			case 'none':
				return 'p-0';
			case 'sm':
				return 'p-4';
			case 'lg':
				return 'p-8';
			default:
				return 'p-6';
		}
	});

	let cardClasses = $derived(`${baseClasses} ${variantClasses} ${paddingClasses}`);
</script>

<div class={cardClasses}>
	{@render children?.()}
</div>