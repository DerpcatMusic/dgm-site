# Svelte 5 Best Practices Guide

## Overview

This comprehensive guide covers best practices for developing with Svelte 5, focusing on the new features like runes, event handling, and modern patterns.

## Table of Contents

1. [Runes and Reactivity](#runes-and-reactivity)
2. [Component Structure](#component-structure)
3. [Event Handling](#event-handling)
4. [State Management](#state-management)
5. [Performance Optimization](#performance-optimization)
6. [TypeScript Integration](#typescript-integration)
7. [Styling Best Practices](#styling-best-practices)
8. [Testing](#testing)
9. [Component-Driven Development with Storybook](#component-driven-development-with-storybook)
10. [Migration from Svelte 4](#migration-from-svelte-4)

## Runes and Reactivity

### Use Runes for Reactive State

```svelte
<script lang="ts">
	let count = $state(0); // Reactive state
	let doubled = $derived(count * 2); // Computed value
	let name = $state(''); // Reactive string

	function increment() {
		count++;
	}

	// Effects run when dependencies change
	$effect(() => {
		console.log('Count changed:', count);
	});
</script>
```

### Best Practices for Runes

- Use `$state()` for mutable reactive values
- Use `$derived()` for computed values that depend on other state
- Use `$effect()` sparingly, only when you need side effects
- Avoid deep nesting of reactive computations
- Prefer reactive statements over manual effect management

## Component Structure

### Component Organization

```svelte
<script lang="ts">
	// Imports at top
	import { createEventDispatcher } from 'svelte';
	import type { Artist } from '$lib/types';

	// Props using runes
	interface Props {
		artist: Artist;
		onSelect?: (artist: Artist) => void;
	}

	let { artist, onSelect }: Props = $props();

	// Local state
	let isHovered = $state(false);

	// Event dispatcher for custom events
	const dispatch = createEventDispatcher<{
		select: { artist: Artist };
	}>();
</script>

<!-- Template -->
<div class="artist-card" class:hovered={isHovered}>
	<h3>{artist.name}</h3>
	<button onclick={() => dispatch('select', { artist })}> Select Artist </button>
</div>

<style>
	.artist-card {
		/* Styles */
	}

	.hovered {
		/* Hover styles */
	}
</style>
```

### Component Best Practices

- Use TypeScript interfaces for props
- Group related logic together
- Use descriptive variable names
- Keep components focused on a single responsibility
- Use custom events for parent-child communication

## Event Handling

### Modern Event Handling

```svelte
<script lang="ts">
	let inputValue = $state('');

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		inputValue = target.value;
	}

	// Or use bind:value for two-way binding
	let boundValue = $state('');
</script>

<input bind:value={boundValue} />
<input value={inputValue} oninput={handleInput} />
```

### Event Handler Best Practices

- Use type assertions for event targets
- Prefer bind:value for simple two-way binding
- Use descriptive event handler names
- Debounce expensive operations
- Clean up event listeners in effects if needed

## State Management

### Local State with Runes

```svelte
<script lang="ts">
	let todos = $state<string[]>([]);
	let filter = $state<'all' | 'active' | 'completed'>('all');

	let filteredTodos = $derived(() => {
		switch (filter) {
			case 'active':
				return todos.filter((todo) => !todo.completed);
			case 'completed':
				return todos.filter((todo) => todo.completed);
			default:
				return todos;
		}
	});

	function addTodo(text: string) {
		todos.push({ id: Date.now(), text, completed: false });
	}

	function toggleTodo(id: number) {
		const todo = todos.find((t) => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
		}
	}
</script>
```

### Global State Management

```svelte
// stores/auth.ts import {writable} from 'svelte/store'; export const user = writable(null); export const
isAuthenticated = writable(false); // Or use runes for global state export let globalCount = $state(0);
```

## Performance Optimization

### Reactive Optimizations

```svelte
<script lang="ts">
	let items = $state<Item[]>([]);
	let searchTerm = $state('');

	// Only recompute when searchTerm changes
	let filteredItems = $derived(() => {
		if (!searchTerm) return items;
		return items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
	});

	// Avoid unnecessary computations
	let itemCount = $derived(filteredItems.length);
</script>
```

### Rendering Optimizations

- Use `$derived()` to cache expensive computations
- Avoid deep object mutations that trigger unnecessary updates
- Use `{#key}` blocks for dynamic component recreation
- Implement virtual scrolling for large lists
- Use `{#await}` blocks appropriately for async operations

## TypeScript Integration

### Type-Safe Components

```svelte
<script lang="ts">
	interface User {
		id: number;
		name: string;
		email: string;
	}

	interface Props {
		user: User;
		onUpdate: (user: User) => void;
	}

	let { user, onUpdate }: Props = $props();

	function updateName(newName: string) {
		onUpdate({ ...user, name: newName });
	}
</script>
```

### TypeScript Best Practices

- Define interfaces for all data structures
- Use generics for reusable components
- Leverage TypeScript's strict mode
- Use `satisfies` operator for better type inference
- Export types for use in other components
- **Note on third-party libraries:** Some libraries may not have full type support for Svelte 5 yet. In such cases, you might need to use `as any` as a temporary workaround. However, always check for updates to the library and its types.

## Styling Best Practices

### CSS Organization

```svelte
<style>
	/* Component-specific styles */
	.card {
		@apply bg-white rounded-lg shadow-md p-4;
	}

	.card-title {
		@apply text-xl font-bold mb-2;
	}

	/* State-based styles */
	.card:hover {
		@apply shadow-lg transform scale-105;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.card {
			@apply p-2;
		}
	}
</style>
```

### Styling Guidelines

- Use CSS custom properties for theming
- Prefer utility-first CSS frameworks like Tailwind
- Avoid inline styles except for dynamic values
- Use CSS modules for component isolation
- Implement dark mode support with CSS variables

## Testing

### Component Testing

```typescript
// ComponentName.test.ts
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import ComponentName from './ComponentName.svelte';

test('renders component correctly', () => {
	render(ComponentName, { props: { title: 'Test' } });

	expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Testing Best Practices

- Test user interactions, not implementation details
- Use descriptive test names
- Mock external dependencies
- Test error states and edge cases
- Use snapshot testing for UI components

## Component-Driven Development with Storybook

### What is Storybook?

Storybook is a tool for building UI components and pages in isolation. It helps you develop, document, and test UI components without having to run your entire application.

### Setting up Storybook

To get started with Storybook in your SvelteKit project, run the following command:

```bash
npm create storybook@latest
```

This command will automatically detect your SvelteKit setup, install the necessary dependencies, and create the required configuration files.

### Creating a Story

A "story" is a single state of a component. You can write multiple stories for each component to represent its different states.

Here's an example of how you could create a story for the `ArtistCard` component. Create a new file named `src/lib/components/ArtistCard.stories.svelte`:

```svelte
<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import ArtistCard from './ArtistCard.svelte';
	import type { Artist } from '$lib/types';

	const meta: Meta<ArtistCard> = {
		title: 'Components/ArtistCard',
		component: ArtistCard,
		tags: ['autodocs'],
		argTypes: {
			artist: { control: 'object' },
			onClick: { action: 'onClick' }
		}
	};

	export default meta;
	type Story = StoryObj<ArtistCard>;

	const sampleArtist: Artist = {
		id: '1',
		name: 'Sample Artist',
		bio: 'This is a sample bio.',
		imageUrl: 'https://via.placeholder.com/300',
		genre: ['Rock', 'Pop'],
		socialLinks: [
			{ platform: 'twitter', url: 'https://twitter.com' },
			{ platform: 'instagram', url: 'https://instagram.com' }
		]
	};

	export const Default: Story = {
		args: {
			artist: sampleArtist
		}
	};

	export const WithoutImage: Story = {
		args: {
			artist: {
				...sampleArtist,
				imageUrl: undefined
			}
		}
	};
</script>

<Story {...Default.args} />

<h2 style="margin-top: 2rem;">Without Image</h2>
<Story {...WithoutImage.args} />
```

### Running Storybook

Once you've set up Storybook and created your first story, you can run it with:

```bash
npm run storybook
```

This will open Storybook in your browser, where you can see your components in isolation.

## Migration from Svelte 4

### Key Changes

1. **Runes**: Replace `let` reactive declarations with `$state()`
2. **Props**: Use `$props()` instead of `export let`
3. **Events**: Use `createEventDispatcher` with modern syntax
4. **Stores**: Continue using Svelte stores, but consider runes for local state

### Migration Steps

1. Update to Svelte 5
2. Convert reactive statements to runes
3. Update component props syntax
4. Test thoroughly after migration
5. Optimize performance with new features

## Common Patterns

### Form Handling

```svelte
<script lang="ts">
	let formData = $state({
		name: '',
		email: '',
		message: ''
	});

	let errors = $state<Record<string, string>>({});

	function validateForm() {
		errors = {};
		if (!formData.name) errors.name = 'Name is required';
		if (!formData.email) errors.email = 'Email is required';
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		// Submit form
	}
</script>

<form onsubmit={handleSubmit}>
	<input bind:value={formData.name} placeholder="Name" />
	{#if errors.name}<span class="error">{errors.name}</span>{/if}

	<input bind:value={formData.email} type="email" placeholder="Email" />
	{#if errors.email}<span class="error">{errors.email}</span>{/if}

	<button type="submit">Submit</button>
</form>
```

### Async Data Loading

```svelte
<script lang="ts">
	let loading = $state(false);
	let data = $state(null);
	let error = $state(null);

	async function loadData() {
		loading = true;
		error = null;

		try {
			const response = await fetch('/api/data');
			data = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	// Load data on mount
	$effect(() => {
		loadData();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<div>{JSON.stringify(data)}</div>
{/if}
```

This guide provides a foundation for building robust, maintainable Svelte 5 applications. Remember to stay updated with the latest Svelte documentation and community best practices.
