// ===== Helpers =====
async function getJSON(url) {
  const res = await fetch(url);
  return res.json();
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

// ===== Hero intro typewriter =====
async function runHero() {
  const profile = await getJSON('/api/profile');
  const cmdEl = document.getElementById('typedCmd');
  const outEl = document.getElementById('typedOutput');

  const greeting = `Salut, je suis ${profile.name.split(' ')[0]} 👋`;
  await typeText(cmdEl, greeting, 45);

  const lines = [
    `<strong>${profile.role}</strong>, basé à ${profile.location}.`,
    profile.bio,
  ];

  for (const line of lines) {
    const p = el('p');
    outEl.appendChild(p);
    await typeText(p, line, 5, true);
  }
}

function typeText(node, text, speed, isHTML) {
  return new Promise((resolve) => {
    if (isHTML) {
      // type by revealing the rendered string progressively but keep tags intact
      let i = 0;
      const plain = text;
      const tmp = document.createElement('div');
      tmp.innerHTML = plain;
      const full = tmp.textContent; // for length reference only
      const step = () => {
        i++;
        // re-render proportion of HTML by slicing the raw string at safe points
        node.innerHTML = sliceHTML(plain, i);
        if (i < full.length + countTagChars(plain)) {
          requestAnimationFrame(() => setTimeout(step, speed));
        } else {
          node.innerHTML = plain;
          resolve();
        }
      };
      step();
    } else {
      let i = 0;
      const step = () => {
        i++;
        node.textContent = text.slice(0, i);
        if (i < text.length) {
          setTimeout(step, speed);
        } else {
          resolve();
        }
      };
      step();
    }
  });
}

// naive HTML-aware slicer: types visible characters, copies tags through untouched
function sliceHTML(html, visibleCount) {
  let out = '';
  let visible = 0;
  let i = 0;
  while (i < html.length && visible < visibleCount) {
    if (html[i] === '<') {
      const close = html.indexOf('>', i);
      out += html.slice(i, close + 1);
      i = close + 1;
    } else {
      out += html[i];
      visible++;
      i++;
    }
  }
  return out;
}
function countTagChars(html) {
  let count = 0;
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const close = html.indexOf('>', i);
      count += close - i + 1;
      i = close + 1;
    } else i++;
  }
  return count;
}

// ===== Skills =====
async function renderSkills() {
  const skills = await getJSON('/api/skills');
  const grid = document.getElementById('skillsGrid');
  skills.forEach(group => {
    const card = el('div', 'skill-card');
    card.appendChild(el('h3', null, group.group));
    const row = el('div', 'tag-row');
    group.tags.forEach(t => row.appendChild(el('span', 'tag', t)));
    card.appendChild(row);
    grid.appendChild(card);
  });
}

// ===== Education =====
async function renderEducation() {
  const items = await getJSON('/api/education');
  const list = document.getElementById('educationList');
  items.forEach(item => {
    const row = el('div', 'log-row');
    row.appendChild(el('span', 'log-period', item.period));
    const titleWrap = el('div');
    titleWrap.appendChild(el('p', 'log-title', item.title));
    if (item.detail) titleWrap.appendChild(el('p', null, item.detail));
    row.appendChild(titleWrap);
    list.appendChild(row);
  });
}

// ===== Experience =====
async function renderExperience() {
  const items = await getJSON('/api/experience');
  const list = document.getElementById('experienceList');
  items.forEach(item => {
    const card = el('div', 'exp-card' + (item.tag === 'recherche' ? ' has-warn' : ''));
    card.appendChild(el('span', 'exp-tag', item.tag));
    const body = el('div', 'exp-body');
    body.appendChild(el('h3', null, item.title));
    body.appendChild(el('p', null, item.detail));
    card.appendChild(body);
    list.appendChild(card);
  });
}

// ===== Languages =====
async function renderLanguages() {
  const items = await getJSON('/api/languages');
  const list = document.getElementById('languagesList');
  items.forEach(item => {
    const row = el('div', 'lang-row');
    const nameWrap = el('div');
    nameWrap.appendChild(el('span', 'lang-name', item.name));
    nameWrap.appendChild(el('span', 'lang-level', item.level));
    const track = el('div', 'lang-bar-track');
    const fill = el('div', 'lang-bar-fill');
    track.appendChild(fill);
    row.appendChild(nameWrap);
    row.appendChild(track);
    list.appendChild(row);

    requestAnimationFrame(() => {
      setTimeout(() => { fill.style.width = item.value + '%'; }, 60);
    });
  });
}

// ===== Interests =====
async function renderInterests() {
  const items = await getJSON('/api/interests');
  const grid = document.getElementById('interestsGrid');
  items.forEach(item => {
    const card = el('div', 'interest-card');
    card.appendChild(el('span', 'label', item.label));
    card.appendChild(el('p', null, item.detail));
    grid.appendChild(card);
  });
}

// ===== Contact form =====
function initContactForm() {
  const WHATSAPP_NUMBER = '212616460988'; // 0616460988 in international format, no leading 0 or +
  const EMAIL = 'abdelaadime2@gmail.com';

  const nameEl = document.getElementById('cName');
  const msgEl = document.getElementById('cMessage');
  const hintEl = document.getElementById('formHint');
  const waBtn = document.getElementById('sendWhatsapp');
  const emailBtn = document.getElementById('sendEmail');

  function getValidatedText() {
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) {
      hintEl.textContent = 'Merci de remplir votre nom et votre message avant d\'envoyer.';
      hintEl.classList.add('is-error');
      return null;
    }
    hintEl.classList.remove('is-error');
    return `Bonjour Abdeladime, je m'appelle ${name}.\n\n${message}`;
  }

  waBtn.addEventListener('click', () => {
    const text = getValidatedText();
    if (!text) return;
    hintEl.textContent = 'Ouverture de WhatsApp...';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });

  emailBtn.addEventListener('click', () => {
    const text = getValidatedText();
    if (!text) return;
    hintEl.textContent = 'Ouverture de votre application email...';
    const subject = encodeURIComponent('Message depuis votre portfolio');
    const body = encodeURIComponent(text);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  });
}

// ===== Scroll reveal =====
function initScrollReveal() {
  const targets = document.querySelectorAll('.block, .intro-card');
  targets.forEach(t => t.classList.add('reveal'));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

// Reveal newly injected cards with a gentle stagger
function observeNewReveals(container) {
  if (!container) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = Array.from(container.children);

  items.forEach((node, i) => {
    node.classList.add('reveal');
    if (prefersReduced) {
      node.classList.add('is-visible');
      return;
    }
    node.style.transitionDelay = `${Math.min(i, 8) * 60}ms`;
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(node => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(node => observer.observe(node));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  runHero();
  await Promise.all([
    renderSkills(),
    renderEducation(),
    renderExperience(),
    renderLanguages(),
    renderInterests(),
  ]);
  initContactForm();
  initScrollReveal();
  observeNewReveals(document.getElementById('skillsGrid'));
  observeNewReveals(document.getElementById('educationList'));
  observeNewReveals(document.getElementById('experienceList'));
  observeNewReveals(document.getElementById('languagesList'));
  observeNewReveals(document.getElementById('interestsGrid'));
});
