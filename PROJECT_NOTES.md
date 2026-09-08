# PROJECT_NOTES.md — Ashik & Jerrin Wedding Site

Commit this file to the root of the repo. Tell zcode (or any tool) to read
this file first before making changes — it replaces needing full
conversation history as context.

---

## Overview
Single-page wedding invitation website for Ashik & Jerrin.
- Wedding: 21 September 2026, Thrissur, Kerala
- Engagement: 12 September 2026, Kamballur, Kasaragod, Kerala
- Live domain: https://ashikandjerrin.site (connected via Namecheap DNS →
  Vercel, A record + CNAME already configured and verified)
- Hosting: Vercel (production deploys from `main` branch)

## Couple & Event Details
- Wedding ceremony: Our Lady of Lourdes Metropolitan Cathedral, East Fort,
  Thrissur — 10:30 AM, followed by lunch at Lourdes Centenary Hall
- Engagement: St. Alphonsa Church, Kamballur, Kasaragod — 11:30 AM
- Countdown section title should read "The Holy Matrimony" only — do NOT
  include "& Celebration Lunch" anywhere in headings (this was fixed
  previously, keep it that way)

## Design System
- Base background: warm ivory/champagne (~#F3E9DC to #F6EFE4), sampled
  from the hero artwork's sky tones — NOT dusky rose (that was tried and
  reverted, doesn't match the illustration's palette)
- Accent colors: burgundy (~#6E1F2A, matches hero rose border) and
  olive-green (~#9CAF3E, matches hero leaf border) — no other accent hues
- Background texture: a generated (nanobanana) warm watercolor/paper
  texture image applied across body sections — NOT a procedural CSS noise
  filter (that caused a harsh pixelated look and was replaced)
- Typography: elegant serif for headings/names (Playfair Display /
  Cormorant Garamond style), clean sans-serif for body text
- Decorative motif: Eiffel Tower silhouette woven into the hero
  illustration (not just a watermark — it's the actual hero artwork)

## Hero Images
- Two separate hero images exist: a landscape composition (desktop/tablet)
  and a portrait composition (mobile) — same couple, same style, same
  color palette, recomposed for each aspect ratio. Both generated via
  nanobanana.
- Landscape hero has a tuned vignette/fade at the bottom transitioning into
  the body section (already resolved after some iteration — moderate
  intensity, not overexposed, not just a thin sliver).
- Portrait (mobile) hero now has the same bottom fade (resolved): a
  mobile-scoped `.hero-section::after` cream gradient in the ≤720px media
  query blends the artwork's bottom into the body canvas, since the
  portrait artwork's painted border is cropped out by cover-fit. Mobile
  hero text sits at `padding-bottom: 3.25rem` to keep the fade band clear
  of the text — keep that pairing if you ever retune either.
- Hero height sizing: mobile hero is set to `100vh; height: 100svh; min-height: 100svh; max-height: none;`
  so the next section (#story) is completely below the fold and not visible
  when the site is opened. Using stable `100svh` instead of `92dvh` prevents
  the hero from resizing when the browser address bar collapses/expands, eliminating
  scroll jumps/jerks.
- Phone landscape & short screens: handled by dedicated `@media (orientation: landscape) and (max-height: 520px), (max-height: 500px)`
  rules with compact header padding, scaled typography (`clamp(1.85rem, 5.2vw, 2.75rem)`),
  and proportional bottom fade to prevent vertical overflow and scrolling stutter.
- Nav bar: has a light vignette treatment behind it for text legibility at
  the top of the hero; sticky/scrolled nav behavior is intentional and
  should NOT be changed. Hardware accelerated with `transform: translateZ(0)` and
  scroll events are throttled with `requestAnimationFrame` for buttery-smooth 60/120fps scrolling.

## Backend / Data
- **Firebase Firestore** (project: `ashik-jerrin-wedding`, region:
  asia-south1/Mumbai) powers both RSVP and Wedding Wishes.
  - `rsvps` collection: name, attending, message, timestamp — NOT publicly
    readable (private to the couple)
  - `wishes` collection: name, message, timestamp — publicly readable so
    the guestbook displays live to all visitors
  - Security rules are the PERMANENT rules (not default test-mode, which
    would have expired Oct 7 2026) — allow create on both, read true on
    wishes only, no update/delete on either.
- **Formspree** (endpoint: https://formspree.io/f/mzebaqwa) sends an email
  notification on every RSVP submission, in addition to the Firestore
  write. Notification email is currently set to the developer's own email
  (couple hasn't shared theirs yet) — update this directly in the
  Formspree dashboard under Workflow → Email action → Settings, no code
  change needed when the couple's email is available.
- **Background music**: "A Thousand Years" (Christina Perri, ThePianoGuys
  cover) — set to loop continuously. Note: this is a copyrighted
  commercial track (unlike the original Canon in D placeholder), sourced
  per explicit request.

## Known-Resolved Issues (don't reintroduce these)
- Grain/texture was originally a harsh procedural CSS noise filter causing
  visible pixelation — replaced with a real generated watercolor texture
  image at natural opacity.
- A floating duplicate hero thumbnail bug (stray lazy-load/preview element)
  was found and removed — if something similar reappears, trace it to its
  actual source in the component tree rather than hiding it with CSS.
- Hero text legibility regressed at one point (missing overlay) — fixed;
  verify text stays legible against both hero images after any future
  hero-related changes.
- Mobile hero was previously capped at 92vh/dvh causing the next section
  (#story cathedral photo) to peek into the initial viewport on page load,
  and causing a layout jerk on scroll down/up due to dynamic dvh recalculation.
  Fixed with stable 100svh/100vh full-bleed sizing and RAF scroll throttling.

## Pending / Open Items
1. Update Formspree notification email once the couple provides their
   actual email address.
2. Domain (`ashikandjerrin.site`) was purchased for ~2 months of use only
   — no need to renew after the wedding dates pass; it's fine to let it
   lapse.

## Workflow Notes
- Repo has been developed across both Antigravity and zcode/GLM at
  different points — always check recent git log/commits at the start of
  a session to see what changed most recently, rather than assuming
  either tool's own memory is current.
- Make non-trivial changes on a feature branch, verify against the actual
  live production URL (not just localhost) before merging to `main`, then
  deploy to Vercel production.
