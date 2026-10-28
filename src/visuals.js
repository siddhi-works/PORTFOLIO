/* Generative pictures for each project, drawn from the project's own facts.
   One canvas per project, animated only while on screen, one still frame when
   the visitor prefers reduced motion. Replace with real screenshots any time:
   screenshots go in the case-study page; these stay as the cover art. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IV = '238,231,218', AM = '228,167,63', HI = '255,208,122';
  const rgba = (c, a) => `rgba(${c},${a})`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const g = (x, m, s) => Math.exp(-((x - m) * (x - m)) / (2 * s * s));
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const font = (px, w = 500) => `${w} ${px}px 'Sora', Arial, sans-serif`;

  /* ---- Chicago: a field of records; heat moves like crime does ---- */
  function chicago(ctx, w, h, t, s) {
    const m = Math.min(w, h), step = Math.max(11, Math.round(m / 26));
    const blobs = [[0.27, 0.4, 0.2], [0.62, 0.6, 0.26], [0.82, 0.24, 0.15], [0.45, 0.82, 0.14]];
    for (let y = step / 2; y < h + step; y += step) {
      for (let x = step / 2; x < w + step; x += step) {
        const u = x / w, v = y / h;
        let val = 0.16 + 0.12 * Math.sin(u * 7 + t * 0.5) + 0.1 * Math.sin(v * 5 - t * 0.4 + u * 3);
        blobs.forEach(([bx, by, br], i) => {
          const dx = x - (bx + 0.035 * Math.sin(t * 0.3 + i)) * w, dy = y - (by + 0.035 * Math.cos(t * 0.27 + i)) * h;
          val += 0.8 * Math.exp(-(dx * dx + dy * dy) / ((br * m * 1.1) ** 2));
        });
        if (s.px >= 0) { const dx = x - s.px, dy = y - s.py; val += 1.1 * Math.exp(-(dx * dx + dy * dy) / ((m * 0.16) ** 2)); }
        val = clamp(val, 0.04, 1.15);
        const r = step * 0.46 * clamp(val, 0.12, 1);
        ctx.fillStyle = val > 0.68 ? rgba(AM, 0.4 + 0.6 * Math.min(1, val)) : rgba(IV, 0.1 + 0.3 * val);
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
      }
    }
  }

  /* ---- ClaimMate: several agents, one claim, two languages ---- */
  function claimmate(ctx, w, h, t) {
    const cx = w * 0.5, cy = h * 0.5, rx = w * 0.3, ry = h * 0.32, n = 5;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.12;
      return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    });
    ctx.lineWidth = 1;
    pts.forEach(([x, y], i) => {
      ctx.strokeStyle = rgba(IV, 0.2); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();
      const nxt = pts[(i + 1) % n]; ctx.strokeStyle = rgba(IV, 0.08); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nxt[0], nxt[1]); ctx.stroke();
    });
    pts.forEach(([x, y], i) => {
      const p = (t * 0.45 + i * 0.2) % 1, out = p < 0.5, k = out ? p * 2 : (1 - p) * 2;
      const px = lerp(cx, x, ease(k)), py = lerp(cy, y, ease(k));
      ctx.fillStyle = rgba(HI, 0.95); ctx.beginPath(); ctx.arc(px, py, 3.2, 0, 6.283); ctx.fill();
      ctx.fillStyle = rgba(IV, 0.85); ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill();
      ctx.strokeStyle = rgba(AM, 0.5 + 0.5 * Math.sin(t * 2 + i)); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 14 + 3 * Math.sin(t * 2 + i), 0, 6.283); ctx.stroke();
    });
    const flip = Math.floor(t / 1.6) % 2 === 0;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = rgba(AM, 1); ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.12, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#1a1204';
    ctx.font = flip ? font(Math.min(w, h) * 0.075, 700) : `700 ${Math.min(w, h) * 0.075}px 'Noto Sans Devanagari','Nirmala UI','Mangal',sans-serif`;
    ctx.fillText(flip ? 'Claim' : 'दावा', cx, cy + 1);
  }

  /* ---- LAND-GPT: parcels from three states under one ID ---- */
  function landgpt(ctx, w, h, t, s) {
    if (s.key !== w + 'x' + h) {
      s.key = w + 'x' + h; const r = rng(7), cl = [];
      [[0.17, 0.62], [0.5, 0.5], [0.83, 0.62]].forEach(([ux, uy], ci) => {
        const cw = w * 0.25, ch = h * 0.34, cols = 5, rows = 4, pts = [];
        for (let j = 0; j <= rows; j++) { pts[j] = []; for (let i = 0; i <= cols; i++) pts[j][i] = [ux * w - cw / 2 + (i / cols) * cw + (r() - 0.5) * cw * 0.07, uy * h - ch / 2 + (j / rows) * ch + (r() - 0.5) * ch * 0.1]; }
        const cells = [];
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) cells.push({ q: [pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]], o: r() * 9 });
        cl.push({ ux: ux * w, uy: uy * h, cells, ci });
      });
      s.cl = cl;
    }
    const chip = [w * 0.5, h * 0.14];
    s.cl.forEach((c) => {
      ctx.strokeStyle = rgba(AM, 0.35); ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(chip[0], chip[1] + 12); ctx.lineTo(c.ux, c.uy - h * 0.18); ctx.stroke(); ctx.setLineDash([]);
      c.cells.forEach((cell) => {
        const cxm = cell.q.reduce((a, p) => a + p[0], 0) / 4, cym = cell.q.reduce((a, p) => a + p[1], 0) / 4;
        const pulse = (Math.sin(t * 0.9 + cell.o) + 1) / 2, near = s.px >= 0 ? Math.exp(-(((cxm - s.px) ** 2 + (cym - s.py) ** 2) / (w * 0.07) ** 2)) : 0;
        const on = pulse > 0.86 || near > 0.4;
        ctx.beginPath(); ctx.moveTo(cell.q[0][0], cell.q[0][1]); cell.q.slice(1).forEach((p) => ctx.lineTo(p[0], p[1])); ctx.closePath();
        ctx.fillStyle = on ? rgba(AM, 0.55 + 0.4 * near) : rgba(IV, 0.04 + 0.05 * pulse); ctx.fill();
        ctx.strokeStyle = rgba(IV, on ? 0.6 : 0.22); ctx.lineWidth = 1; ctx.stroke();
      });
    });
    ctx.fillStyle = rgba(AM, 1); const cw = Math.max(86, w * 0.16), chh = 30;
    ctx.fillRect(chip[0] - cw / 2, chip[1] - chh / 2, cw, chh);
    ctx.fillStyle = '#1a1204'; ctx.font = font(Math.max(13, w * 0.022), 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ULPIN', chip[0], chip[1] + 1);
  }

  /* ---- ARIA: papers in, a typeset paper out ---- */
  function aria(ctx, w, h, t) {
    const ph = (t % 10) / 10, m = Math.min(w, h);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    ctx.font = font(Math.max(12, m * 0.035)); ctx.fillStyle = rgba(IV, 0.55);
    ctx.fillText('arXiv', w * 0.12, h * 0.14);
    for (let i = 0; i < 16; i++) {
      const k = (ph * 2.2 + i / 16) % 1, y0 = h * (0.24 + 0.52 * ((i * 0.37) % 1));
      const x = lerp(w * 0.07, w * 0.42, ease(k)), y = lerp(y0, h * 0.5, ease(k));
      ctx.fillStyle = rgba(IV, 0.15 + 0.5 * (1 - Math.abs(k - 0.5) * 2));
      ctx.fillRect(x - 5, y - 6, 10, 12);
    }
    const hx = w * 0.46, hy = h * 0.5, hr = m * 0.1, a = t * 0.9;
    ctx.strokeStyle = rgba(AM, 1); ctx.lineWidth = 2; ctx.shadowColor = rgba(AM, 0.6); ctx.shadowBlur = 12; ctx.beginPath();
    for (let i = 0; i <= 6; i++) { const an = a + (i / 6) * 6.283; ctx.lineTo(hx + Math.cos(an) * hr, hy + Math.sin(an) * hr); }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = rgba(IV, 0.9); ctx.beginPath(); ctx.arc(hx, hy, 4, 0, 6.283); ctx.fill();
    const pw = Math.min(w * 0.26, m * 0.62), pH = pw * 1.32, px = w * 0.72 - pw / 2, py = h * 0.5 - pH / 2;
    ctx.fillStyle = rgba(IV, 0.92); ctx.fillRect(px, py, pw, pH);
    const lines = 11, done = clamp(ph * 1.55, 0, 1) * lines;
    for (let i = 0; i < lines; i++) {
      const f = clamp(done - i, 0, 1), lw = pw * (i === 0 ? 0.55 : 0.78 - ((i * 7) % 5) * 0.06);
      ctx.fillStyle = i === 0 ? '#1a1204' : 'rgba(26,18,4,.55)';
      ctx.fillRect(px + pw * 0.11, py + pH * 0.1 + i * pH * 0.075, lw * f, i === 0 ? 5 : 3);
    }
    ctx.font = font(Math.max(12, m * 0.035)); ctx.fillStyle = rgba(IV, 0.55); ctx.fillText('LaTeX', w * 0.72, py - 18);
    const stamp = ease((ph - 0.7) / 0.1);
    if (stamp > 0) {
      ctx.save(); ctx.translate(px + pw * 0.8, py + pH * 0.9); ctx.rotate(-0.14); ctx.globalAlpha = stamp;
      ctx.fillStyle = rgba(AM, 1); ctx.fillRect(-30, -15, 60, 30);
      ctx.fillStyle = '#1a1204'; ctx.font = font(15, 800); ctx.fillText('PDF', 0, 1); ctx.restore();
    }
  }

  /* ---- CensusGuru: one guide, five languages, a claim checked ---- */
  function census(ctx, w, h, t, s) {
    if (s.key !== 'c') { s.key = 'c'; const r = rng(11); s.len = Array.from({ length: 5 }, () => Array.from({ length: 8 }, () => 0.45 + r() * 0.55)); }
    const colW = w * 0.14, gap = w * 0.035, x0 = (w - (5 * colW + 4 * gap)) / 2, y0 = h * 0.16, lineH = h * 0.075;
    const active = Math.floor(t / 1.1) % 6;
    for (let c = 0; c < 5; c++) {
      const on = active === c, x = x0 + c * (colW + gap);
      s.len[c].forEach((l, i) => {
        ctx.fillStyle = on ? rgba(AM, 0.95) : rgba(IV, c < active ? 0.38 : 0.16);
        const f = on ? ease((t % 1.1) / 0.6 - i * 0.05) : 1;
        ctx.fillRect(x, y0 + i * lineH, colW * l * f, Math.max(4, h * 0.016));
      });
    }
    const cx = w * 0.5, cy = h * 0.84, r = Math.min(w, h) * 0.07, p = active === 5 ? ease((t % 1.1) / 0.5) : active > 5 ? 1 : 0;
    ctx.strokeStyle = rgba(AM, 0.35 + 0.65 * p); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
    ctx.strokeStyle = rgba(HI, p); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(cx - r * 0.45, cy);
    ctx.lineTo(lerp(cx - r * 0.45, cx - r * 0.1, clamp(p * 2, 0, 1)), lerp(cy, cy + r * 0.38, clamp(p * 2, 0, 1)));
    if (p > 0.5) ctx.lineTo(lerp(cx - r * 0.1, cx + r * 0.5, (p - 0.5) * 2), lerp(cy + r * 0.38, cy - r * 0.4, (p - 0.5) * 2));
    ctx.stroke(); ctx.lineCap = 'butt';
  }

  /* ---- Bot detection: coordinated accounts, found by a sweeping detector ---- */
  function bots(ctx, w, h, t, s) {
    if (s.key !== w + 'x' + h) {
      s.key = w + 'x' + h;
      const r = rng(5), pts = [];
      for (let i = 0; i < 44; i++) pts.push({ x: 0.06 + r() * 0.88, y: 0.1 + r() * 0.8, bot: false, o: r() * 6 });
      [[0.3, 0.36], [0.72, 0.64]].forEach(([cx, cy]) => {
        for (let i = 0; i < 9; i++) pts.push({ x: cx + (r() - 0.5) * 0.2, y: cy + (r() - 0.5) * 0.24, bot: true, o: r() * 6 });
      });
      s.pts = pts;
    }
    const P = s.pts.map((p) => ({ ...p, px: p.x * w, py: p.y * h }));
    const sweep = (((t * 0.13) % 1.25) - 0.1) * w;
    ctx.lineWidth = 1;
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j], d = Math.hypot(a.px - b.px, a.py - b.py);
        if (a.bot && b.bot && d < w * 0.26) { ctx.strokeStyle = rgba(AM, 0.4); ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke(); }
        else if (!a.bot && !b.bot && d < w * 0.1) { ctx.strokeStyle = rgba(IV, 0.1); ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke(); }
      }
    }
    P.forEach((p) => {
      const found = p.px < sweep, pulse = 0.5 + 0.5 * Math.sin(t * 2.4 + p.o);
      ctx.fillStyle = p.bot ? rgba(AM, 0.7 + 0.3 * pulse) : rgba(IV, 0.5);
      ctx.beginPath(); ctx.arc(p.px, p.py, p.bot ? 4 + pulse * 1.5 : 3, 0, 6.283); ctx.fill();
      if (p.bot && found) { ctx.strokeStyle = rgba(HI, 0.9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.px, p.py, 11, 0, 6.283); ctx.stroke(); }
    });
    const g = ctx.createLinearGradient(sweep - 40, 0, sweep, 0);
    g.addColorStop(0, rgba(AM, 0)); g.addColorStop(1, rgba(AM, 0.28));
    ctx.fillStyle = g; ctx.fillRect(sweep - 40, 0, 40, h);
    ctx.fillStyle = rgba(HI, 0.9); ctx.fillRect(sweep, 0, 2, h);
  }

  /* ---- fallback cover: orbiting arcs and nodes, seeded per project ---- */
  function generic(ctx, w, h, t, s) {
    const r = rng(s.seed || 1), cx = w * 0.5, cy = h * 0.52, m = Math.min(w, h);
    for (let i = 0; i < 7; i++) {
      const rad = (0.14 + i * 0.075) * m, dir = i % 2 ? 1 : -1, a0 = r() * 6.283 + t * 0.12 * dir, len = 1.6 + r() * 2;
      ctx.strokeStyle = i % 3 === 0 ? rgba(AM, 0.55) : rgba(IV, 0.15);
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(cx, cy, rad, a0, a0 + len); ctx.stroke();
      const na = a0 + len * (0.5 + 0.5 * Math.sin(t * 0.8 + i));
      ctx.fillStyle = i % 3 === 0 ? rgba(HI, 0.95) : rgba(IV, 0.6);
      ctx.beginPath(); ctx.arc(cx + Math.cos(na) * rad, cy + Math.sin(na) * rad, 3.2, 0, 6.283); ctx.fill();
    }
    ctx.fillStyle = rgba(AM, 0.9); ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 6.283); ctx.fill();
  }

  const art = { chicago, claimmate, landgpt, aria, census, bots, generic };

  function mount(cv) {
    const fn = art[cv.dataset.visual];
    if (!fn) return;
    const ctx = cv.getContext('2d');
    const s = { px: -1, py: -1, seed: Number(cv.dataset.seed) || 1 };
    let w = 0, h = 0, raf = 0, visible = false, t0 = performance.now();
    const frame = (now) => {
      const t = reduce ? 3.4 : (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.save(); fn(ctx, w, h, t, s); ctx.restore();
      raf = visible && !reduce ? requestAnimationFrame(frame) : 0;
    };
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!raf) requestAnimationFrame(frame);
    };
    new ResizeObserver(size).observe(cv);
    new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    }).observe(cv);
    const host = cv.closest('.pcard, a, .case-hero') || cv;
    host.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); s.px = e.clientX - r.left; s.py = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { s.px = -1; s.py = -1; });
    size();
  }

  /* ---- the page itself: drifting tools joined by thin lines, drawn once, behind everything ---- */
  function mountField() {
    if (document.getElementById('field')) return;
    const cv = document.createElement('canvas');
    cv.id = 'field';
    cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv);
    const ctx = cv.getContext('2d');
    const WORDS = ['LangGraph', 'Gemini', 'React', 'Python', 'TypeScript', 'd3', 'SQL', 'R', 'Vercel', 'agent()', '{ }', '</>',
      '0101', 'λ', 'Σ', 'arXiv', 'ULPIN', 'OTP', 'GIS', 'LaTeX'];
    const r = rng(23);
    let w = 0, h = 0, nodes = [], mx = -9999, my = -9999, raf = 0;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(80, Math.max(26, Math.round((w * h) / 22000)));
      nodes = Array.from({ length: n }, (_, i) => ({
        x: r() * w, y: r() * h, vx: (r() - 0.5) * 0.22, vy: (r() - 0.5) * 0.22, z: 0.3 + r() * 0.7,
        label: i % 4 === 0 ? WORDS[(i / 4 | 0) % WORDS.length] : null,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      const pts = nodes.map((n) => {
        if (!reduce) { n.x += n.vx; n.y += n.vy; if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20; if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20; }
        const y = (((n.y - sy * 0.16 * n.z) % h) + h) % h;
        return { n, x: n.x + (mx > -999 ? (mx - w / 2) * -0.018 * n.z : 0), y };
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dd = dx * dx + dy * dy;
          if (dd < 19600) { ctx.strokeStyle = `rgba(${AM},${0.16 * (1 - Math.sqrt(dd) / 140)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
        const px = pts[i].x - mx, py = pts[i].y - my, pd = px * px + py * py;
        if (pd < 32400) { ctx.strokeStyle = `rgba(${HI},${0.38 * (1 - Math.sqrt(pd) / 180)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mx, my); ctx.stroke(); }
      }
      pts.forEach(({ n, x, y }) => {
        ctx.fillStyle = `rgba(${AM},${0.25 + 0.45 * n.z})`;
        ctx.beginPath(); ctx.arc(x, y, 1.1 + 1.7 * n.z, 0, 6.283); ctx.fill();
        if (n.label) { ctx.font = font(11 + 2 * n.z, 500); ctx.fillStyle = `rgba(${IV},${0.1 + 0.12 * n.z})`; ctx.textAlign = 'left'; ctx.fillText(n.label, x + 8, y + 4); }
      });
      raf = reduce ? 0 : requestAnimationFrame(draw);
    };
    size(); draw();
    window.addEventListener('resize', () => { size(); if (reduce) draw(); });
    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
    if (reduce) window.addEventListener('scroll', () => draw(), { passive: true });
    void raf;
  }

  const go = () => { document.querySelectorAll('canvas[data-visual]').forEach(mount); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
})();
