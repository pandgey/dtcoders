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
      const el = document.getElementById('milestone');
      el.textContent = ms.msg;
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 3000);
    }
  });
}

function fmtRev(v) { const n = Math.round(v/100*500); return n >= 1000 ? '$'+(n/1000).toFixed(0)+'k' : '$'+n; }
function fmtCust(v) { const n = Math.round(v/100*5000); return n >= 1000 ? (n/1000).toFixed(1)+'k' : n.toString(); }

function updateUI() {
  const { rev, cust, margin, exp } = state;
  const health = (rev + margin - exp) / 2;

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

  if (health > 65) {
    badge.textContent = '● Thriving';
    badge.style.cssText = 'color:#4ad98a;background:rgba(74,217,138,0.1);border:1px solid rgba(74,217,138,0.3);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px;';
    weatherEl.textContent = '☀️';
  } else if (health > 35) {
    badge.textContent = '● Growing';
    badge.style.cssText = 'color:#4a9eff;background:rgba(74,158,255,0.1);border:1px solid rgba(74,158,255,0.3);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px;';
    weatherEl.textContent = '🌤️';
  } else {
    badge.textContent = '⚠ Struggling';
    badge.style.cssText = 'color:#ff6060;background:rgba(255,80,80,0.1);border:1px solid rgba(255,80,80,0.3);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;letter-spacing:0.5px;';
    weatherEl.textContent = '🌧️';
  }

  const level = Math.round((rev + cust + margin) / 3);
  checkMilestone(level);
  return health;
}
