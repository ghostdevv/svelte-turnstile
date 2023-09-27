<script lang="ts" context="module">
    declare global {
        interface Window {
            turnstile: TurnstileObject;
        }
    }
</script>

<script lang="ts">
    import type { RenderOptions, TurnstileObject, WidgetId } from './types.d';
    import type { Action } from 'svelte/action';

    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher<
        {
            /**
             * Callback function invoked upon successful challenge completion.
             * - Data Attribute - `data-callback`
             * @param token - The token passed upon successful challenge.
             */
            callback: { token: string };
            /**
             * @deprecated Use `callback` instead.
             */
            'turnstile-callback': { token: string };
        } & typeof events
    >();

    let loaded = windowHasTurnstile();
    let mounted = false;

    /**
     * Represents a rendered Turnstile widget.  Used to identify a specific widget when calling
     * Turnstile methods.
     */
    let widgetId: WidgetId;

    /**
     * Turnstile is Cloudflare’s smart CAPTCHA alternative. It can be embedded into any website
     * without sending traffic through Cloudflare and works without showing visitors a CAPTCHA.
     * @see https://developers.cloudflare.com/turnstile
     */
    export let turnstile: TurnstileObject | null = null;
    $: turnstile =
        windowHasTurnstile() && window.turnstile ? window.turnstile : null;

    /**
     * Every widget has a sitekey. This sitekey is associated with the corresponding
     * widget configuration and is created upon the widget creation.
     * - Data Attribute - `data-sitekey`
     */
    export let siteKey: RenderOptions['sitekey'];

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
    export let appearance: RenderOptions['appearance'] = 'always';

    /**
     * Language to display, either `"auto"` or an ISO 639-1 two-letter language code.
     * - Data Attribute - `data-language`
     * @see [language support FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions/#what-languages-does-turnstile-support)
     */
    export let language: RenderOptions['language'] = 'auto' as const;

    /**
     * Execution controls when to obtain the token of the widget and can be on `"render"` (default) or on `"execute"`.
     * - Data Attribute - `data-execution`
     * @defaultValue "render"
     * @see [Execution modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes)
     */
    export let execution: RenderOptions['execution'] = 'render';

    /**
     * A customer value that can be used to differentiate widgets under the same
     * sitekey in analytics and which is returned upon validation. This can only
     * contain up to 32 alphanumeric characters including `_` and `-`.
     * - Data Attribute - `data-action`
     */
    export let action: RenderOptions['action'] = undefined;

    /**
     * A customer payload that can be used to attach customer data to the challenge
     * throughout its issuance and which is returned upon validation. This can only
     * contain up to 255 alphanumeric characters including `_` and `-`.
     * - Data Attribute - `data-cdata`
     */
    export let cData: RenderOptions['cData'] =
        undefined as any as RenderOptions['cData'];

    /**
     * Time between retry attempts in milliseconds. Value must be between `0` and `900000`
     * (15 minutes). Only applies when `retry` is set to `auto`.
     * - Data Attribute - `data-retry-interval`
     * @defaultValue 8000
     */
    export let retryInterval: RenderOptions['retry-interval'] = 8000;

    /**
     * Automatically retry upon failure to obtain a token or never retry.
     * - Data Attribute - `data-retry`
     * @defaultValue "auto"
     */
    export let retry: RenderOptions['retry'] = 'auto';

    /**
     * Controls the behavior when the token of a Turnstile widget has expired.
     * Can be 'auto', 'manual', or 'never'.
     * - Data Attribute - `data-refresh-expired`
     * @defaultValue "auto"
     */
    export let refreshExpired: RenderOptions['refresh-expired'] = 'auto';

    /**
     * The widget theme. Can be `"light"`, `"dark"`, or `"auto"`.
     * - Data Attribute - `data-theme`
     */
    export let theme: RenderOptions['theme'] = 'auto';

    /**
     * The widget size. Can be 'normal' or 'compact'.
     * - Data Attribute - `data-size`
     * @defaultValue "normal"
     */
    export let size: RenderOptions['size'] = 'normal';

    /**
     * The tabindex of Turnstile's iframe for accessibility purposes.
     * - Data Attribute - `data-tabindex`
     * @defaultValue 0
     */
    export let tabIndex = 0;

    /**
     * @deprecated Use `responseField` instead.
     */
    export let forms: RenderOptions['response-field'] = true;

    /**
     * Controls if an input element with the response token is created.
     * - Data Attribute - `data-response-field`
     * @defaultValue true
     */
    export let responseField: RenderOptions['response-field'] = true && forms;

    /**
     * @deprecated Use `responseFieldName` instead.
     */
    export let formsField: RenderOptions['response-field-name'] =
        'cf-turnstile-response';

    /**
     * Name of the input element.
     * - Data Attribute - `data-response-field-name`
     * @defaultValue "cf-turnstile-response"
     */
    export let responseFieldName: RenderOptions['response-field-name'] =
        formsField || 'cf-turnstile-response';

    /**
     * Resets the widget.
     * @param widgetId - The ID of the widget.
     */
    export const reset: TurnstileObject['reset'] = (): void => {
        window.turnstile.reset(widgetId);
    };

    const events = {
        /**
         * Callback invoked when there is an error (e.g., network error, challenge failed).
         * - Data Attribute - `data-error-callback`
         * @see [Client-side errors](https://developers.cloudflare.com/turnstile/reference/client-side-errors)
         */
        'error-callback': {},
        /**
         * @deprecated Use `error-callback` instead.
         */
        'turnstile-error': {},

        /**
         * Callback invoked when the token expires and does not reset the widget.
         * - Data Attribute - `data-expired-callback`
         */
        'expired-callback': {},
        /**
         * @deprecated Use `expired-callback` instead.
         */
        'turnstile-expired': {},

        /**
         * Callback invoked when the challenge expires.
         * - Data Attribute - `data-timeout-callback`
         */
        'timeout-callback': {},

        /**
         * @deprecated Use `timeout-callback` instead.
         */
        'turnstile-timeout': {},

        /**
         * Callback invoked before the challenge enters interactive mode.
         * - Data Attribute - `data-before-interactive-callback`
         */
        'before-interactive-callback': {},
        /**
         * Callback invoked when the challenge has left interactive mode.
         * - Data Attribute - `data-after-interactive-callback`
         */
        'after-interactive-callback': {},

        /**
         * Callback invoked when a given client/browser is not supported.
         * - Data Attribute - `data-unsupported-callback`
         */
        'unsupported-callback': {},
    } as const;

    const turnstileAction: Action = (node) => {
        const id = window.turnstile.render(node, {
            sitekey: siteKey,
            callback: (token: string) => {
                dispatch('callback', { token });
                dispatch('turnstile-callback', { token });
            },
            ...Object.fromEntries(
                Object.keys(events).map((event) => [
                    event,
                    () => dispatch(event as keyof typeof events, {}),
                ]),
            ),
            'response-field-name': responseFieldName,
            'refresh-expired': refreshExpired,
            'retry-interval': retryInterval,
            'response-field': responseField,
            tabindex: tabIndex,
            appearance,
            execution,
            language,
            action,
            retry,
            theme,
            cData,
            size,
        })!;

        widgetId = id;

        return {
            destroy: () => {
                window.turnstile.remove(id);
            },
        };
    };

    function windowHasTurnstile() {
        if (typeof window == 'undefined') return null;
        return 'turnstile' in window;
    }

    function load() {
        loaded = true;
    }

    onMount(() => {
        mounted = true;

        return () => {
            mounted = false;
        };
    });
</script>

<svelte:head>
    {#if mounted && !loaded}
        <script
            async
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            on:load={load}>
        </script>
    {/if}
</svelte:head>

{#if loaded && mounted}
    {#key $$props}
        <div use:turnstileAction />
    {/key}
{/if}
