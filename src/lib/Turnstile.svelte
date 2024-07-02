<script lang="ts">
    import type { Option, TurnstileSize, TurnstileTheme } from './types.d';
    import type { SupportedLanguages } from 'turnstile-types';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { Action } from 'svelte/action';

    const dispatch = createEventDispatcher<{
        'turnstile-callback': { token: string };
        'turnstile-error': {};
        'turnstile-expired': {};
        'turnstile-timeout': {};
    }>();

    let loaded = hasTurnstile();
    let mounted = false;

    let widgetId: string;

    export let siteKey: string;

    export let appearance: Option<'appearance'> = 'always';
    export let language: SupportedLanguages | 'auto' = 'auto';
    export let formsField: string = 'cf-turnstile-response';
    export let execution: Option<'execution'> = 'render';
    export let action: string | undefined = undefined;
    export let cData: string | undefined = undefined;
    export let retryInterval: number | undefined = 8000;
    export let retry: Option<'retry'> = 'auto';
    export let theme: TurnstileTheme = 'auto';
    export let size: TurnstileSize = 'normal';
    export let forms = true;
    export let tabIndex = 0;

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

    function hasTurnstile() {
        if (typeof window == 'undefined') return null;
        return 'turnstile' in window;
    }

    function error() {
        dispatch('turnstile-error', {});
    }

    function expired() {
        dispatch('turnstile-expired', {});
    }

    function timeout() {
        dispatch('turnstile-timeout', {});
    }

    function callback(token: string) {
        dispatch('turnstile-callback', { token });
    }

    export function reset(): void {
        window.turnstile.reset(widgetId);
    }

    const turnstile: Action = (node) => {
        const id = window.turnstile.render(node, {
            'timeout-callback': timeout,
            'expired-callback': expired,
            'error-callback': error,
            callback,

            sitekey: siteKey,

            'response-field-name': formsField,
            'retry-interval': retryInterval,
            'response-field': forms,
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
</script>

{#if loaded && mounted}
    {#key $$props}
        <div use:turnstile />
    {/key}
{/if}
