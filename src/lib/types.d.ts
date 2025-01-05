export interface Events {
	/**
	 * Deprecated - use `callback` instead.
	 * @deprecated
	 */
	'turnstile-callback': { token: string; preClearanceObtained: boolean };

	/**
	 * Callback function invoked upon successful challenge completion.
	 * @param detail - An object containing details about the event.
	 * @param detail.token - The token received upon successful challenge completion.
	 * @param detail.preClearanceObtained - Boolean indicating if the clearance was obtained.
	 */
	callback: { token: string; preClearanceObtained: boolean };

	/**
	 * Deprecated - use `error-callback` instead.
	 * @deprecated
	 */
	'turnstile-error': { code: string };

	/**
	 * Callback invoked when there is an error (e.g., network error, challenge failed).
	 * @see [Client-side errors](https://developers.cloudflare.com/turnstile/reference/client-side-errors)
	 * @param { code: string } - The error code passed upon an error.
	 */
	error: { code: string };

	/**
	 * Deprecated - use `expired` instead.
	 * @deprecated
	 */
	'turnstile-expired': {};

	/**
	 * Callback invoked when the token expires and does not reset the widget.
	 */
	expired: {};

	/**
	 * Deprecated - use `timeout` instead.
	 * @deprecated
	 */
	'turnstile-timeout': {};

	/**
	 * Callback invoked when the challenge expires.
	 */
	timeout: {};

	/**
	 * Callback invoked before the challenge enters interactive mode.
	 */
	'before-interactive': {};

	/**
	 * Callback invoked when the challenge has left interactive mode.
	 */
	'after-interactive': {};

	/**
	 * Callback invoked when a given client/browser is not supported.
	 */
	unsupported: {};
}
