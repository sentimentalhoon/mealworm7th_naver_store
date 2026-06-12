# Search And Smartstore Strategy

## Positioning

The public website should be the official 밀웜7번가 brand and product hub. Its job is to help search users understand the seller and products, then choose to continue to the Naver Smartstore.

This is acceptable when the site provides real value. It becomes risky if the site is only a doorway page that exists to capture search traffic and forward users elsewhere.

## Required Page Value

Each indexable page should include at least one meaningful value beyond a Smartstore link:

- Product explanation.
- Option or quantity guidance.
- Live versus dried product differences.
- Shipping cutoff and seasonal shipping guidance.
- Storage and handling guidance.
- Exchange/refund conditions.
- FAQ.
- Brand contact or trust information.

## Routing Rules

- Do not auto-redirect indexable pages to Smartstore.
- Use visible Smartstore links or buttons with clear labels.
- Product pages may link to the matching Smartstore listing when the URL is known.
- The homepage should link to product information first, then provide a Smartstore purchase path.
- If a temporary redirect is ever needed for operations, document the reason and expected removal date.
- `index.html` is the public search landing page for `https://mealworm7th.com/`.
- The public homepage uses one 840px mobile-first layout on both mobile and desktop, with a sticky Smartstore purchase button.
- Existing `html/*` files are Smartstore upload sources and should keep `noindex,nofollow`.
- `robots.txt` excludes `/html/` from crawling, while `sitemap.xml` lists only the homepage until public product pages are intentionally created.

## Google And Naver Basics

Use normal crawlable HTML for important content:

- Unique `<title>` per page.
- Unique `<meta name="description">` per page.
- Matching Open Graph title and description when social previews matter.
- One clear `<h1>` per page.
- Internal links to product and policy sections.
- `robots.txt` that allows Googlebot and Naver Yeti unless there is a specific reason to block.
- `sitemap.xml` for public indexable pages.
- Canonical URLs for pages with width or tracking query parameters.

## Content Rules

- Do not stuff keywords.
- Use natural Korean product language.
- Do not create pages that differ only by city, search keyword, or repeated phrase.
- Do not copy Smartstore content without adding brand context, product guidance, or policy clarity.
- Keep live-product risk guidance visible and plain.

## Smartstore Relationship

Be transparent that purchase happens through Naver Smartstore. Good examples:

- "네이버 스마트스토어에서 구매하기"
- "상품 안내를 확인한 뒤 스마트스토어로 이동합니다"
- "밀웜7번가 스마트스토어 바로가기"

Avoid misleading labels such as:

- "공식몰 단독 구매" when checkout is not on this site.
- "즉시 구매 완료" when the user still needs Smartstore checkout.

## Future Implementation Checklist

- Keep the representative Smartstore URL set to `https://smartstore.naver.com/mealworm7th` unless the store URL changes.
- Keep crawlable homepage content current for brand, product categories, and purchase path.
- Keep homepage metadata, `robots.txt`, and `sitemap.xml` aligned with the deployed domain.
- Keep canonical handling focused on the homepage unless public product pages are added.
- Register and verify the domain in Google Search Console.
- Register and verify the domain in Naver Search Advisor.
- Submit sitemap after the public URLs are final.
