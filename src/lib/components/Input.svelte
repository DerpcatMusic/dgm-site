<script lang="ts">
	interface Props {
		type?: string;
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
		label?: string;
	}

	let {
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		disabled = false,
		required = false,
		error = '',
		label = ''
	}: Props = $props();

	let inputElement: HTMLInputElement;

	// Base classes
	let baseClasses =
		'input-neo w-full border-4 border-black bg-white px-4 py-3 text-lg font-semibold shadow-[4px_4px_0px_0px_#000000] transition-all duration-100 focus:shadow-[2px_2px_0px_0px_#000000] focus:translate-x-1 focus:translate-y-1 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50';

	// State classes
	let stateClasses = $derived(() => {
		if (disabled) {
			return 'opacity-50 cursor-not-allowed bg-gray-100';
		}
		if (error) {
			return 'border-neo-red focus:border-neo-red focus:ring-neo-red';
		}
		return '';
	});

	let inputClasses = $derived(`${baseClasses} ${stateClasses}`);
</script>

<div class="space-y-2">
	{#if label}
		<label
			for={label.toLowerCase().replace(/\s+/g, '-')}
			class="block text-lg font-black uppercase tracking-wider text-black"
		>
			{label}
			{#if required}
				<span class="text-neo-red ml-1">*</span>
			{/if}
		</label>
	{/if}

	<input
		bind:this={inputElement}
		bind:value
		{type}
		{placeholder}
		{disabled}
		{required}
		id={label ? label.toLowerCase().replace(/\s+/g, '-') : undefined}
		class={inputClasses}
		aria-describedby={error ? `${label.toLowerCase().replace(/\s+/g, '-')}-error` : undefined}
		aria-invalid={error ? 'true' : 'false'}
	/>

	{#if error}
		<p
			id={`${label.toLowerCase().replace(/\s+/g, '-')}-error`}
			class="text-neo-red font-bold text-sm uppercase tracking-wider"
			role="alert"
		>
			{error}
		</p>
	{/if}
</div>
