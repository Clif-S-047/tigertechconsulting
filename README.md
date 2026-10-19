# Tiger Tech Consulting — redesigned GitHub Pages website

## What this package does
A responsive static website using your purple/gold branding and existing project photographs. Includes all eleven service areas, individual service pages, Hampton Roads city pages, a multi-service project builder, a contact form, and no store or checkout. No build tools, framework, API keys, or npm install required.

## Publish safely
1. Back up the current repository or make a new branch before uploading.
2. Extract this ZIP locally. Upload the CONTENTS of the `website` folder to the repository root, preserving the `assets` directory. Replace matching files. Do not upload just the enclosing folder or the ZIP.
3. Keep `CNAME` unchanged. It contains `tigertechconsulting.com`.
4. In GitHub Settings > Pages, retain your existing working publishing setup. For standard branch publishing, use the branch and root folder holding index.html.
5. After deployment, test both domain variants, navigation, a mobile menu, and a real contact inquiry. No DNS change should be needed if you keep the existing setup.

This package has NOT been pushed to GitHub or published to your domain. Repository write access was not available. An easy rollback is reverting your upload commit.

## IMPORTANT: pricing is intentionally not invented
The project builder supports every service, multiple selections, relevant questions, quantities, equipment source, project stage, and timing. It exports an itemized brief and passes selections into the contact inquiry.

Because approved rates were not supplied, it shows “Quote required” rather than false instant dollar prices. The old homepage's TV/Govee rates were not carried forward: their scope and validity have not been confirmed. Provide approved prices and exclusions before enabling numerical estimates.

`assets/services.js` contains a `pricing` object per service. All four values are `null` by default:
- `baseLow` and `baseHigh`: approved base range per selected service
- `unitLow` and `unitHigh`: approved additional range per quantity unit
- Formula: base + quantity × unit rate. If no per-unit charge applies, set both unit values to 0.
- All four fields must be finite, nonnegative numbers; high must be at least low.
- A positive integer quantity is required if per-unit rates are nonzero.
- Unpriced services remain explicitly excluded from priced subtotals, never counted as free.
- This is a basic per-service pricing hook, NOT a complete rules engine. It does not yet price scope-specific options, equipment, wall types, height, complexity, taxes, or travel automatically. If your prices depend on these factors, leave the service unpriced until custom rules are implemented and approved.

## Contact form: activation required before launch
Uses the FormSubmit destination already present in your old contact.html:
`lane.smith.tigertech@gmail.com`

Confirm this inbox is still correct and that you want to keep using this provider. FormSubmit may require first-submission email activation. Captcha is left enabled. The first live test must be followed through and inbox delivery verified; this could not be tested without sending an unsolicited real inquiry. The form redirects to the provider's confirmation page rather than pretending an email has been sent locally. Direct email and the existing Calendly booking URL are available as alternatives. Confirm the Calendly event remains active.

The brief is attached as a separate `project_summary` form field; customers' free-text messages are preserved. No payment, address, passwords, or access codes are requested. The supplied privacy notice is plain-language starter content; confirm it matches your retention practices before publication.

## Files and maintenance
- `index.html`: homepage, project builder, contact form.
- `assets/styles.css`: shared palette, layouts, mobile breakpoints.
- `assets/app.js`: menu, selection state, brief, form handoff, optional price hook.
- `assets/services.js`: service choices and approved pricing configuration.
- Eleven service pages plus location pages, privacy, and replacements for existing public HTML filenames.
- `assets/before.webp`, `assets/after.webp`: optimized versions of your existing photos. Confirm permission to publish them.
- `assets/brand-mark.webp`: cropped existing logo artwork; text wordmark is live HTML.

If you change scopes in services.js, also update the relevant HTML service page. The generator is not needed to maintain or host this website. Old unused images can remain in your repository; the replacement pages do not reference them. No fabricated testimonials, certifications, warranties, project locations, or customer counts are included.

## Local preview
From the website directory run `python3 -m http.server 8000`, then visit localhost:8000. Do not submit real inquiry forms during local testing unless you intend to contact the business.
