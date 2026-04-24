const themeBtn = document.getElementById('theme-switch');
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeBtn.textContent = '☀️ Light Mode';
}

themeBtn.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  }
});

const nameInput = document.getElementById('name-change-input');
const nameDisplay = document.getElementById('user-name'); // Targets the <mark> tag

function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;

  // Update the Big Time
  const timeStr = `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
  document.getElementById('time-big').textContent = timeStr;

  // Update the Machine-Readable datetime attribute for SEO/Accessibility
  function updateClock() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  }
  // 1. Time display
  document.getElementById('time-big').textContent = 
    `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;

  // 2. Date display in words
  const timeElement = document.getElementById('datetime');
  
  // This produces: "Thursday, April 23, 2026"
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
 };
  
  const dateInWords = now.toLocaleDateString('en-US', dateOptions);
  
  timeElement.setAttribute('datetime', now.toISOString().split('T'));
  timeElement.textContent = dateInWords;

  // 3. Greeting & Name persistence
  const greetings = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' };
  const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const savedName = localStorage.getItem('dash_user_name') || 'Guest';
  
  document.getElementById('greeting').innerHTML = 
    `${greetings[part]}, <mark id="user-name">${savedName}</mark>.`;
}

// Initial setup for the name input
nameInput.addEventListener('input', (e) => {
  const newName = e.target.value.trim() || 'Guest';
  localStorage.setItem('dash_user_name', newName);
 })
setInterval(updateClock, 1000);
updateClock();

/*  TIMER */
const ARC_LEN = 213.6;

// Load saved custom durations or use defaults
let timerDurations = JSON.parse(localStorage.getItem('dash_timer_durations') || 'null') || {
  focus: 25, short: 5, long: 15
};
let currentMode = 'focus';
let timerTotal = timerDurations.focus * 60;
let timerLeft = timerTotal;
let timerInterval = null;
let timerRunning = false;

// Sync settings inputs with saved values on load
document.getElementById('set-focus').value = timerDurations.focus;
document.getElementById('set-short').value = timerDurations.short;
document.getElementById('set-long').value  = timerDurations.long;

function pad(n) { return String(n).padStart(2,'0'); }

function renderTimer() {
  const m = Math.floor(timerLeft / 60), s = timerLeft % 60;
  document.getElementById('timer-display').textContent = pad(m) + ':' + pad(s);
  const pct = timerTotal > 0 ? timerLeft / timerTotal : 1;
  document.getElementById('arc').style.strokeDashoffset = ARC_LEN * (1 - pct);
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('timer-toggle').textContent = 'Resume';
  } else {
    if (timerLeft <= 0) return;
    timerRunning = true;
    document.getElementById('timer-toggle').textContent = 'Pause';
    timerInterval = setInterval(() => {
      timerLeft--;
      renderTimer();
      if (timerLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('timer-toggle').textContent = 'Start';
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerLeft = timerTotal;
  document.getElementById('timer-toggle').textContent = 'Start';
  renderTimer();
}

function setTimerMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.mode-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  clearInterval(timerInterval);
  timerRunning = false;
  timerTotal = timerDurations[mode] * 60;
  timerLeft = timerTotal;
  const labels = { focus: 'Focus', short: 'Short break', long: 'Long break' };
  document.getElementById('timer-mode-label').textContent = labels[mode];
  document.getElementById('timer-toggle').textContent = 'Start';
  renderTimer();
}

function toggleTimerSettings() {
  const panel = document.getElementById('timer-settings');
  panel.classList.toggle('hidden');
}

function saveTimerSettings() {
  const f = parseInt(document.getElementById('set-focus').value) || 25;
  const s = parseInt(document.getElementById('set-short').value) || 5;
  const l = parseInt(document.getElementById('set-long').value)  || 15;
  timerDurations = { focus: f, short: s, long: l };
  localStorage.setItem('dash_timer_durations', JSON.stringify(timerDurations));
  // Update pill labels
  document.getElementById('pill-focus').textContent = `Focus ${f}m`;
  document.getElementById('pill-short').textContent = `Short ${s}m`;
  document.getElementById('pill-long').textContent  = `Long ${l}m`;
  // Reset current mode to reflect new duration
  timerTotal = timerDurations[currentMode] * 60;
  timerLeft = timerTotal;
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById('timer-toggle').textContent = 'Start';
  renderTimer();
  document.getElementById('timer-settings').classList.add('hidden');
}

// Init pill labels from saved durations
document.getElementById('pill-focus').textContent = `Focus ${timerDurations.focus}m`;
document.getElementById('pill-short').textContent = `Short ${timerDurations.short}m`;
document.getElementById('pill-long').textContent  = `Long ${timerDurations.long}m`;

renderTimer();


// /*  TO-DO LIST */
// let todos = JSON.parse(localStorage.getItem('dash_todos') || '[]');
// let sortOrder = localStorage.getItem('dash_sort') || 'default';

// function saveTodos() { localStorage.setItem('dash_todos', JSON.stringify(todos)); }

// function getSortedTodos() {
//   const copy = todos.map((t, i) => ({ ...t, _orig: i }));
//   if (sortOrder === 'az')   return copy.sort((a, b) => a.text.localeCompare(b.text));
//   if (sortOrder === 'za')   return copy.sort((a, b) => b.text.localeCompare(a.text));
//   if (sortOrder === 'done') return copy.sort((a, b) => Number(a.done) - Number(b.done));
//   return copy; // 'default' = insertion order
// }

// function setSortOrder(order, btn) {
//   sortOrder = order;
//   localStorage.setItem('dash_sort', order);
//   document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
//   btn.classList.add('active');
//   renderTodos();
// }

// function renderTodos() {
//   const ul = document.getElementById('todo-list');
//   if (!todos.length) {
//     ul.innerHTML = '<li class="todo-empty">No tasks yet — add one above.</li>';
//     return;
//   }
//   const sorted = getSortedTodos();
//   ul.innerHTML = sorted.map((t) => {
//     const i = t._orig; // always reference the real index for mutations
//     return `
//     <li class="todo-item">
//       <input class="todo-cb" type="checkbox" ${t.done ? 'checked' : ''}
//         onchange="toggleTodo(${i})" />
//       <input class="todo-text ${t.done ? 'done' : ''}" type="text" value="${escHtml(t.text)}"
//         onblur="editTodo(${i}, this.value)"
//         onkeydown="if(event.key==='Enter')this.blur()"
//         title="Click to edit" />
//       <button class="todo-del" onclick="deleteTodo(${i})" title="Delete">×</button>
//     </li>`;
//   }).join('');
// }

// // Restore active sort button on load
// document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
// const activeSortBtn = document.getElementById('sort-btn-' + sortOrder);
// if (activeSortBtn) activeSortBtn.classList.add('active');


// function escHtml(s) {
//   return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// }

// function addTodo() {
//   const inp = document.getElementById('todo-input');
//   const text = inp.value.trim();
//   if (!text) return;
//   todos.unshift({ text, done: false, id: Date.now() });
//   inp.value = '';
//   saveTodos();
//   renderTodos();
// }
// document.getElementById('todo-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

// function toggleTodo(i) { todos[i].done = !todos[i].done; saveTodos(); renderTodos(); }
// function deleteTodo(i) { todos.splice(i, 1); saveTodos(); renderTodos(); }
// function editTodo(i, val) {
//   const trimmed = val.trim();
//   if (!trimmed) { renderTodos(); return; }
//   todos[i].text = trimmed;
//   saveTodos();
//   renderTodos();
// }
// renderTodos();

/*  TODOS  */
let todos = JSON.parse(localStorage.getItem('dash_todos') || '[]');

function saveTodos() { localStorage.setItem('dash_todos', JSON.stringify(todos)); }

function renderTodos() {
  const ul = document.getElementById('todo-list');
  if (!todos.length) {
    ul.innerHTML = '<li class="todo-empty">No tasks yet — add one above.</li>';
    return;
  }
  ul.innerHTML = todos.map((t, i) => `
    <li class="todo-item">
      <input class="todo-cb" type="checkbox" ${t.done ? 'checked' : ''}
        onchange="toggleTodo(${i})" />
      <input class="todo-text ${t.done ? 'done' : ''}" type="text" value="${escHtml(t.text)}"
        onblur="editTodo(${i}, this.value)"
        onkeydown="if(event.key==='Enter')this.blur()"
        title="Click to edit" />
      <button class="todo-del" onclick="deleteTodo(${i})" title="Delete">×</button>
    </li>`).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function addTodo() {
  const inp = document.getElementById('todo-input');
  const text = inp.value.trim();
  if (!text) return;

  // Duplicate check (case-insensitive)
  const isDuplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    inp.classList.add('input-error');
    inp.placeholder = 'Task already exists!';
    setTimeout(() => {
      inp.classList.remove('input-error');
      inp.placeholder = 'Add a task…';
    }, 2000);
    return;
  }

  todos.unshift({ text, done: false, id: Date.now() });
  inp.value = '';
  saveTodos();
  renderTodos();
}
document.getElementById('todo-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

function toggleTodo(i) { todos[i].done = !todos[i].done; saveTodos(); renderTodos(); }
function deleteTodo(i) { todos.splice(i, 1); saveTodos(); renderTodos(); }
function editTodo(i, val) {
  const trimmed = val.trim();
  if (!trimmed) { renderTodos(); return; }

  // Duplicate check on edit (ignore the task being edited)
  const isDuplicate = todos.some((t, idx) => idx !== i && t.text.toLowerCase() === trimmed.toLowerCase());
  if (isDuplicate) {
    renderTodos(); // revert the field
    return;
  }

  todos[i].text = trimmed;
  saveTodos();
  renderTodos();
}
renderTodos();

/*  QUICK LINKS  */
const DEFAULT_LINKS = [
  { label: 'Gmail',    url: 'https://mail.google.com' },
  { label: 'Calendar', url: 'https://calendar.google.com' },
  { label: 'YouTube',  url: 'https://youtube.com' },
  { label: 'GitHub',   url: 'https://github.com' },
];

let links = JSON.parse(localStorage.getItem('dash_links') || 'null');
if (!links) { links = DEFAULT_LINKS; saveLinks(); }

function saveLinks() { localStorage.setItem('dash_links', JSON.stringify(links)); }

function faviconUrl(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(origin)}&sz=32`;
  } catch { return ''; }
}

function renderLinks() {
  const grid = document.getElementById('links-grid');
  if (!links.length) { grid.innerHTML = '<span style="font-size:13px;color:var(--ink3);">No links yet.</span>'; return; }
  grid.innerHTML = links.map((l, i) => {
    const fav = faviconUrl(l.url);
    return `<div style="display:flex;align-items:center;gap:6px;padding:9px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);">
      <a href="${escHtml(l.url)}" target="_blank" rel="noopener"
        style="display:flex;align-items:center;gap:7px;flex:1;text-decoration:none;color:var(--ink);font-size:13px;font-family:'DM Sans',sans-serif;overflow:hidden;">
        ${fav ? `<img class="link-favicon" src="${fav}" alt="" onerror="this.style.display='none'" />` : ''}
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(l.label)}</span>
      </a>
      <button class="link-del" onclick="deleteLink(${i})" title="Remove">×</button>
    </div>`;
  }).join('');
}

function addLink() {
  const label = document.getElementById('link-label').value.trim();
  let url = document.getElementById('link-url').value.trim();
  if (!label || !url) return;
  if (!url.startsWith('http')) url = 'https://' + url;
  links.push({ label, url });
  saveLinks();
  renderLinks();
  document.getElementById('link-label').value = '';
  document.getElementById('link-url').value = '';
  toggleAddLink(true);
}
document.getElementById('link-url').addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });

function deleteLink(i) { links.splice(i, 1); saveLinks(); renderLinks(); }

function toggleAddLink(forceClose) {
  const form = document.getElementById('add-link-form');
  const tog = document.getElementById('add-link-toggle');
  const open = !forceClose && form.classList.contains('hidden');
  form.classList.toggle('hidden', !open);
  tog.textContent = open ? '− Cancel' : '+ Add a link';
}
renderLinks();