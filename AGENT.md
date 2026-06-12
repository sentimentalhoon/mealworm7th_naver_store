# AGENT.md

This file is the navigation and rule sheet for the Mealworm 7th Avenue Naver Store project.

## Project Identity

- Korean brand name: 밀웜7번가
- Repository purpose: maintain the public website and Smartstore detail-page assets for 밀웜7번가.
- Business purpose: help Google and Naver understand the brand, products, shipping policy, and purchase path, then guide qualified visitors to the Naver Smartstore.
- The website must behave like an official brand and product information hub, not like a thin redirect or doorway page.

## Primary User Flow

1. A visitor finds the domain through Google, Naver, or a shared link.
2. The visitor understands what 밀웜7번가 sells and whether the products fit their needs.
3. The visitor sees clear product, shipping, storage, exchange, and refund guidance.
4. The visitor can move to the Naver Smartstore for purchase.

## Document Map

- `README.txt`: current build, export, and Smartstore upload notes.
- `DESIGN.md`: visual and UX rules for the public site and Smartstore detail assets.
- `docs/README.md`: index of project documentation.
- `docs/project-purpose.md`: brand, audience, content, and success criteria.
- `docs/search-smartstore-strategy.md`: Google/Naver search and Smartstore routing rules.

Add new project documentation under `docs/`. Keep root-level files limited to navigation, build entry points, and files required by the toolchain or hosting provider.

## SEO And Search Rules

- Optimize for users first, then help search engines understand the same content.
- Do not create pages whose only purpose is to capture search traffic and immediately send users elsewhere.
- Every indexable page must provide original value: product explanation, usage context, storage guidance, shipping policy, FAQ, or brand trust information.
- Avoid duplicate pages with only small keyword changes.
- Use one canonical URL for the same content.
- Use accurate page titles, meta descriptions, Open Graph tags, headings, and internal links.
- Any Smartstore link must be presented as a clear purchase path, not a forced redirect.
- Do not auto-redirect the homepage to Smartstore unless the user explicitly requests it and the SEO tradeoff is documented.

## Content Rules

- Korean is the primary language.
- Keep claims factual and conservative. Do not imply medical, veterinary, or guaranteed growth effects.
- Product names, quantities, shipping deadlines, seasonal shipping notes, and exchange/refund limits must match the current Smartstore policy.
- For live insects, make temperature, recipient availability, death-on-arrival evidence, and limited compensation terms visible before purchase.
- For dried products, make packaging, weight, sealing, humidity, and storage guidance visible.
- If pricing, shipping fees, or Smartstore policy changes, update the relevant product page and docs in the same change.

## Design Rules

- Follow `DESIGN.md` before changing public-facing UI or Smartstore detail pages.
- The design should feel trustworthy, practical, clean, and product-focused.
- Do not make a marketing-only landing page. The first screen should identify 밀웜7번가 and expose a real path to product information.
- Keep text readable on mobile and in exported Smartstore images.
- Avoid decorative elements that reduce clarity or make product details hard to scan.

## Engineering Rules

- Make the smallest change that solves the current task.
- Do not refactor unrelated HTML, CSS, scripts, or generated assets.
- Preserve the existing static-site structure unless there is a clear reason to change it.
- Treat `exports/` as generated output and do not commit it.
- Use existing npm scripts before adding new tooling:
  - `npm run build`
  - `npm run export:images`
  - `npm run export:integrated`
  - `npm run export:options`

## Verification

For documentation-only changes:

- Check `git diff`.
- Confirm links and filenames are consistent.

For site or asset changes:

- Run `npm run build`.
- For Smartstore image changes, run the relevant export script.
- Inspect the affected HTML page or exported images when visual output changes.

## Commit Rule

After each coherent unit of completed work, create a git commit with a detailed message covering:

- What changed.
- Why it changed.
- What verification was run.
- Known limitations or follow-up work.

Do not leave completed work uncommitted unless the user explicitly asks for that.
