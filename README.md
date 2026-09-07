# Ani-Fan India — Telegram Mini App

This version is redesigned to match the supplied reference screenshot more closely.

## Included
- Ani-Fan India branding (not AM-FAN INDIA)
- Dark black/navy + purple neon UI
- Playlist screen with pinned anime cards
- Search and category chips
- Anime detail page
- Like / Share / Report
- Copy Link
- "Watch Ads (0/4)" demo unlock modal
- More Episodes
- Search Results screen
- Profile screen with liked anime preview
- Telegram WebApp initialization
- Mobile-first layout

## Run locally
```bash
npm install
npm run dev
```

Then open the Vite URL in your browser.

## Build
```bash
npm run build
```

## Important
The ad unlock and episode link are demo UI only. For a real Telegram Mini App you still need:
1. Telegram bot + Web App URL
2. Hosting (HTTPS)
3. Backend + database
4. Admin panel for adding/deleting/pinning anime
5. Real ad provider integration
6. Real Telegram channel/episode links
7. Authentication and server-side validation

Do not put bot tokens or other secrets in the frontend.
