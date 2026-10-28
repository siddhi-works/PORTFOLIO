/* Siddhi Kale: cinematic opening, music and sound effects.
   - plays after the laptop intro: avatar video, 3D name layers behind it, the name flying to its place
   - one music track for the whole site, ducked while the avatar speaks, with a sound toggle in the top bar
   - small synthesised sound effects (Web Audio), no extra files
   Everything degrades: no video, reduced motion or a blocked autoplay simply skip the sequence. */
(() => {
  'use strict';
  const d = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const SRC = { video: '/media/intro/avatar.webm', music: '/media/intro/theme.mp3' };
  const KEY = 'sk-sound'; // 'off' when the visitor chose silence
  const T_KEY = 'sk-music-t';
  const BASE = 0.144, LAPTOP = 0.12, DUCK = 0.022; // 40% quieter than the previous mix

  const mem = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  const ses = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  let soundOn = ses.get(KEY) !== 'off';
  let phase = 'page'; // 'laptop' | 'avatar' | 'page': decides the music level
  let ticking = false;

  /* ---------- Web Audio: effects ---------- */
  let ctx = null, master = null, noiseBuf = null, pendingCue = null;
  function unlock() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = soundOn ? 0.7 : 0;
        master.connect(ctx.destination);
      } catch { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        const p = pendingCue;
        pendingCue = null;
        if (p && performance.now() - p.t < 4500 && soundOn) sfx[p.n](...p.a);
      }).catch(() => {});
    }
    return !!ctx;
  }
  const live = () => !!ctx && soundOn && ctx.state === 'running';
  function noise() {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const a = noiseBuf.getChannelData(0);
      for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf; s.loop = true;
    return s;
  }
  const env = (g, t0, peak, a, dur) => {
    g.gain.cancelScheduledValues(t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  };
  function tone(type, f0, f1, dur, peak, a = 0.01, filter) {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    env(g, t, peak, a, dur);
    let node = o;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(filter[0], t);
      f.frequency.exponentialRampToValueAtTime(filter[1], t + dur);
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function swept(f0, f1, dur, peak, q = 4, type = 'bandpass', a = 0.2) {
    const t = ctx.currentTime, s = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, peak, Math.min(a, dur * 0.8), dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + dur + 0.05);
  }
  const sfx = {
    powerUp() { if (!live()) return; tone('sine', 70, 520, 0.7, 0.22, 0.05); tone('triangle', 140, 1040, 0.6, 0.07, 0.05); },
    riser(dur = 1.8) { if (!live()) return; swept(260, 5200, dur, 0.34, 3, 'bandpass', dur * 0.8); tone('sawtooth', 80, 640, dur, 0.06, dur * 0.6, [400, 5000]); },
    hit() { if (!live()) return; tone('sine', 130, 34, 0.9, 0.9, 0.004); swept(2400, 160, 0.5, 0.4, 0.7, 'lowpass', 0.01); },
    whoosh(dur = 1) {
      if (!live()) return;
      const t = ctx.currentTime, s = noise(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.Q.value = 1.3;
      f.frequency.setValueAtTime(200, t);
      f.frequency.exponentialRampToValueAtTime(2800, t + dur * 0.5);
      f.frequency.exponentialRampToValueAtTime(240, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + dur * 0.45);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(master);
      s.start(t); s.stop(t + dur + 0.05);
      tone('sine', 120, 62, dur * 0.85, 0.07, dur * 0.4);
    },
    glitch() { if (!live()) return; swept(4200, 320, 0.26, 0.12, 0.8, 'bandpass', 0.01); tone('square', 190, 60, 0.18, 0.05, 0.003, [3200, 300]); },
    down(dur = 1.4) { if (!live()) return; tone('sawtooth', 190, 30, dur, 0.2, 0.05, [2200, 90]); swept(1800, 90, dur, 0.12, 1, 'lowpass', 0.05); },
    blip(f = 1700, v = 0.045) { if (!live()) return; tone('square', f, f * 0.8, 0.05, v, 0.003, [6000, 1200]); },
    ping() { if (!live()) return; tone('sine', 1320, 1318, 1.1, 0.16, 0.004); tone('sine', 1980, 1976, 0.8, 0.07, 0.004); },
    tick() { if (!live()) return; tone('sine', 2600, 2100, 0.03, 0.018, 0.002); },
    lid() { if (!live()) return; swept(160, 620, 1.0, 0.14, 2.4, 'bandpass', 0.3); tone('sawtooth', 70, 140, 0.9, 0.04, 0.3, [500, 900]); },
    boot(i = 0) { if (!live()) return; tone('square', 900 + i * 420, 900 + i * 420, 0.07, 0.05, 0.004, [5000, 2500]); },
    soft() { if (!live()) return; swept(900, 2600, 0.28, 0.05, 1.4, 'bandpass', 0.1); },
    pop() { if (!live()) return; tone('sine', 520, 980, 0.14, 0.07, 0.006); },
    chime() { if (!live()) return; tone('sine', 784, 783, 0.9, 0.09, 0.005); setTimeout(() => { if (live()) tone('sine', 1175, 1174, 1.0, 0.08, 0.005); }, 120); },
  };

  // before the first click the browser keeps audio suspended: remember the last big cue and play it once allowed
  ['riser', 'hit', 'whoosh', 'down', 'chime', 'ping'].forEach((n) => {
    const f = sfx[n];
    sfx[n] = (...a) => {
      if (live()) { f(...a); return; }
      if (soundOn) pendingCue = { n, a, t: performance.now() };
    };
  });

  /* ---------- music ---------- */
  const music = new Audio();
  music.loop = true;
  music.preload = 'none';
  music.volume = 0;
  const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || null;
  const reloaded = !!nav && nav.type === 'reload';
  if (reloaded) ses.set(T_KEY, '0');
  let tween = 0, resumeAt = reloaded ? 0 : parseFloat(ses.get(T_KEY) || '0') || 0;
  function ramp(to, secs) {
    clearInterval(tween);
    const from = music.volume, t0 = performance.now();
    tween = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / (secs * 1000)), e = k * k * (3 - 2 * k);
      music.volume = Math.max(0, Math.min(1, from + (to - from) * e));
      if (k >= 1) { clearInterval(tween); if (to === 0 && !soundOn) music.pause(); }
    }, 40);
  }
  const level = () => (!soundOn ? 0 : phase === 'avatar' ? DUCK : phase === 'laptop' ? LAPTOP : BASE);
  function startMusic(secs = 1.6) {
    if (!soundOn || reduce && phase === 'page' && !userAsked) return Promise.resolve(false);
    unlock();
    if (!music.src) music.src = SRC.music;
    if (resumeAt > 1 && music.readyState < 1) {
      const at = resumeAt;
      music.addEventListener('loadedmetadata', () => { try { music.currentTime = at % (music.duration || at + 1); } catch { /* ignore */ } }, { once: true });
      resumeAt = 0;
    }
    return music.play().then(() => { audioLive = true; ramp(level(), secs); if (typeof syncToggles === 'function') syncToggles(); return true; }).catch(() => false);
  }
  let userAsked = false;
  let audioLive = false;
  const apply = (secs = 1.4) => { if (soundOn && music.paused) startMusic(secs); else ramp(level(), secs); };

  setInterval(() => { if (!music.paused) ses.set(T_KEY, String(music.currentTime)); }, 1000);
  addEventListener('pagehide', () => { if (!music.paused) ses.set(T_KEY, String(music.currentTime)); });

  /* sound button: a pill with a live equaliser, in the top bar and above the intro */
  const toggles = [];
  function syncToggles() {
    toggles.forEach((b) => {
      b.setAttribute('aria-pressed', String(soundOn));
      b.setAttribute('aria-label', soundOn ? 'Turn the sound off' : 'Turn the sound on');
      b.classList.toggle('is-off', !soundOn);
      const l = $('.snd-l', b);
      if (l) l.textContent = !soundOn ? 'Sound off' : audioLive ? 'Sound on' : 'Tap for sound';
    });
  }
  function flipSound() {
    userAsked = true;
    // sound is wanted but the browser is still holding it back: this press is the permission
    if (soundOn && !audioLive) { hideHint(); unlock(); startMusic(1.2); if (video) video.muted = false; sfx.pop(); return; }
    soundOn = !soundOn;
    ses.set(KEY, soundOn ? 'on' : 'off');
    if (master) master.gain.value = soundOn ? 0.7 : 0;
    syncToggles();
    if (soundOn) { hideHint(); unlock(); startMusic(1.2); if (video) video.muted = false; sfx.pop(); }
    else { ramp(0, 0.5); if (video) video.muted = true; }
  }
  function makeToggle(cls) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.innerHTML = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="snd-l">Sound on</span>';
    b.addEventListener('click', flipSound);
    toggles.push(b);
    syncToggles();
    return b;
  }
  function mountToggle() {
    const tools = $('.bar-tools');
    if (tools && !$('.snd', tools)) tools.insertBefore(makeToggle('snd snd-pill'), tools.firstChild);
    if (!$('.snd-intro')) document.body.appendChild(makeToggle('snd snd-pill snd-intro'));
  }

  /* first gesture on pages where autoplay was blocked */
  let hint = null, gestureArmed = false;
  function showHint() {
    if (hint || reduce) return;
    hint = document.createElement('div');
    hint.className = 'sound-hint';
    hint.setAttribute('role', 'status');
    hint.innerHTML = '<span class="sh-dot"></span>Click anywhere for sound';
    document.body.appendChild(hint);
  }
  function hideHint() {
    if (!hint) return;
    const h = hint;
    hint = null;
    h.classList.add('is-gone');
    setTimeout(() => h.remove(), 500);
  }
  function waitForGesture() {
    if (gestureArmed) return;
    gestureArmed = true;
    const go = () => {
      ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'].forEach((t) => removeEventListener(t, go, true));
      gestureArmed = false;
      hideHint();
      if (!soundOn) return;
      unlock();
      if (music.paused) startMusic(1.8);
      if (video) video.muted = false;
      sfx.powerUp();
    };
    ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'].forEach((t) => addEventListener(t, go, true));
  }

  const GESTURES = ['pointerdown', 'keydown', 'touchend', 'click'];
  function onFirstGesture() {
    hideHint();
    if (!soundOn) return;
    unlock();
    if (video) video.muted = false;
    if (music.paused) startMusic(1.6);
    if (ctx && ctx.state === 'running') GESTURES.forEach((t) => removeEventListener(t, onFirstGesture, true));
  }
  GESTURES.forEach((t) => addEventListener(t, onFirstGesture, true));
  music.addEventListener('playing', () => { audioLive = true; syncToggles(); });

  /* ---------- the cinematic stage ---------- */
  let stage = null, video = null;
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

  function canvas2d(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }

  /* the portrait appears block by block, from coarse pixels to sharp */
  function pixelReveal(done) {
    const box = $('.photo-inner');
    const img = box && $('img', box);
    if (!box || !img || !img.naturalWidth) { d.classList.remove('cinema-hold'); done && done(); return; }
    const r = box.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    const cv = canvas2d(W, H);
    cv.className = 'px-reveal';
    cv.setAttribute('aria-hidden', 'true');
    const cs = getComputedStyle(img);
    const scale = parseFloat((cs.transform.match(/matrix\(([^,]+)/) || [0, 1])[1]) || 1;
    const op = (cs.objectPosition || '50% 50%').split(' ').map((v) => parseFloat(v) / 100);
    const to = (cs.transformOrigin || '50% 50%').split(' ').map((v, i) => parseFloat(v) / (i ? r.height : r.width));
    // draw the image exactly as object-fit: cover and the CSS scale show it
    const full = canvas2d(W, H), fx = full.getContext('2d');
    const cover = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * cover, dh = img.naturalHeight * cover;
    fx.save();
    fx.translate(W * to[0], H * to[1]); fx.scale(scale, scale); fx.translate(-W * to[0], -H * to[1]);
    fx.drawImage(img, (W - dw) * (op[0] || 0), (H - dh) * (isNaN(op[1]) ? 0.5 : op[1]), dw, dh);
    fx.restore();
    box.appendChild(cv);
    img.style.visibility = 'hidden';
    const ctx2 = cv.getContext('2d');
    ctx2.imageSmoothingEnabled = false;
    const steps = [10, 14, 20, 28, 40, 58, 84, 124, 190, 0];
    let k = 0;
    const draw = () => {
      const n = steps[k];
      if (n === 0) { ctx2.imageSmoothingEnabled = true; ctx2.drawImage(full, 0, 0); }
      else {
        const sw = Math.max(1, Math.round(W / (W / n))), sh = Math.max(1, Math.round(n * H / W));
        const small = canvas2d(sw, sh);
        small.getContext('2d').drawImage(full, 0, 0, sw, sh);
        ctx2.clearRect(0, 0, W, H);
        ctx2.drawImage(small, 0, 0, sw, sh, 0, 0, W, H);
      }
      sfx.blip(900 + k * 190, 0.035);
      k++;
      if (k < steps.length) setTimeout(draw, 95 + k * 14);
      else {
        sfx.ping();
        img.style.visibility = '';
        d.classList.remove('cinema-hold');
        setTimeout(() => { cv.remove(); done && done(); }, 160);
      }
    };
    draw();
  }


  /* ---------- motion behind the avatar: glyph rain, dust, radar rings, speed streaks ---------- */
  function startFx(el) {
    const cv = $('.cn-fx', el);
    if (!cv || !cv.getContext) return () => {};
    const g = cv.getContext('2d');
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    let w = 0, h = 0, raf = 0, alive = true;
    const size = () => {
      w = cv.clientWidth || innerWidth || 1280;
      h = cv.clientHeight || innerHeight || 720;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener('resize', size);
    const glyphs = '01<>/{}[]()=+*#$&'.split('');
    const COL = 30;
    const cols = Array.from({ length: Math.ceil((w || 1280) / COL) + 1 }, (_, i) => ({ x: i * COL + 6, v: 40 + Math.random() * 120, p: Math.random() * 1000, n: 6 + Math.floor(Math.random() * 12) }));
    const dust = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, s: Math.random() * 6.28 }));
    const streaks = [];
    const t0 = performance.now();
    function frame(now) {
      if (!alive) return;
      const t = (now - t0) / 1000;
      const k = Math.min(1, t / 1.4);
      g.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.56, R = Math.min(w, h) * 0.5;
      g.font = '14px "JetBrains Mono", monospace';
      for (const c of cols) {
        const head = ((t * c.v + c.p) % (h + c.n * 18)) - 20;
        for (let j = 0; j < c.n; j++) {
          const y = head - j * 18;
          if (y < -18 || y > h + 18) continue;
          const a = (1 - j / c.n) * (j === 0 ? 0.5 : 0.18) * k;
          g.fillStyle = j === 0 ? 'rgba(244,238,226,' + a + ')' : 'rgba(245,165,36,' + a + ')';
          g.fillText(glyphs[Math.floor(c.p + j * 7 + t * 3 + c.x) % glyphs.length], c.x, y);
        }
      }
      for (const p of dust) {
        const x = ((p.x + t * 0.012 * p.z) % 1) * w, y = ((p.y - t * 0.02 * p.z + 1) % 1) * h;
        g.fillStyle = 'rgba(245,190,90,' + ((0.15 + 0.35 * Math.abs(Math.sin(t * 0.8 + p.s))) * p.z * k) + ')';
        g.fillRect(x, y, 1.5 * p.z + 0.5, 1.5 * p.z + 0.5);
      }
      g.lineWidth = 1;
      [[0.62, 0.16, 90], [0.8, -0.1, 140], [1.0, 0.06, 200]].forEach(([r, sp, dash], i) => {
        g.save();
        g.translate(cx, cy); g.rotate(t * sp + i);
        g.strokeStyle = 'rgba(245,165,36,' + ((0.24 - i * 0.05) * k) + ')';
        g.setLineDash([dash, 28 + i * 10]);
        g.beginPath(); g.arc(0, 0, R * r, 0, 6.283); g.stroke();
        g.restore();
      });
      g.save(); g.translate(cx, cy); g.rotate(t * 0.35);
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * 6.283, r1 = R, r2 = r1 + (i % 6 === 0 ? 12 : 5);
        g.strokeStyle = 'rgba(245,165,36,' + ((i % 6 === 0 ? 0.34 : 0.15) * k) + ')';
        g.beginPath(); g.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); g.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); g.stroke();
      }
      g.restore();
      if (g.createConicGradient) {
        const cg = g.createConicGradient(t * 0.9, cx, cy);
        cg.addColorStop(0, 'rgba(245,165,36,' + (0.16 * k) + ')');
        cg.addColorStop(0.14, 'rgba(245,165,36,0)');
        cg.addColorStop(1, 'rgba(245,165,36,0)');
        g.fillStyle = cg; g.beginPath(); g.arc(cx, cy, R * 0.98, 0, 6.283); g.fill();
      }
      if (Math.random() < 0.25) streaks.push({ y: Math.random() * h, x: -200, v: 900 + Math.random() * 1400, l: 90 + Math.random() * 220, a: 0.1 + Math.random() * 0.18 });
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.v / 60;
        if (s.x > w + 50) { streaks.splice(i, 1); continue; }
        const gr = g.createLinearGradient(s.x - s.l, 0, s.x, 0);
        gr.addColorStop(0, 'rgba(245,165,36,0)');
        gr.addColorStop(1, 'rgba(255,214,140,' + (s.a * k) + ')');
        g.fillStyle = gr; g.fillRect(s.x - s.l, s.y, s.l, 1.4);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }

  /* ---------- captions: what she says, typed on the left and right ---------- */
  function readSpeech() {
    const n = document.getElementById('sk-intro');
    if (!n) return null;
    try { return JSON.parse(n.textContent); } catch { return null; }
  }
  function splitPhrases(text, start, end) {
    const out = [];
    text.split(/(?<=[.!?])\s+/).forEach((s) => {
      const t = s.trim();
      if (!t) return;
      if (t.length > 72) t.split(/(?<=[,;:])\s+/).forEach((c) => c.trim() && out.push(c.trim()));
      else out.push(t);
    });
    const weights = out.map((p) => p.length + 10);
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    let at = start;
    return out.map((p, i) => {
      const span = ((end - start) * weights[i]) / total;
      const item = { text: p, t0: at, t1: at + span, side: i % 2 };
      at += span;
      return item;
    });
  }
  function startCaptions(stageEl, v, cfg) {
    const phrases = splitPhrases(cfg.speech, cfg.start || 0.8, cfg.end || 8.6);
    if (!phrases.length) return () => {};
    const sides = [$('.cn-cap-l', stageEl), $('.cn-cap-r', stageEl)];
    const shown = [-1, -1], chars = [0, 0];
    const id = setInterval(() => {
      const t = v.currentTime || 0;
      [0, 1].forEach((s) => {
        let idx = -1;
        phrases.forEach((p, i) => { if (p.side === s && t >= p.t0) idx = i; });
        const el = sides[s];
        if (idx < 0) { el.classList.remove('on'); return; }
        const p = phrases[idx];
        const k = Math.max(0, Math.min(1, (t - p.t0) / Math.max(0.2, (p.t1 - p.t0) * 0.82)));
        const n = Math.round(k * p.text.length);
        if (shown[s] !== idx || chars[s] !== n) {
          el.textContent = '\u201C' + p.text.slice(0, n) + (n >= p.text.length ? '\u201D' : '');
          el.classList.toggle('typing', n < p.text.length);
          if (n !== chars[s] && n % 4 === 0 && n > 0) sfx.tick();
          shown[s] = idx; chars[s] = n;
        }
        el.classList.toggle('on', t < p.t1 + 1.6);
      });
    }, 40);
    return () => clearInterval(id);
  }

  function buildStage() {
    const el = document.createElement('div');
    el.className = 'cn';
    el.setAttribute('aria-hidden', 'true');
    const layers = Array.from({ length: 7 }, (_, i) => `<span class="cn-layer" style="--i:${i}"><span class="cn-ln">Siddhi</span><span class="cn-ln">Kale</span></span>`).join('');
    el.innerHTML = `
      <div class="cn-halo"></div>
      <canvas class="cn-fx"></canvas>
      <div class="cn-floor"></div>
      <div class="cn-scene"><div class="cn-name"><span class="cn-sizer"><span class="cn-ln">Siddhi</span><span class="cn-ln">Kale</span></span>${layers}</div></div>
      <div class="cn-avatar"></div>
      <div class="cn-scan"></div><div class="cn-vig"></div>
      <div class="cn-bar cn-bar-t"></div><div class="cn-bar cn-bar-b"></div>
      <div class="cn-flare"></div><div class="cn-grain"></div>
      <p class="cn-cap cn-cap-l"></p><p class="cn-cap cn-cap-r"></p>
      <button class="cn-skip" type="button">Skip intro</button>`;
    return el;
  }

  function preloadVideo() {
    if (video) return video;
    video = document.createElement('video');
    video.className = 'cn-video';
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.muted = true;
    video.disablePictureInPicture = true;
    if (isSafari) video.classList.add('is-blend');
    video.src = SRC.video;
    video.load();
    return video;
  }

  // The avatar clip is about 7 MB, so skip the cinematic on data saver or a 2G connection.
  function lightConnection() {
    const c = navigator.connection;
    return !!c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''));
  }

  function eligible() {
    return !reduce && !lightConnection() && !!$('.hero .name') && !!document.createElement('video').canPlayType('video/webm');
  }

  function play() {
    const VW = () => innerWidth || d.clientWidth || 1280;
    const VH = () => innerHeight || d.clientHeight || 720;
    if (stage) return;
    stage = buildStage();
    document.body.appendChild(stage);
    d.classList.add('cinema-hold');
    window.scrollTo(0, 0);
    const v = preloadVideo();
    v.muted = !soundOn;
    $('.cn-avatar', stage).appendChild(v);

    const heroName = $('.hero .name');
    const sizer = $('.cn-sizer', stage);
    const group = $('.cn-name', stage);
    const stageEl = stage;
    const stopFx = startFx(stageEl);
    let stopCaps = () => {};
    let finished = false, moved = false, ended = false;
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

    // size the name for the stage, remember the ratio to the hero name
    const heroPx = parseFloat(getComputedStyle(heroName).fontSize) || 64;
    const stagePx = Math.max(heroPx * 1.4, Math.min(VW() * 0.17, VH() * 0.3));
    stageEl.style.setProperty('--cn-px', stagePx.toFixed(1) + 'px');

    function land(instant) {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      d.classList.add('cinema-landed');
      d.classList.remove('is-cinema');
      stopFx();
      stopCaps();
      sfx.chime();
      try { v.pause(); } catch { /* ignore */ }
      phase = 'page';
      apply(2.4);
      if (typeof window.SKLit === 'function') window.SKLit();
      ticking = true;
      stageEl.classList.add('is-leaving');
      const fade = instant ? 0 : 520;
      later(() => { stageEl.remove(); stage = null; }, fade + 60);
      later(() => pixelReveal(() => { ticking = false; }), instant ? 150 : 700);
    }

    function moveName() {
      if (moved || finished) return;
      moved = true;
      stageEl.classList.add('is-moving');
      sfx.whoosh(1.7);
      // where the hero name is, measured on its text
      const range = document.createRange();
      range.selectNodeContents(heroName);
      const hr = range.getBoundingClientRect();
      const w = sizer.offsetWidth || 1, h = sizer.offsetHeight || 1;
      const s = Math.max(0.05, Math.min(hr.width / w, hr.height / h));
      const dx = hr.left + hr.width / 2 - VW() / 2;
      const dy = hr.top + hr.height / 2 - VH() / 2;
      const a = group.animate(
        [{ transform: getComputedStyle(group).transform }, { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotateY(0deg) rotateX(0deg)` }],
        { duration: 1700, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'forwards' });
      a.finished.then(() => land(false), () => land(false));
      later(() => land(false), 3000);
    }

    function dissolve() {
      if (ended) return;
      ended = true;
      stageEl.classList.add('is-dissolve');
      sfx.down(1.5);
      phase = 'page';
      apply(3.2);
      later(moveName, 1300);
    }

    function skip() { dissolve(); ended = true; stageEl.classList.add('is-dissolve'); land(true); }
    $('.cn-skip', stageEl).addEventListener('click', skip);
    const esc = (e) => { if (e.key === 'Escape' && stage) skip(); };
    addEventListener('keydown', esc);

    // act one: the name arrives in depth
    sfx.riser(0.75);
    for (let i = 0; i < 7; i++) later(() => sfx.blip(260 + (6 - i) * 70, 0.045), 120 + (6 - i) * 85 + 260);
    later(() => stageEl.classList.add('is-in'), 40);
    later(() => { sfx.hit(); stageEl.classList.add('is-glitch'); later(() => stageEl.classList.remove('is-glitch'), 420); }, 700);

    // act two: the avatar speaks, the music steps back
    later(() => {
      phase = 'avatar';
      apply(1.2);
      stageEl.classList.add('is-speaking');
      v.currentTime = 0;
      const cfg = readSpeech();
      if (cfg && cfg.speech) stopCaps = startCaptions(stageEl, v, cfg);
      const p = v.play();
      if (p && p.catch) p.catch(() => {
        // blocked with sound: try silently, otherwise skip the clip
        v.muted = true;
        const q = v.play();
        if (q && q.catch) q.catch(() => later(dissolve, 1200));
      });
    }, 900);

    v.addEventListener('ended', dissolve, { once: true });
    v.addEventListener('error', () => later(dissolve, 400), { once: true });
    v.addEventListener('timeupdate', () => {
      if (v.duration && v.currentTime > v.duration - 0.85) dissolve();
    });
    later(dissolve, 16000); // never trap anyone behind an animation
  }

  /* ---------- hand-over points used by site.js ---------- */
  window.SKCinema = {
    sfx,
    eligible,
    play,
    get ticking() { return ticking; },
    // called as soon as the laptop starts
    arm(withSound) {
      userAsked = true;
      soundOn = true;
      ses.set(KEY, 'on');
      mountToggle();
      unlock();
      phase = 'laptop';
      startMusic(2.2).then((ok) => { if (ok) sfx.powerUp(); else { showHint(); waitForGesture(); } });
      if (eligible()) preloadVideo();
    },
    phase(p) { phase = p; },
    debug() { return { ctx: ctx && ctx.state, musicPaused: music.paused, volume: +music.volume.toFixed(3), soundOn, audioLive, phase, level: level(), readyState: music.readyState, error: music.error && music.error.code }; },
  };

  /* ---------- every page ---------- */
  const boot = () => {
    mountToggle();
    const firstVisit = d.classList.contains('is-portal');
    if (firstVisit) { if (eligible()) preloadVideo(); return; } // the gate decides about sound
    if (!soundOn || reduce) return;
    startMusic(2).then((ok) => { if (!ok) waitForGesture(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
