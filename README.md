# SimpleMoney documentation site

Plain static HTML/CSS/JS — no build step, no dependencies.

| File | Page |
|---|---|
| `index.html` | Landing page |
| `features.html` | Feature guide with how-tos and FAQ |
| `privacy.html` | Privacy policy |

## Preview locally
```sh
npx serve .        # or: python -m http.server 8080
```

## Deploy
- **Vercel:** import the repo, set **Root Directory** to `documentation`, framework preset **Other**, no build command. `vercel.json` enables clean URLs (`/features`, `/privacy`).
- **Cloudflare Pages:** set the build output directory to `documentation`, no build command. Clean URLs work by default; `_headers` adds caching/security headers.

## Before publishing
- Replace `CONTACT_EMAIL` in `privacy.html` with a real address.
- Use the final site URL as the Play Console privacy-policy link (`https://<your-domain>/privacy`).
- To add screenshots: drop WebP files in `assets/img/` and add a `<figure class="shot">` to a feature section (remove `no-shot` from its `<section>` class).
