# Bidova Website 2.0 — Review Plan

Status: DRAFT ONLY — do not merge without owner's approval.
Live GitHub Pages branch: main. Redesign branch: website-v2-review.

## Confirmed current assets
- Existing index.html has working sections, on-page interactions, three video tags, and Google ownership tag.
- Three demonstration videos are included in the website repository.
- Existing handbook.html.
- Existing /admin/index.html redirect to a separate admin service; backend security and features are not verified by this audit.
- Existing /download path is a placeholder; do not present as a working installer.
- sitemap.xml, robots.txt and Google verification methods.

## Non-negotiable preservation
- Do not remove or alter ownership meta tag or Google verification file.
- Keep robots.txt, sitemap.xml, canonical URLs, handbook, video assets and their paths intact.
- Maintain access to the current admin redirect; never expose administrative tools publicly.
- Do not assert that a working installer is available until releases are tested.
- Do not invent testimonials, integrations, prices or reliability metrics.
- Preserve original index.html until the owner approves replacement after a review.

## Design direction
Dark navy with restrained electric blue accents, crisp typography, simple layout, responsive mobile menu, real product screenshots, clear trust copy and accessible contrast.

## Website structure
1. Home — headline, product overview, real screenshots, CTA.
2. Features — bid intake, review, comparison, organizing, history, manager.
3. Demos — use the existing genuine video files, optional future presenter intro.
4. Handbook — retain the existing guide.
5. Downloads — Coming Soon and only verified builds/releases.
6. FAQ — accurate operational and security disclosures.
7. Contact/support — design first, then add a verified delivery endpoint; avoid fake form submissions.
8. Owner admin — link to existing secure admin environment; plan any actual functionality as a separate reviewed project.
9. Legal/privacy — create only from confirmed data-handling practices.

## Rollout gates
A. Approve design mockup and homepage copy.
B. Rebuild as branch-only reviewed candidate, retain original links/media.
C. Verify mobile/desktop layout, navigation, accessibility, media playback and all forms.
D. Confirm installer/service URLs, privacy terms and admin security.
E. Review diff/preview with owner.
F. Merge to main only after explicit approval.

## Notes on Search Console
Ownership verification currently succeeds. Public indexing work is on pause at owner's request. Do not undo those assets.

## Owner decision — 2026-10-20: preserve existing original website
The previous alternate V2 mockup is NOT the design target. Keep the existing main-branch index.html's branding, layout, genuine media, navigational behavior and features as baseline. Improve it incrementally rather than replacing it. All changes remain on website-v2-review until explicitly approved. The website-v2-preview.html is an abandoned exploratory concept and must not replace index.html. For admin work, continue separately on admin-v2-review without deploying.

## Contact Us milestone (2026-10-20)
- Added contact.html matching the existing dark Bidova website, not the alternate redesign.
- Added Contact links in desktop/mobile navigation and footer, plus a Request a Demo homepage CTA.
- Inquiry fields: name, email, optional company, reason, message; recipient is bidovasoftware@gmail.com.
- Designed a public, separate contact-worker API with validation, Turnstile site verification, honeypot, CORS and Resend email delivery with Reply-To.
- **No API has been deployed, no email delivery has been connected or tested, and the website main branch has not been updated.** Send button remains disabled intentionally.
- A third-party service account, verified sender identity/domain, Turnstile credentials, public endpoint, rate limits and end-to-end test are required to activate automatic delivery.
- Direct mailto fallback remains available even if the online submission feature is not ready.
- Do not merge or publish until the owner approves and email submission is verified.
