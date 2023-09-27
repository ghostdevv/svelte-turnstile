/**
 * Represents a rendered Turnstile widget.  Used to identify a specific widget when calling
 * Turnstile methods.
 */
export type WidgetId = string;

/**
 * Turnstile is Cloudflare’s smart CAPTCHA alternative. It can be embedded into any website
 * without sending traffic through Cloudflare and works without showing visitors a CAPTCHA.
 * @see https://developers.cloudflare.com/turnstile
 */
export interface TurnstileObject {
    /**
     * If using synchronous loading, will be called once the DOM is ready.
     * @see [Explicit Rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#explicitly-render-the-turnstile-widget)
     */
    ready: (cb: () => any) => void;

    /**
     * @see [Implicit Rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#implicitly-render-the-turnstile-widget)
     */
    implicitRender: () => void;

    /**
     * Excecutes the challenge after the render() function has been called, by invoking the
     * turnstile.execute(container: string | HTMLElement, jsParams?: RenderParameters) function
     * separately, decoupling the appearance and rendering of a widget from its execution.
     * @see [Execution Modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes)
     */
    execute: () => void;

    /**
     * Explicitly renders the Turnstile widget.  The `sitekey` parameter is required. The
     * `callback` parameter, however, is only required if `execution` is set to `execute`.
     * @param container - HTML container to render the widget.
     * @param options - Configuration options for rendering. See {@link RenderOptions}.
     * @returns A `widgetId` string if successful, otherwise undefined.
     */
    render(
        container: HTMLElement | string,
        options: RenderOptions,
    ): string | undefined;

    /**
     * Resets the widget.
     * @param widgetId - The ID of the widget.
     */
    reset(widgetId: WidgetId): void;

    /**
     * Removes the widget from the page.
     * @param widgetId - The ID of the widget.
     */
    remove(widgetId: WidgetId): void;

    /**
     * Obtains the widget's response using its widgetId.
     * @param widgetId - The ID of the widget.
     */
    getResponse(widgetId: WidgetId): string;

    /**
     * Checks if the widget has expired.
     * @param widgetId - The ID of the widget.
     */
    isExpired(widgetId: WidgetId): boolean;
}

export type TurnstileOptions = RenderOptions;

/**
 * Interface for Turnstile rendering parameters.
 */
export interface RenderOptions {
    /**
     * Every widget has a sitekey. This sitekey is associated with the corresponding
     * widget configuration and is created upon the widget creation.
     * - Data Attribute - `data-sitekey`
     */
    sitekey: string;

    /**
     * A customer value that can be used to differentiate widgets under the same
     * sitekey in analytics and which is returned upon validation. This can only
     * contain up to 32 alphanumeric characters including `_` and `-`.
     * - Data Attribute - `data-action`
     */
    action?: string;

    /**
     * A customer payload that can be used to attach customer data to the challenge
     * throughout its issuance and which is returned upon validation. This can only
     * contain up to 255 alphanumeric characters including `_` and `-`.
     * - Data Attribute - `data-cdata`
     */
    cData?: string;

    /**
     * Callback function invoked upon successful challenge completion.
     * - Data Attribute - `data-callback`
     * @param token - The token passed upon successful challenge.
     */
    callback: (token: string) => void;

    /**
     * Callback invoked when there is an error (e.g., network error, challenge failed).
     * - Data Attribute - `data-error-callback`
     * @see [Client-side errors](https://developers.cloudflare.com/turnstile/reference/client-side-errors)
     */
    'error-callback'?: () => void;

    /**
     * Execution controls when to obtain the token of the widget and can be on `"render"` (default) or on `"execute"`.
     * - Data Attribute - `data-execution`
     * @defaultValue "render"
     * @see [Execution modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes)
     */
    execution?: 'render' | 'execute';

    /**
     * Callback invoked when the token expires and does not reset the widget.
     * - Data Attribute - `data-expired-callback`
     */
    'expired-callback'?: () => void;

    /**
     * Callback invoked before the challenge enters interactive mode.
     * - Data Attribute - `data-before-interactive-callback`
     */
    'before-interactive-callback'?: () => void;

    /**
     * Callback invoked when the challenge has left interactive mode.
     * - Data Attribute - `data-after-interactive-callback`
     */
    'after-interactive-callback'?: () => void;

    /**
     * Callback invoked when a given client/browser is not supported.
     * - Data Attribute - `data-unsupported-callback`
     */
    'unsupported-callback'?: () => void;

    /**
     * The widget theme. Can be `"light"`, `"dark"`, or `"auto"`.
     * - Data Attribute - `data-theme`
     */
    theme?: 'light' | 'dark' | 'auto';

    /**
     * Language to display, either `"auto"` or an ISO 639-1 two-letter language code.
     * - Data Attribute - `data-language`
     * @see [language support FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions/#what-languages-does-turnstile-support)
     */
    language?: SupportedLanguages | 'auto' | ISO;

    /**
     * The tabindex of Turnstile's iframe for accessibility purposes.
     * - Data Attribute - `data-tabindex`
     * @defaultValue 0
     */
    tabindex?: number;

    /**
     * Callback invoked when the challenge expires.
     * - Data Attribute - `data-timeout-callback`
     */
    'timeout-callback'?: () => void;

    /**
     * Controls if an input element with the response token is created.
     * - Data Attribute - `data-response-field`
     * @defaultValue true
     */
    'response-field'?: boolean;

    /**
     * Name of the input element.
     * - Data Attribute - `data-response-field-name`
     * @defaultValue "cf-turnstile-response"
     */
    'response-field-name'?: string;

    /**
     * The widget size. Can be 'normal' or 'compact'.
     * - Data Attribute - `data-size`
     * @defaultValue "normal"
     */
    size?: 'normal' | 'compact';

    /**
     * Automatically retry upon failure to obtain a token or never retry.
     * - Data Attribute - `data-retry`
     * @defaultValue "auto"
     */
    retry?: 'auto' | 'never';

    /**
     * Time between retry attempts in milliseconds. Value must be between `0` and `900000`
     * (15 minutes). Only applies when `retry` is set to `auto`.
     * - Data Attribute - `data-retry-interval`
     * @defaultValue 8000
     */
    'retry-interval'?: number;

    /**
     * Controls the behavior when the token of a Turnstile widget has expired.
     * Can be 'auto', 'manual', or 'never'.
     * - Data Attribute - `data-refresh-expired`
     * @defaultValue "auto"
     */
    'refresh-expired'?: 'auto' | 'manual' | 'never';

    /**
     * Controls when the widget is visible:
     * - `"always"` - The widget is visible at all times.
     * - `"execute"` - The widget is visible only after the challenge begins.
     * - `"interaction-only"` - The widget is visible only when an interaction is required.
     *
     * If a widget is visible, its appearance can be controlled via the `appearance` parameter.
     * - Data Attribute - `data-appearance`
     * @see
     * [appearance-modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#appearance-modes)
     */
    appearance?: 'always' | 'execute' | 'interaction-only';

    chlPageData?: string; // ENTERPRISE ONLY - undocumented
}

export type ISO = string & {};

/**
 * A list of supported languages for Turnstile.
 * @see
 * [language support FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions/#what-languages-does-turnstile-support)
 */
export type SupportedLanguages =
    | 'ar-eg'
    | 'ar'
    | 'de'
    | 'en'
    | 'es'
    | 'fa'
    | 'fr'
    | 'id'
    | 'it'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'pl'
    | 'pt'
    | 'pt-br'
    | 'ru'
    | 'tlh'
    | 'tr'
    | 'uk'
    | 'uk-ua'
    | 'zh'
    | 'zh-cn'
    | 'zh-tw';
