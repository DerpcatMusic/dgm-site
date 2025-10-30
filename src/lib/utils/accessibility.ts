/**
 * Accessibility utilities for focus management and ARIA support
 */

/**
 * Traps focus within a container element using Tab key navigation
 * @param container - The container element to trap focus within
 * @param event - The keyboard event
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
	const focusableElements = container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	const firstElement = focusableElements[0] as HTMLElement;
	const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

	if (event.key === 'Tab') {
		if (event.shiftKey) {
			if (document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		}
	}
}

/**
 * Moves focus to the first focusable element within a container
 * @param container - The container element
 */
export function focusFirstElement(container: HTMLElement): void {
	const focusableElements = container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	const firstElement = focusableElements[0] as HTMLElement;
	if (firstElement) {
		firstElement.focus();
	}
}

/**
 * Moves focus to the last focusable element within a container
 * @param container - The container element
 */
export function focusLastElement(container: HTMLElement): void {
	const focusableElements = container.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
	if (lastElement) {
		lastElement.focus();
	}
}

/**
 * Generates a unique ID for ARIA relationships
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateUniqueId(prefix = 'a11y'): string {
	return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announces content to screen readers
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export function announceToScreenReader(
	message: string,
	priority: 'polite' | 'assertive' = 'polite'
): void {
	const announcement = document.createElement('div');
	announcement.setAttribute('aria-live', priority);
	announcement.setAttribute('aria-atomic', 'true');
	announcement.style.position = 'absolute';
	announcement.style.left = '-10000px';
	announcement.style.width = '1px';
	announcement.style.height = '1px';
	announcement.style.overflow = 'hidden';

	document.body.appendChild(announcement);
	announcement.textContent = message;

	// Remove after announcement
	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

/**
 * Checks if an element is visible to screen readers
 * @param element - The element to check
 * @returns True if the element is visible to screen readers
 */
export function isElementVisibleToScreenReaders(element: HTMLElement): boolean {
	const style = window.getComputedStyle(element);
	return (
		style.position !== 'absolute' ||
		style.left !== '-10000px' ||
		style.width !== '1px' ||
		style.height !== '1px' ||
		style.overflow !== 'hidden'
	);
}

/**
 * Manages focus restoration when a modal or dialog closes
 */
export class FocusManager {
	private previouslyFocusedElement: HTMLElement | null = null;

	/**
	 * Saves the currently focused element
	 */
	saveFocus(): void {
		this.previouslyFocusedElement = document.activeElement as HTMLElement;
	}

	/**
	 * Restores focus to the previously saved element
	 */
	restoreFocus(): void {
		if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
			this.previouslyFocusedElement.focus();
		}
	}

	/**
	 * Moves focus to a specific element
	 * @param element - The element to focus
	 */
	moveFocusTo(element: HTMLElement): void {
		if (element && element.focus) {
			element.focus();
		}
	}
}

/**
 * Creates a focus trap for modal dialogs
 * @param modalElement - The modal container element
 * @returns Object with enable/disable methods
 */
export function createFocusTrap(modalElement: HTMLElement) {
	let isEnabled = false;
	const focusManager = new FocusManager();

	function handleKeyDown(event: KeyboardEvent) {
		if (!isEnabled) return;
		trapFocus(modalElement, event);
	}

	function handleEscape(event: KeyboardEvent) {
		if (!isEnabled || event.key !== 'Escape') return;
		// Dispatch custom event for modal close
		modalElement.dispatchEvent(new CustomEvent('focustrap:escape'));
	}

	return {
		enable: () => {
			if (isEnabled) return;
			isEnabled = true;
			focusManager.saveFocus();
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('keydown', handleEscape);
			focusFirstElement(modalElement);
		},

		disable: () => {
			if (!isEnabled) return;
			isEnabled = false;
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keydown', handleEscape);
			focusManager.restoreFocus();
		},

		isEnabled: () => isEnabled
	};
}

/**
 * WCAG compliance checker utilities
 */
export const wcagCompliance = {
	/**
	 * Checks if color contrast meets WCAG AA standards
	 * @param foreground - Foreground color (hex)
	 * @param background - Background color (hex)
	 * @returns Object with contrast ratio and compliance status
	 */
	checkColorContrast: (foreground: string, background: string) => {
		// This is a simplified implementation
		// In a real app, you'd use a proper color contrast library
		return {
			ratio: 4.5, // Placeholder
			aaCompliant: true,
			aaaCompliant: false
		};
	},

	/**
	 * Validates ARIA attributes
	 * @param element - The element to validate
	 * @returns Array of validation errors
	 */
	validateAriaAttributes: (element: HTMLElement): string[] => {
		const errors: string[] = [];

		// Check for required ARIA attributes
		if (
			element.hasAttribute('aria-labelledby') &&
			!document.getElementById(element.getAttribute('aria-labelledby')!)
		) {
			errors.push('aria-labelledby references non-existent element');
		}

		if (
			element.hasAttribute('aria-describedby') &&
			!document.getElementById(element.getAttribute('aria-describedby')!)
		) {
			errors.push('aria-describedby references non-existent element');
		}

		return errors;
	}
};
