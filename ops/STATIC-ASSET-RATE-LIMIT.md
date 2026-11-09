# Static asset rate-limit correction

Nuxt route chunks under `/_nuxt/` are immutable, content-hashed build assets. They must not consume the same rate-limit budget as login, profile, search, or other dynamic requests.

## Cloudflare

Review the rate-limiting rule affecting `dev.nwlronline.com` and exclude requests where the URI path starts with:

```text
/_nuxt/
```

Also exclude ordinary static files where appropriate:

```text
/favicon
/icon
/manifest.json
```

Keep authentication and API rate limits on their respective API hosts and dynamic paths. Do not disable security controls globally.

## Apache

The frontend virtual host should cache hashed Nuxt assets and proxy them without an application throttle:

```apache
<LocationMatch "^/_nuxt/.*\\.(?:js|css|map|woff2?|png|jpe?g|gif|svg)$">
    Header always set Cache-Control "public, max-age=31536000, immutable"
</LocationMatch>
```

If Apache has a custom request-rate rule, exclude `^/_nuxt/` from that rule. The application-level change in this repository also disables speculative Nuxt link prefetching, reducing the initial request burst.

## Deployment

After building and restarting the frontend, purge only the frontend HTML cache in Cloudflare. Hashed `/_nuxt/` assets can remain cached because each build produces new filenames.
