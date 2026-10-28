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

  const C = { hair: '#2c1810', hairHi: '#5e3f2d', skin: '#dba27c', skinShade: '#b9805c', blush: '#ee8a80', top: '#f8f4ee', topShade: '#e6dfd5', skirt: '#4a5568', line: '#4b2d1f', lip: '#c9625a', lipDark: '#8d453f', mouth: '#2e0f14', iris: '#3a2014', silver: '#e3e7eb', spark: '#ffd27a' };

  const art = `
<svg class="toon-svg" viewBox="0 0 400 460" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi">
  <defs>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".55" stop-color="${C.hair}"/><stop offset="1" stop-color="#1e100a"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g stroke="${C.line}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M205 30 C146 30 104 72 94 140 C86 196 88 262 92 322 C94 340 108 348 120 338 C122 300 126 262 134 236 C160 286 244 286 270 236 C286 270 300 320 296 374 C318 364 338 336 338 316 C334 262 322 200 306 140 C292 74 258 30 205 30 Z" fill="url(#tn-hair)"/>
    <rect x="180" y="220" width="36" height="46" rx="12" fill="${C.skinShade}"/>
    <path d="M138 254 C150 242 176 238 190 244 L214 258 C238 244 268 246 284 258 C296 300 298 380 294 446 L150 446 C140 406 132 336 138 254 Z" fill="${C.top}"/>
    <path d="M256 262 C282 270 292 330 290 440 L270 446 C276 380 272 310 256 262 Z" fill="${C.topShade}" stroke="none"/>
    <path d="M150 424 L294 424 L294 450 L150 450 Z" fill="${C.skirt}"/>
    <path d="M186 244 L206 292 L200 300 L190 276 Z" fill="${C.skin}" stroke="none"/>
    <path d="M186 240 L158 262 L172 288 L188 278 L200 304 L214 264 Z" fill="${C.top}"/>
    <path d="M214 264 L236 252 L244 276 L220 300 Z" fill="${C.top}"/>
    <circle cx="172" cy="320" r="3.6" fill="${C.top}"/>
    <path d="M150 296 C130 326 128 366 142 388" fill="none" stroke="${C.line}" stroke-width="31"/>
    <path d="M150 296 C130 326 128 366 142 388" fill="none" stroke="${C.top}" stroke-width="26"/>
    <path d="M282 300 C298 330 296 370 282 392" fill="none" stroke="${C.line}" stroke-width="31"/>
    <path d="M282 300 C298 330 296 370 282 392" fill="none" stroke="${C.top}" stroke-width="26"/>
    <path d="M150 398 C182 412 214 420 246 424" fill="none" stroke="${C.line}" stroke-width="22"/>
    <path d="M150 398 C182 412 214 420 246 424" fill="none" stroke="${C.skin}" stroke-width="17"/>
    <path d="M278 402 C252 418 224 428 196 430" fill="none" stroke="${C.line}" stroke-width="22"/>
    <path d="M278 402 C252 418 224 428 196 430" fill="none" stroke="${C.skin}" stroke-width="17"/>
    <ellipse cx="238" cy="424" rx="16" ry="10" fill="${C.skin}" transform="rotate(14 238 424)"/>
    <ellipse cx="200" cy="430" rx="16" ry="9" fill="${C.skin}" transform="rotate(-8 200 430)"/>
    <path d="M232 418 C238 422 242 428 246 432 M222 422 C228 426 232 432 234 436" fill="none" stroke-width="1.6"/>
  </g></g>

  <g class="toon-head">
    <g stroke="${C.line}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M126 118 C126 80 158 64 196 68 C238 72 260 100 258 142 C256 178 246 208 224 224 C206 236 170 234 150 216 C132 198 126 150 126 118 Z" fill="${C.skin}"/>
    </g>
    <ellipse cx="140" cy="190" rx="11" ry="6" fill="${C.blush}" opacity=".5"/><ellipse cx="228" cy="196" rx="12" ry="6.5" fill="${C.blush}" opacity=".5"/>

    <g class="toon-brows" fill="none" stroke="${C.line}" stroke-width="3" stroke-linecap="round">
      <path d="M130 128 C140 119 154 119 164 124"/>
      <path d="M192 122 C208 114 228 118 240 130"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:150px 150px">
        <ellipse cx="150" cy="150" rx="12.5" ry="14" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="149" cy="151" rx="11" ry="12.5" fill="${C.iris}"/>
          <ellipse cx="149" cy="153" rx="6.4" ry="7.6" fill="#1e0f08" opacity=".55"/>
          <circle cx="145" cy="146" r="3.8" fill="#fff"/><circle cx="154" cy="157" r="2" fill="#fff" opacity=".95"/>
        </g>
        <path d="M133 148 C136 134 162 134 166 148" fill="none" stroke="${C.line}" stroke-width="3.6" stroke-linecap="round"/>
        <path d="M134 149 C130 148 128 145 127 141" fill="none" stroke="${C.line}" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M138 138 C144 132 156 132 162 137" fill="none" stroke="${C.line}" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
      </g>
      <g class="toon-eye" style="transform-origin:213px 153px">
        <ellipse cx="213" cy="153" rx="15" ry="17" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="213" cy="154" rx="13" ry="15" fill="${C.iris}"/>
          <ellipse cx="213" cy="156" rx="7.6" ry="9" fill="#1e0f08" opacity=".55"/>
          <circle cx="208" cy="148" r="4.6" fill="#fff"/><circle cx="219" cy="162" r="2.4" fill="#fff" opacity=".95"/>
        </g>
        <path d="M194 150 C198 132 230 132 234 150" fill="none" stroke="${C.line}" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M233 151 C238 150 241 146 242 142" fill="none" stroke="${C.line}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M199 138 C206 131 220 131 228 138" fill="none" stroke="${C.line}" stroke-width="1.3" stroke-linecap="round" opacity=".55"/>
      </g>
    </g>
    <circle cx="176" cy="180" r="1.8" fill="${C.line}" opacity=".7"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="172" y="198" width="24" height="5" rx="2" fill="#fff"/><ellipse class="toon-tongue" cx="184" cy="214" rx="6" ry="4" fill="#e07a7a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.2" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.2" stroke-linejoin="round"/>
    </g>

    <g stroke="${C.line}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" fill="url(#tn-hair)">
      <path d="M205 30 C150 30 112 70 108 140 C106 172 112 198 126 214 C120 176 126 134 146 104 C160 84 176 74 190 64 C208 74 238 78 250 102 C258 120 258 150 256 176 C254 202 258 226 272 250 C284 284 292 330 280 374 C296 368 314 344 322 318 C326 270 316 200 304 150 C292 80 262 32 205 30 Z"/>
    </g>
    <path d="M238 54 C258 58 272 78 278 102" fill="none" stroke="${C.hairHi}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M166 46 C186 38 208 38 226 46" fill="none" stroke="${C.hairHi}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
    <path d="M300 170 C308 220 306 270 296 316" fill="none" stroke="${C.hairHi}" stroke-width="2.6" stroke-linecap="round" opacity=".5"/>
    <g stroke="${C.line}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M258 168 C274 160 286 172 282 190 C279 204 266 210 258 204 Z" fill="${C.skin}"/>
      <path d="M266 176 C272 174 276 180 274 188" fill="none" stroke-width="1.4"/>
    </g>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:48px 110px" d="M48 94 L52 105 L64 110 L52 115 L48 126 L44 115 L32 110 L44 105 Z"/>
    <path class="toon-spark s2" style="transform-origin:358px 84px" d="M358 72 L361 81 L370 84 L361 87 L358 96 L355 87 L346 84 L355 81 Z"/>
    <path class="toon-spark s3" style="transform-origin:356px 330px" d="M356 322 L358 328 L364 330 L358 332 L356 338 L354 332 L348 330 L354 328 Z"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth: a small smile. The middle line is the smile, the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const cx = 184, yc = 204, w = 9 + o * 4.5;
    const smile = (1.0 - o * 0.7) * 4.6;
    const drop = o * 17;
    const N = 12;
    const xs = Array.from({ length: N + 1 }, (_, i) => cx - w + (2 * w * i) / N);
    const u = (x) => (x - cx) / w;
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
    q(root, '.toon-teeth').setAttribute('y', String(M(cx) - 1));
    q(root, '.toon-teeth').setAttribute('height', String(Math.min(8, 2 + o * 8)));
    q(root, '.toon-tongue').setAttribute('cy', String(M(cx) + drop * 0.95));
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
