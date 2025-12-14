# Svelte Turnstile

Works with Svelte 3, 4, and 5 (compatibility mode)!

[Cloudflare's Turnstile](https://developers.cloudflare.com/turnstile/) is a new CAPTCHA alternative, this library allows you to easily integrate it into your svelte projects.

# Installing

```sh
npm install svelte-turnstile -D
```

# Demo

https://svelte-turnstile.willow.codes

# Using

The only required prop is the `siteKey` which you can get from [adding a site here](https://dash.cloudflare.com/?to=/:account/turnstile).

```svelte
<script>
	import { Turnstile } from 'svelte-turnstile';
</script>

<Turnstile siteKey="SITE_KEY" />
```

## Props

| Prop                | Type                                                 | Description                                                                                    | Required |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| `siteKey`           | `string`                                             | sitekey for your website                                                                       | ✅       |
| `theme`             | `'light' \| 'dark' \| 'auto'`                        | colour theme of the widget (defaults to `auto`)                                                |          |
| `size`              | `'normal' \| 'flexible' \| 'invisible' \| 'compact'` | size of the widget (defaults to `normal`)                                                      |          |
| `action`            | `string`                                             | A string that can be used to differentiate widgets, returned on validation                     |          |
| `cData`             | `string`                                             | A string that can attach customer data to a challange, returned on validation                  |          |
| `tabIndex`          | `number`                                             | Used for accessibility (defaults to `0`)                                                       |          |
| `responseField`     | `boolean`                                            | if true the response token will be a property on the form data (default `true`)                |          |
| `responseFieldName` | `string`                                             | the `name` of the input which will appear on the form data (default `cf-turnstile-response`)   |          |
| `retry`             | `'auto' \| 'never'`                                  | should the widget automatically retry to obtain a token if it did not succeed (default `auto`) |          |
| `retryInterval`     | `number`                                             | if `retry` is true, this controls the time between attempts in milliseconds (default `8000`)   |          |
| `language`          | `SupportedLanguage \| 'auto'`                        | the language turnstile should use (default `auto`)                                             |          |
| `execution`         | `'render' \| 'execute'`                              | controls when to obtain the token of the widget (default `render`)                             |          |
| `appearance`        | `'always' \| 'execute' \| 'interaction-only'`        | controls when the widget is visible. (default `always`)                                        |          |

For more information about some of the props and a list of `SupportedLanguage`'s [checkout the Cloudflare Documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations).

### Deprecated Props

- `forms` renamed to `responseField`
- `formsField` renamed to `responseFieldName`

## Events

| Event                | Data                                                | Description                                                    |
| -------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `callback`           | `{ token: string; preClearanceObtained: boolean; }` | Emitted when a user passes a challenge                         |
| `error`              | `{ code: string }`                                  | Emitted when a user fails verification                         |
| `expired`            | `{}`                                                | Emitted when a challenge expires and does not reset the widget |
| `timeout`            | `{}`                                                | Emitted when a challenge expires and does reset the widget     |
| `before-interactive` | `{}`                                                | Emitted before the challenge enters interactive mode           |
| `after-interactive`  | `{}`                                                | Emitted when the challenge has left interactive mode           |
| `unsupported`        | `{}`                                                | Emitted when a given client/browser is not supported           |

# Validate CAPTCHA

We need to validate the captcha token server side before we do any action on the server, this is to ensure no forgery occured. We can create a simple validate function:

If you are using a HTML Form and POSTing to a server you can get the `cf-turnstile-response` (or what you configured it to using the `responseFieldName` option) property to get the `token`, otherwise you can use the `on:callback` event in svelte to keep track of the token and send it to your backend.

```ts
interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

async function validateToken(token: string, secret: string) {
	const response = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				response: token,
				secret: secret,
			}),
		},
	);

	const data: TokenValidateResponse = await response.json();

	return {
		// Return the status
		success: data.success,

		// Return the first error if it exists
		error: data['error-codes']?.length ? data['error-codes'][0] : null,
	};
}
```

## SvelteKit Example (Svelte 5)

In SvelteKit we can use form actions to easily setup a form with a captcha:

`routes/login/+page.svelte`

```svelte
<script>
	import { Turnstile } from 'svelte-turnstile';

	let { form } = $props();
</script>

{#if form?.error}
	<p>{form?.error}</p>
{/if}

<form method="POST" action="/login">
	<Turnstile siteKey="SITE_KEY" theme="dark" />
</form>
```

`routes/login/+page.server.js`

```js
// Copy and paste the validateToken function from above here

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const token = data.get('cf-turnstile-response'); // if you edited the formsField option change this
		const SECRET_KEY = '...'; // you should use $env module for secrets

		const { success, error } = await validateToken(token, SECRET_KEY);

		if (!success)
			return {
				error: error || 'Invalid CAPTCHA',
			};

		// do something, the captcha is valid!
	},
};
```

## Superforms Example (Svelte 5)

`routes/login/schema.ts`

```ts
import { z } from "zod";

export const schema = z.object({
	..., // other fields
    'cf-turnstile-response': z.string().nonempty('Please complete turnstile')
});
```

`routes/login/+page.svelte`

```svelte
<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { Turnstile } from 'svelte-turnstile';
	import { schema } from './schema.ts';

	let { data } = $props();

	// Call this to reset the turnstile
	let reset = $state<() => void>();

	const { form, enhance, message } = superForm(data.form, {
		validators: zodClient(schema),
		onUpdated() {
			// When the form is updated, we reset the turnstile
			reset?.();
		},
	});
</script>

<form method="POST" use:enhance>
	<Turnstile
		siteKey={PUBLIC_TURNSTILE_SITE_KEY}
		bind:reset
		on:callback={(event) => {
			// Required when using client side validation
			$form['cf-turnstile-response'] = event.detail.token;
		}} />
</form>
```

`routes/login/+page.server.js`

```js
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema.ts';

export const load = async () => {
	const form = await superValidate(zod(schema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		const { success } = await validateToken(
			form.data['cf-turnstile-response'],
			SECRET_KEY,
		);

		if (!success) {
			return setError(
				form,
				'cf-turnstile-response',
				'Invalid turnstile, please try again',
			);
		}

		return message(form, 'Success!');
	},
};
```

This example uses the [Superforms onUpdated event](https://superforms.rocks/concepts/events) to reset the Turnstile widget. Additionally, it automatically adds the Turnstile response token to the form data.

# Resetting

If you need to manually reset the widget, you can do so by binding to the `reset` prop. For example:

```svelte
<script lang="ts">
	let reset = $state<() => void>();
</script>

<button onclick={() => reset?.()}> Reset </button>

<Turnstile bind:reset />
```

# Support

- Join the [discord](https://discord.gg/2Vd4wAjJnm)<br>
- Create a issue on the [github](https://github.com/ghostdevv/svelte-turnstile)

# Notable Changes

Full Changelog: https://github.com/ghostdevv/svelte-turnstile/releases

- Deprecate `forms` prop in favour of `responseField`
- Deprecate `formsField` prop in favour of `responseFieldName`
- Deprecate the `on:turnstile-callback` event in favour of `on:callback`
- Deprecate the `on:turnstile-error` event in favour of `on:error`
- Deprecate the `on:turnstile-timeout` event in favour of `on:timeout`
- Deprecate the `on:turnstile-expired` event in favour of `on:expired`
