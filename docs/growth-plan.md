# HomeBotRadar growth plan

Started: 2026-11-10

Work top to bottom. Check a box only when that item is live on the site. Do not start the next item until the current one is checked.

The site should read as a database people cite, not as a gadget news blog. CountryToLive grows because each page is one search phrase cut from the same scored catalog. HomeBotRadar already has that catalog (44 robots, scores, prices, availability). New pages should be cuts of it.

## Do not do

- Do not delete the social feed. Take it out of Google and off the top of the homepage.
- Do not index every compare pair. Keep the allowlist.
- Do not clone thousands of knowledge pages. The catalog has 44 robots. Start with the lists below.
- Do not buy links or write guest-post filler.
- Do not put an updated old news story back at the top of the homepage. Order stays `createdAt`.

## Success

- Search impressions on phrases like "best home robot", "humanoid price", and "buy NEO".
- Homepage clicks go to a robot, a ranking, or the matchmaker, not only to news and the social feed.

## 1. Stop the leak

- [ ] Remove `/feeds` from `app/sitemap.ts`.
- [ ] Mark `/feeds` `noindex`. The page stays up for people who want the videos.
- [ ] Move the social feed off the top of the homepage. Latest buyable robots, then rankings once they exist, then the matchmaker. The feed can sit lower or become a link to `/feeds`.
- [ ] Point sitemap `lastModified` for hub pages at a real content date, not the frozen 2026-10-06 stamp.
- [ ] Stop writing spectacle news that has no catalog robot and no buy or ship fact. Everest climbs, Arctic runs, surgery demos, dance auditions, and store fights stay out.
- [ ] `noindex` existing spectacle news that does not tie to a catalog robot or a price, stock, or ship change.

## 2. Rankings

One hub, `/rankings`, plus one page per list. Each page is generated from the catalog: unique intro, a table, a short note on the top five, a method line, and links to the robot pages and one compare. Publish a list only when at least five robots qualify. Do not duplicate the same intro across lists.

- [x] Add the `/rankings` hub.
- [x] Best home robots you can buy
- [x] Best humanoid robots (full set, status visible, not only the ones you can order)
- [x] Cheapest home robots (confirmed Buy Now and Pre-order prices)
- [x] Best robot pets
- [x] Best elder-care robots
- [x] Best desktop robots under $500
- [x] Coming soon, not for sale
- [x] Best for an apartment
- [x] Add the published rankings to the sitemap.
- [x] Put the rankings on the homepage once the first lists are live.
- [x] Ranking scan skill: one page, after research. Trigger: "Ranking scan çalıştır".
- [x] Ranking freshness skill: three oldest pages, update only when a fact moved. Trigger: "Ranking freshness çalıştır".

## 3. Knowledge

One question per page, about 400–700 words. Short answer first, official sources at the bottom, related robots, and one compare. A page that fails this does not go in the sitemap. Write these first. Add more only after they are live.

- [x] Add the question page template and the quality gate.
- [x] Can you buy Tesla Optimus?
- [x] What does NEO Gamma cost, and when does it ship?
- [x] Figure 02 is retired. What can you order?
- [x] Does Vector need a subscription?
- [x] Which home robots climb stairs?
- [x] Add the live question pages to the sitemap.
- [x] Answer scan skill: new Robopedia pages. Default 1. A number in the phrase sets the count. Trigger: "Answer scan çalıştır".
- [x] Answer update skill: oldest pages. Rewrite only when a fact or a correction is due. Always bump `updatedAt`. Trigger: "Answer update çalıştır".

## 4. Pages people can cite

- [ ] `/prices`: one table, "home robot prices", dated, linked from robot pages.
- [ ] `/method`: how readiness and reality scores are calculated. Say the lists are not sponsored.
- [ ] Brand hubs, second wave: `/brands/unitree`, `/brands/figure`, `/brands/1x`. Each hub lists that brand's catalog robots, prices, and status.

## 5. Links back

- [ ] An embeddable ranking (a small page another site can iframe), same idea as CountryToLive `/embed`.
- [ ] One yearly note, "what you can actually buy", built from `/prices` and the buy-now ranking.
- [ ] When a price or ship status changes, send that robot page to a few newsletters. Do not run a guest-post campaign.

## 6. Bring people back

- [ ] Turn on email for price or stock changes only. Not a video digest.
- [ ] Leave comments as they are. Do not treat empty comments as a growth project.

## 7. After the first rankings ship

- [ ] In Search Console, check impressions for the new ranking and price URLs before writing more question pages.
