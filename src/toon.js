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
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".55" stop-color="${C.hair}"/><stop offset="1" stop-color="#1e100a"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M200 26 C130 24 84 78 86 160 C88 226 70 280 76 336 C80 380 72 412 86 436 C104 448 118 430 122 410 C134 430 156 428 164 404 L236 404 C244 428 266 430 278 410 C282 430 296 448 314 436 C328 412 320 380 324 336 C330 280 312 226 314 160 C316 78 270 24 200 26 Z" fill="url(#tn-hair)"/>
    <rect x="186" y="228" width="28" height="48" rx="10" fill="${C.skinShade}"/>
    <path d="M160 282 C160 272 240 272 240 282 L250 352 C252 384 248 410 244 424 L156 424 C152 410 148 384 150 352 Z" fill="${C.top}"/>
    <path d="M160 288 C146 300 140 330 138 374" fill="none" stroke="${C.line}" stroke-width="25"/>
    <path d="M160 288 C146 300 140 330 138 374" fill="none" stroke="${C.top}" stroke-width="20"/>
    <path d="M240 288 C254 300 260 330 262 374" fill="none" stroke="${C.line}" stroke-width="25"/>
    <path d="M240 288 C254 300 260 330 262 374" fill="none" stroke="${C.top}" stroke-width="20"/>
    <circle cx="138" cy="386" r="10.5" fill="${C.skin}"/><circle cx="262" cy="386" r="10.5" fill="${C.skin}"/>
    <path d="M182 276 C188 298 196 306 200 308 C204 306 212 298 218 276" fill="${C.skin}"/>
    <path d="M190 304 C194 316 206 316 210 304" fill="none" stroke="${C.silver}" stroke-width="2" stroke-linecap="round"/>
    <path d="M200 320 l4 6 l-4 6 l-4 -6 z" fill="${C.spark}" stroke-width="1.6"/>
  </g></g>

  <g class="toon-head">
    <g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M114 128 C114 68 150 40 200 40 C250 40 286 68 286 128 C286 178 258 224 226 238 C212 244 188 244 174 238 C142 224 114 178 114 128 Z" fill="${C.skin}"/>
    </g>
    <ellipse cx="140" cy="178" rx="14" ry="8" fill="${C.blush}" opacity=".6"/><ellipse cx="260" cy="178" rx="14" ry="8" fill="${C.blush}" opacity=".6"/>

    <g class="toon-brows" fill="none" stroke="${C.line}" stroke-width="3.6" stroke-linecap="round">
      <path d="M146 112 C154 105 166 104 174 108"/>
      <path d="M254 112 C246 105 234 104 226 108"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:162px 142px">
        <ellipse cx="162" cy="142" rx="19" ry="23" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="162" cy="144" rx="16.5" ry="20.5" fill="${C.iris}"/>
          <ellipse cx="162" cy="146" rx="9.5" ry="12" fill="#1e0f08" opacity=".55"/>
          <circle cx="155" cy="135" r="6" fill="#fff"/><circle cx="170" cy="153" r="3" fill="#fff" opacity=".95"/>
        </g>
        <path d="M141 139 C145 118 179 118 183 139" fill="none" stroke="${C.line}" stroke-width="4.6" stroke-linecap="round"/>
        <path d="M142 141 C138 139 136 136 135 132" fill="none" stroke="${C.line}" stroke-width="2.8" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:238px 142px">
        <ellipse cx="238" cy="142" rx="19" ry="23" fill="#fff"/>
        <g class="toon-iris">
          <ellipse cx="238" cy="144" rx="16.5" ry="20.5" fill="${C.iris}"/>
          <ellipse cx="238" cy="146" rx="9.5" ry="12" fill="#1e0f08" opacity=".55"/>
          <circle cx="231" cy="135" r="6" fill="#fff"/><circle cx="246" cy="153" r="3" fill="#fff" opacity=".95"/>
        </g>
        <path d="M259 139 C255 118 221 118 217 139" fill="none" stroke="${C.line}" stroke-width="4.6" stroke-linecap="round"/>
        <path d="M258 141 C262 139 264 136 265 132" fill="none" stroke="${C.line}" stroke-width="2.8" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M198 174 C197 178 199 180 202 179" fill="none" stroke="${C.line}" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="184" y="196" width="32" height="6" rx="2" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="214" rx="8" ry="5" fill="#e07a7a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="1.4" stroke-linejoin="round"/>
    </g>

    <g stroke="${C.line}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" fill="url(#tn-hair)">
      <path d="M184 36 C130 36 98 82 100 140 C102 182 94 216 86 248 C80 270 94 280 106 266 C124 244 122 206 124 178 C126 150 134 124 150 104 C164 88 178 66 184 36 Z"/>
      <path d="M192 36 C256 34 302 82 300 140 C298 182 306 216 314 248 C320 270 306 280 294 266 C276 244 278 206 276 178 C274 150 266 124 250 104 C234 86 202 74 192 36 Z"/>
      <path d="M200 30 C192 8 214 -2 230 12 C218 14 212 24 214 38 Z"/>
    </g>
    <path d="M172 46 C132 50 110 84 106 136" fill="none" stroke="${C.hairHi}" stroke-width="3.2" stroke-linecap="round" opacity=".7"/>
    <path d="M206 46 C250 48 290 84 294 136" fill="none" stroke="${C.hairHi}" stroke-width="3.2" stroke-linecap="round" opacity=".7"/>
    <path d="M97 196 C101 220 97 240 92 256" fill="none" stroke="${C.hairHi}" stroke-width="2.8" stroke-linecap="round" opacity=".5"/>
    <path d="M303 196 C299 220 303 240 308 256" fill="none" stroke="${C.hairHi}" stroke-width="2.8" stroke-linecap="round" opacity=".5"/>
    <g class="toon-clip" transform="translate(276 98) rotate(18)"><path d="M0 -12 L3.3 -3.7 L12 -3.3 L5.2 2.2 L7.4 11 L0 6 L-7.4 11 L-5.2 2.2 L-12 -3.3 L-3.3 -3.7 Z" fill="${C.spark}" stroke="#9a6a1c" stroke-width="1.5" stroke-linejoin="round"/></g>
  </g>

  <g class="toon-sparks" fill="${C.spark}">
    <path class="toon-spark" style="transform-origin:44px 110px" d="M44 94 L48 105 L60 110 L48 115 L44 126 L40 115 L28 110 L40 105 Z"/>
    <path class="toon-spark s2" style="transform-origin:356px 84px" d="M356 72 L359 81 L368 84 L359 87 L356 96 L353 87 L344 84 L353 81 Z"/>
    <path class="toon-spark s3" style="transform-origin:352px 320px" d="M352 312 L354 318 L360 320 L354 322 L352 328 L350 322 L344 320 L350 318 Z"/>
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
