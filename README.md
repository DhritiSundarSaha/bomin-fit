# Bomin Fit — Static Nutraceutical Website

A lightweight rebuild of the supplied Bomin Fit screenshots using only:

- HTML5
- CSS3
- Vanilla JavaScript
- Local SVG assets

No React, no bundler, no runtime dependency, and no external image CDN are required.

## Run locally

Open `index.html` directly in VS Code or use the VS Code Live Server extension. Because this project does not use `fetch()` for page content, it also works when opened as a local file.

## Structure

```text
bomin-fit-site/
├── index.html
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── icons/
│   │   └── logo-mark.svg
│   └── images/
│       ├── product-bb-powder.svg
│       ├── hero-bowl.svg
│       ├── ingredient-protein.svg
│       ├── ingredient-seeds.svg
│       ├── ingredient-cocoa.svg
│       ├── lifestyle-1.svg
│       ├── lifestyle-2.svg
│       └── lifestyle-3.svg
├── css/
│   └── style.css
├── js/
│   └── script.js
└── pages/
    ├── about.html
    ├── product.html
    └── contact.html
```

## Architecture decisions

### 1. Static-first
All pages are independent HTML documents sharing one CSS file and one JavaScript file. This keeps deployment simple and makes later edits easy.

### 2. Local assets
The included artwork is SVG, so it is tiny, sharp at any screen size, and does not need a separate image CDN. Replace these files later with optimized WebP/AVIF or final product photography where appropriate.

### 3. Image loading strategy
- Hero product artwork uses `loading="eager"` because it is above the fold.
- Lower-page images use `loading="lazy"`.
- Every image has explicit width and height to reduce layout shift.
- `decoding="async"` is used for non-blocking decode.
- Real photography should be resized to its rendered dimensions and converted to WebP/AVIF before production.

### 4. Animation strategy
Only lightweight browser APIs and CSS transitions are used:
- IntersectionObserver for scroll reveal
- CSS keyframes for product floating and orbit motion
- Hover micro-interactions for cards and buttons
- Vanilla JS accordion
- Vanilla JS interactive product hotspots
- Respect for `prefers-reduced-motion`

### 5. Responsive strategy
The layout uses CSS Grid, Flexbox and three practical breakpoint ranges. The mobile navigation becomes a solid-background accordion-like menu rather than a transparent overlay.

## Important content before production

The original screenshots contain business statistics, reviews, health/wellness language and product claims. This rebuild intentionally keeps several of those as placeholders so nothing unsupported is presented as a verified fact. Before launch, replace placeholders with:

- the final ingredient declaration
- the approved nutrition facts
- verified certifications
- substantiated product claims
- genuine customer reviews
- the official purchase URL
- real shipping/refund/legal details
- final logo/product photography

## Replacing product photography

Keep the same dimensions where possible and use a responsive `<picture>` element with AVIF/WebP sources. Example:

```html
<picture>
  <source srcset="assets/images/product.avif" type="image/avif">
  <source srcset="assets/images/product.webp" type="image/webp">
  <img src="assets/images/product.jpg" width="700" height="820" alt="BB Powder">
</picture>
```

For large photographic sections, use `object-fit: cover` and supply a properly sized source rather than a multi-megapixel original.

## Customization checklist

1. Replace the local SVG bottle with the final product packshot.
2. Replace the placeholder brand mark with the official logo if available as SVG/PNG.
3. Update business contact details and official social links.
4. Replace placeholder benefit/ingredient copy with approved product text.
5. Replace review placeholders with genuine reviews and attribution.
6. Connect the contact form to Google Forms or a form backend.
7. Add Privacy Policy, Terms, Shipping and Returns pages.
8. Run Lighthouse/PageSpeed after final images are inserted.

## Contact form setup

The contact page includes working call and WhatsApp buttons. The form is ready for a Google Forms endpoint, but it needs your form's private field mapping before it can submit data.

1. Create a Google Form with questions for `name`, `phone`, `email`, `topic`, and `message`.
2. In Google Forms, choose **Get pre-filled link**, fill each field with a test value, and copy the generated URL.
3. Open that URL and inspect the page source or use the browser developer tools to find each question's `entry.##########` name.
4. Update the contact form inputs in `pages/contact.html` so each `name` is its matching `entry.##########` value.
5. Set `data-google-form-action` to the form response URL, usually `https://docs.google.com/forms/d/e/FORM_ID/formResponse`.
6. In Google Forms, use the **Responses** tab to enable email notifications. Google Forms does not natively send each response to WhatsApp or Telegram; use Make, Zapier, or an Apps Script webhook for those notifications.

Until the action URL is configured, submissions stay on the page and the visitor is directed to call or use WhatsApp. Do not put private API keys in this static website.
