# SEO TODO

This checklist tracks the remaining SEO hardening work for `https://mealworm7th.com/`.

## P0 - Fix Before Search Console Submission

- [ ] Add Search Console and Naver Search Advisor ownership verification.
  - Current state: no verification meta tags or verification files are present.
  - Target state: Google and Naver ownership verification is present using either provider-issued HTML files or meta tags.
  - Verification: provider verification succeeds in Google Search Console and Naver Search Advisor.

- [ ] Submit `sitemap.xml` after deployment.
  - Current state: `sitemap.xml` exists and lists the homepage.
  - Target state: Google Search Console and Naver Search Advisor both know `https://mealworm7th.com/sitemap.xml`.
  - Verification: sitemap submission is accepted; no blocked-homepage or invalid-sitemap errors are reported.

## P1 - Improve Search Result Quality

- [ ] Strengthen homepage structured data.
  - Current state: homepage has a minimal `Store` JSON-LD object.
  - Target state: JSON-LD includes the official site URL, Smartstore URL, representative image, and product category/offer summary without making unsupported claims.
  - Verification: structured data parses cleanly in Google Rich Results Test or Schema Markup Validator.

- [ ] Create a dedicated social preview image.
  - Current state: `og:image` uses `assets/live_mealworm.jpg`.
  - Target state: add a 1200x630-ish branded preview image that includes the 밀웜7번가 name and product context.
  - Verification: `og:image` points to the new asset and renders clearly in link preview checks.

- [ ] Add optional `lastmod` to `sitemap.xml`.
  - Current state: sitemap only contains the homepage URL.
  - Target state: sitemap includes a manually maintained `lastmod` date when homepage content changes.
  - Verification: sitemap remains valid XML and only includes intended public URLs.

## P2 - Monitor After Indexing

- [ ] Check Google index coverage after deployment.
  - Target state: homepage is indexable; Smartstore source pages under `/html/` are not indexed.
  - Verification: Search Console URL Inspection reports homepage as indexable; `html/*` pages are excluded by `noindex` if inspected.

- [ ] Check Naver Search Advisor collection and optimization reports.
  - Target state: homepage is collected without title, description, robots, or content parsing errors.
  - Verification: Naver Search Advisor shows successful collection for the homepage and no critical optimization errors.

- [ ] Review search snippets after first indexing.
  - Target state: snippets accurately describe 밀웜7번가 and do not look like a thin redirect page.
  - Verification: Google/Naver search results show the homepage title and description close to the intended metadata.

## Completed Baseline

- [x] `robots.txt` allows crawlers to access `html/*` so page-level `noindex,nofollow` can be read.
- [x] Homepage has a unique `<title>`.
- [x] Homepage has a unique `<meta name="description">`.
- [x] Homepage has canonical URL `https://mealworm7th.com/`.
- [x] Homepage has one `<h1>`.
- [x] Homepage contains product, delivery, storage, FAQ, and purchase-path content.
- [x] Representative Smartstore URL is set to `https://smartstore.naver.com/mealworm7th`.
- [x] Sticky Smartstore CTA is present.
- [x] `sitemap.xml` exists and lists the homepage.
- [x] Smartstore source pages under `html/*` contain `noindex,nofollow`.
