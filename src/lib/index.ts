export type * from './types.d';

// Export Turnstile component
export { default as Turnstile } from './Turnstile.svelte';

import type { TurnstileOptions } from 'turnstile-types';

// Backwards compatibility (semver) for when we switched to turnstile-types
export type TurnstileTheme = TurnstileOptions['theme'];
export type TurnstileLanguage = TurnstileOptions['language'];
export type TurnstileSize = TurnstileOptions['size'];
