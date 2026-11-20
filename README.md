# SMS Trial Attorneys — Static Rebuild (GitHub Pages)

A from-scratch, static recreation of smstrial.com. Pure HTML/CSS/JS — no backend,
no build step. Dark/gold "lion" branding, rule-based AI intake chatbot, news
articles with YouTube embeds, and an exit-intent lead-capture popup.

## Deploy to GitHub Pages
1. Create a new repo (e.g. `smstrial-site`) and upload this entire folder
   (drag-and-drop in the GitHub web UI, or `git push`).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `main` / folder: `/ (root)` → Save.
3. Live at `https://<username>.github.io/smstrial-site/` in ~1 minute.
   All paths are relative, so it works at any base path or custom domain
   (add a `CNAME` file for a custom domain).

Preview locally: `python -m http.server` then open http://localhost:8000

## Configure (one file): `js/config.js`
- **formEmail** — set to the inbox that should receive leads. Forms POST to
  FormSubmit's AJAX endpoint. The FIRST submission emails that address an
  activation link — click it once. Until then the site runs in **DEMO MODE**
  (submissions succeed silently and log to the console).
- Phone, email, and social URLs are also here.

## Swap the placeholders
- **YouTube videos:** in `js/data.js` (media) and the article/home pages, set
  `data-id="VIDEO_ID"` (the part after `watch?v=`). Empty = styled placeholder.
  Embeds are lazy + privacy-enhanced (youtube-nocookie.com), load on click.
- **Images/logo:** replace `assets/img/logo.svg`; team avatars are initials-based.
- **Addresses & award badges:** marked `[placeholder]` in the footer/contact
  page and the Awards section — replace with the firm's real details/art.

## How it works
- Shared header/footer/forms are injected by `js/components.js`; page content
  is data-driven from `js/data.js` via `js/main.js` (keyed off `body[data-page]`).
- **Chatbot:** rule-based intake (10 case types → when/care/name/contact →
  FormSubmit lead). Free-text is routed by keyword intents. To upgrade to a live
  LLM later, replace `handleText()` in `js/chatbot.js` with an API call via a
  free Cloudflare Worker proxy (keeps your key off the client).
- **Popup:** exit-intent (desktop) or 30s timer, once per session. Clicking ✕
  asks for a callback number first (with a skip link).
- **Add a news article:** push an entry to `SMS_DATA.news` in `js/data.js` and
  create `news/<slug>.html` (copy an existing article as the template).

## Notes
Demo recreation for design/preview purposes. Verify all content, claims, and
attorney-advertising compliance before publishing. Not legal advice.
