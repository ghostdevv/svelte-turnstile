export interface Events {
    /**
     * @deprecated Use `callback` instead.
     */
    'turnstile-callback': { token: string };
    callback: { token: string };

    /**
     * @deprecated Use `error-callback` instead.
     */
    'turnstile-error': {};
    'error-callback': {};

    /**
     * @deprecated Use `expired-callback` instead.
     */
    'turnstile-expired': {};
    'expired-callback': {};

    /**
     * @deprecated Use `timeout-callback` instead.
     */
    'turnstile-timeout': {};
    'timeout-callback': {};

    'before-interactive-callback': {};
    'after-interactive-callback': {};
    'unsupported-callback': {};
}
