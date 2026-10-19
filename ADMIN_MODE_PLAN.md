# Bidova Admin Mode — engineering foundation

**Status: prototype only. Do NOT deploy an admin login on GitHub Pages and assume it is private.**

## Current website
- Public GitHub Pages repo: `Bidova/bidova.github.io`; current landing page is a large single `index.html` with embedded CSS/image data.
- Preserve public site's visual appearance during refactor and keep production `main` unchanged until reviewed.
- This branch's `admin/index.html` is a NON-SECURE sample of editing controls. It has no login, persistence, or publish capability. Do not enter passwords.

## Intended user experience
- Public site: `https://bidova.github.io/`
- Intended entry point: `https://bidova.github.io/admin/` (route is not security).
- Private admin app for one owner, accessible from iPhone and Windows browser.
- Phone: tap-to-edit, compact bottom-sheet controls.
- PC: editor canvas with detailed properties sidebar.
- Draft -> Preview -> Confirm -> Publish -> Deployment status -> Rollback.
- Brand fields centralized for future website-only rebrand.

## Security architecture (must precede real operations)
1. Host the authenticated admin app and APIs on a secure managed platform, optionally linked from /admin on GitHub Pages. A public GitHub Pages file is **not** an access-controlled resource.
2. Identity provider: create exactly one owner account through private enrollment, disable public sign-up, enable MFA/passkeys, support secure account recovery. No hardcoded passwords or secrets.
3. Backend authorizes every read/write/publish operation by server-validated session and owner role; deny by default. Use CSRF protections where cookie sessions are used, enforce origin checks, rate limits, audit events.
4. GitHub App installation with least-privilege repository permissions; all signing keys and tokens held in backend secret storage, never browser JS or public GitHub repo.
5. Store draft data in private database. Store uploads in protected object storage with type/size validation and safe filenames; publish selected media to public assets only after approval.
6. Generate deterministic site files from structured content and design tokens. Validate schemas, escape untrusted text, prevent script injection, and inspect diffs before publish.
7. On Publish: create/update branch, open PR or otherwise trigger approved deployment; show actual status and errors, require confirmation; retain previous revision for rollback.
8. Scope raw JS/HTML editing behind additional controls and review; do not execute untrusted scripts in the admin origin. Isolate previews in a sandboxed separate origin.

## Planned stages
1. Secure backend + sole-owner identity + protected app hosting.
2. Extract existing site's hero and theme settings into structured editable data without visual regression.
3. Shared saved drafts and visual editing for headline, buttons, colors, and videos.
4. Advanced component/layout controls, responsive variants, global styles plus overrides.
5. Publishing/rollback, auditing, monitoring, installation/PWA support.

## Initial testing criteria
- Anonymous visitors cannot fetch draft content or invoke any edit/publish API.
- Site behaves unchanged on public homepage.
- Drafts visible on phone and PC only after authentication.
- No credential or installation token in website source, repo, or network responses.
- Failed deployments never masquerade as published.
