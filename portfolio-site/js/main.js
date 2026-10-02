// Liya Wang — portfolio. Plain JS, no dependencies.

// ---------- theme ----------
// The saved choice is applied by the inline snippet at the top of <body>; this only handles the toggle.
function savePref(value) {
  try { localStorage.setItem('pref-theme', value); } catch (e) { /* storage unavailable */ }
}
document.querySelectorAll('.theme-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    savePref(dark ? 'dark' : 'light');
  });
});

// ---------- header ----------
const header = document.querySelector('.site-header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---------- tabs (About) ----------
document.querySelectorAll('[role="tablist"]').forEach((list) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
});

// ---------- lightbox ----------
// Any button with data-full inside a [data-lightbox] group opens; arrows step through the group.
const groups = document.querySelectorAll('[data-lightbox]');
if (groups.length) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML = `
    <img alt="">
    <button class="lb-btn lb-close" aria-label="Close">×</button>
    <button class="lb-btn lb-prev" aria-label="Previous image">‹</button>
    <button class="lb-btn lb-next" aria-label="Next image">›</button>
    <div class="lb-count" aria-live="polite"></div>`;
  document.body.appendChild(box);
  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  let items = [];
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    img.src = items[index].dataset.full;
    img.alt = items[index].querySelector('img')?.alt || '';
    count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
    box.querySelector('.lb-prev').hidden = box.querySelector('.lb-next').hidden = items.length < 2;
  };
  const close = () => {
    box.hidden = true;
    img.removeAttribute('src');
    document.body.style.overflow = '';
    opener?.focus();
  };

  groups.forEach((group) => {
    const members = [...group.querySelectorAll('[data-full]')];
    members.forEach((member, i) => member.addEventListener('click', () => {
      items = members;
      opener = member;
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      box.querySelector('.lb-close').focus();
    }));
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (event) => { if (event.target === box) close(); });
  document.addEventListener('keydown', (event) => {
    if (box.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
}

// ---------- footer year ----------
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
