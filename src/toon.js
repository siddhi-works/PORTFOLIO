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

  const C = { hair: '#2c1810', hairHi: '#5e3f2d', skin: '#dba27c', skinShade: '#b9805c', blush: '#ee8a80', top: '#f8f4ee', skirt: '#2c2a33', line: '#4b2d1f', lip: '#c9625a', lipDark: '#8d453f', mouth: '#2e0f14', iris: '#3a2014', silver: '#e3e7eb', spark: '#ffd27a' };

  const art = `
<svg class="toon-svg" viewBox="0 0 400 460" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi">
  <defs>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".55" stop-color="${C.hair}"/><stop offset="1" stop-color="#1e100a"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M200 30 C140 28 100 74 100 150 C100 210 84 250 90 300 C94 340 80 366 92 396 C100 418 90 434 104 446 C122 452 134 432 138 414 C150 432 170 428 176 410 L224 410 C230 428 250 432 262 414 C266 432 278 452 296 446 C310 434 300 418 308 396 C320 366 306 340 310 300 C316 250 300 210 300 150 C300 74 260 28 200 30 Z" fill="url(#tn-hair)"/>
    <rect x="188" y="218" width="24" height="52" rx="9" fill="${C.skinShade}"/>
    <path d="M152 272 C152 262 248 262 248 272 L258 360 C260 392 256 410 252 426 L148 426 C144 410 140 392 142 360 Z" fill="${C.top}"/>
    <path d="M146 408 L254 408 L255 426 L145 426 Z" fill="${C.skirt}"/>
    <path d="M184 264 C190 288 196 298 200 300 C204 298 210 288 216 264 Z" fill="${C.skin}"/>
    <path d="M154 288 C134 304 128 336 140 358 C170 380 210 376 236 366" fill="none" stroke="${C.line}" stroke-width="29"/>
    <path d="M154 288 C134 304 128 336 140 358 C170 380 210 376 236 366" fill="none" stroke="${C.top}" stroke-width="24"/>
    <path d="M246 288 C266 304 272 336 260 358 C230 382 196 380 164 368" fill="none" stroke="${C.line}" stroke-width="29"/>
    <path d="M246 288 C266 304 272 336 260 358 C230 382 196 380 164 368" fill="none" stroke="${C.top}" stroke-width="24"/>
    <circle cx="240" cy="366" r="9.5" fill="${C.skin}"/><circle cx="160" cy="368" r="9.5" fill="${C.skin}"/>
    <path d="M176 262 L198 306 L168 308 L150 276 Z" fill="${C.top}"/>
    <path d="M224 262 L202 306 L232 308 L250 276 Z" fill="${C.top}"/>
    <path d="M191 272 C194 286 206 286 209 272" fill="none" stroke="${C.silver}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M200 286 l3.2 4.8 l-3.2 4.8 l-3.2 -4.8 z" fill="${C.spark}" stroke-width="1.4"/>
  </g></g>

  <g class="toon-head">
    <g stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M125 128 C125 70 158 44 200 44 C242 44 275 70 275 128 C275 176 252 214 222 226 C208 231 192 231 178 226 C148 214 125 176 125 128 Z" fill="${C.skin}"/>
    </g>
    <ellipse cx="148" cy="170" rx="11" ry="6" fill="${C.blush}" opacity=".55"/><ellipse cx="252" cy="170" rx="11" ry="6" fill="${C.blush}" opacity=".55"/>

    <g class="toon-brows" fill="none" stroke="${C.line}" stroke-width="2.8" stroke-linecap="round">
      <path d="M152 114 C160 108 171 107 179 110"/>
      <path d="M248 114 C240 108 229 107 221 110"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:166px 138px">
        <ellipse cx="166" cy="138" rx="15" ry="17" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="166" cy="139" rx="13" ry="15.5" fill="${C.iris}"/>
          <ellipse cx="166" cy="141" rx="7.5" ry="9" fill="#1e0f08" opacity=".55"/>
          <circle cx="161" cy="133" r="4.6" fill="#fff"/><circle cx="172" cy="145" r="2.3" fill="#fff" opacity=".95"/>
        </g>
        <path d="M149 135 C152 120 180 120 183 135" fill="none" stroke="${C.line}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M150 137 C146 136 144 133 143 130" fill="none" stroke="${C.line}" stroke-width="2.4" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:234px 138px">
        <ellipse cx="234" cy="138" rx="15" ry="17" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="234" cy="139" rx="13" ry="15.5" fill="${C.iris}"/>
          <ellipse cx="234" cy="141" rx="7.5" ry="9" fill="#1e0f08" opacity=".55"/>
          <circle cx="229" cy="133" r="4.6" fill="#fff"/><circle cx="240" cy="145" r="2.3" fill="#fff" opacity=".95"/>
        </g>
        <path d="M217 135 C220 120 248 120 251 135" fill="none" stroke="${C.line}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M250 137 C254 136 256 133 257 130" fill="none" stroke="${C.line}" stroke-width="2.4" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M199 166 C198 169 200 171 203 170" fill="none" stroke="${C.line}" stroke-width="2" stroke-linecap="round" opacity=".7"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="188" y="186" width="24" height="5" rx="2" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="204" rx="6" ry="4" fill="#e07a7a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.2" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.2" stroke-linejoin="round"/>
    </g>

    <g stroke="${C.line}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="url(#tn-hair)">
      <path d="M178 40 C136 40 112 80 112 130 C112 170 106 206 98 240 C92 270 100 300 94 330 C90 356 98 376 110 388 C122 376 118 352 124 328 C130 300 136 262 134 226 C132 196 130 170 134 148 C138 126 160 100 178 40 Z"/>
      <path d="M186 40 C246 38 290 80 288 130 C288 170 294 206 302 240 C308 270 300 300 306 330 C310 356 302 376 290 388 C278 376 282 352 276 328 C270 300 264 262 266 226 C268 196 270 170 266 148 C262 126 232 100 186 40 Z"/>
    </g>
    <path d="M168 50 C134 54 118 86 116 134" fill="none" stroke="${C.hairHi}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path d="M194 50 C244 50 280 86 284 134" fill="none" stroke="${C.hairHi}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path d="M104 260 C110 290 102 320 108 350" fill="none" stroke="${C.hairHi}" stroke-width="2.6" stroke-linecap="round" opacity=".5"/>
    <path d="M296 260 C290 290 298 320 292 350" fill="none" stroke="${C.hairHi}" stroke-width="2.6" stroke-linecap="round" opacity=".5"/>
    <g class="toon-clip" transform="translate(262 88) rotate(18)"><path d="M0 -11 L3 -3.4 L11 -3 L4.8 2 L6.8 10 L0 5.5 L-6.8 10 L-4.8 2 L-11 -3 L-3 -3.4 Z" fill="${C.spark}" stroke="#9a6a1c" stroke-width="1.4" stroke-linejoin="round"/></g>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:48px 110px" d="M48 94 L52 105 L64 110 L52 115 L48 126 L44 115 L32 110 L44 105 Z"/>
    <path class="toon-spark s2" style="transform-origin:352px 84px" d="M352 72 L355 81 L364 84 L355 87 L352 96 L349 87 L340 84 L349 81 Z"/>
    <path class="toon-spark s3" style="transform-origin:350px 320px" d="M350 312 L352 318 L358 320 L352 322 L350 328 L348 322 L342 320 L348 318 Z"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth: a small smile. The middle line is the smile, the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const yc = 192, w = 9 + o * 4.5;
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
