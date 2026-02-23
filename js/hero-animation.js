/* ============================================
   Tehilah World Worship – Hero Canvas Animation
   Scenes: The Shofar → David's Harp → David's Sling
   ============================================ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GOLD       = '#d4a853';
  const GOLD_LIGHT = '#f0c96a';

  let W, H;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- Timing ---- */
  const FADE  = 1200;   // ms fade in / out
  const HOLD  = 4200;   // ms hold
  const TOTAL = HOLD + FADE * 2;

  let startTime = null;
  let lastScene = -1;
  let particles = [];

  /* ---- Particles ---- */
  function makeParticle(scene) {
    if (scene === 0) {
      return { x: 0, y: 0,
               vx: (Math.random() - 0.4) * 2, vy: -(0.5 + Math.random() * 1.5),
               r: 1.5 + Math.random() * 3, life: Math.random() };
    } else if (scene === 1) {
      return { x: W * 0.5 + (Math.random() - 0.5) * W * 0.25,
               y: H * 0.58 + Math.random() * H * 0.12,
               vx: (Math.random() - 0.5) * 0.4, vy: -(0.4 + Math.random() * 1.2),
               size: 12 + Math.random() * 14,
               note: Math.random() > 0.5 ? '♪' : '♫',
               life: Math.random() };
    } else {
      return { x: Math.random() * W, y: Math.random() * H,
               r: 0.5 + Math.random() * 2,
               phase: Math.random() * Math.PI * 2 };
    }
  }

  function resetParticles(scene) {
    particles = Array.from({ length: 40 }, () => makeParticle(scene));
  }

  /* ---- Background ---- */
  function drawBg() {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   '#0d0020');
    grad.addColorStop(0.5, '#150035');
    grad.addColorStop(1,   '#0a0018');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---- Glow helper ---- */
  function glow(x, y, r, hex, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hex.replace('1)', a + ')'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---- Silhouette figure ---- */
  function figure(cx, cy, sc, pose) {
    ctx.save();
    ctx.fillStyle   = GOLD;
    ctx.strokeStyle = GOLD;
    ctx.translate(cx, cy);
    ctx.scale(sc, sc);

    // head
    ctx.beginPath();
    ctx.arc(0, -130, 16, 0, Math.PI * 2);
    ctx.fill();

    if (pose === 'shofar') {
      // torso
      ctx.fillRect(-10, -114, 20, 55);
      // left arm (relaxed)
      ctx.save(); ctx.translate(-10, -110); ctx.rotate(0.4);  ctx.fillRect(-5, 0, 10, 48); ctx.restore();
      // right arm (raised – holding shofar)
      ctx.save(); ctx.translate(10,  -110); ctx.rotate(-1.1); ctx.fillRect(-5, 0, 10, 52); ctx.restore();
      // legs
      ctx.save(); ctx.translate(-7, -59); ctx.rotate(0.05);  ctx.fillRect(-5, 0, 10, 59); ctx.restore();
      ctx.save(); ctx.translate( 7, -59); ctx.rotate(-0.05); ctx.fillRect(-5, 0, 10, 59); ctx.restore();

    } else if (pose === 'harp') {
      // torso (leaning slightly)
      ctx.save(); ctx.rotate(0.08); ctx.fillRect(-10, -114, 20, 55); ctx.restore();
      // arms reaching to harp
      ctx.save(); ctx.translate(10, -105); ctx.rotate(-0.6);  ctx.fillRect(-5, 0, 10, 52); ctx.restore();
      ctx.save(); ctx.translate(10, -80);  ctx.rotate(-0.35); ctx.fillRect(-5, 0, 10, 46); ctx.restore();
      // seated legs
      ctx.fillRect(-15, -59, 32, 10);
      ctx.save(); ctx.translate(-15, -49); ctx.rotate(1.5); ctx.fillRect(-5, 0, 10, 42); ctx.restore();
      ctx.save(); ctx.translate( 15, -49); ctx.rotate(1.5); ctx.fillRect(-5, 0, 10, 42); ctx.restore();

    } else if (pose === 'sling') {
      // torso (leaning back)
      ctx.save(); ctx.rotate(-0.12); ctx.fillRect(-10, -114, 20, 55); ctx.restore();
      // throwing arm (raised high)
      ctx.save(); ctx.translate(10, -112);  ctx.rotate(-1.5); ctx.fillRect(-5, 0, 10, 56); ctx.restore();
      // balance arm
      ctx.save(); ctx.translate(-10, -108); ctx.rotate(0.6);  ctx.fillRect(-5, 0, 10, 48); ctx.restore();
      // legs (wide stance)
      ctx.save(); ctx.translate(-10, -59); ctx.rotate(-0.25); ctx.fillRect(-5, 0, 10, 62); ctx.restore();
      ctx.save(); ctx.translate( 10, -59); ctx.rotate(0.2);   ctx.fillRect(-5, 0, 10, 62); ctx.restore();
    }

    ctx.restore();
  }

  /* ---- Scene label ---- */
  function label(text, a) {
    ctx.save();
    ctx.globalAlpha = a * 0.88;
    ctx.font        = `italic ${Math.max(14, H * 0.03)}px 'Playfair Display', Georgia, serif`;
    ctx.fillStyle   = GOLD_LIGHT;
    ctx.textAlign   = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur  = 10;
    ctx.fillText(text, W * 0.5, H * 0.93);
    ctx.restore();
  }

  /* ======================================================
     SCENE 0 – THE SHOFAR
  ====================================================== */
  function drawShofar(t, a) {
    const figX = W * 0.42, figY = H * 0.82, sc = H / 520;

    glow(figX, figY - H * 0.25, H * 0.5, 'rgba(180,80,255,1)', (0.16 * a).toFixed(3));
    figure(figX, figY, sc, 'shofar');

    // Ram's horn
    const sx = figX + sc * 46, sy = figY - sc * 186;
    ctx.save();
    ctx.strokeStyle = GOLD_LIGHT;
    ctx.lineWidth   = sc * 9;
    ctx.lineCap = ctx.lineJoin = 'round';
    ctx.shadowColor = GOLD_LIGHT;
    ctx.shadowBlur  = 14;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.bezierCurveTo(sx + sc*30, sy - sc*38, sx + sc*78, sy - sc*28, sx + sc*98, sy + sc*6);
    ctx.bezierCurveTo(sx + sc*118, sy + sc*42, sx + sc*93, sy + sc*72, sx + sc*50, sy + sc*72);
    ctx.stroke();
    // bell
    ctx.lineWidth = sc * 16;
    ctx.beginPath();
    ctx.arc(sx + sc*46, sy + sc*74, sc*8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Sound waves
    const bx = sx + sc*38, by = sy + sc*86;
    for (let i = 0; i < 5; i++) {
      const ph = ((t / 900) + i * 0.22) % 1;
      ctx.save();
      ctx.strokeStyle = `rgba(240,201,106,${((1 - ph) * 0.65 * a).toFixed(3)})`;
      ctx.lineWidth   = 1.8;
      ctx.beginPath();
      ctx.arc(bx, by, sc * (14 + ph * 145), -Math.PI * 0.55, Math.PI * 0.55);
      ctx.stroke();
      ctx.restore();
    }

    // Spark particles
    particles.forEach(p => {
      p.life = (p.life + 0.009) % 1;
      if (p.life < 0.009) { p.x = bx + (Math.random() - 0.5) * sc * 20; p.y = by; }
      p.x += p.vx;
      p.y += p.vy;
      ctx.fillStyle = `rgba(240,201,106,${(Math.sin(p.life * Math.PI) * 0.85 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    label('The Shofar', a);
  }

  /* ======================================================
     SCENE 1 – DAVID'S HARP
  ====================================================== */
  function drawHarp(t, a) {
    const figX = W * 0.38, figY = H * 0.82, sc = H / 520;

    glow(figX + sc*80, figY - H*0.3, H*0.5, 'rgba(120,50,255,1)', (0.2 * a).toFixed(3));

    // Harp frame
    const hx = figX + sc*50, hy = figY - sc*150;
    const hH = sc*142, hW = sc*95;
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth   = sc * 4;
    ctx.fillStyle   = 'rgba(212,168,83,0.10)';
    ctx.shadowColor = GOLD;
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx, hy + hH);
    ctx.lineTo(hx + hW * 0.65, hy + hH);
    ctx.bezierCurveTo(hx + hW*1.05, hy + hH*0.45, hx + hW*0.75, hy - sc*8, hx + sc*2, hy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Vibrating strings
    for (let i = 0; i < 8; i++) {
      const fr  = (i + 1) / 9;
      const sx  = hx + hW*0.07 + fr*hW*0.55;
      const y1  = hy + fr*sc*4;
      const y2  = hy + hH - fr*sc*6;
      const vib = Math.sin(t / 140 + i * 0.9) * sc * 3.5;
      ctx.save();
      ctx.strokeStyle = 'rgba(240,201,106,0.85)';
      ctx.lineWidth   = 1.4;
      ctx.shadowColor = GOLD_LIGHT;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.moveTo(sx, y1);
      ctx.quadraticCurveTo(sx + vib, (y1 + y2) * 0.5, sx, y2);
      ctx.stroke();
      ctx.restore();
    }

    figure(figX, figY, sc, 'harp');

    // Musical notes floating up
    particles.forEach(p => {
      p.life = (p.life + 0.007) % 1;
      if (p.life < 0.007) {
        p.x = W * 0.48 + (Math.random() - 0.5) * W * 0.22;
        p.y = H * 0.65;
      }
      p.x += p.vx;
      p.y += p.vy;
      ctx.save();
      ctx.globalAlpha = Math.sin(p.life * Math.PI) * 0.9 * a;
      ctx.fillStyle   = GOLD_LIGHT;
      ctx.font        = `${p.size}px serif`;
      ctx.shadowColor = GOLD;
      ctx.shadowBlur  = 8;
      ctx.fillText(p.note, p.x, p.y);
      ctx.restore();
    });

    label("David's Harp", a);
  }

  /* ======================================================
     SCENE 2 – DAVID'S SLING
  ====================================================== */
  function drawSling(t, a) {
    const figX = W * 0.42, figY = H * 0.82, sc = H / 520;

    // Star field background
    particles.forEach(p => {
      p.phase += 0.04;
      ctx.fillStyle = `rgba(212,168,83,${((0.25 + Math.sin(p.phase) * 0.25) * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    glow(figX, figY - H * 0.28, H * 0.55, 'rgba(160,70,255,1)', (0.15 * a).toFixed(3));
    figure(figX, figY, sc, 'sling');

    // Sling orbit
    const armX  = figX + sc * 42;
    const armY  = figY - sc * 228;
    const orbitR = sc * 50;
    const angle  = (t / 350) * Math.PI * 2;
    const stoneX = armX + Math.cos(angle) * orbitR;
    const stoneY = armY + Math.sin(angle) * orbitR * 0.55;

    // Dashed orbit ellipse
    ctx.save();
    ctx.strokeStyle = 'rgba(212,168,83,0.45)';
    ctx.lineWidth   = 1.8;
    ctx.setLineDash([6, 7]);
    ctx.beginPath();
    ctx.ellipse(armX, armY, orbitR, orbitR * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Rope
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth   = sc * 2;
    ctx.beginPath();
    ctx.moveTo(armX, armY);
    ctx.lineTo(stoneX, stoneY);
    ctx.stroke();
    ctx.restore();

    // Stone trail
    for (let i = 5; i >= 1; i--) {
      const ta = angle - i * 0.18;
      ctx.fillStyle = `rgba(212,168,83,${(0.18 - i * 0.028).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(armX + Math.cos(ta) * orbitR, armY + Math.sin(ta) * orbitR * 0.55, sc * (6 - i), 0, Math.PI * 2);
      ctx.fill();
    }

    // Stone (glowing)
    ctx.save();
    ctx.fillStyle   = GOLD_LIGHT;
    ctx.shadowColor = GOLD;
    ctx.shadowBlur  = 18;
    ctx.beginPath();
    ctx.arc(stoneX, stoneY, sc * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    label("David's Sling", a);
  }

  /* ---- Main render loop ---- */
  const scenes = [drawShofar, drawHarp, drawSling];

  function loop(ts) {
    if (!startTime) { startTime = ts; resetParticles(0); }

    const elapsed = ts - startTime;
    const idx     = Math.floor(elapsed / TOTAL) % 3;
    const t       = elapsed % TOTAL;

    if (idx !== lastScene) { resetParticles(idx); lastScene = idx; }

    // Fade alpha
    let a = 1;
    if (t < FADE)             a = t / FADE;
    else if (t > HOLD + FADE) a = 1 - (t - HOLD - FADE) / FADE;
    a = Math.min(1, Math.max(0, a));

    ctx.clearRect(0, 0, W, H);
    drawBg();
    scenes[idx](t, a);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
