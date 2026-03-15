const milestones = [
  { level: 20, msg: '🏠 First neighbourhood unlocked!' },
  { level: 40, msg: '🏢 Commercial district appearing!' },
  { level: 60, msg: '🏙️ Skyline taking shape!' },
  { level: 80, msg: '🌆 Thriving metropolis!' },
  { level: 95, msg: '🌃 World-class city achieved!' },
];
let shownMilestones = new Set();

function checkMilestone(level) {
  milestones.forEach(ms => {
    if (level >= ms.level && !shownMilestones.has(ms.level)) {
      shownMilestones.add(ms.level);
      trackStat('milestones');
      addXP(25);
      const el = document.getElementById('milestone');
      el.textContent = ms.msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 3000);
    }
  });
}

function fmtRev(v) { const n = Math.round(v/100*500); return n >= 1000 ? '$'+(n/1000).toFixed(0)+'k' : '$'+n; }
function fmtCust(v) { const n = Math.round(v/100*5000); return n >= 1000 ? (n/1000).toFixed(1)+'k' : n.toString(); }

let prevHealth = -1;

function updateUI() {
  const { rev, cust, margin, exp } = state;
  const health = (rev + cust + margin - exp) / 3;

  // Award XP the first time health crosses into Thriving territory
  if (health > 65 && prevHealth <= 65) addXP(50);
  prevHealth = health;

  document.getElementById('mv-rev').textContent = fmtRev(rev);
  document.getElementById('mv-cust').textContent = fmtCust(cust);
  document.getElementById('mv-margin').textContent = Math.round(margin) + '%';
  document.getElementById('mv-exp').textContent = fmtRev(exp / 2);

  document.getElementById('lv-rev').textContent = fmtRev(rev);
  document.getElementById('lv-cust').textContent = fmtCust(cust);
  document.getElementById('lv-margin').textContent = Math.round(margin) + '%';
  document.getElementById('lv-exp').textContent = fmtRev(exp / 2);

  const badge = document.getElementById('status-badge');
  const weatherEl = document.getElementById('weather');

  badge.classList.remove('thriving', 'growing', 'struggling');
  if (health > 65) {
    badge.textContent = '● Thriving';
    badge.classList.add('thriving');
    weatherEl.textContent = '☀️';
  } else if (health > 35) {
    badge.textContent = '● Growing';
    badge.classList.add('growing');
    weatherEl.textContent = '🌤️';
  } else {
    badge.textContent = '⚠ Struggling';
    badge.classList.add('struggling');
    weatherEl.textContent = '🌧️';
  }

  const level = Math.round((rev + cust + margin) / 3);
  checkMilestone(level);
  return health;
}
