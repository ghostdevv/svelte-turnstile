import type { TurnstileOptions } from 'turnstile-types';

// Remove undefined from option
export type Option<Key extends keyof TurnstileOptions> = Exclude<
    TurnstileOptions[Key],
    undefined
>;

export type TurnstileTheme = Option<'theme'>;
export type TurnstileSize = Option<'size'>;
