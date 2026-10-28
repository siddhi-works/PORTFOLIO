/* Siddhi Kale: motion that follows the scroll.
   A section spine, a wandering light, marquees that lean with your speed, and the hero lifting away.
   Nothing here is required to read the page; reduced motion turns all of it off. */
(() => {
  'use strict';
  const d = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const tick = () => { const s = window.SKCinema && window.SKCinema.sfx; if (s && s.tick) s.tick(); };
  const lerp = (a, b, t) => a + (b - a) * t;

  /* a light that wanders across the page as you read */
  const wash = document.createElement('div');
  wash.className = 'fx-wash';
  wash.setAttribute('aria-hidden', 'true');
  document.body.appendChild(wash);

  /* the section spine, home page only */
  const home = $('main.home');
  let spineLinks = [], sections = [];
  if (home) {
    const names = { about: 'About', work: 'Projects', experience: 'Experience', stack: 'Stack', services: 'Services', records: 'Records', beyond: 'Humanity', contact: 'Contact' };
    sections = Object.keys(names).map((id) => document.getElementById(id)).filter(Boolean);
    const nav = document.createElement('nav');
    nav.className = 'spine';
    nav.setAttribute('aria-label', 'Sections');
    nav.innerHTML = '<span class="spine-rail" aria-hidden="true"><i></i></span>' +
      sections.map((s) => '<a href="#' + s.id + '" data-label="' + names[s.id] + '"><i></i><span>' + names[s.id] + '</span></a>').join('');
    document.body.appendChild(nav);
    spineLinks = $$('a', nav);
  }

  const marquees = $$('.marquee');
  const heroCopy = $('.hero-copy');
  let lastY = scrollY, vel = 0, active = -1, ticking = false;

  function frame() {
    ticking = false;
    const y = scrollY, max = Math.max(1, d.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, y / max));
    vel = lerp(vel, y - lastY, 0.25);
    lastY = y;
    d.style.setProperty('--sp', p.toFixed(4));

    // marquees drift against the scroll and lean with its speed
    const lean = Math.max(-7, Math.min(7, vel * 0.22));
    marquees.forEach((m, i) => {
      m.style.transform = 'translateX(' + ((i % 2 ? 1 : -1) * y * 0.05).toFixed(1) + 'px) skewX(' + lean.toFixed(2) + 'deg)';
    });

    // the hero lifts and thins out as it leaves
    if (heroCopy && !d.classList.contains('is-cinema') && !d.classList.contains('cinema-hold')) {
      const k = Math.min(1, y / (innerHeight * 0.85));
      heroCopy.style.translate = '0 ' + (-k * 46).toFixed(1) + 'px';
      heroCopy.style.opacity = (1 - k * 0.7).toFixed(3);
    }

    // which section are we in
    if (spineLinks.length) {
      let now = -1;
      sections.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) now = i; });
      if (now !== active) {
        active = now;
        spineLinks.forEach((a, i) => a.classList.toggle('is-on', i === now));
        if (now >= 0 && !d.classList.contains('is-cinema')) {
          tick();
          const b = document.createElement('div');
          b.className = 'fx-beam';
          b.setAttribute('aria-hidden', 'true');
          document.body.appendChild(b);
          setTimeout(() => b.remove(), 1100);
        }
      }
      const spine = $('.spine');
      if (spine) {
        spine.classList.toggle('is-shown', y > innerHeight * 0.6);
        spine.style.setProperty('--fill', (now < 0 ? 0 : (now + 1) / sections.length).toFixed(3));
      }
    }
    if (Math.abs(vel) > 0.2) requestAnimationFrame(frame);
  }
  const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  kick();
})();
