const GRID_COLS = 220;
const GRID_ROWS = 110;

function lonToGridX(lon) { return ((lon + 180) / 360) * GRID_COLS; }
function latToGridY(lat) { return ((90 - lat) / 180) * GRID_ROWS; }

function buildLandGrid() {
  const grid = [];
  for (let y = 0; y < GRID_ROWS; y++) {
    grid.push(new Array(GRID_COLS).fill(false));
  }

  function fillBox(lonMin, lonMax, latMin, latMax) {
    const x0 = Math.max(0, Math.floor(lonToGridX(lonMin)));
    const x1 = Math.min(GRID_COLS, Math.ceil(lonToGridX(lonMax)));
    const y0 = Math.max(0, Math.floor(latToGridY(latMax)));
    const y1 = Math.min(GRID_ROWS, Math.ceil(latToGridY(latMin)));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) grid[y][x] = true;
    }
  }

  function clearBox(lonMin, lonMax, latMin, latMax) {
    const x0 = Math.max(0, Math.floor(lonToGridX(lonMin)));
    const x1 = Math.min(GRID_COLS, Math.ceil(lonToGridX(lonMax)));
    const y0 = Math.max(0, Math.floor(latToGridY(latMax)));
    const y1 = Math.min(GRID_ROWS, Math.ceil(latToGridY(latMin)));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) grid[y][x] = false;
    }
  }

  // North America
  fillBox(-168, -141, 54, 71);    // Alaska
  fillBox(-141, -60, 49, 70);     // Canada
  fillBox(-125, -67, 30, 49);     // Contiguous US
  fillBox(-117, -86, 14, 32);     // Mexico
  fillBox(-92, -77, 8, 18);       // Central America
  fillBox(-84, -78, 23, 31);      // Florida
  fillBox(-79, -76, 23, 27);      // Bahamas-ish
  fillBox(-78, -68, 17, 23);      // Cuba/Hispaniola band

  // South America
  fillBox(-79, -35, -10, 12);     // North (Colombia, Venezuela, Guyana)
  fillBox(-75, -35, -23, -10);    // Brazil + Peru/Bolivia
  fillBox(-72, -38, -33, -23);    // South Brazil/Paraguay/N. Argentina
  fillBox(-73, -55, -45, -33);    // Argentina/Chile mid
  fillBox(-74, -65, -55, -45);    // Patagonia tapering

  // Europe (mainland)
  fillBox(-10, 30, 36, 50);
  fillBox(0, 32, 45, 55);
  fillBox(4, 32, 50, 60);
  fillBox(5, 32, 55, 71);         // Scandinavia
  fillBox(20, 41, 55, 70);
  fillBox(-10, 2, 50, 59);        // Britain
  fillBox(-11, -5, 51, 56);       // Ireland
  fillBox(-10, 4, 36, 44);        // Iberia
  fillBox(6, 19, 36, 47);         // Italy / central
  fillBox(19, 30, 35, 42);        // Balkans / Greece

  // Africa
  fillBox(-18, 51, 5, 37);        // North Africa + Sahel
  fillBox(-18, 12, -5, 15);       // West Africa
  fillBox(10, 42, -5, 15);        // Central Africa
  fillBox(12, 42, -18, -5);       // Southern bulge
  fillBox(14, 36, -35, -18);      // South Africa
  fillBox(43, 50, -26, -12);      // Madagascar

  // Middle East
  fillBox(32, 60, 12, 42);
  fillBox(34, 56, 18, 32);        // Arabian peninsula
  fillBox(43, 56, 12, 22);        // Yemen/Oman

  // Russia / North Asia
  fillBox(30, 180, 50, 78);
  fillBox(60, 180, 45, 78);

  // China + Central Asia
  fillBox(73, 135, 22, 53);
  fillBox(46, 87, 35, 55);        // Kazakhstan/Central Asia

  // Southeast Asia mainland
  fillBox(92, 110, 8, 28);
  fillBox(95, 108, 5, 22);

  // Indonesia / Malaysia
  fillBox(95, 119, -6, 6);
  fillBox(99, 105, -6, 2);        // Sumatra
  fillBox(105, 116, -9, -5);      // Java
  fillBox(109, 120, -4, 5);       // Borneo
  fillBox(118, 126, -5, 2);       // Sulawesi
  fillBox(127, 142, -9, 0);       // West Papua / Maluku

  // Philippines
  fillBox(117, 127, 5, 19);

  // Papua New Guinea
  fillBox(140, 152, -11, -1);

  // Japan
  fillBox(130, 146, 30, 46);
  fillBox(140, 146, 40, 46);      // Hokkaido

  // Korea
  fillBox(124, 131, 33, 43);

  // Australia
  fillBox(113, 153, -39, -11);
  fillBox(144, 149, -44, -39);    // Tasmania

  // New Zealand
  fillBox(165, 179, -47, -34);

  // Greenland
  fillBox(-55, -15, 60, 84);

  // Iceland
  fillBox(-25, -13, 63, 67);

  // India subcontinent (explicit detailed geometry)
  fillBox(60, 75, 23, 37);        // Pakistan + Afghanistan border
  fillBox(68, 97, 22, 37);        // North India, Nepal, Bangladesh, Bhutan
  fillBox(70, 92, 18, 23);        // Central India
  fillBox(73, 88, 13, 18);        // Deccan
  fillBox(75, 81, 8, 13);         // Southern peninsula
  fillBox(79, 82, 6, 10);         // Sri Lanka

  // Carve Arabian Sea (west of India coast)
  clearBox(60, 68, 8, 23);
  // Carve Bay of Bengal (east of India coast)
  clearBox(85, 92, 8, 18);
  clearBox(88, 92, 12, 20);

  // Antarctica
  for (let y = 0; y < GRID_ROWS; y++) {
    const lat = 90 - (y + 0.5) * (180 / GRID_ROWS);
    if (lat < -63) {
      for (let x = 0; x < GRID_COLS; x++) grid[y][x] = true;
    }
  }

  return grid;
}

const LOCATIONS = [
  {
    city: 'Tokyo', country: 'Japan',
    lat: 35.6, lon: 139.7,
    tag: 'manipulation',
    date: '2024.03',
    visited: false,
    body: 'Two weeks with a dexterous manipulation lab in Bunkyō. Notes on under-actuated grippers, the quiet humility of Japanese research culture, and late nights of soldering fueled by 7-Eleven onigiri.'
  },
  {
    city: 'Nairobi', country: 'Kenya',
    lat: -1.3, lon: 36.8,
    tag: 'field robotics',
    date: '2024.05',
    visited: false,
    body: 'Field deployment with an agricultural robotics startup outside Karen. Dust in every connector, GPS drift under acacia canopy, and the most patient farmers I have ever worked with.'
  },
  {
    city: 'Lisbon', country: 'Portugal',
    lat: 38.7, lon: -9.1,
    tag: 'marine robotics',
    date: '2024.07',
    visited: false,
    body: 'AUV trials in the Tagus estuary with a marine robotics group. Current-correction debugging until 2am, then pastel de nata for breakfast. A surprising amount of robotics is just patience.'
  },
  {
    city: 'Bangalore', country: 'India',
    lat: 12.9, lon: 77.6,
    tag: 'perception',
    date: '2024.09',
    visited: false,
    body: 'Home stretch. Computer vision pipelines through monsoon outages, and reconnecting with the robotics community that first taught me to break things on purpose.'
  },
  {
    city: 'Reykjavik', country: 'Iceland',
    lat: 64.1, lon: -21.9,
    tag: 'extreme environments',
    date: '2024.11',
    visited: false,
    body: 'Cold-weather testing for a polar exploration platform. Lessons in battery chemistry, lubricant viscosity, and how silence at -15°C changes the way you think about failure modes.'
  },
  {
    city: 'São Paulo', country: 'Brazil',
    lat: -23.5, lon: -46.6,
    tag: 'swarm',
    date: '2025.01',
    visited: false,
    body: 'Multi-agent coordination workshop at USP. A diagram drawn on a café napkin ended up as Figure 3 in a paper draft three months later — sometimes the best whiteboards are made of paper.'
  },
  {
    city: 'Seoul', country: 'South Korea',
    lat: 37.5, lon: 127.0,
    tag: 'HRI',
    date: '2025.04',
    visited: false,
    body: 'Human-robot interaction studies on a campus in Gwanak. The way participants greeted the robot before greeting me told me more about social robotics than the data ever did.'
  },
  {
    city: 'London', country: 'UK',
    lat: 51.5, lon: -0.1,
    tag: 'base',
    date: '2025 — present',
    visited: true,
    body: 'Home base. MRes Design Engineering at Imperial College. Where the maps get drawn, the writing gets done, and the bags get repacked for the next trip.'
  }
];
