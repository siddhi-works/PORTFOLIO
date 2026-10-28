/* Siddhi Kale: the phone layer.
   An Android-style bottom navigation bar that follows the page, a bottom sheet for the contact form,
   and a small tap ripple. It does nothing on wide screens. */
(() => {
  'use strict';
  const mq = window.matchMedia('(max-width: 760px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const nav = $('.bnav');
  const form = $('.cform');
  const home = !!$('main.home');

  /* ---- the bottom bar follows the section you are in ---- */
  if (nav && home) {
    const map = [['top', 'top'], ['work', 'work'], ['services', 'services'], ['records', 'records'], ['contact', 'contact']];
    const items = $$('a[data-sec]', nav);
    let raf = 0;
    const update = () => {
      raf = 0;
      let now = 'top';
      for (const [id] of map) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) now = id; }
      // the sections in between belong to the item before them
      items.forEach((a) => { const on = a.dataset.sec === now; a.classList.toggle('is-on', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ---- the contact form as a bottom sheet ---- */
  let scrim = null, lastFocus = null, holder = null;
  function openSheet() {
    if (!form || !mq.matches) return;
    lastFocus = document.activeElement;
    // fixed positioning is trapped by a styled ancestor, so the form moves to the page level while it is a sheet
    holder = document.createComment('form');
    form.parentNode.insertBefore(holder, form);
    document.body.appendChild(form);
    scrim = scrim || Object.assign(document.createElement('div'), { className: 'sheet-scrim' });
    document.body.appendChild(scrim);
    requestAnimationFrame(() => scrim.classList.add('is-on'));
    form.classList.add('is-sheet');
    document.documentElement.classList.add('sheet-open');
    form.setAttribute('role', 'dialog');
    form.setAttribute('aria-modal', 'true');
    form.setAttribute('aria-label', 'Say hello');
    scrim.addEventListener('click', closeSheet);
    setTimeout(() => { const f = form.querySelector('input[name="name"]'); if (f) f.focus({ preventScroll: true }); }, 380);
  }
  function closeSheet() {
    if (!form) return;
    form.classList.remove('is-sheet');
    if (holder && holder.parentNode) { holder.parentNode.insertBefore(form, holder); holder.remove(); holder = null; }
    document.documentElement.classList.remove('sheet-open');
    form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('aria-label');
    if (scrim) { scrim.classList.remove('is-on'); const s = scrim; setTimeout(() => s.remove(), 300); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$('.sheet-open, a[data-sheet]').forEach((el) => el.addEventListener('click', (e) => { if (mq.matches && form) { e.preventDefault(); openSheet(); } }));
  $$('.sheet-close').forEach((el) => el.addEventListener('click', closeSheet));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && form && form.classList.contains('is-sheet')) closeSheet(); });
  mq.addEventListener('change', () => { if (!mq.matches) closeSheet(); });

  /* ---- tap ripple, the way Android answers a touch ---- */
  if (!reduce) {
    document.addEventListener('pointerdown', (e) => {
      if (!mq.matches) return;
      const t = e.target.closest && e.target.closest('.cta, .ghost, .svc-bar, .bnav a, .chip-radio span, .bar-resume, .sheet-open, .ctile, .pan');
      if (!t) return;
      const r = t.getBoundingClientRect(), size = Math.max(r.width, r.height) * 1.6;
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size / 2) + 'px;top:' + (e.clientY - r.top - size / 2) + 'px';
      t.appendChild(s);
      setTimeout(() => s.remove(), 650);
    }, { passive: true });
  }
})();
