<script lang="ts">
    import { Turnstile } from '$lib';
</script>

<Turnstile
    siteKey="0x4AAAAAAAAn8CCb_WenRWb-"
    on:turnstile-callback={(e) => alert(e.detail.token)}
    on:turnstile-error={() => alert('error')}
    on:turnstile-expired={() => alert('expire')} />
