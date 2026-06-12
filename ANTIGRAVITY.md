# Antigravity Status and Walkthrough Document

This document tracks Antigravity's progress, changes made, and current status of the BirQala project. Updated after every session.

---

## Stage 1 — Working Map and Interface Design (Completed)

### Project Setup
- Initialized Next.js (App Router, JavaScript) project inside `birqala-app/`
- Installed dependencies: `leaflet`, `react-leaflet`, `lucide-react`
- Connected to GitHub repository: [poizonfeed/birqala-app](https://github.com/poizonfeed/birqala-app)

### Design System — [globals.css](app/globals.css)
- Material You theme: dark green primary (`#2E7D32`), pastel surfaces, warm outline tones
- CSS variables for shadows, radius, and transitions using Material's standard easing curve
- Leaflet control overrides to match the overall aesthetic

### Mock Data — [mockData.js](lib/mockData.js)
- 5 realistic urban issues across Astana (broken streetlight, overflowing trash, damaged sidewalk, graffiti, pothole)
- Upvote counts range 2–145 to demonstrate the full yellow-to-red color spectrum
- Helper functions: `getUpvoteColor()`, `getPinSize()`, `formatTimeAgo()`

### Components

| Component | File | Description |
| :--- | :--- | :--- |
| AppShell | [AppShell.js](components/AppShell.js) | Client-side root, manages selected post, detail modal, active tab state |
| Map | [Map.js](components/Map/Map.js) | Leaflet map centered on Astana, teardrop SVG pins (yellow to red), CartoDB Voyager tiles (free) |
| FloatingNav | [FloatingNav.js](components/FloatingNav/FloatingNav.js) | Bottom island nav with Map/Feed/Profile tabs and swipe-to-create gesture |
| PostCard | [PostCard.js](components/PostCard/PostCard.js) | Floating rounded preview card that appears above the island when a pin is tapped |
| PostDetail | [PostDetail.js](components/PostDetail/PostDetail.js) | Floating rounded full-post panel with comments, blurred map visible behind it |

### Assets
- 5 AI-generated photos in `public/images/post-{1-5}.jpg`

---

## UI Fixes and Refinements (Post Stage 1)

### Swipe-to-create gesture fixes
- "Slide to create" text was invisible (light on light). Fixed by wrapping it in a dark frosted-glass pill.
- "Post Created!" was obscured by nav buttons bleeding through. Fixed by raising swipe hint to `z-index: 10` and fading nav buttons to `opacity: 0` on completion with a 250ms transition.
- Post Created text drops the dark pill and renders directly as clean white on the green overlay, with a scale-in animation.

### Floating panel redesign
- PostCard and PostDetail were bottom sheets attached to the screen edge — now they are fully rounded floating cards that hover above the island.
- The overlay uses `padding-bottom: 104px` to push cards clear of the island. The island (`z-index: 1000`) always floats on top.
- PostDetail overlay applies `backdrop-filter: blur(8px)` so the map is visible and blurred behind the panel.
- Tapping the blurred area outside PostDetail dismisses it.
- z-index hierarchy: Map (base) < PostCard overlay (500) < PostDetail overlay (600) < FloatingNav (1000).
- Viewport Locking: Added `overflow: hidden` on the overlays and `overflow-x: hidden` on the `PostDetail` scrollable container to completely eliminate horizontal viewport shift and rubber-banding wobble on desktop and mobile browsers.
- Sticky Rounded Header: Refactored the `PostDetail` header to be sticky (`position: sticky; top: 0; z-index: 20;`) with a solid background and a bottom border-radius (`var(--radius-xl)`). Removed top padding from `.scrollArea` and set `margin-top: 0` on the sticky header to remove excessive layout gaps and prevent the post picture from peaking out above/behind the header before scrolling. This keeps the user section visible at all times, and ensures the post picture maintains its rounded corners visually as it slides under the header.



### Selected Pin & Map Interaction
- Tap/click on a marker highlights it: it grows 22% larger, gains a matching color ring, and gets a higher z-index to stand above surrounding markers.
- Tapping a bare area on the map closes the active PostCard.

### True Yellow Color Fix & Pin Legibility
- Shifted the lowest upvote color from HSL 60° (greenish-yellow) to HSL 48° (vibrant, warm golden yellow) to prevent the pins and confirmation text from blending into the light map background, while retaining the original solid-color teardrop body.
- Increased the font size of the numbers inside the marker pins by ~25% (from 28% of size to 35% of size, min 12px) to better fill the spacious center of the teardrop.
- Adjusted the number alignment using an absolute `inset: 0` flex container inside the pin, resolving off-centering layout bugs caused by rotated inline spans.
- Applied a vertical offset of `margin-top: -3px` inside the un-rotated inner container to visually align the text directly in the center of the teardrop's rounded bubble.

### Comments Features
- Added a `MessageCircle` comments icon in `PostCard` to the left of the upvote counter. It displays the comment count, is unclickable, and dims to `0.35` opacity if there are no comments.
- Added a `commentsBtn` in `PostDetail` next to the confirmations container. It is a fully styled button (with hover scale and click feedback) showing the total comments, and clicking it smoothly scrolls down to the comments section via React refs.

---

## Rules and Conventions

- No emojis anywhere in code or markdown files.
- No AI attribution in git commit messages.
- All commits go to `birqala-app/` only, not the parent `BirQala/` directory.
- Design style: Material You, dark green primary, pastel, rounded, mobile-first.
- No paid APIs or services — map tiles use free CartoDB Voyager.

---

## Validation

- `npm run build` passes with zero errors.
- Dev server runs at http://localhost:3000.
- Repository: [poizonfeed/birqala-app](https://github.com/poizonfeed/birqala-app)

---

## Up Next — Stage 2: Feed and Posts Logic

- Feed page showing all posts with search bar and sort controls (top / recent / relevance)
- Post creation flow (triggered by the swipe-to-create gesture)
- Make the Feed and Profile nav tabs functional
