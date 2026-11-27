# SimpleMoney website

The public website and guides for **SimpleMoney**, a free, private, offline-first expense manager and budget planner for Android.

**Live site:** https://simplemoney.aashglobal.in/

- App on Google Play: https://play.google.com/store/apps/details?id=com.aash591.SimpleMoney
- App source code: https://github.com/aash591/Simple-Money

## What is here

| Path | What it is |
| --- | --- |
| `index.html` | Home page |
| `guides.html` | Step-by-step guides with screenshots |
| `*-alternative.html`, `best-expense-manager-app.html`, `ai-expense-tracker.html`, `bank-sms-expense-tracker.html` | Comparison and topic pages |
| `privacy.html`, `terms.html` | Privacy policy and terms |
| `assets/` | Images and screenshots (`assets/app/`) |
| `llms.txt`, `robots.txt`, `sitemap.xml` | Search and crawler files |
| `vercel.json`, `_headers`, `_redirects` | Hosting settings (clean URLs, caching, redirects) |

It is a plain static site: no build step. Open `index.html` in a browser, or serve the folder with any static file server.

## Updating the screenshots

Screenshots are 540×1200 WebP images taken from the Android emulator and saved in `assets/app/`. The guides refer to them by file name, so keep the names when you replace a picture.

## Licence

The app is open source under AGPL-3.0. See the app repository for details.
