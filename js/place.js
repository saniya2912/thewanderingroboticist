/* place.js — renders a single place page from ?place=<slug>. Reads data.js. */

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Turn a body string into paragraphs (blank line = new paragraph).
function paragraphs(body) {
  return String(body || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

const slug = new URLSearchParams(location.search).get('place');
const place = slug ? getPlace(slug) : null;
const root = document.getElementById('place-content');

if (!place) {
  root.innerHTML = `
    <a class="back-link" href="index.html">← back to the map</a>
    <h1 class="place-title">Place not found</h1>
    <p class="place-summary">No place matches that link. Head back to the map and pick a pin.</p>`;
} else {
  document.title = `${place.city} — The Wandering Roboticist`;

  const journal = place.journal || [];
  const projects = place.projects || [];

  const journalHtml = journal.length
    ? journal.map(e => `
        <article class="entry" id="${esc(e.slug)}">
          <div class="entry-date">${esc(e.date)}</div>
          <h3 class="entry-title">${esc(e.title)}</h3>
          <div class="entry-body">${paragraphs(e.body)}</div>
        </article>`).join('')
    : `<p class="empty">No journal entries yet.</p>`;

  const projectsHtml = projects.length
    ? projects.map(p => `
        <article class="project-card" id="${esc(p.slug)}">
          <h3 class="project-title">${esc(p.title)}</h3>
          <div class="tags">${(p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <p class="project-blurb">${esc(p.blurb || '')}</p>
          <div class="entry-body">${paragraphs(p.body)}</div>
          ${p.link ? `<a class="story-link" href="${esc(p.link)}" target="_blank" rel="noopener">view project →</a>` : ''}
        </article>`).join('')
    : `<p class="empty">No projects yet.</p>`;

  root.innerHTML = `
    <a class="back-link" href="index.html">← back to the map</a>
    <header class="place-header">
      <h1 class="place-title">${esc(place.city)}<span class="place-country">, ${esc(place.country)}</span></h1>
      <div class="place-coords">${place.lat.toFixed(1)}°, ${place.lon.toFixed(1)}°</div>
      ${place.summary ? `<p class="place-summary">${esc(place.summary)}</p>` : ''}
    </header>

    <section class="place-section">
      <h2 class="section-head">Journal</h2>
      ${journalHtml}
    </section>

    <section class="place-section">
      <h2 class="section-head">Projects</h2>
      <div class="project-grid">${projectsHtml}</div>
    </section>`;
}
