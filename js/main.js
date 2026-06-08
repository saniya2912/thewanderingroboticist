const PX = 3;
const GAP = 1;
const CELL = PX + GAP;

const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
canvas.width = GRID_COLS * CELL;
canvas.height = GRID_ROWS * CELL;

const land = buildLandGrid();

function isIndiaCell(lon, lat) {
  return lon > 68 && lon < 97.5 && lat > 7 && lat < 37;
}

function drawMap() {
  ctx.fillStyle = '#9bbdd4';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let lon = -150; lon <= 150; lon += 30) {
    const x = Math.floor(lonToGridX(lon) * CELL) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = Math.floor(latToGridY(lat) * CELL) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (!land[y][x]) continue;
      const lon = (x + 0.5) * (360 / GRID_COLS) - 180;
      const lat = 90 - (y + 0.5) * (180 / GRID_ROWS);
      const dither = (x + y) % 2 === 0;
      let color;
      if (isIndiaCell(lon, lat)) {
        color = dither ? '#d4956a' : '#c8825a';
      } else {
        color = dither ? '#c8b888' : '#bfae7c';
      }
      ctx.fillStyle = color;
      ctx.fillRect(x * CELL, y * CELL, PX, PX);
    }
  }
}

drawMap();

const pinsLayer = document.getElementById('pins');
const counterEl = document.getElementById('counter');

function updateCounter() {
  const v = LOCATIONS.filter(l => l.visited).length;
  counterEl.textContent = `${v} / ${LOCATIONS.length} visited`;
}

function buildPins() {
  pinsLayer.innerHTML = '';
  LOCATIONS.forEach((loc, i) => {
    const pin = document.createElement('button');
    pin.className = 'pin' + (loc.visited ? ' visited' : '');
    pin.style.left = (((loc.lon + 180) / 360) * 100) + '%';
    pin.style.top = (((90 - loc.lat) / 180) * 100) + '%';
    pin.setAttribute('aria-label', `${loc.city}, ${loc.country}`);
    pin.title = `${loc.city}, ${loc.country}`;
    pin.addEventListener('click', () => {
      LOCATIONS[i].visited = true;
      pin.classList.add('visited');
      openStory(loc);
      updateCounter();
    });
    pinsLayer.appendChild(pin);
  });
}

buildPins();
updateCounter();

const panel = document.getElementById('story-panel');
const panelPlace = document.getElementById('story-place');
const panelDate = document.getElementById('story-date');
const panelTag = document.getElementById('story-tag');
const panelBody = document.getElementById('story-body');

function openStory(loc) {
  panelPlace.textContent = `${loc.city}, ${loc.country}`;
  panelDate.textContent = loc.date;
  panelTag.textContent = loc.tag;
  panelBody.textContent = loc.body;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

document.getElementById('story-close').addEventListener('click', () => {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
});

const readout = document.getElementById('readout');
const stage = document.getElementById('map-stage');
stage.addEventListener('mousemove', (e) => {
  const r = stage.getBoundingClientRect();
  const xPct = (e.clientX - r.left) / r.width;
  const yPct = (e.clientY - r.top) / r.height;
  if (xPct < 0 || xPct > 1 || yPct < 0 || yPct > 1) return;
  const lon = xPct * 360 - 180;
  const lat = 90 - yPct * 180;
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  readout.textContent = `${Math.abs(lat).toFixed(1)}°${ns}  ${Math.abs(lon).toFixed(1)}°${ew}`;
});
stage.addEventListener('mouseleave', () => {
  readout.textContent = '—';
});
