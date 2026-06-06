# HomeBotRadar

Compare, score, and track home robots on [homebotradar.com](https://homebotradar.com).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Comments (local demo)

User comments appear on:

- Robot pages → **Reviews** tab
- News articles → **Discussion** section

Storage is file-based for now (`data/comments.json`). Comments are rendered in HTML for SEO (microdata + JSON-LD). Production will move to Supabase.

Features:

- No account sign-up (username only)
- One reply level per comment
- Staff/admin usernames map to editor profiles with avatar + HomeBotRadar logo
- 500 character limit per comment or reply

### Admin comment usernames

Enter one of these **exact usernames** in the comment form to post as a verified HomeBotRadar editor (avatar + small HR logo next to the name):

| Username | Posts as |
| --- | --- |
| `oguzhan-aydin26` | Oguzhan Aydin |
| `chuck-steward26` | Chuck Steward |
| `maya-chen26` | Maya Chen |

Usernames are case-insensitive. Codes live in `config/admin-codes.ts`.

**Do not share these publicly.** They are for internal staff replies only until proper auth exists.

## Email alerts

Homepage email signup is disabled (`siteConfig.features.emailSubscription = false`) until the list is live.

## News content

Markdown sources live in `data/news/`. Rebuild with:

```bash
npm run news:build
```

`predev` / `prebuild` run this automatically.

## Deploy

Standard Next.js deploy (Vercel or similar). Set `NEXT_PUBLIC_SITE_URL` for canonical URLs and OG tags.

## Legal pages

Public policy pages for Search and AdSense:

- `/privacy` — Privacy Policy
- `/cookies` — Cookie Policy
- `/terms` — Terms of Service

Footer links appear site-wide. Contact and last-updated dates live in `config/legal.ts`. Review with counsel before production ads go live.
