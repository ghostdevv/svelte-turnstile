# Svelte Turnstile

[Cloudflare's Turnstile](https://developers.cloudflare.com/turnstile/) is a new CAPTCHA alternative, this library allows you to easily integrate it into your svelte projects.

# Installing

```sh
npm install svelte-turnstile -D
```

# Demo

https://svelte-turnstile.pages.dev/

# Using

The only required prop is the `siteKey` which you can get from [adding a site here](https://dash.cloudflare.com/?to=/:account/turnstile).

```html
<script>
    import { Turnstile } from 'svelte-turnstile';
</script>

<Turnstile siteKey="SITE_KEY" />
```

## Props

| Prop         | Type                                   | Description                                                                                  | Required                                     |
|--------------|----------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------|
| `siteKey`    | `string`                               | sitekey for your website                                                                     | ✅                                           |
| `theme`      | `'light' \| 'dark' \| 'auto'`          | colour theme of the widget (defaults to `auto`)                                                | ❌                                           |
| `size`       | `'normal' \| 'compact' \| 'invisible'` | size of the widget (defaults to `normal`)                                                      | ❌                                           |
| `action`     | `string`                               | A string that can be used to differentiate widgets, returned on validation                   | ❌                                           |
| `cData`      | `string`                               | A string that can attach customer data to a challange, returned on validation                | ❌                                           |
| `tabIndex`   | `number`                               | Used for accessibility (defaults to `0`)                                                       | ❌                                           |
| `forms`      | `boolean`                              | if true the response token will be a property on the form data (default `true`)                | ❌                                           |
| `formsField` | `string`                               | the `name` of the input which will appear on the form data (default `cf-turnstile-response`) | ❌                                           |

For more information about some of the props [checkout the Cloudflare Documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations).

## Events

| Event                | Data                | Description                                                                  |
|----------------------|---------------------|------------------------------------------------------------------------------|
| `turnstile-error`    | `{}`                | Emitted when a user fails verification                                       |
| `turnstile-expired`  | `{}`                | Emitted when a challenge expires, this library will auto-renew the challenge |
| `turnstile-callback` | `{ token: string }` | Emitted when a user passes a challenge                                       |

# Validate CAPTCHA

We need to validate the captcha token server side before we do any action on the server, this is to ensure no forgery occured. We can create a simple validate function:

If you are using a HTML Form and POSTing to a server you can get the `cf-turnstile-response` (or what you configured it to using the `formsField` option) property to get the `token`, otherwise you can use the `on:turnstile-callback` event in svelte to keep track of the token and send it to your backend.

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
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                response: token,
                secret: secret,
            });
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

## SvelteKit Example

In SvelteKit we can use form actions to easily setup a form with a captcha:

`routes/login/+page.svelte`
```html
<script>
    import { Turnstile } from 'svelte-turnstile';

    /** @type {import('./$types').ActionData} */
    export let form;
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

        const token = data.get('cf-turnstile-response') // if you edited the formsField option change this
        const SECRET_KEY = '...' // you should use $env module for secrets

        const { success, error } = await validateToken(token, SECRET_KEY);

        if (!success)
            return {
                error: error || 'Invalid CAPTCHA',
            };

        // do something, the captcha is valid!
    }
}
```

# Support

-   Join the [discord](https://discord.gg/2Vd4wAjJnm)<br>
-   Create a issue on the [github](https://github.com/ghostdevv/svelte-turnstile)
