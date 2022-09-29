# Svelte Turnstile

[Cloudflare's Turnstile](https://developers.cloudflare.com/turnstile/) is a new CAPTCHA alternative, this library allows you to easily integrate it into your svelte projects.

# Installing

```sh
npm install svelte-turnstile -D
```

# Using

The only required prop is the `siteKey` which you can get from [adding a site here](https://dash.cloudflare.com/?to=/:account/turnstile).

```html
<script>
    import { Turnstile } from 'svelte-turnstile';
</script>

<Turnstile siteKey="SITE_KEY" />
```

## Props

| Prop       | Type                          | Description                                                                   | Required |
|------------|-------------------------------|-------------------------------------------------------------------------------|----------|
| `siteKey`  | `string`                      | sitekey for your website                                                      | ✅       |
| `theme`    | `'light' \| 'dark' \| 'auto'` | colour theme of the widget (defaults to auto)                                 | ❌       |
| `action`   | `string`                      | A string that can be used to differentiate widgets, returned on validation    | ❌       |
| `cData`    | `string`                      | A string that can attach customer data to a challange, returned on validation | ❌       |
| `tabIndex` | `number`                      | Used for accessibility (defaults to 0)                                        | ❌       |

For more information about some of the props [checkout the Cloudflare Documentation](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations).

## Events

| Event                | Data                | Description                                                                  |
|----------------------|---------------------|------------------------------------------------------------------------------|
| `turnstile-error`    | `{}`                | Emitted when a user fails verification                                       |
| `turnstile-expired`  | `{}`                | Emitted when a challenge expires, this library will auto-renew the challenge |
| `turnstile-callback` | `{ token: string }` | Emitted when a user passes a challenge                                       |

# Support

-   Join the [discord](https://discord.gg/2Vd4wAjJnm)<br>
-   Create a issue on the [github](https://github.com/ghostdevv/svelte-turnstile)
