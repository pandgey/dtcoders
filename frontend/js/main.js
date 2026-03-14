const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H, uiH;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  uiH = document.getElementById('ui').offsetHeight + 10;
}
resize();
window.addEventListener('resize', () => { resize(); makeStars(); buildCity(); });

// Cached health value — updated only when state changes, not every frame
let health = 0;

// Main render loop
function render(ts) {
  requestAnimationFrame(render);
  animT = ts / 1000;
  const skyH = H - uiH;
  const groundY = skyH * 0.78;

  ctx.clearRect(0, 0, W, H);
  drawSky(health, animT);
  drawGround(groundY, skyH);
  cranes.forEach(cr => drawCrane(cr, animT));
  buildings.forEach(b => drawBuilding(b, animT));
}

// Slider events
let rebuildTimer;
function onSlider() {
  state.rev    = +document.getElementById('sr').value;
  state.cust   = +document.getElementById('sc').value;
  state.margin = +document.getElementById('sm').value;
  state.exp    = +document.getElementById('se').value;
  health = updateUI();
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(buildCity, 150);
}
['sr','sc','sm','se'].forEach(id => document.getElementById(id).addEventListener('input', onSlider));

// Init
makeStars();
buildCity();
health = updateUI();
requestAnimationFrame(render);
