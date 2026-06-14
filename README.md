# BirQala

**BirQala** (meaning "One City" / "Common City" in Kazakh) is a mobile-first social platform for reporting, tracking, and resolving urban infrastructure problems in Astana, Kazakhstan.

This project is built using a modern mobile-first design system inspired by Google's Material You aesthetic, prioritizing simplicity, micro-animations, and visual clarity.

---

## Live Demo

The project is live and deployed at: [https://birqala.vercel.app/](https://birqala.vercel.app/)

---

## Features

- **Interactive Astana Map**: Built using Leaflet and React-Leaflet with CartoDB Voyager tiles.
- **Dynamic Pin Mechanics**: Custom teardrop map pins that dynamically scale and transition in color from golden yellow (few upvotes) to red (many upvotes) depending on issue severity.
- **Marker Clustering**: Groups nearby issues into cluster markers with dynamic sizing and counts, automatically ungrouping and spiderfying when zooming in close (up to level 18) or selecting a post.
- **Watermark Overlay**: Displays a subtle "BirQala" watermark on the map page.
- **Floating Details Card**: Sleek rounded preview cards that hover above the bottom island navigation showing a quick preview of the reported issue.
- **Full Report Panel**: Expandable full-screen overlay details with an interactive comment viewer and smooth scrolling transitions.
- **Swipe-to-Create Nav**: A unique slide-to-unlock gesture bar for reporting issues, integrated directly into the bottom floating island navigation.
- **Robinhood-style Success Animation**: Displays a premium success overlay with scale-in animations and a canvas particle confetti explosion upon successful post creation.
- **Responsive City Feed**: Scrollable list view of all issues with real-time text and tag search, dynamic sorting (Top, Recent, Relevance), and a responsive layout that scales from a single column on mobile to a 4-column grid on desktop screens.
- **Floating Settings Menu**: A centered floating popover settings card on the Profile tab that allows users to edit their Full Name and Username, automatically generating dynamic avatar initials.
- **Profile Stats & History**: Profile page showing active citizen level, rank, XP progress bar, statistics dashboard, and a color-coded visual timeline of recent activity.

---

## Tech Stack

- **Framework**: Next.js (App Router, JavaScript)
- **Styling**: Vanilla CSS (Modular CSS)
- **Map Engine**: Leaflet & React-Leaflet
- **Marker Grouping**: React Leaflet Cluster
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1. Navigate to the app directory:
   ```bash
   cd birqala-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser (preferably in mobile simulation mode).
