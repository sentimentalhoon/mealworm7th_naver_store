# DESIGN.md

Design rules for the 밀웜7번가 public website and Naver Smartstore detail-page assets.

## Design Goal

The experience should make 밀웜7번가 feel like a reliable seller of live and dried feed insects. The design must help visitors quickly understand the product lineup, shipping constraints, storage guidance, and purchase path to Naver Smartstore.

## Tone

- Practical, calm, and trustworthy.
- Product-first rather than decorative.
- Clear enough for first-time buyers and efficient enough for repeat buyers.
- Korean copy should be direct and natural, without exaggerated sales language.

## First Screen

The first viewport of the public website should communicate:

- Brand: 밀웜7번가.
- Category: live mealworms, live superworms, dried mealworms, dried superworms.
- Purchase path: Naver Smartstore link or product-specific purchase actions.
- Important context: shipping or product condition guidance when relevant.

Do not use an empty hero, abstract illustration, or vague slogan as the main content.

## Layout

- Prefer a simple static layout with clear product sections and policy sections.
- Keep navigation shallow.
- Use section bands or unframed layouts for major page areas.
- Use cards only for repeated product summaries, FAQ items, notices, or compact comparison blocks.
- Do not nest cards inside cards.
- Keep border radius modest, generally 8px or less for cards unless matching existing Smartstore asset styling.

## Visual Style

- Use warm natural colors only as support. Avoid letting the whole site become a single brown, beige, or orange theme.
- Pair warm product colors with neutral backgrounds, dark readable text, and restrained accent colors.
- Product photos or product-detail imagery should carry the visual identity more than decoration.
- Avoid gradient blobs, abstract decorative shapes, and stock-like imagery that does not show the actual product or buying context.

## Typography

- Prioritize readability on mobile.
- Use stable font sizes by breakpoint or component, not viewport-width scaling.
- Do not use negative letter spacing.
- Reserve large display type for true page headers.
- Keep dense policy copy smaller but readable, with enough line height for mobile scanning.

## Product Information

Each product-facing page or asset should make the following easy to scan:

- Product type and option structure.
- Quantity, weight, or count basis.
- Live or dried condition.
- Shipping method and dispatch cutoff.
- Seasonal live-product shipping notes.
- Storage and handling guidance.
- Exchange, refund, and evidence requirements.
- Naver Smartstore purchase path.

## Smartstore Detail Assets

- Existing HTML detail pages are designed for 840px, 640px, and 400px checks.
- Keep exported image text large enough to remain readable after Naver mobile compression.
- Avoid copy that only makes sense to the site builder, such as production notes or internal labels.
- Do not add visual effects that make the exported PNGs harder to read.
- Preserve the current page-width query behavior unless the export scripts are updated with it.

## Accessibility And Usability

- Maintain strong contrast for body text, prices, notices, and CTAs.
- Links and buttons must have clear labels.
- Do not rely on color alone to communicate warnings or product differences.
- On mobile, CTAs and option links should be easy to tap without accidental presses.
- Long Korean text must wrap cleanly without overlapping adjacent content.

## Change Checklist

Before finalizing visual changes:

- Confirm the first screen clearly identifies 밀웜7번가.
- Confirm product and policy information is still easy to scan.
- Confirm mobile layout does not overlap or clip text.
- Run `npm run build` for site changes.
- Run the relevant export script for Smartstore image changes.
