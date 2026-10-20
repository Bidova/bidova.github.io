# Bidova Contact Form — Private Review Checklist

Status: **NOT DEPLOYED**. The public Bidova website remains unchanged. This is a standalone Cloudflare Worker application prepared on the website-v2-review branch.

## Intended behavior
- Website: https://bidova.github.io/contact.html
- Public contact API (to be deployed separately): POST contact information, request type and message.
- Inbox: bidovasoftware@gmail.com
- Reply directly from Gmail: provider request uses `reply_to` set to the validated sender's email.
- No database storage in this scaffold. Resend processes email content according to its policies.
- Online Send button stays **disabled** until an actual Worker URL and Turnstile site key are configured on contact.html.
- Visitors have a visible `mailto:` alternative. No fake success notification.
- No website administration or publishing ability exists in the public contact endpoint.

## Before any production launch
1. Review privacy wording, terms and data handling. Do not ask visitors to submit bid PDFs, secrets or sensitive information.
2. Configure a Resend account and an **approved/verified sending domain**. A Gmail recipient is fine, but a production sending address requires provider verification. Set `FROM_EMAIL` to a verified sender, for example `Bidova <contact@your-verified-domain.example>`.
3. Create a Cloudflare Turnstile widget for **bidova.github.io**, enable the action `contact` and obtain its public site key and secret key.
4. Configure Worker secrets (never commit values): `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `FROM_EMAIL` (can be a secret too).
5. Add Cloudflare WAF/rate limit rules for the public contact API endpoint and verify spam protection. Turnstile and honeypot are supplemental protections.
6. Deploy Worker to a separate public hostname only after explicit approval. Test OPTIONS/CORS, origin rejection, invalid content, CAPTCHA failure and successful message delivery.
7. Confirm actual email arrives in **bidovasoftware@gmail.com** and clicking Reply addresses the sender. Verify recipient spam/junk folder behavior.
8. Configure `CONTACT_ENDPOINT` and `TURNSTILE_SITE_KEY` near the end of contact.html once the Worker is deployed and tested.
9. Review site behavior on desktop and iPhone, check keyboard navigation and assistive text.
10. Request explicit approval before merging website-v2-review into main or deploying any Worker.

## GitHub Pages limitations
GitHub Pages serves static HTML; it cannot securely hold the Resend API key or process a protected contact form. Do not place API keys in client-side JS.

## Security assumptions
The Worker only accepts requests with `Origin: https://bidova.github.io`, enforces field limits and validates Cloudflare Turnstile server-side for the expected hostname and action. Requests are not stored in a database. This origin check is **not** a substitute for CAPTCHA, server validation or rate limiting. No published contact processing is asserted until end-to-end tests pass.

## Local developer command (after installing Wrangler)
Run `npx wrangler dev` from `contact-worker`. Running without secrets correctly returns an unavailable/configuration response; do not present that as live email delivery.
