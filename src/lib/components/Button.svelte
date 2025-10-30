<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'success';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		'aria-label'?: string;
		'aria-describedby'?: string;
		'aria-expanded'?: boolean;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		onclick,
		'aria-label': ariaLabel,
		'aria-describedby': ariaDescribedBy,
		'aria-expanded': ariaExpanded,
		children
	}: Props = $props();

	// Base classes
	let baseClasses = 'btn-neo inline-flex items-center justify-center font-black uppercase tracking-wider border-4 border-black transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50';

	// Variant classes
	let variantClasses = $derived(() => {
		switch (variant) {
			case 'primary':
				return 'bg-neo-red text-white border-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-red-light';
			case 'secondary':
				return 'bg-neo-yellow text-black border-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-yellow-light';
			case 'danger':
				return 'bg-neo-red text-white border-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-red-light';
			case 'success':
				return 'bg-neo-green text-black border-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] hover:bg-neo-green-light';
			default:
				return 'bg-white text-black shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000]';
		}
	});

	// Size classes
	let sizeClasses = $derived(() => {
		switch (size) {
			case 'sm':
				return 'px-4 py-2 text-sm';
			case 'lg':
				return 'px-12 py-6 text-xl';
			default:
				return 'px-8 py-4 text-lg';
		}
	});

	// State classes
	let stateClasses = $derived(() => {
		if (disabled || loading) {
			return 'opacity-50 cursor-not-allowed shadow-[4px_4px_0px_0px_#666666] hover:shadow-[4px_4px_0px_0px_#666666] hover:translate-x-0 hover:translate-y-0';
		}
		return '';
	});

	let buttonClasses = $derived(`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses}`);
</script>

<button
	class={buttonClasses}
	{disabled}
	{type}
	{onclick}
	aria-label={ariaLabel}
	aria-describedby={ariaDescribedBy}
	aria-expanded={ariaExpanded}
>
	{#if loading}
		<svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	{/if}
	{@render children?.()}
</button>