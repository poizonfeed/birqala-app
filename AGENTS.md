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
- Added a `commentsBtn` in `PostDetail` next to the upvotes indicator. It is a fully styled button (with hover scale and click feedback) showing the total comments, and clicking it smoothly scrolls down to the comments section via React refs.
- Removed the word "confirmations" from the upvotes display in `PostDetail.js` to simplify the layout.

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

## Stage 2 — Feed and Posts Logic (Completed)

### Routing & Tab Navigation
- `AppShell` now manages views conditionally (`map`, `feed`, `profile`).
- `FloatingNav` is now fully functional, toggling views while maintaining the swipe-to-create gesture logic.

### Feed Component
- Built a scrollable list view (`Feed.js`) displaying all posts in `mockData.js`.
- Implemented real-time search functionality by post text and tags.
- Added dynamic sorting controls for "Top" (by upvotes), "Recent" (by timestamp), and "Relevance" (a simulated score combining time and upvotes).
- Removed the "City Feed" header title from the layout to make the interface cleaner and maximize content space.

### Post Creation Flow
- Replaced the temporary "Post Created!" state on the swipe gesture with a callback to trigger a full-screen `CreatePost` overlay.
- Built a simulated form to enter descriptions, pick issue tags, and "take a photo".
- Includes mock submission logic that adds a new local post object to the `AppShell`'s state and switches the user automatically to the Feed tab to see their new post.

### Profile Placeholder
- Added a simple `Profile.js` placeholder component to handle the routing state before full implementation.

### UI Fixes and Refinements (Post Stage 2)

#### Telegram-style Frosted Glass Bottom Panel
- Added a rounded translucent blur panel at the bottom of the screen (`height: 96px`, `backdrop-filter: blur(20px)`, `border-radius: var(--radius-xl) var(--radius-xl) 0 0`) that renders on all tabs except the Map, creating a smooth transition as list elements scroll behind it. Fully optimized for iOS Safari by avoiding `mask-image` render conflicts.

#### Tab Change Auto-Close
- Clicking any button on the floating navigation menu now automatically closes open post detail dialogs or preview cards, resetting focus to the selected tab.

#### Centering Offset Panning
- Tapping "Tap to view on map" or clicking a pin on the map now uses a dynamic screen-size-aware offset to pan the map, centering the selected pin marker tip exactly `55px` above the top of the post card (with viewport clamping to ensure it stays on screen), keeping visual focus compact and close to the card itself on both desktop and mobile viewports.

#### Feed Scroll Padding
- Replaced empty spacer `div` with a robust `padding-bottom: 120px` in `Feed.module.css` to prevent list elements from being cut off by the navigation bar.

#### Feed Card Design Polish
- Replaced the `+` character with the `ArrowUp` icon and aligned layout.
- Styled Feed user avatars to use the system `primary-container` and `on-primary-container` theme colors, keeping them consistent with other sections.

#### Feed Scroll Position Preservation
- Updated `AppShell.js` to render the `Feed` component unconditionally, using a new `visible` prop to toggle its styling (`display: flex` or `display: none`) instead of mounting/unmounting it. This allows the browser to natively preserve the DOM state and scroll position of the feed list when the user switches to the Map and back.

#### Feed Sort Click Auto-Scroll-to-Top
- Integrated a `useRef` on the scrollable Feed list container and created a custom `handleSortClick` handler in `Feed.js`. Tapping on any of the sorting buttons ("Top", "Recent", "Relevance") will now automatically scroll the feed list smoothly back to the beginning, even if the clicked sort mode is already active.

#### Robinhood-style Success Animation
- Created `PostSuccess.js` and `PostSuccess.module.css` inside `components/CreatePost/` representing a premium full-screen success overlay.
- Features a custom high-performance HTML5 canvas particle confetti explosion and a spring scale-in transition for the checkmark.
- Integrates into the `AppShell.js` post submission workflow, displaying the animation for 3.2 seconds upon successfully creating a post and avoiding automatic redirection to the Feed tab so that the user stays within their active map/context tab.

---

## Stage 3 — Profile Page (Completed)

### Mock Data
- Added `mockUser` object to `lib/mockData.js` representing the current user's profile information.
- Includes username, avatar, level ("Active Citizen"), rank, XP, stats (posts, verifications, resolved issues), and an activity history timeline array.

### Profile Component
- Implemented `Profile.js` and `Profile.module.css` following the Material You design system.
- Conditionally rendered via `display: none` / `flex` in `AppShell` (using the `visible` prop) to preserve the scroll position.
- **Header Section:** Displays avatar, user info, level badge, and weekly rank badge (highlighted in orange).
- **XP Section:** Visually prominent XP counter with a progress bar to the next level.
- **Stats Row:** Three grid-aligned boxes for quick metrics (Posts, Verified, Resolved).
- **Recent Activity:** A scrollable timeline list mapping over `mockUser.history`. Different activity types (resolved, verification, post) use unique pastel-colored icon wrappers for visual clarity.
- Ensured the component has `padding-bottom: 120px` so content isn't obscured by the Floating Nav.

---

## UI Fixes, Refinements, and Layout Polish (Post Stage 3)

### Map Marker Clustering & Zoom Focus
- Integrated react-leaflet-cluster in Map.js to group nearby posts dynamically when zoomed out.
- Styled custom cluster icons following Material You design, with dynamic sizing based on the number of grouped markers.
- Increased the target zoom level to 18 (the maximum street-level zoom) in the FocusSelectedPin component when a post is focused from the feed or map. This automatically unclusters nearby pins and triggers spiderfying for posts sharing the exact same coordinates.
- Added a semi-transparent "BirQala" watermark overlay in the top-left corner of the map.

### Responsive Feed Layout
- Converted the single-column feed list into a responsive CSS grid layout:
  - Mobile: 1 column.
  - Tablet/Small Desktop: 2 columns.
  - Desktop: 3 columns.
  - Large Desktop: 4 columns max (centered container with 1600px max-width).
- Aligned the search bar and sorting filter tabs side-by-side on desktop viewports to save vertical space.
- Fixed layout squishing on mobile (cards looking like pills) and card overlapping on desktop by removing overflow: hidden from postCard (restoring natural min-height: auto rendering) and adding flex-shrink: 0.

### Placeholder Image & Requirement Sync
- Generated a clean modern placeholder image with the text "TEST" at test_placeholder.png.
- Assigned the test placeholder image to all mock posts (ID 6-10) that previously lacked images, ensuring every post has an image.
- Updated the post creation flow (CreatePost.js) to display the "TEST" placeholder image as pre-uploaded by default, passing it along when submitting a new post.

### Floating Settings Menu
- Moved user profile state (currentUser) to AppShell.js to enable dynamic name and avatar synchronization between the Profile tab and the post creation workflow.
- Implemented a floating settings card menu centered on the screen with a blurred backdrop overlay, toggled by the Settings gear icon on the Profile tab.
- Users can edit their Full Name and Username inside the card. Saving changes dynamically updates the profile details and generates new initials for the user avatar.

### Default Profile & Stats Setup
- Set default mock user's name and username to "test" and "@test" respectively.
- Cleared all fake default user stats (postsCreated, verifications, resolvedIssues), XP, and history.
- Dynamic Post-Increment: Configured post submission handler in AppShell.js to dynamically increment the user's postsCreated count, award 10 XP, recalculate citizen level, and append a corresponding activity to their history timeline.
- Clean Rank Badge Display: Adjusted the rank badge on the Profile tab to display "Unranked this week" if the user has no rank or a rank value of "-".

---

## Up Next — Stage 4: Geolocation and Post Creation

- Geolocation support to determine user's current coordinates.
- Camera and photo support for creating a post in the Create Post flow.

