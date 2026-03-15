const XP_KEY = 'biztownXP';

const LEVEL_TITLES = [
  [0,  'Dreamer'],
  [5,  'Intern'],
  [10, 'Planner'],
  [15, 'Manager'],
  [20, 'Director'],
  [30, 'Executive'],
  [50, 'Owner'],
];

function getXPData() {
  return JSON.parse(localStorage.getItem(XP_KEY) || 'null') || { totalXP: 0 };
}

// Add XP and save to localStorage
function addXP(amount) {
  const d = getXPData();
  d.totalXP = (d.totalXP || 0) + amount;
  localStorage.setItem(XP_KEY, JSON.stringify(d));
}

// Level from total XP using sqrt curve: level = floor(sqrt(xp / 10))
function getLevel(totalXP) {
  return Math.floor(Math.sqrt((totalXP || 0) / 10));
}

// XP required to reach a given level
function xpForLevel(level) {
  return level * level * 10;
}

// Title string for a given level number
function getLevelTitle(level) {
  let title = LEVEL_TITLES[0][1];
  for (const [minLevel, t] of LEVEL_TITLES) {
    if (level >= minLevel) title = t;
  }
  return title;
}

// Returns all XP/level info needed to render the profile bar
function getXPProgress() {
  const { totalXP } = getXPData();
  const level = getLevel(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP    = xpForLevel(level + 1);
  const xpIntoLevel    = totalXP - currentLevelXP;
  const xpNeeded       = nextLevelXP - currentLevelXP;
  return {
    level,
    totalXP,
    title: getLevelTitle(level),
    xpIntoLevel,
    xpNeeded,
    progress: Math.min(1, Math.max(0, xpIntoLevel / xpNeeded)),
  };
}
