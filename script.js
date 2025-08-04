const original = [];
let current = [];

async function main(){
  try {
    const res = await fetch('data/items.json');
    if (!res.ok) throw new Error(res.statusText);
    const list = await res.json();
    original.push(...list);
    setupFilters();
    applyAll();
  } catch(err){
    document.body.prepend(`⚠️ Error loading data: ${err}`);
    console.error(err);
  }
}
function setupFilters(){
  const tagContainer = document.getElementById('tag-filters');
  const tagSet = new Set(original.flatMap(a => a.tags || []));
  tagSet.forEach(tag => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${tag}"> ${tag}`;
    tagContainer.append(label);
  });
  document.getElementById('sort-by').addEventListener('change', applyAll);
  document.getElementById('sort-order').addEventListener('change', applyAll);
  tagContainer.addEventListener('change', applyAll);
}

function applyAll(){
  // Tag filtering
  const checked = [...document.querySelectorAll('#tag-filters input:checked')]
                    .map(i => i.value);
  let filtered = checked.length
    ? original.filter(a => checked.every(t => a.tags.includes(t)))
    : [...original];

  // Sorting
  const key = document.getElementById('sort-by').value;
  const dir = document.getElementById('sort-order').value;
  filtered.sort((a,b) => {
    const xa = a[key], xb = b[key];
    const cmp = typeof xa === 'string'
      ? xa.localeCompare(xb)
      : xa - xb;
    return dir === 'asc' ? cmp : -cmp;
  });

  current = filtered;
  renderCards();
  renderChart();
}

function renderCards(){
  const container = document.getElementById('cards');
  container.innerHTML = '';
  current.forEach(a => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${a.cover}" alt="${a.title}">
      <div class="overlay">${totalWatched(a)} watched</div>
      <div class="info">
        <strong>${a.title}</strong><br>
        ${a.releaseYear} • ${a.episodeCount} ep • Score: ${a.score}
      </div>`;
    container.append(div);
  });
}

function totalWatched(a){
  return a.progressActivities?.reduce((s,e)=>s+e.watched,0)||0;
}

function renderChart(){
  const counts = current.reduce((acc,a) => {
    (a.progressActivities||[]).forEach(e => {
      acc[e.date] = (acc[e.date]||0) + e.watched;
    });
    return acc;
  }, {});
  const dates = Object.keys(counts).sort();
  const chartData = { labels: dates, datasets: [{
    label: 'Episodes watched',
    data: dates.map(d => counts[d]),
    borderColor: 'teal', backgroundColor: 'lightcyan', fill: true
  }]};

  const ctx = document.getElementById('globalChart').getContext('2d');
  if (window.globalChart) {
    window.globalChart.data = chartData;
    window.globalChart.update();
  } else {
    window.globalChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
}

main();