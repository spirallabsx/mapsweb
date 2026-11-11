// Published content for the internal MAPS prototype. Saved HTML remains the fallback.
const CONTENT_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCc8QdLaFiDCZjH5JPQwoltV37CDlUhe5_tan8GfN0fb7g8lgrbEezMUSPKr8xINj8DZJPyo0mTCFM/pub?gid=652006040&single=true&output=csv';

function parseCsv(input) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted && char === '"' && input[i + 1] === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function setText(selector, value, mode = 'plain') {
  document.querySelectorAll(selector).forEach(element => {
    if (mode === 'lead') {
      const first = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
      if (first) first.textContent = value + ' ';
    } else if (mode === 'logo') {
      const words = value.trim().split(/\s+/);
      element.replaceChildren(document.createTextNode(words.shift() || ''), document.createElement('br'), document.createTextNode(words.join(' ')));
    } else if (mode === 'lines') {
      const nodes = [];
      value.split('\n').forEach((line, index) => {
        if (index) nodes.push(document.createElement('br'));
        nodes.push(document.createTextNode(line));
      });
      element.replaceChildren(...nodes);
    } else element.textContent = value;
  });
}

function applyContent(content) {
  const bindings = {
    'site.logo.wordmark': ['.logo .wordmark'],
    'site.logo.subtitle': ['.logo .logo-sub', 'logo'],
    'home.intro.heading': ['#intro h1', 'lines'],
    'home.intro.lead': ['#intro .intro-copy > p:first-child'],
    'home.intro.support': ['#intro .support'],
    'home.intro.button': ['#intro .pill', 'lead'],
    'home.services.eyebrow': ['#services .eyebrow span:first-child'],
    'home.services.kicker': ['#services .eyebrow span:last-child'],
    'home.services.heading': ['#services .section-heading h2', 'lines'],
    'home.services.intro': ['#services .section-heading p'],
    'home.work.label': ['#work .work-label'],
    'home.work.heading': ['#work .section-heading h2', 'lines'],
    'home.work.intro': ['#work .section-heading p'],
    'home.work.note': ['#work .pricing-note'],
    'home.about.eyebrow': ['#about .eyebrow span'],
    'home.about.heading': ['#about .about-heading'],
    'home.about.name': ['#about figcaption span'],
    'home.about.title': ['#about figcaption small'],
    'home.about.bio1': ['#about .bio > p:first-child'],
    'home.about.bio2': ['#about .bio > p:nth-child(2)'],
    'home.about.metric1': ['#about .stats > div:first-child strong'],
    'home.about.metric1_label': ['#about .stats > div:first-child span'],
    'home.about.metric2': ['#about .stats > div:nth-child(2) strong'],
    'home.about.metric2_label': ['#about .stats > div:nth-child(2) span'],
    'home.about.note': ['#about .experience-note'],
    'contact.eyebrow': ['#contact .eyebrow span:first-child'],
    'contact.kicker': ['#contact .eyebrow span:last-child'],
    'contact.heading': ['#contact .contact-grid h2', 'lines'],
    'contact.intro': ['#contact .contact-grid > div > p:first-of-type'],
    'contact.note': ['#contact .form-note'],
    'contact.button': ['#contact form button', 'lead'],
    'footer.lead': ['.footer-story > p', 'lines'],
    'footer.button': ['.footer-story > .pill', 'lead'],
    'gate.heading': ['.site-gate-form h1'],
    'gate.description': ['.site-gate-form > p:first-of-type'],
    'gate.button': ['.site-gate-form button', 'lead']
  };
  for (let number = 1; number <= 3; number++) {
    const offer = `#services .offer:nth-child(${number})`;
    bindings[`home.services.${number}.phase`] = [`${offer} .offer-top span:last-child`];
    bindings[`home.services.${number}.heading`] = [`${offer} h3`];
    bindings[`home.services.${number}.description`] = [`${offer} > p`];
    for (let item = 1; item <= 3; item++) bindings[`home.services.${number}.item${item}`] = [`${offer} li:nth-child(${item})`];
    bindings[`home.services.${number}.button`] = [`${offer} .text-link`, 'lead'];
    const price = `#work .pricing article:nth-child(${number})`;
    bindings[`home.work.${number}.label`] = [`${price} .small`];
    bindings[`home.work.${number}.heading`] = [`${price} h3`];
    bindings[`home.work.${number}.description`] = [`${price} > p:not(.price)`];
    bindings[`home.work.${number}.button`] = [`${price} a`, 'lead'];
  }
  for (const [key, value] of Object.entries(content)) {
    if (key.match(/^home\.work\.[123]\.price$/)) {
      const number = key.split('.')[2];
      const element = document.querySelector(`#work .pricing article:nth-child(${number}) .price`);
      if (element) {
        const unit = element.querySelector('span');
        if (unit) {
          const parts = value.match(/^(.*?)(\s*\/.*)$/);
          if (parts) { element.firstChild.textContent = parts[1]; unit.textContent = parts[2]; }
          else element.textContent = value;
        } else element.textContent = value;
      }
    } else if (key === 'home.work.label') setText('#work .work-label', /^02\s*\//.test(value) ? value : `02 / ${value.replace(/\bWith\b/, 'with')}`);
    else if (bindings[key]) setText(bindings[key][0], value, bindings[key][1]);
  }
}

fetch(CONTENT_URL, { cache: 'no-store' })
  .then(response => { if (!response.ok) throw new Error(`Content request: ${response.status}`); return response.text(); })
  .then(csv => {
    const rows = parseCsv(csv);
    if (rows[0]?.[0]?.replace(/^\uFEFF/, '') !== 'key' || rows[0]?.[1] !== 'text') throw new Error('Unexpected content sheet columns');
    const content = Object.fromEntries(rows.slice(1).filter(row => row[0] && row.length > 1).map(row => [row[0], row[1]]));
    applyContent(content);
  })
  .catch(error => console.warn('Using saved site content:', error));
