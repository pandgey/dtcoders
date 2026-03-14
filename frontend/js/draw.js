function drawBuilding(b, t) {
  const winGlow = 0.6 + 0.4 * Math.sin(t * 1.5 + b.winPhase);
  const bodyColor = `hsl(${b.hue},${b.sat}%,${b.lit}%)`;
  const topColor = `hsl(${b.hue},${b.sat + 10}%,${b.lit + 8}%)`;

  // Body
  ctx.fillStyle = bodyColor;
  ctx.fillRect(b.x, b.y, b.w, b.h);

  // Slightly lighter top strip
  ctx.fillStyle = topColor;
  ctx.fillRect(b.x, b.y, b.w, Math.min(6, b.h * 0.1));

  // Edge highlight
  ctx.strokeStyle = `hsla(${b.hue},70%,${b.lit + 20}%,0.3)`;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(b.x, b.y, b.w, b.h);

  // Windows
  const cols = Math.max(1, Math.floor(b.w / 7));
  const rows = Math.max(1, Math.floor(b.h / 9));
  const ww = Math.max(2, b.w / cols - 3);
  const wh = Math.max(2, b.h / rows - 4);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (Math.sin(b.winPhase + row * 1.7 + col * 2.3) > (1 - b.winDensity) * 2 - 1) {
        const wx = b.x + 3 + col * (b.w / cols);
        const wy = b.y + 6 + row * (b.h / rows);
        const flicker = 0.7 + 0.3 * Math.sin(t * 2 + b.winPhase + row + col);
        const alpha = 0.5 + 0.5 * flicker;
        ctx.fillStyle = `hsla(${b.winHue},80%,75%,${alpha})`;
        ctx.fillRect(wx, wy, ww, wh);
      }
    }
  }
}

function drawCrane(cr, t) {
  ctx.strokeStyle = '#e87820';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cr.x, cr.y);
  ctx.lineTo(cr.x, cr.y - cr.h);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cr.x - 5, cr.y - cr.h);
  ctx.lineTo(cr.x + cr.h * 0.6, cr.y - cr.h);
  ctx.stroke();
  // Dangling hook
  const hookX = cr.x + cr.h * 0.6 - 10 + Math.sin(t * 0.8 + cr.x) * 5;
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#e87820aa';
  ctx.beginPath();
  ctx.moveTo(cr.x + cr.h * 0.6 - 10, cr.y - cr.h);
  ctx.lineTo(hookX, cr.y - cr.h + 25);
  ctx.stroke();
}

function drawGround(groundY, skyH) {
  // Ground plane
  const grd = ctx.createLinearGradient(0, groundY, 0, H - uiH);
  grd.addColorStop(0, '#0d1828');
  grd.addColorStop(1, '#080f1a');
  ctx.fillStyle = grd;
  ctx.fillRect(0, groundY, W, H - uiH - groundY);

  // Road lines
  ctx.strokeStyle = 'rgba(30,60,100,0.6)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const ry = groundY + 4 + i * 8;
    if (ry > H - uiH) break;
    ctx.beginPath();
    ctx.moveTo(0, ry);
    ctx.lineTo(W, ry);
    ctx.stroke();
  }
}

function drawSky(health, t) {
  const skyH = H - uiH;
  let topColor, midColor;
  if (health > 65) {
    topColor = '#06101f';
    midColor = '#0a1830';
  } else if (health > 35) {
    topColor = '#060e1c';
    midColor = '#0a1525';
  } else {
    topColor = '#0c0810';
    midColor = '#180d20';
  }
  const grd = ctx.createLinearGradient(0, 0, 0, skyH * 0.8);
  grd.addColorStop(0, topColor);
  grd.addColorStop(1, midColor);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, skyH);

  // Stars
  stars.forEach(s => {
    const tw = 0.5 + 0.5 * Math.sin(t * 1.2 + s.twinkle);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * tw, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,200,255,${0.4 + 0.5 * tw})`;
    ctx.fill();
  });

  // Moon or storm cloud
  if (health > 65) {
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.08, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,250,220,0.9)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W * 0.85 + 10, H * 0.08 - 5, 14, 0, Math.PI * 2);
    ctx.fillStyle = midColor;
    ctx.fill();
  } else {
    // Storm cloud
    const cx2 = W * 0.8, cy2 = H * 0.1;
    ctx.fillStyle = 'rgba(40,20,60,0.8)';
    [[-20,0,28],[0,-8,22],[20,0,26],[0,8,20]].forEach(([ox,oy,r]) => {
      ctx.beginPath(); ctx.arc(cx2+ox, cy2+oy, r, 0, Math.PI*2); ctx.fill();
    });
    // Lightning
    if (Math.sin(t * 7) > 0.92) {
      ctx.strokeStyle = 'rgba(180,140,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx2, cy2+28);
      ctx.lineTo(cx2-8, cy2+50);
      ctx.lineTo(cx2+4, cy2+50);
      ctx.lineTo(cx2-4, cy2+70);
      ctx.stroke();
    }
  }

  // City glow on horizon
  const glowColor = health > 65 ? 'rgba(60,120,255,0.15)' : health > 35 ? 'rgba(40,80,180,0.1)' : 'rgba(80,20,80,0.1)';
  const glw = ctx.createRadialGradient(W/2, skyH * 0.74, 0, W/2, skyH * 0.74, W * 0.5);
  glw.addColorStop(0, glowColor);
  glw.addColorStop(1, 'transparent');
  ctx.fillStyle = glw;
  ctx.fillRect(0, skyH * 0.5, W, skyH * 0.3);
}
