<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Action } from 'svelte/action';
    import type { Events } from './types';
    import type {
        RenderParameters,
        TurnstileObject,
        WidgetId,
    } from 'turnstile-types';

    const dispatch = createEventDispatcher<Events>();

    let loaded = typeof window != 'undefined' && 'turnstile' in window;
    let mounted = false;

    /**
     * Represents a rendered Turnstile widget.  Used to identify a specific widget when calling
     * Turnstile methods.
     */
    export let widgetId: WidgetId | null = null;

    /**
     * Turnstile is Cloudflare’s smart CAPTCHA alternative. It can be embedded into any website
     * without sending traffic through Cloudflare and works without showing visitors a CAPTCHA.
     * @see https://developers.cloudflare.com/turnstile
     */
    export let turnstile: TurnstileObject | null = null;
    $: turnstile = (loaded && window.turnstile) || null;

    /**
     * Every widget has a sitekey. This sitekey is associated with the corresponding
     * widget configuration and is created upon the widget creation.
     */
    export let siteKey: RenderParameters['sitekey'];

    /**
     * Controls when the widget is visible:
     * - `"always"` - The widget is visible at all times.
     * - `"execute"` - The widget is visible only after the challenge begins.
     * - `"interaction-only"` - The widget is visible only when an interaction is required.
     *
     * If a widget is visible, its appearance can be controlled via the `appearance` parameter.
     * @see
     * [appearance-modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#appearance-modes)
     */
    export let appearance: RenderParameters['appearance'] = 'always';

    /**
     * Language to display, either `"auto"` or an ISO 639-1 two-letter language code.
     * @see [language support FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions/#what-languages-does-turnstile-support)
     */
    export let language: RenderParameters['language'] = 'auto' as const;

    /**
     * Execution controls when to obtain the token of the widget and can be on `"render"` (default) or on `"execute"`.
     * @default "render"
     * @see [Execution modes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#execution-modes)
     */
    export let execution: RenderParameters['execution'] = 'render';

    /**
     * A customer value that can be used to differentiate widgets under the same
     * sitekey in analytics and which is returned upon validation. This can only
     * contain up to 32 alphanumeric characters including `_` and `-`.
     */
    export let action: RenderParameters['action'] = undefined;

    /**
     * A customer payload that can be used to attach customer data to the challenge
     * throughout its issuance and which is returned upon validation. This can only
     * contain up to 255 alphanumeric characters including `_` and `-`.
     */
    export let cData: RenderParameters['cData'] = undefined;

    /**
     * Time between retry attempts in milliseconds. Value must be between `0` and `900000`
     * (15 minutes). Only applies when `retry` is set to `auto`.
     * @default 8000
     */
    export let retryInterval: RenderParameters['retry-interval'] = 8000;

    /**
     * Automatically retry upon failure to obtain a token or never retry.
     * @default "auto"
     */
    export let retry: RenderParameters['retry'] = 'auto';

    /**
     * Controls the behavior when the token of a Turnstile widget has expired.
     * Can be 'auto', 'manual', or 'never'.
     * @default "auto"
     */
    export let refreshExpired: RenderParameters['refresh-expired'] = 'auto';

    /**
     * The widget theme. Can be `"light"`, `"dark"`, or `"auto"`.
     */
    export let theme: RenderParameters['theme'] = 'auto';

    /**
     * The widget size. Can be 'normal', 'flexible', or 'compact'.
     * @default "normal"
     */
    export let size: RenderParameters['size'] = 'normal';

    /**
     * The tabindex of Turnstile's iframe for accessibility purposes.
     * @default 0
     */
    export let tabIndex = 0;

    /**
     * @deprecated Use `responseField` instead.
     */
    export let forms: RenderParameters['response-field'] = undefined;

    /**
     * Controls if an input element with the response token is created.
     * @default true
     */
    export let responseField: RenderParameters['response-field'] = undefined;

    /**
     * @deprecated Use `responseFieldName` instead.
     */
    export let formsField: RenderParameters['response-field-name'] = undefined;

    /**
     * Name of the input element.
     * @default "cf-turnstile-response"
     */
    export let responseFieldName: RenderParameters['response-field-name'] =
        undefined;

    /**
     * Classes to apply to the wrapper div around turnstile.
     * This won't work with Svelte scoped styles.
     */
    let _class: string | undefined = undefined;
    export { _class as class };

    /**
     * Resets the widget.
     * @param widgetId - The ID of the widget.
     */
    export const reset: TurnstileObject['reset'] = (): void => {
        widgetId && window?.turnstile?.reset(widgetId);
    };

    const turnstileAction: Action = (node) => {
        const id = window.turnstile.render(node, {
            sitekey: siteKey,
            callback: (token: string) => {
                dispatch('callback', { token });
                dispatch('turnstile-callback', { token });
            },
            'error-callback': (code) => {
                dispatch('error', { code });
                dispatch('turnstile-error', { code });
            },
            'timeout-callback': () => {
                dispatch('timeout', {});
                dispatch('turnstile-timeout', {});
            },
            'expired-callback': () => {
                dispatch('expired', {});
                dispatch('turnstile-expired', {});
            },
            'before-interactive-callback': () => {
                dispatch('before-interactive', {});
            },
            'after-interactive-callback': () => {
                dispatch('after-interactive', {});
            },
            'unsupported-callback': () => dispatch('unsupported', {}),
            'response-field-name':
                responseFieldName ?? formsField ?? 'cf-turnstile-response',
            'response-field': responseField ?? forms ?? true,
            'refresh-expired': refreshExpired,
            'retry-interval': retryInterval,
            tabindex: tabIndex,
            appearance,
            execution,
            language,
            action,
            retry,
            theme,
            cData,
            size,
        });

        widgetId = id;

        return {
            destroy: () => {
                window.turnstile.remove(id);
            },
        };
    };

    onMount(() => {
        mounted = true;

        if (!loaded) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.addEventListener('load', () => (loaded = true), {
                once: true,
            });
            document.head.appendChild(script);
        }

        return () => {
            mounted = false;
        };
    });
</script>

{#if loaded && mounted}
    {#key $$props}
        <div use:turnstileAction class={_class} />
    {/key}
{/if}
