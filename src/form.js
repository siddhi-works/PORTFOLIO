/* Siddhi Kale: the contact form.
   With an endpoint (contact.formEndpoint in content.mjs) it posts the message directly.
   Without one it opens the visitor's email app with the message already written. */
(() => {
  'use strict';
  const f = document.querySelector('.cform');
  if (!f) return;
  const status = f.querySelector('.cform-status');
  const btn = f.querySelector('button[type="submit"]');
  const sfx = () => (window.SKCinema && window.SKCinema.sfx) || null;
  const say = (msg, kind) => { status.textContent = msg; status.dataset.kind = kind || ''; };
  const to = (f.dataset.to || '').split(',').filter(Boolean);

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (f.elements.website.value) return; // a bot filled the hidden field
    const data = {
      name: f.elements.name.value.trim(),
      organisation: f.elements.organisation.value.trim(),
      purpose: (f.querySelector('input[name="purpose"]:checked') || {}).value || '',
      message: f.elements.message.value.trim(),
    };
    const missing = [];
    if (!data.name) missing.push('your name');
    if (!data.purpose) missing.push('what brings you here');
    if (!data.message) missing.push('a short message');
    if (missing.length) {
      say('Please add ' + missing.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.', 'error');
      const first = !data.name ? f.elements.name : !data.purpose ? f.querySelector('input[name="purpose"]') : f.elements.message;
      first.focus();
      return;
    }
    const endpoint = f.dataset.endpoint;
    if (endpoint) {
      btn.disabled = true;
      say('Sending\u2026', 'busy');
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(String(r.status));
        f.reset();
        say('Sent. Thank you, ' + data.name.split(' ')[0] + '. I will reply within a day or two.', 'ok');
        const s = sfx(); if (s && s.chime) s.chime();
      } catch {
        say('The message did not go through. Please write to ' + to[0] + ' instead.', 'error');
      }
      btn.disabled = false;
      return;
    }
    const subject = data.purpose + ': ' + data.name + (data.organisation ? ' (' + data.organisation + ')' : '');
    const body = data.message + '\n\n' + data.name + (data.organisation ? '\n' + data.organisation : '') + '\nPurpose: ' + data.purpose;
    say('Your email app should open with the message ready. If it does not, write to ' + to[0] + '.', 'ok');
    const s = sfx(); if (s && s.chime) s.chime();
    location.href = 'mailto:' + (to[0] || '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
