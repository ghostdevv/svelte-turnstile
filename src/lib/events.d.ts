declare namespace svelte.JSX {
    interface HTMLProps<T> {
        'onturnstile-error'?: (event: CustomEvent<{}>) => void;
        'onturnstile-expired'?: (event: CustomEvent<{}>) => void;
        'onturnstile-callback'?: (
            event: CustomEvent<{ token: string }>,
        ) => void;
    }
}
