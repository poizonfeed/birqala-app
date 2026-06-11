# BirQala (Bir Qala)

**BirQala** (meaning "One City" / "Common City" in Kazakh) is a mobile-first social platform for reporting, tracking, and resolving urban infrastructure problems in Astana, Kazakhstan.

This project is built using a modern mobile-first design system inspired by Google's Material You aesthetic, prioritizing simplicity, micro-animations, and visual clarity.

## Live Demo

The project is live and deployed at: [https://birqala.vercel.app/](https://birqala.vercel.app/)

---

## Features (Stage 1)

- **Interactive Astana Map**: Built using Leaflet and React-Leaflet with CartoDB Voyager tiles (completely free and open-source).
- **Dynamic Pin Mechanics**: Custom teardrop map pins that dynamically scale and transition in color from yellow (few upvotes) to red (many upvotes) depending on issue severity.
- **Bottom-Sheet Preview**: Sleek cards that slide up from the bottom showing a quick preview of the reported issue.
- **Full Report Details**: Expandable full-screen overlay details with a dedicated comments section.
- **Swipe-to-Create Nav**: A unique, slide-to-unlock gesture bar for reporting issues, integrated directly into the bottom floating island navigation.

---

## Tech Stack

- **Framework**: Next.js (App Router, JavaScript)
- **Styling**: Vanilla CSS (Modular CSS)
- **Map Engine**: Leaflet & React-Leaflet
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
