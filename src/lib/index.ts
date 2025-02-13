// Export Turnstile component
export { default as Turnstile } from './Turnstile.svelte';

import type { RenderParameters } from 'turnstile-types';

// Backwards compatibility (semver) for when we switched to turnstile-types
export type TurnstileTheme = RenderParameters['theme'];
export type TurnstileLanguage = RenderParameters['language'];
export type TurnstileSize = RenderParameters['size'];
