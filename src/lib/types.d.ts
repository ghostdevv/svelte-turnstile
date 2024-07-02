export interface Events {
    /**
     * @deprecated Use `callback` instead.
     */
    'turnstile-callback': { token: string };
    callback: { token: string };

    /**
     * @deprecated Use `error-callback` instead.
     */
    'turnstile-error': { code: string };
    error: { code: string };

    /**
     * @deprecated Use `expired` instead.
     */
    'turnstile-expired': {};
    expired: {};

    /**
     * @deprecated Use `timeout` instead.
     */
    'turnstile-timeout': {};
    timeout: {};

    'before-interactive': {};
    'after-interactive': {};
    unsupported: {};
}
