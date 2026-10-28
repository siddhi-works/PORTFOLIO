/* Siddhi Kale: the cartoon character.
   A cute flat illustration drawn in SVG, based on Siddhi's photos: long dark wavy hair, warm skin, a gentle smile,
   a small silver earring and pendant, a blush blazer over a black top.
   In the hero it blinks, sways, twinkles and looks toward the pointer. It can also speak along with a recorded clip. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  // loudness of the original voice clip every 50 ms, 0 to 100 (used to move the mouth if the character ever speaks with it)
  const ENV = '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,57,86,47,12,0,0,0,0,0,25,50,41,14,9,28,51,34,2,0,0,0,0,0,0,0,0,0,0,15,69,81,70,25,20,48,13,20,25,30,78,32,50,43,36,35,33,18,14,11,5,2,0,0,0,0,49,66,39,22,32,48,34,35,29,30,33,30,27,18,15,11,1,0,0,0,0,31,39,14,56,69,44,40,30,47,25,27,13,12,6,40,23,16,12,36,5,0,0,20,5,17,24,15,22,23,9,12,2,0,4,1,0,0,0,0,0,0,0,0,11,23,100,88,46,14,28,35,60,20,23,32,23,45,19,25,22,1,0,0,0,0,0,0,0,43,36,44,69,32,36,31,11,6,4,0,0,0,0,0,0,0,0'.split(',').map(Number);
  const STEP = 0.05;

  const C = { hair: '#2c1810', hairHi: '#5e3f2d', skin: '#e6b08a', skinShade: '#c98d68', blush: '#f08a80', top: '#e3a9a2', line: '#4b2d1f', lip: '#c9625a', lipDark: '#8d453f', mouth: '#2e0f14', iris: '#3a2014', silver: '#e3e7eb', spark: '#ffd27a' };

  const art = `
<svg class="toon-svg" viewBox="0 0 400 460" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi">
  <defs>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".55" stop-color="${C.hair}"/><stop offset="1" stop-color="#2a170f"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M200 26 C108 24 50 86 52 172 C54 238 34 292 42 352 C48 394 38 420 54 440 C76 452 94 432 98 412 C112 434 140 432 150 406 L250 406 C260 432 288 434 302 412 C306 432 324 452 346 440 C362 420 352 394 358 352 C366 292 346 238 348 172 C350 86 292 24 200 26 Z" fill="url(#tn-hair)"/>
    <rect x="178" y="226" width="44" height="46" rx="14" fill="${C.skinShade}"/>
    <path d="M144 276 C144 266 256 266 256 276 L280 372 C284 398 268 414 246 416 L154 416 C132 414 116 398 120 372 Z" fill="${C.top}"/>
    <path d="M150 288 C124 300 112 330 110 372" fill="none" stroke="${C.line}" stroke-width="34"/>
    <path d="M150 288 C124 300 112 330 110 372" fill="none" stroke="${C.top}" stroke-width="29"/>
    <path d="M250 288 C276 300 288 330 290 372" fill="none" stroke="${C.line}" stroke-width="34"/>
    <path d="M250 288 C276 300 288 330 290 372" fill="none" stroke="${C.top}" stroke-width="29"/>
    <circle cx="110" cy="388" r="14" fill="${C.skin}"/><circle cx="290" cy="388" r="14" fill="${C.skin}"/>
    <path d="M176 270 C182 296 194 306 200 308 C206 306 218 296 224 270" fill="${C.skin}"/>
    <path d="M188 306 C192 320 208 320 212 306" fill="none" stroke="${C.silver}" stroke-width="2" stroke-linecap="round"/>
    <path d="M200 322 l4.4 6.6 l-4.4 6.6 l-4.4 -6.6 z" fill="${C.spark}" stroke-width="1.6"/>
  </g></g>

  <g class="toon-head">
    <g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M92 130 C92 66 138 40 200 40 C262 40 308 66 308 130 C308 198 262 240 200 240 C138 240 92 198 92 130 Z" fill="${C.skin}"/>
    </g>
    <ellipse cx="124" cy="184" rx="18" ry="10" fill="${C.blush}" opacity=".6"/><ellipse cx="276" cy="184" rx="18" ry="10" fill="${C.blush}" opacity=".6"/>

    <g class="toon-brows" fill="none" stroke="${C.line}" stroke-width="4" stroke-linecap="round">
      <path d="M138 118 C148 110 162 109 172 113"/>
      <path d="M262 118 C252 110 238 109 228 113"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:152px 148px">
        <ellipse cx="152" cy="148" rx="24" ry="28" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="152" cy="150" rx="21" ry="25.5" fill="${C.iris}"/>
          <ellipse cx="152" cy="153" rx="12" ry="15" fill="#1e0f08" opacity=".55"/>
          <circle cx="143" cy="139" r="7.5" fill="#fff"/><circle cx="162" cy="162" r="3.6" fill="#fff" opacity=".95"/>
        </g>
        <path d="M126 144 C131 118 173 118 178 144" fill="none" stroke="${C.line}" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M127 146 C122 144 119 140 118 135" fill="none" stroke="${C.line}" stroke-width="3.2" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:248px 148px">
        <ellipse cx="248" cy="148" rx="24" ry="28" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="248" cy="150" rx="21" ry="25.5" fill="${C.iris}"/>
          <ellipse cx="248" cy="153" rx="12" ry="15" fill="#1e0f08" opacity=".55"/>
          <circle cx="239" cy="139" r="7.5" fill="#fff"/><circle cx="258" cy="162" r="3.6" fill="#fff" opacity=".95"/>
        </g>
        <path d="M274 144 C269 118 227 118 222 144" fill="none" stroke="${C.line}" stroke-width="5.4" stroke-linecap="round"/>
        <path d="M273 146 C278 144 281 140 282 135" fill="none" stroke="${C.line}" stroke-width="3.2" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M198 180 C197 184 199 186 202 185" fill="none" stroke="${C.line}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="184" y="196" width="32" height="6" rx="2" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="214" rx="8" ry="5" fill="#e07a7a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
    </g>

    <g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" fill="url(#tn-hair)">
      <path d="M182 36 C112 34 76 84 80 150 C84 190 76 224 66 256 C58 280 74 292 90 276 C112 252 108 214 112 182 C116 152 128 124 146 104 C162 88 176 66 182 36 Z"/>
      <path d="M190 36 C268 32 326 84 320 150 C316 190 324 224 334 256 C342 280 326 292 310 276 C288 252 292 214 288 182 C284 152 274 124 254 104 C234 86 200 74 190 36 Z"/>
      <path d="M200 30 C192 8 214 -2 230 12 C218 14 212 24 214 38 Z"/>
    </g>
    <path d="M176 46 C130 48 96 84 92 140" fill="none" stroke="${C.hairHi}" stroke-width="3.4" stroke-linecap="round" opacity=".7"/>
    <path d="M196 46 C250 46 296 84 308 140" fill="none" stroke="${C.hairHi}" stroke-width="3.4" stroke-linecap="round" opacity=".7"/>
    <path d="M84 196 C90 220 84 242 80 262" fill="none" stroke="${C.hairHi}" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="M316 196 C310 220 316 242 320 262" fill="none" stroke="${C.hairHi}" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <g class="toon-clip" transform="translate(292 102) rotate(18)"><path d="M0 -13 L3.6 -4 L13 -3.6 L5.6 2.4 L8 12 L0 6.6 L-8 12 L-5.6 2.4 L-13 -3.6 L-3.6 -4 Z" fill="${C.spark}" stroke="#9a6a1c" stroke-width="1.6" stroke-linejoin="round"/></g>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:34px 96px" d="M34 80 L38 91 L50 96 L38 101 L34 112 L30 101 L18 96 L30 91 Z"/>
    <path class="toon-spark s2" style="transform-origin:366px 74px" d="M366 62 L369 71 L378 74 L369 77 L366 86 L363 77 L354 74 L363 71 Z"/>
    <path class="toon-spark s3" style="transform-origin:370px 300px" d="M370 292 L372 298 L378 300 L372 302 L370 308 L368 302 L362 300 L368 298 Z"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth: a small smile. The middle line is the smile, the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const yc = 205, w = 10 + o * 5;
    const smile = (1.0 - o * 0.7) * 4.6;
    const drop = o * 17;
    const N = 12;
    const xs = Array.from({ length: N + 1 }, (_, i) => 200 - w + (2 * w * i) / N);
    const u = (x) => (x - 200) / w;
    const M = (x) => yc + smile * (1 - u(x) * u(x)) - smile * 0.4;
    const bow = (x) => (Math.abs(u(x)) < 0.25 ? 1.1 : 0);
    const pts = (f) => xs.map((x) => x.toFixed(1) + ' ' + f(x).toFixed(1));
    const rev = (a) => a.slice().reverse();
    const upTop = (x) => M(x) - 2.8 + bow(x) * 0.6 - 0.4 * (1 - Math.abs(u(x)));
    const lowTop = (x) => M(x) + drop * Math.pow(Math.max(0, 1 - u(x) * u(x)), 0.7);
    const lowBot = (x) => lowTop(x) + 3.4 + 1.6 * (1 - u(x) * u(x));
    const poly = (a) => 'M' + a.join(' L') + ' Z';
    q(root, '.toon-upper').setAttribute('d', poly([...pts(upTop), ...rev(pts(M))]));
    q(root, '.toon-lower').setAttribute('d', poly([...pts(lowTop), ...rev(pts(lowBot))]));
    const open = o > 0.07;
    const inner = poly([...pts(M), ...rev(pts(lowTop))]);
    q(root, '.toon-mouth-bg').setAttribute('d', open ? inner : '');
    q(root, '#tn-mouth-in').setAttribute('d', open ? inner : '');
    q(root, '.toon-teeth').setAttribute('y', String(M(200) - 1));
    q(root, '.toon-teeth').setAttribute('height', String(Math.min(8, 2 + o * 8)));
    q(root, '.toon-tongue').setAttribute('cy', String(M(200) + drop * 0.95));
  }

  function mount(host, cls = 'cn-toon') {
    const wrap = document.createElement('div');
    wrap.className = cls;
    wrap.innerHTML = art;
    host.appendChild(wrap);
    setMouth(wrap, 0);
    return wrap;
  }

  // speaks along with a playing clip; returns a function that stops it
  function drive(video, root) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const head = q(root, '.toon-head'), body = q(root, '.toon-body'), brows = q(root, '.toon-brows');
    const eyes = root.querySelectorAll('.toon-eye');
    let raf = 0, open = 0, nextBlink = performance.now() + 1600, blinkUntil = 0;
    const t0 = performance.now();
    const at = (t) => { const i = t / STEP, a = Math.floor(i), f = i - a; return ((ENV[a] || 0) + ((ENV[a + 1] || 0) - (ENV[a] || 0)) * f) / 100; };
    const frame = (now) => {
      const speaking = !video.paused && !video.ended;
      const e = speaking ? at(video.currentTime) : 0;
      open += (Math.min(1, Math.pow(e, 0.75) * 1.25) - open) * 0.45;
      setMouth(root, open < 0.04 ? 0 : open);
      const s = (now - t0) / 1000;
      brows.setAttribute('transform', 'translate(0 ' + (-4 * Math.max(0, e - 0.6) / 0.4).toFixed(2) + ')');
      if (!reduce) {
        head.setAttribute('transform', 'rotate(' + (Math.sin(s * 0.9) * 1.1).toFixed(3) + ' 200 244) translate(0 ' + (Math.sin(s * 1.7) * 1.4 - open * 1.2).toFixed(2) + ')');
        body.setAttribute('transform', 'translate(0 ' + (Math.sin(s * 1.7) * 1.8).toFixed(2) + ')');
      }
      if (now > nextBlink) { blinkUntil = now + 130; nextBlink = now + 2400 + Math.random() * 3200; }
      eyes.forEach((n) => { n.style.transform = now < blinkUntil ? 'scaleY(0.08)' : 'scaleY(1)'; });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); };
  }

  // the hero version: it blinks, sways, twinkles, and looks toward the pointer
  function idle(root) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const head = q(root, '.toon-head'), body = q(root, '.toon-body'), brows = q(root, '.toon-brows');
    const eyes = root.querySelectorAll('.toon-eye'), irises = root.querySelectorAll('.toon-iris');
    let raf = 0, px = 0, py = 0, lx = 0, ly = 0, near = 0, nearS = 0, nextBlink = performance.now() + 1800, blinkUntil = 0;
    const t0 = performance.now();
    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.4;
      px = Math.max(-1, Math.min(1, (e.clientX - cx) / (innerWidth * 0.45)));
      py = Math.max(-1, Math.min(1, (e.clientY - cy) / (innerHeight * 0.45)));
      near = Math.hypot(e.clientX - cx, e.clientY - cy) < r.width * 0.6 ? 1 : 0;   // a wider smile when the pointer is close
    };
    const frame = (now) => {
      lx += (px - lx) * 0.12; ly += (py - ly) * 0.12; nearS += (near - nearS) * 0.1;
      const s = (now - t0) / 1000;
      head.setAttribute('transform', 'rotate(' + (lx * 3 + Math.sin(s * 0.9) * 0.9).toFixed(3) + ' 200 244) translate(' + (lx * 2).toFixed(2) + ' ' + (Math.sin(s * 1.7) * 1.4).toFixed(2) + ')');
      body.setAttribute('transform', 'translate(0 ' + (Math.sin(s * 1.7) * 1.8).toFixed(2) + ')');
      irises.forEach((n) => n.setAttribute('transform', 'translate(' + (lx * 4).toFixed(2) + ' ' + (ly * 3).toFixed(2) + ')'));
      brows.setAttribute('transform', 'translate(0 ' + (-2.5 * nearS).toFixed(2) + ')');
      setMouth(root, nearS > 0.05 ? 0.05 + nearS * 0.22 : 0);
      if (now > nextBlink) { blinkUntil = now + 130; nextBlink = now + 2600 + Math.random() * 3400; }
      eyes.forEach((n) => { n.style.transform = now < blinkUntil ? 'scaleY(0.08)' : 'scaleY(1)'; });
      raf = requestAnimationFrame(frame);
    };
    if (!reduce) { addEventListener('pointermove', onMove, { passive: true }); raf = requestAnimationFrame(frame); }
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); };
  }

  // the hero: the cartoon where the photo used to be
  const host = document.querySelector('[data-hero-toon]');
  if (host) {
    const go = () => { const w = mount(host, 'hero-toon-art'); w.setAttribute('role', 'img'); w.setAttribute('aria-label', 'A cartoon of Siddhi'); idle(w); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true }); else go();
  }

  window.SKToon = { mount, drive, idle, setMouth };
})();
