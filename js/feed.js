/* feed.js — renders the cross-place journal feed or projects grid, with a
   place filter. Which one it renders is decided by <body data-feed="...">.
   Reads data.js. */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const mode = document.body.dataset.feed; // 'journal' | 'projects'
const feedEl = document.getElementById('feed');
const filtersEl = document.getElementById('filters');

const items = mode === 'projects' ? allProjects() : allJournal();

// Places that actually have items of this type, for the filter bar.
const placeSlugs = [...new Set(items.map(i => i.place.slug))];
let activeFilter = 'all';

function renderFilters() {
  const chips = [{ slug: 'all', label: 'all places' }]
    .concat(placeSlugs.map(s => ({ slug: s, label: getPlace(s).city })));
  filtersEl.innerHTML = chips.map(c =>
    `<button class="filter-chip${c.slug === activeFilter ? ' active' : ''}" data-slug="${c.slug}">${esc(c.label)}</button>`
  ).join('');
  filtersEl.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.slug;
      renderFilters();
      renderFeed();
    });
  });
}

function journalCard(e) {
  return `
    <a class="feed-entry" href="place.html?place=${esc(e.place.slug)}#${esc(e.slug)}">
      <div class="feed-meta">
        <span class="feed-date">${esc(e.date)}</span>
        <span class="feed-place">${esc(e.place.city)}, ${esc(e.place.country)}</span>
      </div>
      <h3 class="feed-entry-title">${esc(e.title)}</h3>
    </a>`;
}

function projectCard(p) {
  return `
    <a class="project-card project-card--link" href="place.html?place=${esc(p.place.slug)}#${esc(p.slug)}">
      <h3 class="project-title">${esc(p.title)}</h3>
      <div class="tags">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <p class="project-blurb">${esc(p.blurb || '')}</p>
      <div class="feed-place">${esc(p.place.city)}, ${esc(p.place.country)}</div>
    </a>`;
}

function renderFeed() {
  const shown = activeFilter === 'all'
    ? items
    : items.filter(i => i.place.slug === activeFilter);

  if (!shown.length) {
    feedEl.innerHTML = `<p class="empty">Nothing here yet. Add entries in <code>js/data.js</code>.</p>`;
    return;
  }
  const card = mode === 'projects' ? projectCard : journalCard;
  feedEl.innerHTML = shown.map(card).join('');
}

renderFilters();
renderFeed();
