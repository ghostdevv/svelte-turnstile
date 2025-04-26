<script lang="ts" module>
	let loadPromise: Promise<void> | undefined;

	function addScript(): Promise<void> {
		if (!(window && 'document' in window)) {
			return new Promise(() => {});
		}
		if (loadPromise === undefined) {
			loadPromise = new Promise((resolve) => {
				const script = document.createElement('script');
				script.src =
					'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
				script.async = true;
				script.addEventListener('load', () => resolve(), {
					once: true,
				});
				document.head.appendChild(script);
			});
		}
		return loadPromise;
	}
</script>

<script lang="ts">
	import type { Action } from 'svelte/action';
	import type {
		RenderParameters,
		TurnstileObject,
		WidgetId,
	} from 'turnstile-types';

	let {
		widgetId = $bindable(null),
		turnstile = $bindable(null),
		class: _class,
		...renderParams
	}: {
		/**
		 * Represents a rendered Turnstile widget.  Used to identify a specific widget when calling
		 * Turnstile methods.
		 */
		widgetId?: WidgetId | null;

		/**
		 * Turnstile is Cloudflare’s smart CAPTCHA alternative. It can be embedded into any website
		 * without sending traffic through Cloudflare and works without showing visitors a CAPTCHA.
		 * @see https://developers.cloudflare.com/turnstile
		 */
		turnstile?: TurnstileObject | null;

		/**
		 * Classes to apply to the wrapper div around turnstile.
		 * This won't work with Svelte scoped styles.
		 */
		class?: string;
	} & RenderParameters = $props();

	const loadScript = addScript();

	loadScript.then(() => {
		turnstile = window.turnstile || null;
	});

	/**
	 * Resets the widget.
	 */
	export const reset: TurnstileObject['reset'] = (): void => {
		widgetId && window?.turnstile?.reset(widgetId);
	};

	const turnstileAction: Action<HTMLElement, RenderParameters> = (
		node: HTMLElement,
		renderParams: RenderParameters,
	) => {
		let id = window.turnstile.render(node, renderParams);
		widgetId = id;

		return {
			destroy() {
				window.turnstile.remove(id);
			},
			update(newRenderParams) {
				window.turnstile.remove(id);
				id = window.turnstile.render(node, newRenderParams);
				widgetId = id;
			},
		};
	};
</script>

{#await loadScript then}
	<div
		use:turnstileAction={renderParams}
		class:flexible={renderParams.size == 'flexible'}
		class={_class}>
	</div>
{/await}

<style>
	:where(.flexible) {
		width: 100%;
	}
</style>
