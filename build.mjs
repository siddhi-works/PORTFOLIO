// build.mjs — zero-dependency static site generator.
//   node build.mjs   → writes ./dist (real HTML page per URL)
// Content lives in content.mjs. Styles and scripts live in src/.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import C from './content.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
const { site, contact, portrait } = C;

/* ---------- helpers ---------- */
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const exists = (p) => !!p && fs.existsSync(path.join(root, p.replace(/^\//, '')));
// Resolve a media path, trying other image extensions so siddhi.png works as well as siddhi.jpg.
function resolveMedia(p) {
  if (!p) return null;
  if (exists(p)) return p;
  const base = p.replace(/\.(jpe?g|png|webp)$/i, '');
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) if (exists(`${base}.${ext}`)) return `${base}.${ext}`;
  return null;
}
const github = (repo) => (repo ? `${contact.github}/${repo}` : null);
const bySlug = (s) => C.projects.find((p) => p.slug === s);
const top = C.projects.filter((p) => p.top);
const withPage = C.projects.filter((p) => p.page);
const caseUrl = (p) => `/work/${p.slug}/`;
const serviceUrl = (s) => `/services/${s.slug}/`;
const generalResume = exists(contact.resume) ? contact.resume : null;
const lowerOpen = site.openTo.map((x) => x.toLowerCase());
const openLine = `Open to ${lowerOpen.slice(0, -1).join(', ')} and ${lowerOpen[lowerOpen.length - 1]}.`;

// Text that decodes itself when it scrolls into view. Screen readers get the plain text.
const scr = (text) => `<span class="sr">${esc(text)}</span><span aria-hidden="true" data-scramble="${esc(text)}">${esc(text)}</span>`;
// "*word*" becomes a soft highlight.
const hl = (text) => esc(text).replace(/\*(.+?)\*/g, '<mark class="hl">$1</mark>');
const plain = (text) => text.replace(/\*/g, '');
const fact = (f) => `${f.prefix || ''}${f.n}${f.unit || ''}`;

function slot(label, cls = '') {
  const hint = site.showSlotHints ? `<span class="slot-hint">Slot: ${esc(label)}</span>` : '';
  return `<div class="slot ${cls}" role="img" aria-label="Image to come">${hint}</div>`;
}

const icon = {
  copy: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13H7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  ext: '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M8 4H4v12h12v-4M11 3h6v6M17 3l-8 8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.5l1.7 4.3-2.3 1.5a11 11 0 0 0 6.3 6.3l1.5-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/></svg>',
  svc: {
    agent: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="9" width="18" height="14" rx="3"/><path d="M16 9V5M12 15v2M20 15v2M4 14v4M28 14v4M12 27h8"/></svg>',
    chart: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5v22h22"/><path d="m9 20 5-6 4 4 8-10"/><path d="M21 8h5v5"/></svg>',
    layers: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 4 12 6-12 6L4 10l12-6Z"/><path d="m4 16 12 6 12-6M4 22l12 6 12-6"/></svg>',
    bolt: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3 7 18h8l-2 11 12-16h-8l1-10Z"/></svg>',
    briefcase: '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="24" height="16" rx="3"/><path d="M12 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M4 17h24"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  },
  github: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
};

const socials = (cls = '') => `
<span class="socials ${cls}">
  <a class="icon-btn" href="${contact.linkedin}" target="_blank" rel="noopener" aria-label="Siddhi Kale on LinkedIn">${icon.linkedin}</a>
  <a class="icon-btn" href="${contact.github}" target="_blank" rel="noopener" aria-label="Siddhi Kale on GitHub">${icon.github}</a>
</span>`;

/* ---------- chrome shared by every page ---------- */
// The opening intro: a laptop opens, boots, and the camera walks into the screen.
// Hidden unless the head script switches it on.
function portal() {
  const log = [
    'mounting projects … 20+',
    'loading agents … ok',
    'loading dashboards … ok',
    'resolving sources … ok',
    'opening portfolio …',
  ];
  return `<div id="portal" class="portal" role="status" aria-label="Loading the site">
  <div class="lp-scene" aria-hidden="true">
    <div class="lp">
      <div class="lid">
        <div class="lid-front">
          <span class="cam"></span>
          <div class="scr">
            <div class="scr-top"><span>SK-OS</span><span>${esc(site.place.split(',')[0])}</span></div>
            <div class="scr-body">
              <p class="scr-hello">${esc(site.name)}</p>
              <p class="scr-role">${esc(site.role)}</p>
              <ul class="scr-log">${log.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
              <div class="scr-bar"><i></i></div>
              <p class="scr-pct">0%</p>
            </div>
          </div>
        </div>
        <div class="lid-back"></div>
      </div>
      <div class="lp-base"><div class="keys"></div><div class="pad"></div></div>
    </div>
  </div>
  <div class="lp-flash" aria-hidden="true"></div>
  <div class="portal-hud">
    <p class="portal-msg" aria-hidden="true">Powering on</p>
    <button class="portal-skip" type="button">Skip intro</button>
  </div>
</div>`;
}

function veil() {
  const w = [1, 1.7, 1.1, 2.1, 1.2, 1.6, 1];
  return `<div id="veil" class="veil" aria-hidden="true">${w.map((f) => `<i class="veil-slab" style="--w:${f}"></i>`).join('')}<span class="veil-label"></span></div>`;
}


// Android-style bottom navigation: five places, a tonal pill behind the active one. Phones only (CSS).
function bnav(current) {
  const h = current === 'home' ? '' : '/';
  const it = (id, label, svg, extra = '') => `<a href="${h}#${id}" data-sec="${id}"${extra}><span class="bn-pill">${svg}</span><span class="bn-label">${label}</span></a>`;
  return `
<nav class="bnav" aria-label="Sections">
  ${it('top', 'Home', '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-7.5Z"/></svg>')}
  ${it('work', 'Work', '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>')}
  ${it('services', 'Services', '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>')}
  ${it('records', 'Wins', '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6"/></svg>')}
  ${it('contact', 'Contact', '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/></svg>', ' data-sheet')}
</nav>`;
}

function bar(current) {
  const h = current === 'home' ? '' : '/';
  const link = (id, label, active) =>
    `<a class="link" href="${h}#${id}" data-section="${id}" data-label="${esc(label)}"${active ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  return `
<header class="bar">
  <a class="bar-brand" href="/" data-label="${esc(site.name)}"><span class="bar-brand-mark">${esc(site.initials)}</span>${esc(site.name)}</a>
  <button class="bar-menu" type="button" aria-expanded="false" aria-controls="bar-nav"><span class="bar-menu-t">Menu</span></button>
  <nav class="bar-nav" id="bar-nav" aria-label="Main">
    ${link('work', 'Projects', current === 'work')}
    ${link('services', 'Services', current === 'services')}
    <a class="mark" href="/" aria-label="${esc(site.name)}, home" data-label="${esc(site.name)}">${esc(site.initials)}</a>
    ${link('experience', 'Experience')}
    ${link('beyond', 'Humanity')}
    <a class="link nav-contact" href="${h}#contact" data-section="contact" data-label="Contact">Contact</a>
  </nav>
  <div class="bar-tools">
    ${socials()}
    <a class="bar-contact" href="${h}#contact" data-label="Contact">Contact me</a>
    <a class="bar-resume" href="/resume/" data-label="Résumé"${current === 'resume' ? ' aria-current="page"' : ''}>Résumé</a>
  </div>
</header>`;
}

function hud() {
  return `
<div class="hud" aria-hidden="true">
  <p class="hud-pill"><span class="lamp"></span>${esc(site.status)}</p>
  <p class="hud-pill hud-clock"><span data-clock="${esc(site.timeZone)}">--:--</span> ${esc(site.place.split(',')[0])}</p>
</div>`;
}

function footer() {
  return `
<footer class="foot">
  <div class="foot-meta">
    <p>${esc(site.name)}, ${esc(site.role)}, ${esc(site.place)}</p>
    <div class="foot-right">
      ${socials('socials-sm')}
      <ul class="foot-links">
        <li><a href="mailto:${contact.email}">${esc(contact.email)}</a></li>
        <li><a href="/resume/" data-label="Résumé">Résumé</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

// Image dimensions read from the file header, so the browser can reserve space before the image loads.
const dimCache = new Map();
function dims(p) {
  if (dimCache.has(p)) return dimCache.get(p);
  let r = null;
  try {
    const b = fs.readFileSync(path.join(root, p.replace(/^\//, '')));
    if (b.toString('latin1', 1, 4) === 'PNG') r = [b.readUInt32BE(16), b.readUInt32BE(20)];
    else if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') {
      const k = b.toString('latin1', 12, 16);
      if (k === 'VP8 ') r = [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      else if (k === 'VP8L') { const v = b.readUInt32LE(21); r = [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
      else if (k === 'VP8X') r = [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      for (let i = 2; i < b.length - 9;) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { r = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch { /* no size: the image still renders */ }
  dimCache.set(p, r);
  return r;
}
const size = (p) => { const d = dims(p); return d ? ` width="${d[0]}" height="${d[1]}"` : ''; };

// Search engines cut descriptions near 160 characters, so end on a whole word.
const clip = (s, n = 160) => {
  s = String(s).replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '') + '…';
};

// The one inline script in every <head>. It is allowed by hash in the Content-Security-Policy below.
const BOOT = `
(function(){var d=document.documentElement;d.classList.add('js');
var r=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=false;try{seen=sessionStorage.getItem('portal-seen')==='1'}catch(e){}
try{var nv=performance.getEntriesByType('navigation')[0];if(nv&&nv.type==='reload'){seen=false;sessionStorage.removeItem('portal-seen');}}catch(e){}
var shot=false;try{shot=!!sessionStorage.getItem('shoot')}catch(e){}
var home=location.pathname==='/'||location.pathname==='';
if(!r){d.classList.add(shot?'is-shot':(seen||!home?'is-veiled':'is-portal'));}})();
`;
const origin = (u) => { try { return new URL(u).origin; } catch { return ''; } };
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${crypto.createHash('sha256').update(BOOT).digest('base64')}'`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self' ${origin(contact.formEndpoint)}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function page({ file, title, desc, current, theme = '', body, ogTitle, jsonld, noindex = false }) {
  desc = clip(desc);
  const isHome = file === 'index.html';
  const fullTitle = isHome ? `${site.name}: ${site.role}, ${site.place}` : `${title} | ${site.name}`;
  const ogPortrait = resolveMedia(portrait.src);
  const ogImage = ogPortrait ? site.url.replace(/\/$/, '') + ogPortrait : null;
  const url = site.url.replace(/\/$/, '') + (isHome ? '/' : '/' + file.replace(/index\.html$/, ''));
  const ldData = isHome ? homeLd() : jsonld;
  const ld = ldData ? `<script type="application/ld+json">${JSON.stringify(ldData).replace(/</g, '\\u003c')}</script>` : '';

  return `<!doctype html>
<html lang="en" class="${theme}">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>${noindex ? '\n<meta name="robots" content="noindex">' : ''}
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0c0b09">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(ogTitle || fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${esc(site.name)}">
${ogImage ? `<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">` : '<meta name="twitter:card" content="summary">'}
${noindex ? '' : `<link rel="canonical" href="${url}">`}
<link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Full site content as Markdown">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230c0b09'/%3E%3Crect x='14' y='5' width='4' height='22' rx='2' fill='%23e4a73f'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<script>${BOOT}</script>
${ld}
</head>
<body data-page="${current}">
<a class="skip" href="#main">Skip to content</a>
${portal()}
${veil()}
${bar(current)}
${bnav(current)}
${body}
${footer()}
${hud()}
<script src="/assets/visuals.js" defer></script>
<script src="/assets/cinema.js" defer></script>
<script src="/assets/fx.js" defer></script>
<script src="/assets/scroll.js" defer></script>
<script src="/assets/form.js" defer></script>
<script src="/assets/interact.js" defer></script><script src="/assets/honours.js" defer></script><script src="/assets/mobile.js" defer></script><script src="/assets/fit.js" defer></script><script src="/assets/site.js" defer></script>
</body>
</html>`;
}

function write(file, html) {
  const p = path.join(out, file);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
}

/* ---------- components ---------- */
function barcode(str) {
  let x = 0, bars = '';
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    for (let b = 0; b < 4; b++) {
      const w = 1 + ((c >> (b * 2)) & 3);
      if (b % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="40"/>`;
      x += w + 1;
    }
    x += 2;
  }
  return `<svg class="id-bars" viewBox="0 0 ${x} 40" preserveAspectRatio="none" aria-hidden="true" fill="currentColor">${bars}</svg>`;
}

function portraitHtml(cls = '') {
  const pr = resolveMedia(portrait.src);
  return pr
    ? `<img src="${pr}" alt="${esc(portrait.alt)}" width="1280" height="1448" style="--scale:${portrait.scale};object-position:${portrait.position}">`
    : slot(portrait.src, cls);
}

function idCard() {
  const pr = resolveMedia(portrait.src);
  const photo = pr
    ? `<img src="${pr}" alt="" width="1280" height="1448" style="--scale:${portrait.scale};object-position:${portrait.position}">`
    : slot(portrait.src, 'slot-card');
  return `
<aside class="badge" aria-label="Identity card">
  <div class="hang">
    <div class="strap" aria-hidden="true"><i class="clasp"></i></div>
    <div class="idcard" data-idcard>
      <div class="idcard-inner">
        <section class="face face-front" aria-label="Front of the card">
          <span class="id-hole" aria-hidden="true"></span>
          <div class="id-photo">${photo}</div>
          <h3 class="id-name">${esc(site.name)}</h3>
          <p class="id-role">${esc(site.role)}</p>
          <dl class="id-fields">
            <div><dt>Base</dt><dd>${esc(site.place)}</dd></div>
            <div><dt>Handle</dt><dd>${esc(contact.githubHandle)}</dd></div>
          </dl>
          ${barcode(contact.githubHandle)}
        </section>
        <section class="face face-back" aria-label="Back of the card" aria-hidden="true">
          <span class="id-hole" aria-hidden="true"></span>
          <p class="id-open">Open to</p>
          <ul class="id-open-list">${site.openTo.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
          <dl class="id-fields id-fields-back">
            <div><dt>Email</dt><dd>${esc(contact.email)}</dd></div>
            <div><dt>Phone</dt><dd>${esc(contact.phone)}</dd></div>
            <div><dt>GitHub</dt><dd>${esc(contact.githubHandle)}</dd></div>
            <div><dt>LinkedIn</dt><dd>${esc(contact.linkedinHandle)}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  </div>
</aside>`;
}

function secHead(tag, title, sub, id) {
  return `
<header class="sec-head">
  <p class="sec-tag">${scr(tag)}</p>
  <h2 class="sec-title"${id ? ` id="${id}"` : ''}>${esc(title)}</h2>
  ${sub ? `<p class="sec-sub">${esc(sub)}</p>` : ''}
</header>`;
}

function marquee(words, cls = '') {
  const run = words.map((w) => `<span>${esc(w)}</span>`).join('');
  return `<div class="marquee ${cls}" aria-hidden="true"><div class="marquee-track">${run}${run}${run}${run}</div></div>`;
}

// One project card for the sideways rail. The front is short; hovering flips it to the details.
const railProjects = [...top, ...C.projects.filter((p) => !p.top)];
function hcard(p, i, lv = 3) {
  const shot = resolveMedia(p.shot);
  const href = p.page ? caseUrl(p) : github(p.repo);
  const external = !!href && !p.page;
  const tilt = [-1.4, 1.1, -0.8, 1.5, -1.2][i % 5];
  const art = shot
    ? `<img src="${shot}" alt="Screenshot of ${esc(p.name)}"${size(shot)} loading="lazy" decoding="async">`
    : `<canvas data-visual="${p.visual || 'generic'}" data-seed="${i + 3}" aria-hidden="true"></canvas>`;
  const attrs = external ? ' target="_blank" rel="noopener"' : ` data-shoot data-label="${esc(p.short || p.name)}"`;
  const facts = (p.facts || []).slice(0, 3);
  const factHtml = facts.length
    ? `<ul class="hcard-facts">${facts.map((f) => `<li><b>${esc(fact(f))}</b><span>${esc(f.label)}</span></li>`).join('')}</ul>`
    : p.score ? `<ul class="hcard-facts"><li><b>${p.score}%</b><span>accuracy</span></li></ul>` : '';
  const cta = external ? 'Read the code' : 'Open the project';
  const extLinks = [
    p.live && `<a href="${p.live}" target="_blank" rel="noopener">Live app ${icon.ext}</a>`,
    p.page && p.repo && `<a href="${github(p.repo)}" target="_blank" rel="noopener">Code ${icon.ext}</a>`,
  ].filter(Boolean).join('');
  return `
<li class="hcard" style="--tilt:${tilt}deg">
  <article class="hcard-in">
    <div class="hcard-flip">
      <div class="hcard-face hcard-front">
        <div class="hcard-art${shot ? ' has-shot' : ''}">
          ${art}
          ${p.badge ? `<p class="hcard-badge"><span class="lamp" aria-hidden="true"></span>${esc(p.badge)}</p>` : ''}
        </div>
        <div class="hcard-body">
          <h${lv} class="hcard-name">${href ? `<a class="stretch" href="${href}"${attrs}>${esc(p.name)}</a>` : esc(p.name)}</h${lv}>
          <p class="hcard-line">${esc(p.card || p.line)}</p>
        </div>
      </div>
      <div class="hcard-face hcard-back">
        <p class="hcard-name hcard-name-sm">${esc(p.name)}</p>
        <p class="hcard-line hcard-line-full">${esc(p.line)}</p>
        ${factHtml}
        ${(p.tools || []).length ? `<ul class="chips">${p.tools.slice(0, 5).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${href ? `<p class="hcard-cta"><a class="stretch" href="${href}"${attrs}><span>${cta}</span></a></p>` : ''}
        ${extLinks ? `<p class="hcard-ext">${extLinks}</p>` : ''}
      </div>
    </div>
  </article>
</li>`;
}

// Animated shapes for the three records.
function recArt(kind) {
  if (kind === 'prize') {
    return `<span class="art art-prize" aria-hidden="true">
      <i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i>
      <svg class="star" viewBox="-50 -50 100 100"><polygon points="0,-40 11.8,-16.2 38,-12.4 19,6.2 23.5,32.4 0,20 -23.5,32.4 -19,6.2 -38,-12.4 -11.8,-16.2"/></svg>
      ${[0, 1, 2, 3, 4, 5].map((n) => `<b class="chip" style="--r:${64 + (n % 3) * 22}px;--d:${7 + n * 1.3}s;--o:${n * -1.1}s"></b>`).join('')}
    </span>`;
  }
  if (kind === 'rank') {
    return `<span class="art art-rank" aria-hidden="true">
      ${[1, 2, 3, 4, 5, 6, 7].map((n) => `<i class="${n === 1 ? 'on' : ''}" style="--w:${100 - (n - 1) * 10}%;--k:${n}"></i>`).join('')}
    </span>`;
  }
  return `<span class="art art-paper" aria-hidden="true">
    <i class="sheet s1"></i><i class="sheet s2"></i>
    <i class="sheet s3"><u></u><u></u><u></u><u></u></i>
    <b class="seal"></b>
  </span>`;
}

/* ---------- numbers: one strip, no boxes ---------- */
function numTile(s) {
  return `
      <li class="stat">
        <span class="stat-n"><span data-count="${s.n}" data-dec="${s.dec || 0}">${s.dec ? s.n.toFixed(s.dec) : s.n}</span>${s.unit ? `<span class="stat-unit">${esc(s.unit)}</span>` : ''}${s.plus ? '<span class="stat-unit">+</span>' : ''}</span>
        <span class="stat-l">${s.href ? `<a class="stat-a" href="${s.href}"${s.href.startsWith('/') ? ` data-label="${esc(s.label)}"` : ''}>${esc(s.label)}</a>` : esc(s.label)}</span>
        ${s.sub ? `<span class="stat-sub">${esc(s.sub)}</span>` : ''}
      </li>`;
}

/* ---------- interactive text helpers ---------- */
const escRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const linkNames = [
  ...C.projects.filter((p) => p.page || p.repo).map((p) => [p.short || p.name, p.page ? caseUrl(p) : github(p.repo), !p.page]),
  ['ICAIML-AE 2026', '/records/icaiml-ae-2026/', false],
].sort((a, b) => b[0].length - a[0].length);
const linkRe = new RegExp('\\b(' + linkNames.map((n) => escRe(n[0])).join('|') + ')\\b', 'g');
function linkify(text) {
  return esc(text).replace(linkRe, (m) => {
    const hit = linkNames.find((n) => n[0] === m);
    if (!hit) return m;
    return `<a class="inline-link" href="${hit[1]}"${hit[2] ? ' target="_blank" rel="noopener"' : ` data-label="${esc(m)}"`}>${m}</a>`;
  });
}
const toolIndex = C.projects.map((p) => ({ slug: p.slug, name: p.short || p.name, tools: (p.tools || []).map((x) => x.toLowerCase()) }));
function chip(t) {
  const c = t.toLowerCase();
  const hit = toolIndex.filter((p) => p.tools.some((x) => x === c || (c.length > 3 && x.length > 3 && (x.includes(c) || c.includes(x)))));
  const used = hit.map((p) => p.name).slice(0, 4);
  return used.length ? `<li tabindex="0" data-used="Used in ${esc(used.join(', '))}" data-slugs="${hit.map((p) => p.slug).join(',')}">${esc(t)}</li>` : `<li>${esc(t)}</li>`;
}


/* ---------- line art for the volunteering frames, used until a real photo is added ---------- */
const S = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
const beyondArt = {
  research: '<svg viewBox="0 0 240 150" aria-hidden="true"><g ' + S + '><rect class="a-draw" x="40" y="86" width="14" height="40"/><rect class="a-draw" x="64" y="62" width="14" height="64"/><rect class="a-draw" x="88" y="74" width="14" height="52"/><path class="a-draw" d="M30 128h84"/><circle class="a-draw" cx="164" cy="64" r="24"/><path class="a-draw" d="m182 82 22 22"/><path class="a-draw" d="M154 64h20M164 54v20"/></g><circle class="a-dot" cx="204" cy="30" r="4"/><circle class="a-dot d2" cx="30" cy="34" r="3"/></svg>',
  content: '<svg viewBox="0 0 240 150" aria-hidden="true"><g ' + S + '><path class="a-draw" d="M44 62h34l56-30v86L78 88H44z"/><path class="a-draw" d="M62 88l8 34h14l-8-34"/><path class="a-wave w1" d="M150 56c10 8 10 30 0 38"/><path class="a-wave w2" d="M166 44c18 16 18 48 0 64"/><path class="a-wave w3" d="M182 32c26 24 26 70 0 92"/></g><circle class="a-dot" cx="212" cy="26" r="4"/><circle class="a-dot d2" cx="26" cy="124" r="3"/></svg>',
  plant: '<svg viewBox="0 0 240 150" aria-hidden="true"><g ' + S + '><path class="a-draw" d="M120 124V70"/><path class="a-draw" d="M120 92c-26 0-38-16-40-36 24 0 40 12 40 36z"/><path class="a-draw" d="M120 78c24 0 36-14 38-32-22 0-38 10-38 32z"/><path class="a-draw" d="M70 128h100"/><path class="a-draw" d="M84 128l6 12h60l6-12"/></g><g class="a-sun" ' + S + '><circle cx="192" cy="36" r="10"/><path d="M192 14v6M192 52v6M170 36h6M208 36h6M176 20l4 4M204 48l4 4M208 20l-4 4M180 48l-4 4"/></g><circle class="a-dot d2" cx="40" cy="46" r="3"/></svg>',
  balloons: '<svg viewBox="0 0 240 150" aria-hidden="true"><g ' + S + '><ellipse class="a-float f1" cx="88" cy="56" rx="22" ry="28"/><path class="a-float f1" d="M88 84c-2 18 6 26 0 44"/><ellipse class="a-float f2" cx="134" cy="46" rx="22" ry="28"/><path class="a-float f2" d="M134 74c2 18-4 30 2 54"/><ellipse class="a-float f3" cx="176" cy="62" rx="20" ry="26"/><path class="a-float f3" d="M176 88c-2 14 4 24-2 40"/></g><path class="a-dot" d="M30 40l4 8 8 1-6 6 2 9-8-4-8 4 2-9-6-6 8-1z"/></svg>',
  book: '<svg viewBox="0 0 240 150" aria-hidden="true"><g ' + S + '><path class="a-draw" d="M120 46c-18-12-44-14-72-8v76c28-6 54-4 72 8 18-12 44-14 72-8V38c-28-6-54-4-72 8z"/><path class="a-draw" d="M120 46v76"/><path class="a-draw" d="M64 60c10-2 20-1 30 3M64 78c10-2 20-1 30 3M146 63c10-4 20-5 30-3M146 81c10-4 20-5 30-3"/></g><g class="a-spark" ' + S + '><path d="M120 16v10M104 22l6 8M136 22l-6 8"/></g><circle class="a-dot d2" cx="208" cy="124" r="3"/></svg>',
};
const artFor = (b) => beyondArt[b.art] || beyondArt.plant;


/* ---------- projects grouped by technology ---------- */
const orbitIds = ['agentic', 'data', 'deep', 'platforms'];
const groupsForOrbit = (C.projectGroups || []).filter((g) => orbitIds.includes(g.id)).map((g) => {
  const items = g.projects.map(bySlug).filter(Boolean);
  return { ...g, items, thumb: resolveMedia(g.image) || items.map((p) => resolveMedia(p.shot)).find(Boolean) || null };
});

function groupPage(g) {
  const i = groupsForOrbit.findIndex((x) => x.id === g.id);
  const prev = groupsForOrbit[(i + groupsForOrbit.length - 1) % groupsForOrbit.length];
  const next = groupsForOrbit[(i + 1) % groupsForOrbit.length];
  const body = `
<main id="main" class="page group">
  <header class="page-head">
    <p class="sec-tag">${scr('Projects')}</p>
    <h1 class="page-title page-title-md"><span class="line"><span>${esc(g.title)}</span></span></h1>
    <p class="page-sub">${esc(g.line)}</p>
  </header>
  <ul class="gcards">${g.items.map((p, k) => hcard(p, k, 2)).join('')}</ul>
  <nav class="gnav" aria-label="More project groups">
    <a class="textlink" href="/projects/${prev.id}/" data-label="${esc(prev.title)}">\u2190 ${esc(prev.title)}</a>
    <a class="textlink" href="/#work" data-label="Projects">All groups</a>
    <a class="textlink" href="/projects/${next.id}/" data-label="${esc(next.title)}">${esc(next.title)} \u2192</a>
  </nav>
</main>`;
  return page({ file: `projects/${g.id}/index.html`, title: g.title, desc: `${g.title}: ${g.line}`, current: 'work', body });
}

function conceptItem(t) {
  const slugs = (C.conceptUse || {})[t] || [];
  const names = slugs.map(bySlug).filter(Boolean).map((p) => p.short || p.name);
  return names.length ? `<li tabindex="0" data-used="Used in ${esc(names.join(', '))}" data-slugs="${slugs.join(',')}">${esc(t)}</li>` : `<li>${esc(t)}</li>`;
}

/* ---------- home ---------- */
function home() {
  const orbit = ['LangGraph', 'Data Science', 'React', 'Python', 'TypeScript', 'Automation'];
  const body = `
<main id="main" class="home">
${(C.intro && C.intro.speech) ? `<script type="application/json" id="sk-intro">${JSON.stringify({ speech: C.intro.speech, start: C.intro.speechStart, end: C.intro.speechEnd }).replace(/</g, '\\u003c')}</script>` : ''}

  <section class="hero" id="top" aria-label="Introduction">
    <div class="hero-copy">
      <p class="status"><span class="lamp" aria-hidden="true"></span>${esc(openLine)}</p>
      <h1 class="name"><span class="name-line"><span>Siddhi</span></span><span class="name-line"><span>Kale</span></span></h1>
      <p class="role">${esc(site.role)}</p>
      <p class="hero-quote" data-quote="${esc(C.hero.quote)}"><span class="hq-text">${hl(C.hero.quote)}</span><span class="caret" aria-hidden="true"></span></p>
      <div class="hero-actions">
        <a class="cta" href="#work">See the work</a>
        <a class="ghost" href="#contact">Contact me</a>
      </div>
    </div>

    <div class="hero-photo">
      <div class="photo-frame">
        <span class="hud-c hud-tl" aria-hidden="true"></span><span class="hud-c hud-tr" aria-hidden="true"></span>
        <span class="hud-c hud-bl" aria-hidden="true"></span><span class="hud-c hud-br" aria-hidden="true"></span>
        <div class="photo-inner">${portraitHtml('slot-photo')}</div>
        <span class="scan" aria-hidden="true"></span>
      </div>
    </div>
    <div class="grid-floor" aria-hidden="true"></div>
  </section>

  <section class="numbers" aria-label="By the numbers">
    <ul class="strip">${C.numbers.map(numTile).join('')}
    </ul>
  </section>

  ${marquee(C.marquee, 'marquee-a')}

  <section class="sec about" id="about" aria-labelledby="about-h">
    ${secHead('About', C.about.title, '', 'about-h')}
    <div class="about-grid">
      <div class="about-copy">
        ${C.about.paragraphs.map((t) => `<p>${linkify(t)}</p>`).join('')}
        <dl class="about-facts">
          ${C.about.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
      </div>
      ${idCard()}
    </div>
  </section>

  ${marquee(C.marqueeProof, 'marquee-b')}

  <section class="sec work" id="work" aria-labelledby="work-h">
    <div class="proj-orbit" data-orbit>
      <div class="orbit-core"><h2 class="orbit-title" id="work-h">Selected projects.</h2></div>
      <div class="orbit-ring">
        ${groupsForOrbit.map((g, i) => `
        <div class="orbit-item" style="--a:${i * 90}deg">
          <div class="orbit-card">
            <div class="orbit-card-in">
              <a class="orbit-link" href="/projects/${g.id}/" data-label="${esc(g.title)}">
                <span class="orbit-thumb">${g.thumb ? `<img src="${g.thumb}" alt="" width="164" height="164">` : '<canvas data-visual="generic" aria-hidden="true"></canvas>'}</span>
                <span class="orbit-name">${esc(g.title)}</span>
                <span class="orbit-count">${g.items.length} projects</span>
              </a>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <p class="also-more"><a class="textlink" href="/work/" data-label="Every project">See every project on the map</a></p>
  </section>

  <section class="sec experience" id="experience" aria-labelledby="exp-h">
    ${secHead('Experience', 'Experience.', 'Roles where I led, built and gave back, newest first.', 'exp-h')}
    <div class="exp">
      <ol class="tl" aria-label="Experience, newest first">
        ${C.experience.map((x, i) => `
        <li class="tl-item${i === 0 ? ' is-open' : ''}">
          <span class="tl-when">${esc(x.when)}</span>
          <span class="tl-mid" aria-hidden="true"><i class="tl-dot"></i><i class="tl-line"></i></span>
          <div class="tl-body">
            <h3 class="tl-h"><button class="tl-head" type="button" aria-expanded="${i === 0}" aria-controls="tl-d-${i}">
              <span class="tl-role">${esc(x.role)}</span>
              <span class="tl-org">${esc(x.org)}${x.type ? `<span class="tl-type">${esc(x.type)}</span>` : ''}</span>
              <span class="tl-chev" aria-hidden="true"></span>
            </button></h3>
            <div class="tl-detail" id="tl-d-${i}"><div class="tl-detail-in"><p class="tl-what">${esc(x.what)}</p></div></div>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="sec stack" id="stack" aria-labelledby="stack-h">
    ${secHead('Core stack', 'Technical skills.', 'Languages, frameworks and concepts I work with.', 'stack-h')}
    <div class="tcards">
      ${C.stackCards.map((c, i) => `
      <article class="tcard">
        <h3 class="tcard-title">${esc(c.title)}</h3>
        <ul class="tchips">${c.items.map((t) => chip(t)).join('')}</ul>
        ${i === 0 && C.stackR.length ? `<p class="tcard-note">R tooling: ${C.stackR.map(esc).join(', ')}</p>` : ''}
      </article>`).join('')}
    </div>
    <article class="tcore">
      ${C.stackCore.map((c) => `
      <div class="tcore-col">
        <h3 class="tcard-title">${esc(c.title)}</h3>
        <ul class="tcore-list">${c.items.map((t) => conceptItem(t)).join('')}</ul>
      </div>`).join('')}
    </article>
    <div class="pmap">
      <p class="pmap-hint"><span class="hint-fine">Hover a skill to see where it was used.</span><span class="hint-touch">Tap a skill to see where it was used.</span></p>
      <ul class="pmap-list">${C.projects.filter((p) => p.page || p.repo).map((p) => { const h = p.page ? caseUrl(p) : github(p.repo); return `<li data-slug="${p.slug}"><a href="${h}"${p.page ? ` data-label="${esc(p.short || p.name)}"` : ' target="_blank" rel="noopener"'}>${esc(p.short || p.name)}</a></li>`; }).join('')}</ul>
    </div>
  </section>

  <section class="sec services" id="services" aria-labelledby="svc-h">
    ${secHead('Services', 'What I can build for you.', 'Each service is backed by work I have already shipped.', 'svc-h')}
    <div class="svc-panel" data-svc>
      <div class="svc-tabs" role="tablist" aria-label="Services">
        ${C.services.map((s, i) => `<button class="svc-tab" type="button" role="tab" id="svc-t-${i}" aria-selected="${i === 0}" aria-controls="svc-p-${i}" tabindex="${i === 0 ? 0 : -1}"><span class="svc-tab-ic">${icon.svc[s.icon] || icon.svc.agent}</span><span class="svc-tab-name">${esc(s.titleParts.join(' '))}</span></button>`).join('')}
      </div>
      <div class="svc-views">
        ${C.services.map((s, i) => `
        <article class="svc-view" role="tabpanel" id="svc-p-${i}" aria-labelledby="svc-t-${i}"${i === 0 ? '' : ' hidden'}>
          <h3 class="svc-view-title">${esc(s.name)}</h3>
          <p class="svc-view-line">${esc(s.line)}</p>
          <p class="svc-view-pitch">${esc(s.pitch)}</p>
          <ul class="svc-proof">${s.projects.map(bySlug).filter(Boolean).map((p) => { const h = p.page ? caseUrl(p) : github(p.repo); const inner = `<b>${esc(p.short || p.name)}</b><span>${esc(p.card || p.line)}</span>`; return h ? `<li><a href="${h}"${p.page ? ` data-label="${esc(p.short || p.name)}"` : ' target="_blank" rel="noopener"'}>${inner}</a></li>` : `<li><div>${inner}</div></li>`; }).join('')}</ul>
          <ul class="chips">${s.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <a class="cta" href="${serviceUrl(s)}" data-label="${esc(s.short)}">See the full page</a>
        </article>`).join('')}
      </div>
    </div>
    <ul class="svc-bars">
      ${C.services.map((s) => `
      <li><a class="svc-bar" href="${serviceUrl(s)}" data-label="${esc(s.short)}">
        <span class="svc-bar-ic" aria-hidden="true">${icon.svc[s.icon] || icon.svc.agent}</span>
        <span class="svc-bar-t"><b>${esc(s.name)}</b><span>${esc(s.line)}</span></span>
        <span class="svc-bar-go" aria-hidden="true">${icon.svc.arrow}</span>
      </a></li>`).join('')}
    </ul>
    <p class="svc-more"><a class="textlink" href="#contact">A different project in mind? Say hello.</a></p>
  </section>

  <section class="sec proof" id="records" aria-labelledby="records-h">
    ${secHead('Records', 'Wins and published research.', 'Three milestones from 2026. Open any one for the full story.', 'records-h')}
    <div class="triptych" data-honours>
      ${C.records.map((r, i) => `
      <a class="pan${i === 0 ? ' is-on' : ''}" href="${r.href}" data-label="${esc(r.title.slice(0, 24))}" aria-current="${i === 0}">
        ${panBackdrop(r)}
        <span class="pan-shade" aria-hidden="true"></span>
        <span class="pan-mark" aria-hidden="true">${laurelSvg()}<span class="pan-date"><b>${esc(r.date[0])}</b>${esc(r.date[1])}</span></span>
        <span class="pan-tab" aria-hidden="true">${esc(r.result)}</span>
        <span class="pan-body">
          <span class="pan-kicker">${esc(r.title)}</span>
          <span class="pan-result">${esc(r.result)}</span>
          <span class="pan-line">${esc(r.line)}</span>
          <span class="pan-go">Read the full story</span>
        </span>
        <i class="pan-timer" aria-hidden="true"></i>
      </a>`).join('')}
    </div>

  </section>

  <section class="sec beyond" id="beyond" aria-labelledby="beyond-h">
    ${secHead('Humanity', 'Community and volunteering.', 'Volunteer work and community programmes.', 'beyond-h')}
    <ul class="frames">
      ${C.beyond.map((b, i) => {
        const shots = (b.photos && b.photos.length ? b.photos : [b.photo]).map(resolveMedia).filter(Boolean);
      const ph = shots[0];
      const gallery = `<div class="fp-track" tabindex="0" role="group" aria-label="Photos from ${esc(b.org)}">${shots.map((s, k) => `<figure class="fp-slide"><img src="${s}" alt="${esc(b.org)}, photo ${k + 1} of ${shots.length}"${size(s)}${(C.photoFocus || {})[s] ? ` style="object-position:${C.photoFocus[s]}"` : ''}${k ? ' loading="lazy"' : ''} decoding="async"></figure>`).join('')}</div>${shots.length > 1 ? `<button type="button" class="fp-arrow fp-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" class="fp-arrow fp-next" aria-label="Next photo"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="fp-dots">${shots.map((_, k) => `<button type="button" class="fp-dot${k ? '' : ' is-on'}" aria-label="Photo ${k + 1} of ${shots.length}"></button>`).join('')}</div>` : ''}`;
        return `
      <li class="frame" style="--tilt:${[-1.2, 0.8, -0.6, 1.1, -0.9][i % 5]}deg">
        <div class="frame-photo${ph ? '' : ' is-art'}">${ph ? gallery : `<span class="frame-art" role="img" aria-label="${esc(b.org)}">${artFor(b)}</span>`}</div>
        <h3 class="frame-org">${esc(b.org)}</h3>
        <p class="frame-role">${esc(b.role)}${b.when ? `, ${esc(b.when)}` : ''}</p>
        <ul class="frame-facts">${b.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </li>`;
      }).join('')}
    </ul>
  </section>

  <section class="sec contact" id="contact" aria-labelledby="contact-h">
    <div class="cpanel">
      <div class="cpanel-main">
        <p class="sec-tag">${scr('Contact')}</p>
        <h2 class="cpanel-title" id="contact-h"><span class="q" aria-hidden="true">“</span>Great collaborations start with a hello.<span class="q" aria-hidden="true">”</span></h2>
        <p class="sec-sub">${esc(openLine)} Based in ${esc(site.place)}.</p>
        <button class="cta sheet-open" type="button">Write a message</button>
        <form class="cform" novalidate data-endpoint="${esc(contact.formEndpoint || '')}" data-to="${(contact.emails || [contact.email]).join(',')}" aria-describedby="cform-status">
          <div class="sheet-head"><span class="sheet-grab" aria-hidden="true"></span><b>Say hello</b><button class="sheet-close" type="button" aria-label="Close">Close</button></div>
          <div class="cform-row">
            <label class="cf"><span>Your name</span><input name="name" type="text" autocomplete="name" required placeholder="Ada Lovelace"></label>
            <label class="cf"><span>Organisation</span><input name="organisation" type="text" autocomplete="organization" placeholder="Company, college or team"></label>
          </div>
          <fieldset class="cf-purpose">
            <legend>What brings you here?</legend>
            ${['Internship', 'Full-time role', 'Freelance project', 'Collaboration', 'Something else'].map((p, i) => `<label class="chip-radio"><input type="radio" name="purpose" value="${p}"${i === 0 ? ' required' : ''}><span>${p}</span></label>`).join('')}
          </fieldset>
          <label class="cf"><span>Message</span><textarea name="message" rows="4" required placeholder="A line or two about what you have in mind"></textarea></label>
          <label class="cf-trap" aria-hidden="true">Leave this empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
          <div class="cform-actions">
            <button class="cta" type="submit">Send message</button>
            <a class="ghost" href="/resume/" data-label="Résumé">Read the résumé first</a>
          </div>
          <p class="cform-status" id="cform-status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <ul class="ctiles">
        ${[
          ...(contact.emails || [contact.email]).map((m, i) => ({ k: i ? 'Email ' + (i + 1) : 'Email', v: m, href: `mailto:${m}`, ic: icon.mail, copy: m })),
          { k: 'Phone', v: contact.phone, href: `tel:${contact.phoneHref}`, ic: icon.phone, copy: contact.phone },
          { k: 'LinkedIn', v: contact.linkedinHandle, href: contact.linkedin, ic: icon.linkedin, ext: true },
          { k: 'GitHub', v: contact.githubHandle, href: contact.github, ic: icon.github, ext: true },
          ...(contact.whatsapp ? [{ k: 'WhatsApp', v: 'Message me', href: contact.whatsapp, ic: icon.phone, ext: true }] : []),
        ].map((r) => `
        <li class="ctile">
          <span class="ctile-ic">${r.ic}</span>
          <span class="ctile-txt">
            <span class="ctile-k">${esc(r.k)}</span>
            <a class="ctile-v stretch" href="${r.href}"${r.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(r.v)}</a>
          </span>
          ${r.copy ? `<button class="copy" type="button" data-copy="${esc(r.copy)}" aria-label="Copy ${esc(r.k.toLowerCase())}">${icon.copy}<span class="copy-t">Copy</span></button>` : ''}
        </li>`).join('')}
      </ul>
    </div>
    <p class="copy-status sr" aria-live="polite"></p>
  </section>
</main>`;
  return page({ file: 'index.html', title: site.name, desc: site.description, current: 'home', body });
}

/* ---------- record detail pages ---------- */

// A laurel wreath: a stem arc on each side with leaves in two rows. Drawn once, animated with CSS.
function laurelSvg() {
  const cx = 60, cy = 60, R = 43, pts = (sgn) => Array.from({ length: 9 }, (_, k) => {
    const th = (205 + k * 16.5) * Math.PI / 180;              // from low on the side up toward the top
    return { th, x: cx + sgn * R * Math.sin(th), y: cy - R * Math.cos(th), k };
  });
  const side = (sgn) => {
    const p = pts(sgn), a = p[0], z = p[p.length - 1];
    const stem = `<path class="lv-stem" pathLength="1" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${R} ${R} 0 0 ${sgn > 0 ? 1 : 0} ${z.x.toFixed(1)} ${z.y.toFixed(1)}"/>`;
    const leaves = p.map((q) => [1, -1].map((o) => {
      const rr = R + o * 5.5, x = cx + sgn * rr * Math.sin(q.th), y = cy - rr * Math.cos(q.th);
      const rot = sgn * (q.th * 180 / Math.PI) + 90 + o * sgn * 26;
      return `<ellipse class="lv-leaf" style="--k:${q.k * 2 + (o > 0 ? 0 : 1)}" cx="0" cy="0" rx="3.1" ry="7.6" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"/>`;
    }).join('')).join('');
    return stem + leaves;
  };
  return `<svg class="laurel-svg" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${side(1)}${side(-1)}</svg>`;
}

// The picture behind one panel of the wins triptych. A logo becomes a round seal on a dark panel.
function panBackdrop(r) {
  const p = resolveMedia(`/media/records/${r.slug}.jpg`);
  if (!p) return `<span class="pan-bg">${recArt(r.kind)}</span>`;
  if (/\.webp$/.test(p)) return `<span class="pan-bg is-emblem"><span class="seal"><img src="${p}" alt=""${size(p)} loading="lazy" decoding="async"></span></span>`;
  return `<span class="pan-bg"><img src="${p}" alt=""${size(p)} loading="lazy" decoding="async"></span>`;
}
// A real photo for a record when one exists (media/records/<slug>.jpg), otherwise the drawn art.
function recCardArt(r) {
  const p = resolveMedia(`/media/records/${r.slug}.jpg`);
  return p ? `<span class="art art-photo"><img src="${p}" alt=""${size(p)} loading="lazy" decoding="async"></span>` : recArt(r.kind);
}

function recordPage(r) {
  const d = C.recordPages[r.slug];
  const proj = bySlug(d.project);
  const body = `
<main id="main" class="page record">
  <header class="page-head">
    <p class="sec-tag">${scr('Record')}</p>
    <h1 class="page-title page-title-md"><span class="line"><span>${esc(d.headline)}</span></span></h1>
    <p class="page-sub">${esc(d.result)}</p>
  </header>
  <section class="rec-detail">
    <div class="rec-detail-art">${(() => {
      const p = resolveMedia(`/media/records/${r.slug}.jpg`);
      const dir = path.join(root, 'media', 'records');
      const more = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.startsWith(r.slug + '-') && /\.jpe?g$/i.test(f)).sort() : [];
      const fig = (src, alt) => `<figure class="rec-photo"><img src="${src}" alt="${esc(alt)}"${size(src)} decoding="async"></figure>`;
      if (!p) return recArt(r.kind);
      return fig(p, r.kind === 'paper' ? `${r.title}: receiving the certificate at the conference` : `${r.title}: certificate and trophy`) + more.map((f) => fig('/media/records/' + f, `${r.title}: certificate`)).join('');
    })()}</div>
    <div class="rec-detail-body">
      ${d.body.map((t) => `<p>${esc(t)}</p>`).join('')}
      <dl class="rec-facts">
        ${d.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
      <div class="btns">
        <a class="btn btn-solid" href="${caseUrl(proj)}" data-label="${esc(proj.short || proj.name)}">See the project: ${esc(proj.name)}</a>
        ${r.kind === 'paper' && C.publication.href ? `<a class="btn" href="${C.publication.href}" target="_blank" rel="noopener">View full paper${icon.ext}</a>` : r.kind === 'paper' && site.showSlotHints ? '<span class="btn btn-slot">Paper link slot</span>' : ''}
        ${r.kind === 'paper' && C.publication.post ? `<a class="btn" href="${C.publication.post}" target="_blank" rel="noopener">The LinkedIn post${icon.ext}</a>` : ''}
        <a class="btn" href="/#records" data-label="Records">All records</a>
      </div>
    </div>
  </section>
</main>`;
  return page({ file: `records/${r.slug}/index.html`, title: `${d.headline}: ${d.result}`, desc: `${d.headline}, ${d.result}. ${d.body[0]}`, current: 'records', body });
}

/* ---------- résumé: one per role ---------- */
function resumePage() {
  const cards = C.resumes.map((r) => {
    const own = exists(r.file);
    const href = own ? r.file : generalResume;
    return `
    <li class="role-card">
      <h2 class="role-title">${esc(r.title)}</h2>
      ${r.tag ? `<p class="role-tag">${esc(r.tag)}</p>` : ''}
      <p class="role-sum">${esc(r.summary)}</p>
      <ul class="role-points">${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <div class="btns">
        ${href ? `<a class="btn btn-solid" href="${href}" download>Download PDF</a>` : `<span class="btn btn-slot">Resume slot</span>`}
        ${!own && site.showSlotHints ? `<span class="role-slot">Role-specific PDF slot: ${esc(r.file.replace(/^\//, ''))}. The general résumé is used until then.</span>` : ''}
      </div>
    </li>`;
  }).join('');
  const body = `
<main id="main" class="page resume">
  <header class="page-head">
    <h1 class="page-title"><span class="line"><span>Résumé</span></span></h1>
    <p class="page-sub">Choose the version that matches the role you are hiring for.</p>
    <p class="svc-cta">${generalResume
      ? `<a class="cta" href="${generalResume}" download>Download the full résumé</a>`
      : '<span class="btn btn-slot">General résumé slot</span>'}</p>
  </header>
  <section aria-labelledby="roles-h">
    <h2 id="roles-h" class="band-title">By role</h2>
    <ul class="role-grid">${cards}</ul>
  </section>
</main>`;
  return page({
    file: 'resume/index.html', title: 'Résumé', desc: `Résumés for ${site.name}: AI/ML engineer (main résumé), software development, AI research and product intern, and marketing.`,
    current: 'resume', body,
  });
}

/* ---------- work index (map) ---------- */
function work() {
  const nodeHref = (p) => (p.page ? caseUrl(p) : github(p.repo));
  const nodes = C.projects.map((p) => {
    const h = nodeHref(p);
    const inner = `<span class="node-dot" aria-hidden="true"></span><span class="node-name">${esc(p.name)}</span>`;
    const attrs = `class="node${p.top ? ' is-featured' : ''}" style="--x:${p.map[0]};--y:${p.map[1]}" data-id="${p.slug}" data-tags="${(p.tags || []).join(' ')}"`;
    if (!h) return `<span ${attrs}>${inner}</span>`;
    return p.page
      ? `<a ${attrs} href="${h}" data-label="${esc(p.short || p.name)}">${inner}</a>`
      : `<a ${attrs} href="${h}" target="_blank" rel="noopener">${inner}</a>`;
  });
  const clusters = [...new Set(C.projects.map((p) => p.cluster))];
  const list = clusters.map((cl) => `
    <section class="group" aria-labelledby="g-${cl.replace(/\W+/g, '-')}">
      <h2 id="g-${cl.replace(/\W+/g, '-')}" class="group-title">${esc(cl)}</h2>
      <ul class="rows">
        ${C.projects.filter((p) => p.cluster === cl).map((p) => {
          const h = nodeHref(p);
          const name = h
            ? (p.page
                ? `<a href="${h}" data-label="${esc(p.short || p.name)}">${esc(p.name)}</a>`
                : `<a href="${h}" target="_blank" rel="noopener">${esc(p.name)}<span class="ext">${icon.ext}</span></a>`)
            : esc(p.name);
          return `<li class="row"><span class="row-name">${name}</span><span class="row-line">${esc(p.line)}</span>${p.score ? `<span class="row-score">${p.score}%</span>` : '<span></span>'}</li>`;
        }).join('')}
      </ul>
    </section>`).join('');
  const body = `
<main id="main" class="page work-index">
  <header class="page-head">
    <h1 class="page-title"><span class="line"><span>Every project</span></span></h1>
    <p class="page-sub">The projects documented here, placed by what they have in common.</p>
  </header>
  <section class="map" aria-label="Map of projects. A list with the same content follows.">
    <div class="map-field">
      ${C.clusters.map((c) => `<span class="map-cluster" style="--x:${c.at[0]};--y:${c.at[1]}">${esc(c.name)}</span>`).join('')}
      <svg class="map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
      ${nodes.join('')}
    </div>
    <p class="map-hint"><span class="hint-fine">Hover or focus a project to see what it shares with the others.</span><span class="hint-touch">Tap a project to see what it shares with the others.</span></p>
  </section>
  <section class="list" aria-label="All projects">${list}</section>
</main>`;
  return page({
    file: 'work/index.html', title: 'Every project', desc: `Agents, models, data products and public systems by ${site.name}.`,
    current: 'work', body,
  });
}

/* ---------- case study ---------- */
function caseStudy(p) {
  const shot = resolveMedia(p.shot);
  const postHref = p.post ? (C.contact.postLinks === "profile" ? contact.linkedin : p.post) : null;
  const links = [
    p.demo && `<a class="btn btn-solid" href="${p.demo}" target="_blank" rel="noopener">Watch the demo${icon.ext}</a>`,
    p.live && `<a class="btn btn-solid" href="${p.live}" target="_blank" rel="noopener">Open the live site${icon.ext}</a>`,
    p.repo && `<a class="btn${p.live || p.demo ? "" : " btn-solid"}" href="${github(p.repo)}" target="_blank" rel="noopener">View the code${icon.ext}</a>`,
    postHref && `<a class="btn" href="${postHref}" target="_blank" rel="noopener">The LinkedIn post${icon.ext}</a>`,
    ...(p.extra || []).map((x) => `<a class="btn" href="${x.href}" target="_blank" rel="noopener">${esc(x.label)}${icon.ext}</a>`),
  ].filter(Boolean).join("");
  const meta = [["Built for", p.builtFor], ["When", p.when], ["Team", p.team], ["My role", p.role]].filter(([, v]) => v);
  const st = p.study || {};
  const blocks = [["The problem", st.problem], ["The solution", st.solution], ["How it was built", st.build], ["The result", st.result]].filter(([, v]) => v && v.length);
  const related = C.services.filter((s) => s.projects.includes(p.slug));
  const body = `
<main id="main" class="page case">
  <header class="case-hero${shot ? " has-shot" : ""}">
    ${shot
      ? `<img class="case-hero-shot" src="${shot}" alt="Screenshot of ${esc(p.name)}"${size(shot)} decoding="async">`
      :`<canvas data-visual="${p.visual || "generic"}" aria-hidden="true"></canvas>`}
    <div class="case-head">
      ${p.badge ? `<p class="badge-line"><span class="lamp" aria-hidden="true"></span>${esc(p.badge)}</p>` : ""}
      <h1 class="page-title"><span class="line"><span>${esc(p.name)}</span></span></h1>
      <p class="page-sub">${esc(p.line)}</p>
      ${links ? `<div class="btns case-links">${links}</div>` : ""}
    </div>
  </header>

  ${p.postImage && postHref && exists(p.postImage) ? `<a class="post-snap" href="${postHref}" target="_blank" rel="noopener" aria-label="Open the LinkedIn post about ${esc(p.name)}"><img src="${p.postImage}" alt="Snapshot of the LinkedIn post about the Smart India Hackathon"${size(p.postImage)} loading="lazy" decoding="async"></a>` : ''}

  ${meta.length ? `<dl class="case-meta" aria-label="Project details">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}

  ${(p.facts || []).length ? `<section class="case-facts" aria-label="At a glance">
    ${p.facts.map((f) => `
    <p class="fact"><span class="fact-n">${f.prefix ? esc(f.prefix) : ""}<span${f.count != null ? ` data-count="${f.count}" data-dec="${f.dec || 0}"` : ""}>${esc(f.n)}</span></span>${f.unit ? `<span class="fact-unit">${esc(f.unit)}</span>` : ""}<span class="fact-l">${esc(f.label)}</span></p>`).join("")}
  </section>` : ""}

  ${blocks.length || (p.tools || []).length ? `<section class="case-boxes" aria-label="Case study">
    ${blocks.map(([k, v], i) => `
    <article class="cbox cbox-${k.toLowerCase().replace(/[^a-z]+/g, '-')}">
      <header class="cbox-head"><span class="cbox-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h2 class="cbox-k">${k}</h2></header>
      <div class="cbox-t">${v.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
    </article>`).join('')}
    ${(p.tools || []).length ? `
    <article class="cbox cbox-stack">
      <header class="cbox-head"><span class="cbox-n" aria-hidden="true">${String(blocks.length + 1).padStart(2, '0')}</span><h2 class="cbox-k">Tech stack</h2></header>
      <ul class="chips chips-lg">${p.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </article>` : ''}
  </section>` : ''}

  ${(p.gallery || []).length ? `<section class="case-gallery" aria-label="Screens and results">
    ${p.gallery.filter((g) => exists(g)).map((g, i) => `<figure><img src="${g}" alt="${esc(p.name)}, screen ${i + 1}"${size(g)} loading="lazy" decoding="async"></figure>`).join("")}
  </section>` : ""}

  <section class="case-flow" aria-labelledby="flow-h">
    <h2 id="flow-h" class="band-title">How it works</h2>
    <ol class="flow flow-boxes">
      ${(p.flow || []).map(([k, v], i) => `<li><span class="flow-i" aria-hidden="true">${i + 1}</span><span class="flow-k">${esc(k)}</span><span class="flow-v">${esc(v)}</span></li>`).join('')}
    </ol>
  </section>

  ${related.length ? `
  <section class="case-related" aria-labelledby="rel-h">
    <h2 id="rel-h" class="band-title">Work with me on projects like this</h2>
    <ul class="rel-list">
      ${related.map((s) => `<li><a href="${serviceUrl(s)}" data-label="${esc(s.short)}"><span class="rel-name">${esc(s.name)}</span><span class="rel-line">${esc(s.line)}</span></a></li>`).join("")}
    </ul>
  </section>` : ""}

</main>`;
  return page({ file: `work/${p.slug}/index.html`, title: p.name, desc: `${p.name}: ${p.line}`, current: "work", body, jsonld: { '@context': 'https://schema.org', ...projectLd(p) } });
}

/* ---------- service page ---------- */
function servicePage(s) {
  const next = C.services[(C.services.indexOf(s) + 1) % C.services.length];
  const proof = s.projects.map(bySlug);
  const body = `
<main id="main" class="page service">
  <header class="page-head">
    <p class="sec-tag">${scr('Service')}</p>
    <h1 class="page-title page-title-md"><span class="line"><span>${esc(s.name)}</span></span></h1>
    <p class="page-sub">${esc(s.line)}</p>
    <p class="svc-pitch">${esc(s.pitch)}</p>
    <p class="svc-cta"><a class="cta" href="/#contact" data-label="Contact">Start a conversation</a></p>
  </header>

  <section class="svc-block" aria-labelledby="get-h">
    <h2 id="get-h" class="band-title">What you get</h2>
    <ul class="deliver">
      ${s.deliver.map((d) => `<li>${esc(d)}</li>`).join('')}
    </ul>
  </section>

  <section class="svc-block" aria-labelledby="run-h">
    <h2 id="run-h" class="band-title">How it runs</h2>
    <ol class="steps">
      ${s.steps.map(([k, v], i) => `<li><span class="step-n">${i + 1}</span><span class="step-k">${esc(k)}</span><span class="step-v">${esc(v)}</span></li>`).join('')}
    </ol>
  </section>

  <section class="svc-block" aria-labelledby="proof-h">
    <h2 id="proof-h" class="band-title">Proof</h2>
    <ul class="proof-cards">
      ${proof.map((p) => {
        const h = p.page ? caseUrl(p) : github(p.repo);
        const inner = `<span class="pc-name">${esc(p.name)}</span><span class="pc-line">${esc(p.line)}</span>${p.badge ? `<span class="pc-badge">${esc(p.badge)}</span>` : ''}`;
        return `<li>${h ? `<a href="${h}"${p.page ? ` data-label="${esc(p.short || p.name)}"` : ' target="_blank" rel="noopener"'}>${inner}</a>` : `<div>${inner}</div>`}</li>`;
      }).join('')}
    </ul>
  </section>

  <section class="svc-block" aria-labelledby="tools-h">
    <h2 id="tools-h" class="band-title">Tools</h2>
    <ul class="chips chips-lg">${s.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${s.slots && site.showSlotHints ? `<ul class="slot-list">${s.slots.map((x) => `<li>Slot: ${esc(x)}</li>`).join('')}</ul>` : ''}
  </section>

</main>`;
  return page({ file: `services/${s.slug}/index.html`, title: s.name, desc: `${s.name}. ${s.line}`, current: 'services', body });
}

function notFound() {
  const body = `
<main id="main" class="page notfound">
  <header class="page-head">
    <h1 class="page-title"><span class="line"><span>Not found</span></span></h1>
    <p class="page-sub">That address does not lead anywhere on this site.</p>
    <p><a class="cta" href="/" data-label="Home">Back to the start</a></p>
  </header>
</main>`;
  return page({ file: '404.html', title: 'Not found', desc: 'This page does not exist on the site. Go back to the home page.', current: '404', body, noindex: true });
}


/* ---------- machine-readable copies: JSON-LD, llms.txt, llms-full.txt ---------- */
const abs = (p) => site.url.replace(/\/$/, '') + p;
const stackAll = [...new Set([...C.stackCards.flatMap((c) => c.items), ...C.stackCore.flatMap((c) => c.items), ...C.stackR])];
const projectLd = (p) => ({
  '@type': p.repo ? 'SoftwareSourceCode' : 'CreativeWork',
  name: p.name,
  description: p.line,
  url: p.page ? abs(caseUrl(p)) : (github(p.repo) || undefined),
  ...(p.repo ? { codeRepository: github(p.repo) } : {}),
  author: { '@type': 'Person', name: site.name, url: abs('/') },
  ...(p.tools && p.tools.length ? { keywords: p.tools.join(', ') } : {}),
  ...(p.badge && p.badge !== 'More work' ? { award: p.badge } : {}),
  ...(p.when && /^\d{4}$/.test(p.when) ? { dateCreated: p.when } : {}),
  ...([p.live, p.demo, p.post].filter(Boolean).length ? { sameAs: [p.live, p.demo, p.post].filter(Boolean) } : {}),
});
function homeLd() {
  const job = C.experience[0];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': abs('/#person'),
        name: site.name,
        jobTitle: site.role,
        description: site.description,
        url: abs('/'),
        email: contact.email,
        telephone: contact.phone,
        image: resolveMedia(portrait.src) ? abs(resolveMedia(portrait.src)) : undefined,
        address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressCountry: 'IN' },
        sameAs: [contact.github, contact.linkedin],
        knowsAbout: stackAll,
        knowsLanguage: ['English', 'Hindi', 'Marathi'],
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Ajeenkya DY Patil University', address: 'Pune, India' },
        worksFor: job && job.type === 'Internship' ? { '@type': 'Organization', name: job.org.replace(/,.*$/, '') } : undefined,
        award: C.achievements.map((a) => a.title + ': ' + a.result),
      },
      { '@type': 'WebSite', '@id': abs('/#site'), name: site.name + ' portfolio', url: abs('/'), inLanguage: 'en', publisher: { '@id': abs('/#person') } },
      {
        '@type': 'ItemList',
        name: 'Projects',
        itemListElement: C.projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: projectLd(p) })),
      },
    ],
  };
}

function markdownSite(full) {
  const L = [];
  const push = (...s) => L.push(...s);
  const link = (label, href) => (href ? '[' + label + '](' + href + ')' : label);
  push('# ' + site.name, '', '> ' + site.role + ' based in ' + site.place + '. ' + site.description, '');
  push('Open to: ' + site.openTo.join(', ') + '.', '');
  push('## Contact', '',
    '- Email: ' + contact.email,
    '- Phone: ' + contact.phone,
    '- GitHub: ' + contact.github,
    '- LinkedIn: ' + contact.linkedin,
    '- Website: ' + abs('/'),
    '- Resume (PDF): ' + abs(contact.resume), '');
  if (full) {
    push('## About', '', ...C.about.paragraphs.flatMap((t) => [t, '']));
    push(...C.about.facts.map(([k, v]) => '- ' + k + ': ' + v), '');
    push('## Experience', '');
    C.experience.forEach((x) => push('- ' + x.when + ': ' + x.role + ', ' + x.org + '. ' + x.what));
    push('');
    push('## Achievements', '');
    C.records.forEach((r) => push('- ' + r.title + ': ' + r.result + '. ' + r.line));
    push('');
    push('## Publication', '', C.publication.title + '. ' + C.publication.venue + ', ' + C.publication.publisher + '. ' + C.publication.organiser, '');
    push('## Skills', '');
    C.stackCards.concat(C.stackCore).forEach((c) => push('- ' + c.title + ': ' + c.items.join(', ')));
    push('- R tooling: ' + C.stackR.join(', '), '');
  } else {
    push('## Key facts', '', ...C.numbers.map((n) => '- ' + n.n + (n.unit || '') + (n.plus ? '+' : '') + ' ' + n.label + '. ' + n.sub), '');
  }
  push('## Projects', '');
  C.projects.forEach((p) => {
    const links = [
      p.page ? link('Case study', abs(caseUrl(p))) : null,
      p.live ? link('Live app', p.live) : null,
      p.repo ? link('GitHub', github(p.repo)) : null,
      p.demo ? link('Demo video', p.demo) : null,
      p.post ? link('LinkedIn post', p.post) : null,
    ].filter(Boolean);
    if (!full) {
      push('- **' + p.name + '**: ' + p.line + (links.length ? ' (' + links.join(', ') + ')' : ''));
      return;
    }
    push('### ' + p.name, '', p.line, '');
    if (p.badge && p.badge !== 'More work') push('- Recognition: ' + p.badge);
    if (p.builtFor) push('- Built for: ' + p.builtFor);
    if (p.team) push('- Team: ' + p.team);
    if (p.when) push('- When: ' + p.when);
    if (p.tools && p.tools.length) push('- Tech stack: ' + p.tools.join(', '));
    (p.facts || []).forEach((f) => push('- ' + fact(f) + ' ' + f.label));
    links.forEach((l) => push('- ' + l));
    push('');
    const st = p.study || {};
    [['Problem', st.problem], ['Solution', st.solution], ['How it was built', st.build], ['Result', st.result]].forEach(([k, v]) => {
      if (v && v.length) push('**' + k + '**', '', ...v.flatMap((t) => [t, '']));
    });
    if (p.flow && p.flow.length) push('**How it works**', '', ...p.flow.map(([k, v]) => '1. ' + k + ': ' + v), '');
  });
  push('', '## Services', '');
  C.services.forEach((s) => {
    if (!full) { push('- **' + s.name + '**: ' + s.line + ' (' + abs(serviceUrl(s)) + ')'); return; }
    push('### ' + s.name, '', s.line, '', s.pitch, '', 'Deliverables:', ...s.deliver.map((d) => '- ' + d), '', 'Process: ' + s.steps.map(([k, v]) => k + ' (' + v + ')').join(' ') , '');
  });
  push('', '## Pages', '',
    '- Home: ' + abs('/'), '- Resume page: ' + abs('/resume/'), '- All projects: ' + abs('/work/'),
    '- Full content as Markdown: ' + abs('/llms-full.txt'), '- Sitemap: ' + abs('/sitemap.xml'), '');
  return L.join('\n');
}

/* ---------- run ---------- */
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });

for (const f of ['site.css', 'site.js', 'visuals.js', 'cinema.js', 'fx.js', 'scroll.js', 'form.js', 'interact.js', 'honours.js', 'mobile.js', 'fit.js'])
  fs.copyFileSync(path.join(root, 'src', f), path.join(out, 'assets', f));
if (fs.existsSync(path.join(root, 'media'))) fs.cpSync(path.join(root, 'media'), path.join(out, 'media'), { recursive: true });

write('index.html', home());
write('resume/index.html', resumePage());
C.records.filter((r) => C.recordPages[r.slug]).forEach((r) => write(`records/${r.slug}/index.html`, recordPage(r)));
write('work/index.html', work());
groupsForOrbit.forEach((g) => write(`projects/${g.id}/index.html`, groupPage(g)));
withPage.forEach((p) => write(`work/${p.slug}/index.html`, caseStudy(p)));
C.services.forEach((s) => write(`services/${s.slug}/index.html`, servicePage(s)));
write('404.html', notFound());

const pages = fs.readdirSync(out, { recursive: true }).map(String).filter((f) => f.endsWith('index.html')).map((f) => f.replace(/index\.html$/, '').replace(/\\/g, '/'));
const base = site.url.replace(/\/$/, '');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${base}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
const bots = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'cohere-ai', 'Bytespider', 'Meta-ExternalAgent'];
write('robots.txt', `User-agent: *\nAllow: /\n\n${bots.map((x) => `User-agent: ${x}\nAllow: /\n`).join('\n')}\nSitemap: ${base}/sitemap.xml\n`);
write('llms.txt', markdownSite(false));
write('llms-full.txt', markdownSite(true));

const n = fs.readdirSync(out, { recursive: true }).filter((f) => String(f).endsWith('.html')).length;
console.log(`Built ${n} pages → dist/`);
void plain;
