# Bidova Contact Us — Activation Checklist

Status: **REVIEW BRANCH ONLY**. Do not tell the owner that the form is live until a real test submission arrives.

## Completed
- Responsive Contact Us page with compact mobile menu, matching original Bidova design.
- Name, email, optional company, topic, message, required consent.
- Formspree AJAX submission with validation, success/error messages.
- Formspree `_gotcha` honeypot; email `name="email"` for reply-to behavior.
- No owner email address in public page source.
- Send button stays disabled while `FORM_ID='FORM_ID_REQUIRED'`.

## Owner action needed
1. Go to https://formspree.io/register and create/sign in to your **own** Formspree account.
2. Verify the recipient email address privately in the Formspree dashboard. Choose the existing Bidova Gmail as target/notification email.
3. Create a form named `Bidova Contact` from **New Form** and configure email notifications.
4. In the form Integration page, copy its **public endpoint**, e.g. `https://formspree.io/f/abcdefgh`. Share only that endpoint (or public ID), not passwords, login links with tokens, API keys or other secrets.
5. In Formspree Settings, restrict submissions to `bidova.github.io` if offered. Turn on its available spam protection / CAPTCHA and keep `_gotcha`.
6. Replace `FORM_ID_REQUIRED` in **both** `action` and `FORM_ID` in contact.html with the actual public form ID. If the provided ID format differs, validate that it matches Formspree's actual endpoint before replacing.
7. Check browser/mobile validation, one real test message, notification in Bidova Gmail, and that hitting **Reply** addresses the test sender.
8. Only when owner approves, merge just the contact page into main. Avoid merging the experimental review branch, contact-worker prototype or other unfinished features.

## Notes
Formspree notifications are processed by Formspree, not stored locally on GitHub Pages. A static GitHub Pages site cannot receive private form data on its own. This approach hides the private target inbox from the current public HTML/JS, but a visitor who receives a personal email reply from that inbox will see the sender address.
