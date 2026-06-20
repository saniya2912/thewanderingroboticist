/* ──────────────────────────────────────────────────────────────────────────
   data.js — SINGLE SOURCE OF TRUTH for all content.

   The map, the per-place pages, and the journal/projects feeds all read from
   this one array, so nothing ever goes out of sync.

   To document a new place: add an object to PLACES.
   To add an entry: push to that place's `journal` or `projects` array.

   A place is automatically marked "visited" on the map once it has at least
   one journal entry or project (see isVisited() below) — no manual flag.

   Entry shape (journal):
     { slug, title, date: 'YYYY-MM' or 'YYYY-MM-DD', body }
   Project shape:
     { slug, title, tags: [..], blurb, body, link? }
   `body` may contain plain text; blank lines become paragraphs.
   ────────────────────────────────────────────────────────────────────────── */

const PLACES = [
  {
    slug: 'seattle',
    city: 'Seattle', country: 'USA', lat: 47.6, lon: -122.3,
    summary: '',
    journal: [],
    projects: []
  },
  {
    slug: 'london',
    city: 'London', country: 'UK', lat: 51.5, lon: -0.1,
    summary: 'Where the wandering started — first stint working on field robotics.',
    journal: [
      {
        slug: 'arriving-in-london',
        title: 'Arriving in London',
        date: '2025-01',
        body: `This is a sample journal entry so you can see the shape of a place page.

Replace this text with your own writing. Leave a blank line between paragraphs and they'll render as separate paragraphs.`
      }
    ],
    projects: [
      {
        slug: 'sensor-fusion-rig',
        title: 'Sensor-fusion test rig',
        tags: ['ROS2', 'LiDAR', 'C++'],
        blurb: 'A bench rig for fusing LiDAR + IMU on a mobile base.',
        body: `Sample project. Describe what you built, the stack you used, and what you learned.`,
        link: ''
      }
    ]
  },
  {
    slug: 'dublin',
    city: 'Dublin', country: 'Ireland', lat: 53.3, lon: -6.3,
    summary: '',
    journal: [],
    projects: []
  },
  {
    slug: 'mumbai',
    city: 'Mumbai', country: 'India', lat: 19.1, lon: 72.9,
    summary: '',
    journal: [],
    projects: []
  },
  {
    slug: 'delhi',
    city: 'Delhi', country: 'India', lat: 28.6, lon: 77.2,
    summary: '',
    journal: [],
    projects: []
  },
  {
    slug: 'pune',
    city: 'Pune', country: 'India', lat: 18.5, lon: 73.9,
    summary: 'Manipulation research — the most hands-on lab time so far.',
    journal: [
      {
        slug: 'first-week-in-the-lab',
        title: 'First week in the lab',
        date: '2025-03',
        body: `Another sample entry, on a different place.

The journal feed shows entries from every place newest-first; this one and the London one will both appear there, each tagged with where it happened.`
      }
    ],
    projects: [
      {
        slug: 'dexterous-grasping',
        title: 'Dexterous grasping pipeline',
        tags: ['Manipulation', 'Python', 'PyTorch'],
        blurb: 'Vision-to-grasp pipeline for a multi-finger hand.',
        body: `Sample project at Pune. Use the projects feed to show all your work as a portfolio.`,
        link: ''
      }
    ]
  },
  {
    slug: 'gandhinagar',
    city: 'Gandhinagar', country: 'India', lat: 23.2, lon: 72.7,
    summary: '',
    journal: [],
    projects: []
  },
  {
    slug: 'singapore',
    city: 'Singapore', country: 'Singapore', lat: 1.3, lon: 103.8,
    summary: '',
    journal: [],
    projects: []
  }
];

/* ── Accessors (used by map.js, place.js, feed.js) ─────────────────────────── */

function getPlace(slug) {
  return PLACES.find(p => p.slug === slug);
}

function placeItemCount(p) {
  return (p.journal ? p.journal.length : 0) + (p.projects ? p.projects.length : 0);
}

// A place counts as "visited" once anything has been documented there.
function isVisited(p) {
  return placeItemCount(p) > 0;
}

// All journal entries across every place, each carrying a `place` ref, newest first.
function allJournal() {
  return PLACES
    .flatMap(p => (p.journal || []).map(e => ({ ...e, place: p })))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// All projects across every place, each carrying a `place` ref.
function allProjects() {
  return PLACES.flatMap(p => (p.projects || []).map(e => ({ ...e, place: p })));
}
