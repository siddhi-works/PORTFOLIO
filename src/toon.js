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

  const C = { hair: '#1c120e', hairHi: '#44302a', skin: '#cc9370', skinShade: '#a96f4d', blush: '#e5786f', blazer: '#e0c7bb', blazerShade: '#c9ab9d', top: '#14100e', lip: '#bb675c', lipDark: '#8d453f', mouth: '#2e0f14', iris: '#3b2317', silver: '#d4d9de', spark: '#ffd27a' };

  const art = `
<svg class="toon-svg" viewBox="0 0 400 520" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi">
  <defs>
    <radialGradient id="tn-cheek"><stop offset="0" stop-color="${C.blush}" stop-opacity=".6"/><stop offset="1" stop-color="${C.blush}" stop-opacity="0"/></radialGradient>
    <linearGradient id="tn-neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skinShade}"/><stop offset=".55" stop-color="${C.skin}"/></linearGradient>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".45" stop-color="${C.hair}"/><stop offset="1" stop-color="#120a08"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g>
    <path d="M200 46 C112 44 70 114 72 212 C74 288 52 344 62 418 C70 458 112 470 138 444 C150 460 176 466 200 450 C224 466 250 460 262 444 C288 470 330 458 338 418 C348 344 326 288 328 212 C330 114 288 44 200 46 Z" fill="url(#tn-hair)"/>
    <path d="M66 540 L80 410 C92 376 148 362 176 358 L224 358 C252 362 308 376 320 410 L334 540 Z" fill="${C.blazer}"/>
    <path d="M66 540 L80 410 C84 400 90 394 98 388 C92 440 92 500 96 540 Z M334 540 L320 410 C316 400 310 394 302 388 C308 440 308 500 304 540 Z" fill="${C.blazerShade}"/>
    <path d="M172 296 L172 362 C176 394 224 394 228 362 L228 296 Z" fill="url(#tn-neck)"/>
    <path d="M172 362 C176 394 224 394 228 362 L238 520 L162 520 Z" fill="${C.top}"/>
    <path d="M176 360 L148 372 C156 420 176 462 198 496 L206 452 C192 428 184 392 176 360 Z" fill="${C.blazerShade}"/>
    <path d="M224 360 L252 372 C244 420 224 462 202 496 L194 452 C208 428 216 392 224 360 Z" fill="${C.blazerShade}"/>
    <path d="M181 367 C185 390 194 402 200 406 C206 402 215 390 219 367" fill="none" stroke="${C.silver}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="200" cy="411" r="4" fill="#f4f6f8"/>
  </g></g>

  <g class="toon-head">
    <circle cx="104" cy="228" r="15" fill="${C.skin}"/><circle cx="296" cy="228" r="15" fill="${C.skin}"/>
    <circle cx="297" cy="244" r="3.6" fill="${C.silver}"/><circle cx="297" cy="254" r="2.6" fill="#f4f6f8"/>
    <path d="M105 205 C105 140 145 102 200 102 C255 102 295 140 295 205 C295 268 255 316 200 318 C145 316 105 268 105 205 Z" fill="${C.skin}"/>
    <ellipse cx="200" cy="318" rx="30" ry="7" fill="${C.skinShade}" opacity=".38"/>
    <circle cx="140" cy="262" r="26" fill="url(#tn-cheek)"/><circle cx="260" cy="262" r="26" fill="url(#tn-cheek)"/>

    <g class="toon-brows">
      <path d="M137 191 C149 177 173 177 185 186" fill="none" stroke="#2a1a14" stroke-width="6" stroke-linecap="round"/>
      <path d="M263 191 C251 177 227 177 215 186" fill="none" stroke="#2a1a14" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:160px 217px">
        <ellipse cx="160" cy="217" rx="26" ry="23" fill="#fff"/>
        <circle class="toon-iris" cx="161" cy="219" r="17.5" fill="${C.iris}"/><circle cx="161" cy="219" r="9" fill="#100906"/>
        <circle cx="168" cy="210" r="5.2" fill="#fff"/><circle cx="153" cy="227" r="2.4" fill="#fff" opacity=".9"/>
        <path d="M132 215 C139 190 181 190 188 215" fill="none" stroke="${C.hair}" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M132 216 C127 214 124 210 123 206" fill="none" stroke="${C.hair}" stroke-width="3.6" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:240px 217px">
        <ellipse cx="240" cy="217" rx="26" ry="23" fill="#fff"/>
        <circle class="toon-iris" cx="239" cy="219" r="17.5" fill="${C.iris}"/><circle cx="239" cy="219" r="9" fill="#100906"/>
        <circle cx="246" cy="210" r="5.2" fill="#fff"/><circle cx="231" cy="227" r="2.4" fill="#fff" opacity=".9"/>
        <path d="M268 215 C261 190 219 190 212 215" fill="none" stroke="${C.hair}" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M268 216 C273 214 276 210 277 206" fill="none" stroke="${C.hair}" stroke-width="3.6" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M198 243 C196 250 196 255 201 256" fill="none" stroke="${C.skinShade}" stroke-width="3" stroke-linecap="round"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="180" y="276" width="40" height="8" rx="3" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="300" rx="11" ry="6" fill="#d96a6a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.8" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.8" stroke-linejoin="round"/>
    </g>

    <path d="M192 68 C142 66 100 114 104 200 C106 240 100 264 108 296 C120 292 128 262 130 228 C132 178 152 128 192 100 Z" fill="url(#tn-hair)"/>
    <path d="M192 68 C262 64 302 112 298 200 C296 240 302 264 294 296 C282 292 274 262 272 228 C270 176 250 128 192 100 Z" fill="url(#tn-hair)"/>
    <path d="M106 232 C96 284 86 332 78 384 C72 422 88 446 110 438 C126 430 120 404 128 378 C136 344 134 294 130 256 Z" fill="url(#tn-hair)"/>
    <path d="M294 232 C304 284 314 332 322 384 C328 422 312 446 290 438 C274 430 280 404 272 378 C264 344 266 294 270 256 Z" fill="url(#tn-hair)"/>
    <path d="M192 74 C168 80 142 104 132 150" fill="none" stroke="#5e463b" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="M192 74 C226 78 256 104 268 150" fill="none" stroke="#5e463b" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="M92 330 C98 350 98 372 94 392" fill="none" stroke="#5e463b" stroke-width="2.6" stroke-linecap="round" opacity=".4"/>
    <path d="M308 330 C302 350 302 372 306 392" fill="none" stroke="#5e463b" stroke-width="2.6" stroke-linecap="round" opacity=".4"/>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:62px 120px" d="M62 104 L66 116 L78 120 L66 124 L62 136 L58 124 L46 120 L58 116 Z"/>
    <path class="toon-spark s2" style="transform-origin:340px 96px" d="M340 84 L343 93 L352 96 L343 99 L340 108 L337 99 L328 96 L337 93 Z"/>
    <path class="toon-spark s3" style="transform-origin:352px 196px" d="M352 188 L354 194 L360 196 L354 198 L352 204 L350 198 L344 196 L350 194 Z"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth: a small smile. The middle line is the smile, the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const yc = 279, w = 17 + o * 4;
    const smile = (1.0 - o * 0.7) * 5.5;
    const drop = o * 22;
    const N = 12;
    const xs = Array.from({ length: N + 1 }, (_, i) => 200 - w + (2 * w * i) / N);
    const u = (x) => (x - 200) / w;
    const M = (x) => yc + smile * (1 - u(x) * u(x)) - smile * 0.4;
    const bow = (x) => (Math.abs(u(x)) < 0.25 ? 1.1 : 0);
    const pts = (f) => xs.map((x) => x.toFixed(1) + ' ' + f(x).toFixed(1));
    const rev = (a) => a.slice().reverse();
    const upTop = (x) => M(x) - 4.2 + bow(x) - 0.5 * (1 - Math.abs(u(x)));
    const lowTop = (x) => M(x) + drop * Math.pow(Math.max(0, 1 - u(x) * u(x)), 0.7);
    const lowBot = (x) => lowTop(x) + 5.5 + 2 * (1 - u(x) * u(x));
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
        head.setAttribute('transform', 'rotate(' + (Math.sin(s * 0.9) * 1.1).toFixed(3) + ' 200 340) translate(0 ' + (Math.sin(s * 1.7) * 1.4 - open * 1.2).toFixed(2) + ')');
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
      head.setAttribute('transform', 'rotate(' + (lx * 3 + Math.sin(s * 0.9) * 0.9).toFixed(3) + ' 200 340) translate(' + (lx * 2).toFixed(2) + ' ' + (Math.sin(s * 1.7) * 1.4).toFixed(2) + ')');
      body.setAttribute('transform', 'translate(0 ' + (Math.sin(s * 1.7) * 1.8).toFixed(2) + ')');
      irises.forEach((n) => n.setAttribute('transform', 'translate(' + (lx * 5).toFixed(2) + ' ' + (ly * 3.5).toFixed(2) + ')'));
      brows.setAttribute('transform', 'translate(0 ' + (-2.5 * nearS).toFixed(2) + ')');
      setMouth(root, nearS > 0.05 ? 0.05 + nearS * 0.16 : 0);
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
