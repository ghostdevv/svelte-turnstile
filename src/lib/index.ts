// Backwards compatibility (semver) for when we switched to turnstile-types
export type { TurnstileTheme, TurnstileSize } from './types.d.ts';

// Export Turnstile component
export { default as Turnstile } from './Turnstile.svelte';
