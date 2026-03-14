// Global state
let state = { rev: 0, cust: 0, margin: 0, exp: 0 };
let buildings = [];
let particles = [];
let cranes = [];
let stars = [];
let animT = 0;
let prevLevel = 0;

function makeStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({ x: Math.random() * W, y: Math.random() * (H * 0.55), r: Math.random() * 1.2 + 0.2, twinkle: Math.random() * Math.PI * 2 });
  }
}

function buildCity() {
  buildings = [];
  cranes = [];
  particles = [];

  const r = state.rev / 100;
  const c = state.cust / 100;
  const m = state.margin / 100;
  const e = state.exp / 100;

  const skyH = H - uiH;
  const groundY = skyH * 0.78;
  const horizonY = skyH * 0.72;

  const cityWidth = W * (0.35 + r * 0.5);
  const cx = W / 2;
  const numBuildings = Math.floor(12 + r * 80 + c * 40);
  const maxBldH = skyH * (0.12 + r * 0.45 + m * 0.18);

  for (let i = 0; i < numBuildings; i++) {
    const t = i / numBuildings;
    // Distribute buildings: more dense in centre
    const spread = (Math.random() - 0.5) * 2;
    const distFromCentre = Math.abs(spread);
    const bx = cx + spread * cityWidth * 0.5;

    // Height falls off from centre
    const centreFactor = Math.pow(1 - distFromCentre * 0.8, 1.4);
    const bh = Math.max(8, centreFactor * maxBldH * (0.3 + Math.random() * 0.7));
    const bw = 14 + Math.random() * (30 + r * 20) * centreFactor;

    // Depth for isometric feel — buildings further back are smaller
    const depthLayer = Math.random();
    const scale = 0.6 + depthLayer * 0.4;
    const by = groundY - bh * scale + (1 - depthLayer) * skyH * 0.04;

    // Colour based on margin and height
    let hue, sat, lit2;
    if (m > 0.65) { hue = 200 + Math.random() * 30; sat = 60 + m * 30; lit2 = 25 + centreFactor * 25; }
    else if (m > 0.35) { hue = 220 + Math.random() * 20; sat = 30 + m * 40; lit2 = 18 + centreFactor * 18; }
    else { hue = 260 + Math.random() * 30; sat = 20; lit2 = 12 + centreFactor * 10; }

    // Window glow colour
    const winHue = m > 0.5 ? 45 : 200;

    buildings.push({
      x: bx - bw * scale / 2,
      y: by,
      w: bw * scale,
      h: bh * scale,
      hue, sat, lit: lit2,
      winHue,
      depthLayer,
      winPhase: Math.random() * Math.PI * 2,
      winDensity: 0.3 + m * 0.5,
    });
  }

  // Sort by depth
  buildings.sort((a, b) => a.depthLayer - b.depthLayer);

  // Cranes when expenses high
  if (e > 0.3) {
    const numCranes = Math.floor(e * 8);
    for (let i = 0; i < numCranes; i++) {
      const bx = cx + (Math.random() - 0.5) * cityWidth * 0.7;
      cranes.push({ x: bx, y: groundY, h: 60 + Math.random() * 150 });
    }
  }
}
