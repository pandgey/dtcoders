// Keys used to read/write data in localStorage
const PROFILE_KEY = 'biztownProfile';
const STATS_KEY   = 'biztownStats';

// Fallback values shown when the user has never saved a profile
const defaults = {
  name: 'Alexander Alakazam',
  role: 'Business Analyst',
};

// Returns saved profile from localStorage, or defaults if nothing is saved yet
function loadProfile() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || defaults;
}

// Returns saved stats from localStorage, or zeroed-out defaults if nothing is saved yet
function loadStats() {
  return JSON.parse(localStorage.getItem(STATS_KEY) || 'null') || {
    cities: 0,       
    milestones: 0,   
    imports: 0,      
    lastState: null, 
  };
}

// Extracts up to 2 initials from a full name, e.g. "Alexander Alakazam" -> "AA"
function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Populates the entire page with data from localStorage
function renderProfile() {
  const p = loadProfile();
  const s = loadStats();

  // Fill in the profile card
  document.getElementById('profile-name').textContent    = p.name;
  document.getElementById('profile-role').textContent    = p.role;
  document.getElementById('avatar-initials').textContent = initials(p.name);

  // Fill in level and XP bar
  const xp = getXPProgress();
  document.getElementById('level-badge').textContent = `Level ${xp.level} — ${xp.title}`;
  document.getElementById('xp-bar').style.width      = (xp.progress * 100) + '%';
  document.getElementById('xp-label').textContent    = `${xp.xpIntoLevel} / ${xp.xpNeeded} XP to next level`;

  // Fill in the stat counters
  document.getElementById('stat-cities').textContent     = s.cities;
  document.getElementById('stat-milestones').textContent = s.milestones;
  document.getElementById('stat-imports').textContent    = s.imports;

  const snapEl = document.getElementById('city-snapshot');

  // Only render the snapshot grid if city data has been saved
  if (s.lastState) {
    const st = s.lastState;

    // Convert 0-100 slider values back to real-world numbers and build the grid
    snapEl.innerHTML = `
      <div class="snap-grid">
        <div class="snap-item">
          <div class="snap-item-label">Revenue</div>
          <div class="snap-item-val">$${Math.round(st.rev * 5000).toLocaleString()}</div>
        </div>
        <div class="snap-item">
          <div class="snap-item-label">Customers</div>
          <div class="snap-item-val">${Math.round(st.cust * 50).toLocaleString()}</div>
        </div>
        <div class="snap-item">
          <div class="snap-item-label">Profit Margin</div>
          <div class="snap-item-val">${Math.round(st.margin)}%</div>
        </div>
        <div class="snap-item">
          <div class="snap-item-label">Expenses</div>
          <div class="snap-item-val">$${Math.round(st.exp * 2500).toLocaleString()}</div>
        </div>
      </div>`;
  }
}

// Grab all interactive elements once so we don't look them up on every click
const editBtn   = document.getElementById('edit-btn');
const editForm  = document.getElementById('edit-form');
const efName    = document.getElementById('ef-name');
const efRole    = document.getElementById('ef-role');
const saveBtn   = document.getElementById('ef-save');
const cancelBtn = document.getElementById('ef-cancel');

// Open the edit form and pre-fill inputs with the current saved values
editBtn.addEventListener('click', () => {
  const p = loadProfile();
  efName.value = p.name;
  efRole.value = p.role;
  editForm.classList.add('open'); // CSS shows the form when this class is present
  editBtn.style.display = 'none'; // hide the button while the form is open
});

// Close the form without saving anything
cancelBtn.addEventListener('click', () => {
  editForm.classList.remove('open');
  editBtn.style.display = ''; // restore the button
});

// Save the new name/role to localStorage, then re-render so changes appear instantly
saveBtn.addEventListener('click', () => {
  // Fall back to defaults if the user saved an empty field
  const name = efName.value.trim() || defaults.name;
  const role = efRole.value.trim() || defaults.role;

  localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, role }));

  editForm.classList.remove('open');
  editBtn.style.display = '';
  renderProfile(); // refresh the page with the new values
});

// Run on page load to populate everything immediately
renderProfile();
