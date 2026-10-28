/* Siddhi Kale: the cartoon character for the intro.
   A flat illustration drawn in SVG. It speaks with the recorded voice: the mouth follows the loudness of the clip
   (measured once and stored below, so it works even when the browser holds the sound back), and it blinks and sways. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  // loudness of the voice clip every 50 ms, 0 to 100
  const ENV = '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,57,86,47,12,0,0,0,0,0,25,50,41,14,9,28,51,34,2,0,0,0,0,0,0,0,0,0,0,15,69,81,70,25,20,48,13,20,25,30,78,32,50,43,36,35,33,18,14,11,5,2,0,0,0,0,49,66,39,22,32,48,34,35,29,30,33,30,27,18,15,11,1,0,0,0,0,31,39,14,56,69,44,40,30,47,25,27,13,12,6,40,23,16,12,36,5,0,0,20,5,17,24,15,22,23,9,12,2,0,4,1,0,0,0,0,0,0,0,0,11,23,100,88,46,14,28,35,60,20,23,32,23,45,19,25,22,1,0,0,0,0,0,0,0,43,36,44,69,32,36,31,11,6,4,0,0,0,0,0,0,0,0'.split(',').map(Number);
  const STEP = 0.05;

  const C = { hair: '#1b1210', hairHi: '#3a2a22', skin: '#eebf9f', skinShade: '#d39674', blush: '#f08f84', blazer: '#f4ebe3', blazerShade: '#dccdc1', top: '#17120f', lip: '#c9605e', lipDark: '#9c4343', mouth: '#33101a', iris: '#3d2517', gold: '#dcaa4a' };

  const art = `
<svg class="toon-svg" viewBox="0 0 400 560" xmlns="${NS}" role="img" aria-label="A cartoon of Siddhi, speaking">
  <defs>
    <radialGradient id="tn-cheek"><stop offset="0" stop-color="${C.blush}" stop-opacity=".6"/><stop offset="1" stop-color="${C.blush}" stop-opacity="0"/></radialGradient>
    <linearGradient id="tn-neck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.skinShade}"/><stop offset=".6" stop-color="${C.skin}"/></linearGradient>
    <linearGradient id="tn-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hairHi}"/><stop offset=".45" stop-color="${C.hair}"/><stop offset="1" stop-color="#130c0a"/></linearGradient>
    <clipPath id="tn-mouth-clip"><path id="tn-mouth-in" d=""/></clipPath>
  </defs>

  <g class="toon-body"><g>
    <path d="M200 40 C124 38 84 106 86 200 C88 276 70 340 78 436 C86 478 124 476 146 440 L254 440 C276 476 314 478 322 436 C330 340 312 276 314 200 C316 106 276 38 200 40 Z" fill="url(#tn-hair)"/>
    <path d="M50 580 L62 420 C74 376 142 354 174 348 L226 348 C258 354 326 376 338 420 L350 580 Z" fill="${C.blazer}"/>
    <path d="M50 580 L62 420 C66 410 72 402 82 396 C76 440 76 520 80 580 Z M350 580 L338 420 C334 410 328 402 318 396 C324 440 324 520 320 580 Z" fill="${C.blazerShade}"/>
    <path d="M172 346 L200 426 L228 346 Z" fill="${C.top}"/>
    <path d="M172 346 L146 358 L188 466 L200 426 Z M228 346 L254 358 L212 466 L200 426 Z" fill="${C.blazerShade}"/>
    <path d="M180 354 C184 388 192 406 200 414 C208 406 216 388 220 354" fill="none" stroke="${C.gold}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="200" cy="418" r="5.5" fill="#fff"/>
    <path d="M172 296 L172 348 C180 366 220 366 228 348 L228 296 Z" fill="url(#tn-neck)"/>
  </g></g>

  <g class="toon-head">
    <circle cx="127" cy="212" r="14" fill="${C.skin}"/><circle cx="273" cy="212" r="14" fill="${C.skin}"/>
    <path d="M126 196 C126 128 156 90 200 90 C244 90 274 128 274 196 C274 256 242 304 200 306 C158 304 126 256 126 196 Z" fill="${C.skin}"/>
    <ellipse cx="200" cy="308" rx="28" ry="6.5" fill="${C.skinShade}" opacity=".35"/>
    <circle cx="152" cy="254" r="24" fill="url(#tn-cheek)"/><circle cx="248" cy="254" r="24" fill="url(#tn-cheek)"/>

    <g class="toon-brows">
      <path d="M141 178 C153 163 179 163 191 172" fill="none" stroke="${C.hair}" stroke-width="7" stroke-linecap="round"/>
      <path d="M259 178 C247 163 221 163 209 172" fill="none" stroke="${C.hair}" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g class="toon-eyes">
      <g class="toon-eye" style="transform-origin:165px 199px">
        <path d="M141 199 C153 180 179 180 189 199 C179 214 153 214 141 199 Z" fill="#fff"/>
        <circle class="toon-iris" cx="166" cy="199" r="12.5" fill="${C.iris}"/><circle cx="166" cy="199" r="6" fill="#120a07"/><circle cx="171" cy="194" r="3.2" fill="#fff"/>
        <path d="M139 200 C152 178 181 178 191 199" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>
        <path d="M139 200 C135 197 133 193 132 190" fill="none" stroke="${C.hair}" stroke-width="3.4" stroke-linecap="round"/>
      </g>
      <g class="toon-eye" style="transform-origin:235px 199px">
        <path d="M259 199 C247 180 221 180 211 199 C221 214 247 214 259 199 Z" fill="#fff"/>
        <circle class="toon-iris" cx="234" cy="199" r="12.5" fill="${C.iris}"/><circle cx="234" cy="199" r="6" fill="#120a07"/><circle cx="239" cy="194" r="3.2" fill="#fff"/>
        <path d="M261 200 C248 178 219 178 209 199" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>
        <path d="M261 200 C265 197 267 193 268 190" fill="none" stroke="${C.hair}" stroke-width="3.4" stroke-linecap="round"/>
      </g>
    </g>
    <path d="M201 214 C197 232 194 244 200 248 C205 250 210 247 208 243" fill="none" stroke="#c98d6c" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>

    <g class="toon-mouth">
      <path class="toon-mouth-bg" d="" fill="${C.mouth}"/>
      <g clip-path="url(#tn-mouth-clip)"><rect class="toon-teeth" x="170" y="272" width="60" height="8" rx="3" fill="#fff"/><ellipse class="toon-tongue" cx="200" cy="300" rx="15" ry="8" fill="#d96a6a"/></g>
      <path class="toon-lower" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="2" stroke-linejoin="round"/>
      <path class="toon-upper" d="" fill="${C.lip}" stroke="${C.lipDark}" stroke-width="2" stroke-linejoin="round"/>
    </g>

    <path d="M200 72 C148 70 112 118 116 196 C118 236 112 264 118 296 C130 292 136 262 138 228 C140 178 160 132 200 106 Z" fill="url(#tn-hair)"/>
    <path d="M200 72 C252 70 288 118 284 196 C282 236 288 264 282 296 C270 292 264 262 262 228 C260 178 240 132 200 106 Z" fill="url(#tn-hair)"/>
    <path d="M120 226 C110 274 102 320 96 372 C92 408 106 432 124 424 C138 416 136 392 140 362 C144 322 144 274 138 240 Z" fill="url(#tn-hair)"/>
    <path d="M280 226 C290 274 298 320 304 372 C308 408 294 432 276 424 C262 416 264 392 260 362 C256 322 256 274 262 240 Z" fill="url(#tn-hair)"/>
    <path d="M200 78 C176 84 150 106 140 152" fill="none" stroke="#5a4136" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    <path d="M200 78 C224 84 250 106 260 152" fill="none" stroke="#5a4136" stroke-width="3" stroke-linecap="round" opacity=".5"/>
  </g>
</svg>`;

  const q = (r, s) => r.querySelector(s);

  // The mouth is built from three curves. The middle line is the smile; the lips hang off it, and the lower lip drops as it opens.
  function setMouth(root, o) {
    const yc = 277, w = 25 + o * 3;
    const smile = (1.0 - o * 0.7) * 6.5;                 // how much the corners lift (flattens as it opens)
    const drop = o * 25;
    const N = 14;
    const xs = Array.from({ length: N + 1 }, (_, i) => 200 - w + (2 * w * i) / N);
    const u = (x) => (x - 200) / w;
    const M = (x) => yc + smile * (1 - u(x) * u(x)) - smile * 0.4;
    const bow = (x) => (Math.abs(u(x)) < 0.22 ? 1.4 : 0);   // a small dip in the upper lip
    const pts = (f) => xs.map((x) => x.toFixed(1) + ' ' + f(x).toFixed(1));
    const rev = (a) => a.slice().reverse();
    const upTop = (x) => M(x) - 5.5 + bow(x) - 0.6 * (1 - Math.abs(u(x)));
    const lowTop = (x) => M(x) + drop * Math.pow(Math.max(0, 1 - u(x) * u(x)), 0.7);
    const lowBot = (x) => lowTop(x) + 7 + 2.5 * (1 - u(x) * u(x));
    const poly = (a) => 'M' + a.join(' L') + ' Z';
    q(root, '.toon-upper').setAttribute('d', poly([...pts(upTop), ...rev(pts(M))]));
    q(root, '.toon-lower').setAttribute('d', poly([...pts(lowTop), ...rev(pts(lowBot))]));
    const open = o > 0.07;
    const inner = poly([...pts(M), ...rev(pts(lowTop))]);
    q(root, '.toon-mouth-bg').setAttribute('d', open ? inner : '');
    q(root, '#tn-mouth-in').setAttribute('d', open ? inner : '');
    q(root, '.toon-teeth').setAttribute('y', String(M(200) - 1));
    q(root, '.toon-teeth').setAttribute('height', String(Math.min(9, 2 + o * 9)));
    q(root, '.toon-tongue').setAttribute('cy', String(M(200) + drop * 0.95));
  }

  function mount(host) {
    const wrap = document.createElement('div');
    wrap.className = 'cn-toon';
    wrap.innerHTML = art;
    host.appendChild(wrap);
    setMouth(wrap, 0);
    return wrap;
  }

  // drives the character from the playing clip; returns a function that stops it
  function drive(video, root) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const head = q(root, '.toon-head'), body = q(root, '.toon-body'), brows = q(root, '.toon-brows');
    const eyes = root.querySelectorAll('.toon-eye'), irises = root.querySelectorAll('.toon-iris');
    let raf = 0, open = 0, nextBlink = performance.now() + 1600, blinkUntil = 0;
    const t0 = performance.now();
    const at = (t) => {
      const i = t / STEP, a = Math.floor(i), f = i - a;
      const e0 = ENV[a] || 0, e1 = ENV[a + 1] || 0;
      return (e0 + (e1 - e0) * f) / 100;
    };
    const frame = (now) => {
      const speaking = !video.paused && !video.ended;
      const e = speaking ? at(video.currentTime) : 0;
      const target = Math.min(1, Math.pow(e, 0.75) * 1.25);
      open += (target - open) * (target > open ? 0.55 : 0.32);
      setMouth(root, open < 0.04 ? 0 : open);
      const s = (now - t0) / 1000;
      brows.setAttribute('transform', 'translate(0 ' + (-4 * Math.max(0, e - 0.6) / 0.4).toFixed(2) + ')');
      if (!reduce) {
        head.setAttribute('transform', 'rotate(' + (Math.sin(s * 0.9) * 1.1 + (speaking ? Math.sin(s * 5.1) * 0.5 * e : 0)).toFixed(3) + ' 200 340) translate(0 ' + (Math.sin(s * 1.7) * 1.4 - open * 1.2).toFixed(2) + ')');
        body.setAttribute('transform', 'translate(0 ' + (Math.sin(s * 1.7) * 1.8).toFixed(2) + ')');
        const look = Math.sin(s * 0.55) * 2.4;
        irises.forEach((n) => n.setAttribute('transform', 'translate(' + look.toFixed(2) + ' 0)'));
      }
      if (now > nextBlink) { blinkUntil = now + 130; nextBlink = now + 2400 + Math.random() * 3200; }
      const closed = now < blinkUntil;
      eyes.forEach((n) => { n.style.transform = closed ? 'scaleY(0.08)' : 'scaleY(1)'; });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); };
  }

  window.SKToon = { mount, drive, setMouth };
})();
