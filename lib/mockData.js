export const mockPosts = [
  {
    id: 1,
    username: "Aigerim_K",
    avatar: "AK",
    text: "Broken streetlight near Baiterek Tower. This area is completely dark at night, making it dangerous for pedestrians. Several people have already tripped. The light pole appears to be damaged from a recent storm. Municipal services need to address this urgently before someone gets seriously hurt.",
    tags: ["streetlight", "safety", "urgent"],
    severity: "high",
    upvotes: 145,
    lat: 51.1282,
    lng: 71.4306,
    image: "/images/post-1.jpg",
    status: "in progress",
    createdAt: "2026-06-09T14:30:00Z",
    comments: [
      {
        username: "Marat_D",
        text: "I confirmed this yesterday. It's been dark here for weeks.",
        createdAt: "2026-06-09T16:00:00Z",
      },
      {
        username: "Dana_S",
        text: "Very dangerous at night, especially near the crosswalk.",
        createdAt: "2026-06-10T09:15:00Z",
      },
    ],
  },
  {
    id: 2,
    username: "Talgat_M",
    avatar: "TM",
    text: "Overflowing trash bins outside Khan Shatyr. The garbage hasn't been collected for days and the smell is unbearable. Stray dogs are tearing through the bags and spreading waste everywhere. This is a health hazard and an embarrassment for such a landmark area.",
    tags: ["trash", "sanitation"],
    severity: "high",
    upvotes: 87,
    lat: 51.1325,
    lng: 71.4039,
    image: "/images/post-2.jpg",
    status: "accepted by service",
    createdAt: "2026-06-08T10:00:00Z",
    comments: [
      {
        username: "Zhanna_B",
        text: "Same problem last month. They need more bins here.",
        createdAt: "2026-06-08T12:30:00Z",
      },
    ],
  },
  {
    id: 3,
    username: "Saule_N",
    avatar: "SN",
    text: "Damaged sidewalk tiles on Turan Avenue near the Expo area. Large cracks and missing tiles creating a tripping hazard. Wheelchair users cannot pass through this section safely.",
    tags: ["sidewalk", "accessibility"],
    severity: "medium",
    upvotes: 34,
    lat: 51.0905,
    lng: 71.4164,
    image: "/images/post-3.jpg",
    status: null,
    createdAt: "2026-06-10T08:45:00Z",
    comments: [],
  },
  {
    id: 4,
    username: "Ruslan_A",
    avatar: "RA",
    text: "Graffiti vandalism on residential building facade on Kabanbay Batyr Avenue. Appeared overnight. The building management hasn't taken any action yet.",
    tags: ["graffiti", "vandalism"],
    severity: "low",
    upvotes: 12,
    lat: 51.1448,
    lng: 71.47,
    image: "/images/post-4.jpg",
    status: null,
    createdAt: "2026-06-11T06:20:00Z",
    comments: [],
  },
  {
    id: 5,
    username: "Asel_Z",
    avatar: "AZ",
    text: "Deep pothole on Kenesary Street near the old city center. Already caused damage to at least two cars this week according to neighbors.",
    tags: ["pothole", "road damage"],
    severity: "medium",
    upvotes: 2,
    lat: 51.1605,
    lng: 71.4381,
    image: "/images/post-5.jpg",
    status: null,
    createdAt: "2026-06-11T07:00:00Z",
    comments: [],
  },
  {
    id: 6,
    username: "Nurlan_T",
    avatar: "NT",
    text: "Broken bench in the park near Baiterek. Someone vandalized it last night.",
    tags: ["vandalism", "park"],
    severity: "low",
    upvotes: 45,
    lat: 51.1288,
    lng: 71.4312,
    image: "/images/test_placeholder.png",
    status: null,
    createdAt: "2026-06-12T09:00:00Z",
    comments: [],
  },
  {
    id: 7,
    username: "Aigerim_K",
    avatar: "AK",
    text: "Flickering streetlight on the pedestrian path.",
    tags: ["streetlight", "safety"],
    severity: "medium",
    upvotes: 12,
    lat: 51.1275,
    lng: 71.4290,
    image: "/images/test_placeholder.png",
    status: null,
    createdAt: "2026-06-12T10:15:00Z",
    comments: [],
  },
  {
    id: 8,
    username: "Timur_B",
    avatar: "TB",
    text: "Graffiti on the signpost near the water fountain.",
    tags: ["graffiti", "vandalism"],
    severity: "low",
    upvotes: 4,
    lat: 51.1290,
    lng: 71.4320,
    image: "/images/test_placeholder.png",
    status: null,
    createdAt: "2026-06-12T11:30:00Z",
    comments: [],
  },
  {
    id: 9,
    username: "Diana_M",
    avatar: "DM",
    text: "Puddles forming near the mall entrance due to clogged drainage.",
    tags: ["drainage", "water"],
    severity: "medium",
    upvotes: 18,
    lat: 51.1330,
    lng: 71.4020,
    image: "/images/test_placeholder.png",
    status: null,
    createdAt: "2026-06-13T08:00:00Z",
    comments: [],
  },
  {
    id: 10,
    username: "Almas_S",
    avatar: "AS",
    text: "Missing paving stones on the sidewalk approach to the parking lot.",
    tags: ["sidewalk", "accessibility"],
    severity: "medium",
    upvotes: 2,
    lat: 51.1310,
    lng: 71.4050,
    image: "/images/test_placeholder.png",
    status: null,
    createdAt: "2026-06-13T09:45:00Z",
    comments: [],
  },
];

export const mockUser = {
  username: "Urban_Hero_01",
  avatar: "UH",
  fullName: "Alibek N.",
  xp: 430,
  level: "Active Citizen",
  rank: 8,
  stats: {
    postsCreated: 12,
    verifications: 34,
    resolvedIssues: 5,
  },
  history: [
    { id: 101, type: "resolved", date: "2026-06-13T10:00:00Z", title: "Trash cleared outside Khan Shatyr", xpDelta: 50 },
    { id: 102, type: "verification", date: "2026-06-12T15:30:00Z", title: "Confirmed pothole on Kenesary", xpDelta: 5 },
    { id: 103, type: "post", date: "2026-06-11T14:20:00Z", title: "Reported damaged sidewalk tiles", xpDelta: 10 },
    { id: 104, type: "verification", date: "2026-06-10T09:15:00Z", title: "Disputed false graffiti report", xpDelta: 5 },
    { id: 105, type: "resolved", date: "2026-06-08T11:00:00Z", title: "Streetlight repaired near Baiterek", xpDelta: 50 },
  ]
};

/* ── Helpers ───────────────────────────────────────────────── */

/**
 * Maps an upvote count to a colour on the yellow -> orange -> red spectrum.
 * 0 upvotes   -> true warm yellow (HSL 48°, fully saturated)
 * 150+ upvotes -> deep red        (HSL 0°)
 */
export function getUpvoteColor(upvotes) {
  const maxUpvotes = 150;
  const ratio = Math.min(upvotes / maxUpvotes, 1);

  const hue = 48 - ratio * 48;   // 48 -> 0  (warm yellow -> red)
  const saturation = 100;         // always fully saturated — no washed-out tones
  const lightness = 50 - ratio * 8; // 50% -> 42%  (slightly deepen toward red)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Pin diameter in px — grows with upvotes.
 */
export function getPinSize(upvotes) {
  const minSize = 30;
  const maxSize = 50;
  const maxUpvotes = 150;
  const ratio = Math.min(upvotes / maxUpvotes, 1);
  return minSize + ratio * (maxSize - minSize);
}

/**
 * Human-readable relative timestamp.
 */
export function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "just now";
}
