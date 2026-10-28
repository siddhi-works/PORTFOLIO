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

  const C = { hair: '#1c120e', hairHi: '#4a342c', skin: '#d8a07b', skinShade: '#b9805c', blush: '#ee7f78', top: '#e9b9b0', topHi: '#f6d6cf', skirt: '#2c2431', skirtHi: '#4a3d52', shoe: '#2a1e1a', lip: '#c4665e', lipDark: '#8d453f', mouth: '#2e0f14', iris: '#4a2a18', silver: '#d4d9de', spark: '#ffd27a' };

  const art = `
<svg class="toon-svg" viewBox="0 40 400 430" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi">
  <defs>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".5" stop-color="${C.hair}"/><stop offset="1" stop-color="#120a08"/></linearGradient>
    <linearGradient id="tn-eye" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25140d"/><stop offset=".6" stop-color="${C.iris}"/><stop offset="1" stop-color="#8a5634"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <ellipse cx="200" cy="522" rx="84" ry="9" fill="#000" opacity=".28"/>

  <g class="toon-body"><g>
    <path d="M200 50 C96 48 34 122 36 232 C38 300 20 352 34 410 C44 448 92 456 118 426 C130 444 158 448 172 422 L228 422 C242 448 270 444 282 426 C308 456 356 448 366 410 C380 352 362 300 364 232 C366 122 304 48 200 50 Z" fill="url(#tn-hair)"/>
    <rect x="168" y="472" width="22" height="36" rx="9" fill="${C.skin}"/><rect x="210" y="472" width="22" height="36" rx="9" fill="${C.skin}"/>
    <path d="M158 504 C158 494 190 494 190 504 L190 512 C190 520 158 520 158 512 Z M210 504 C210 494 242 494 242 504 L242 512 C242 520 210 520 210 512 Z" fill="${C.shoe}"/>
    <path d="M138 428 L262 428 L276 478 L124 478 Z" fill="${C.skirt}"/>
    <path d="M124 478 L276 478" stroke="${C.skirtHi}" stroke-width="3" stroke-linecap="round"/>
    <path d="M156 336 L244 336 C256 336 264 346 266 358 L272 432 C272 442 128 442 128 432 L134 358 C136 346 144 336 156 336 Z" fill="${C.top}"/>
    <path d="M150 352 C124 366 112 392 110 418" fill="none" stroke="${C.top}" stroke-width="26" stroke-linecap="round"/>
    <path d="M250 352 C276 366 288 392 290 418" fill="none" stroke="${C.top}" stroke-width="26" stroke-linecap="round"/>
    <circle cx="110" cy="428" r="12" fill="${C.skin}"/><circle cx="290" cy="428" r="12" fill="${C.skin}"/>
    <path d="M178 340 C184 360 194 368 200 370 C206 368 216 360 222 340" fill="none" stroke="${C.topHi}" stroke-width="5" stroke-linecap="round"/>
    <path d="M190 372 C194 384 206 384 210 372" fill="none" stroke="${C.silver}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M200 386 l3.6 5.4 l-3.6 5.4 l-3.6 -5.4 z" fill="${C.spark}"/>
    <rect x="180" y="316" width="40" height="30" rx="12" fill="${C.skinShade}"/>
  </g></g>

  <g class="toon-head">
    <path d="M70 214 C70 130 126 90 200 90 C274 90 330 130 330 214 C330 286 276 338 200 338 C124 338 70 286 70 214 Z" fill="${C.skin}"/>
    <ellipse cx="108" cy="284" rx="22" ry="12" fill="${C.blush}" opacity=".6"/><ellipse cx="292" cy="284" rx="22" ry="12" fill="${C.blush}" opacity=".6"/>

    <g class="toon-brows">
      <path d="M118 184 C130 174 148 173 160 178" fill="none" stroke="#2a1a14" stroke-width="5" stroke-linecap="round"/>
      <path d="M282 184 C270 174 252 173 240 178" fill="none" stroke="#2a1a14" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:139px 236px">
        <ellipse cx="139" cy="236" rx="33" ry="39" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="139" cy="238" rx="29" ry="35" fill="url(#tn-eye)"/>
          <ellipse cx="139" cy="234" rx="14" ry="18" fill="#0e0705"/>
          <circle cx="127" cy="220" r="10.5" fill="#fff"/><circle cx="151" cy="254" r="5" fill="#fff"/><circle cx="154" cy="226" r="2.6" fill="#fff" opacity=".9"/>
        </g>
        <path d="M104 228 C108 196 170 194 174 228" fill="none" stroke="${C.hair}" stroke-width="7" stroke-linecap="round"/>
        <path d="M105 230 C100 228 97 223 96 217" fill="none" stroke="${C.hair}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:261px 236px">
        <ellipse cx="261" cy="236" rx="33" ry="39" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="261" cy="238" rx="29" ry="35" fill="url(#tn-eye)"/>
          <ellipse cx="261" cy="234" rx="14" ry="18" fill="#0e0705"/>
          <circle cx="249" cy="220" r="10.5" fill="#fff"/><circle cx="273" cy="254" r="5" fill="#fff"/><circle cx="276" cy="226" r="2.6" fill="#fff" opacity=".9"/>
        </g>
        <path d="M296 228 C292 196 230 194 226 228" fill="none" stroke="${C.hair}" stroke-width="7" stroke-linecap="round"/>
        <path d="M295 230 C300 228 303 223 304 217" fill="none" stroke="${C.hair}" stroke-width="4" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M199 272 C198 276 200 278 203 277" fill="none" stroke="${C.skinShade}" stroke-width="2.6" stroke-linecap="round"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="184" y="290" width="32" height="6" rx="2" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="310" rx="8" ry="5" fill="#e07a7a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
    </g>

    <path d="M200 54 C112 54 46 112 48 230 C58 190 78 166 108 152 C144 136 184 132 200 102 Z" fill="url(#tn-hair)"/>
    <path d="M200 54 C288 54 354 112 352 230 C342 190 322 166 292 152 C256 136 216 132 200 102 Z" fill="url(#tn-hair)"/>
    <path d="M58 230 C50 272 56 316 70 344 C68 356 76 368 90 360 C104 344 104 298 100 252 C98 236 80 228 58 230 Z" fill="url(#tn-hair)"/>
    <path d="M342 230 C350 272 344 316 330 344 C332 356 324 368 310 360 C296 344 296 298 300 252 C302 236 320 228 342 230 Z" fill="url(#tn-hair)"/>
    <path d="M196 62 C146 64 90 94 68 156" fill="none" stroke="#6a4f43" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <path d="M204 62 C254 64 310 94 332 156" fill="none" stroke="#6a4f43" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <path d="M200 58 C194 34 214 22 228 34 C216 38 210 48 212 62 Z" fill="url(#tn-hair)"/>
    <path d="M58 270 C72 292 62 322 76 350" fill="none" stroke="#6a4f43" stroke-width="3" stroke-linecap="round" opacity=".4"/>
    <path d="M342 270 C328 292 338 322 324 350" fill="none" stroke="#6a4f43" stroke-width="3" stroke-linecap="round" opacity=".4"/>
    <g class="toon-clip" transform="translate(278 118) rotate(18)"><path d="M0 -13 L3.6 -4 L13 -3.6 L5.6 2.4 L8 12 L0 6.6 L-8 12 L-5.6 2.4 L-13 -3.6 L-3.6 -4 Z" fill="${C.spark}" stroke="#c98f2a" stroke-width="1.4" stroke-linejoin="round"/></g>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:48px 130px" d="M48 112 L52 124 L66 130 L52 136 L48 148 L44 136 L30 130 L44 124 Z"/>
    <path class="toon-spark s2" style="transform-origin:354px 96px" d="M354 84 L357 93 L366 96 L357 99 L354 108 L351 99 L342 96 L351 93 Z"/>
    <path class="toon-spark s3" style="transform-origin:362px 330px" d="M362 322 L364 328 L370 330 L364 332 L362 338 L360 332 L354 330 L360 328 Z"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth: a small smile. The middle line is the smile, the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const yc = 297, w = 10 + o * 5;
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
        head.setAttribute('transform', 'rotate(' + (Math.sin(s * 0.9) * 1.1).toFixed(3) + ' 200 336) translate(0 ' + (Math.sin(s * 1.7) * 1.4 - open * 1.2).toFixed(2) + ')');
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
      head.setAttribute('transform', 'rotate(' + (lx * 3 + Math.sin(s * 0.9) * 0.9).toFixed(3) + ' 200 336) translate(' + (lx * 2).toFixed(2) + ' ' + (Math.sin(s * 1.7) * 1.4).toFixed(2) + ')');
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
