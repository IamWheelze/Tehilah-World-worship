/* ============================================
   Tehilah World Worship — Cloud Animation
   Realistic drifting clouds on hero canvas
   ============================================ */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  /* ---- resize canvas to fill hero ---- */
  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    initClouds();
  }
  window.addEventListener('resize', resize);

  /* ---- cloud definitions ---- */
  const cloudDefs = [];

  function makeCloud(xFraction, yFraction, scale, speed, alpha, delay) {
    return {
      xFrac:  xFraction,   // 0‑1 starting x as fraction of canvas width
      yFrac:  yFraction,   // 0‑1 y position as fraction of canvas height
      scale:  scale,
      speed:  speed,       // pixels per second
      alpha:  alpha,
      delay:  delay,       // seconds already elapsed in journey (negative offset)
      x:      0,           // computed in initClouds
      y:      0,
    };
  }

  function initClouds() {
    const W = canvas.width;
    const H = canvas.height;

    cloudDefs.length = 0;

    /* Spread clouds at various heights; negative delay = already on-screen */
    cloudDefs.push(makeCloud(-0.1,  0.12, 1.3,  38,  0.22,  0));
    cloudDefs.push(makeCloud( 0.35, 0.24, 1.0,  26,  0.18, -8));
    cloudDefs.push(makeCloud(-0.05, 0.40, 1.6,  32,  0.20, -12));
    cloudDefs.push(makeCloud( 0.60, 0.55, 0.9,  22,  0.16, -5));
    cloudDefs.push(makeCloud( 0.15, 0.65, 1.4,  42,  0.22, -18));
    cloudDefs.push(makeCloud(-0.15, 0.78, 1.1,  28,  0.17, -3));
    cloudDefs.push(makeCloud( 0.75, 0.88, 0.8,  18,  0.14, -9));

    for (const c of cloudDefs) {
      c.x = c.xFrac * W + c.delay * c.speed;
      c.y = c.yFrac * H;
    }
  }

  /* ---- draw one realistic cloud ----
     Built from overlapping circles + shadow blur for soft, puffy edges.
     cx/cy = centre of the cloud mass.                                   */
  function drawCloud(cx, cy, scale, alpha) {
    const r  = 55 * scale;   // base radius unit
    const blobs = [
      /* [dx, dy, radius_factor]  — relative to centre */
      [  0,      0,     1.0  ],   // main body centre
      [ -r*0.55, r*0.12, 0.72],   // left body
      [  r*0.55, r*0.12, 0.68],   // right body
      [ -r*0.22,-r*0.58, 0.80],   // upper-left peak
      [  r*0.25,-r*0.65, 0.88],   // main top peak
      [  r*0.65,-r*0.40, 0.65],   // upper-right shoulder
      [ -r*0.75,-r*0.18, 0.55],   // far left shoulder
      [  r*0.82, r*0.05, 0.52],   // far right
    ];

    ctx.save();

    /* Soft glow behind the cloud */
    ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.55})`;
    ctx.shadowBlur  = 28 * scale;
    ctx.fillStyle   = `rgba(255, 255, 255, ${alpha})`;

    for (const [dx, dy, rf] of blobs) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, r * rf, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Second lighter pass — brightens the upper crown */
    ctx.shadowBlur = 0;
    ctx.fillStyle  = `rgba(255, 255, 255, ${alpha * 0.45})`;
    ctx.beginPath();
    ctx.arc(cx + r * 0.25, cy - r * 0.62, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - r * 0.2, cy - r * 0.52, r * 0.48, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ---- animation loop ---- */
  let lastTs = null;

  function animate(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.1); // seconds, cap at 100ms
    lastTs = ts;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    for (const c of cloudDefs) {
      drawCloud(c.x, c.y, c.scale, c.alpha);

      c.x += c.speed * dt;

      /* wrap back to the left once fully off-screen right */
      if (c.x - 200 * c.scale > W) {
        c.x = -280 * c.scale;
        c.y = c.yFrac * H + (Math.random() - 0.5) * 40; // slight y variation
      }
    }

    requestAnimationFrame(animate);
  }

  /* ---- kick off ---- */
  resize();
  requestAnimationFrame(animate);
})();
