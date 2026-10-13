// Site behavior. All of it is enhancement: without JavaScript the pages work the same (the
// language menu is a <details>, the changelog shows everything, the copy buttons stay hidden and
// the source links can be selected by hand).
(() => {
  'use strict';

  const LANG_KEY = 'stein-lang';
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* no storage: it just doesn't remember */ }
    },
  };

  // On the first visit to the English version, a browser in Portuguese or Spanish goes to its
  // language. Picking a language in the menu stores the choice and turns this off.
  const page = document.documentElement.lang;
  const preferred = storage.get(LANG_KEY);
  if (!preferred && page === 'en') {
    const browser = (navigator.languages || [navigator.language || '']).map((lang) => lang.toLowerCase().slice(0, 2));
    const match = browser.find((lang) => lang === 'pt' || lang === 'es' || lang === 'en');
    if (match && match !== 'en') {
      const target = document.querySelector(`[data-lang="${match}"]`);
      if (target) {
        storage.set(LANG_KEY, match);
        location.replace(target.href + location.hash);
        return;
      }
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-lang]');
    if (link) storage.set(LANG_KEY, link.dataset.lang);
  });

  // Language picker: closes on an outside click or Esc.
  const langMenu = document.querySelector('[data-lang-menu]');
  if (langMenu) {
    document.addEventListener('click', (event) => {
      if (langMenu.open && !langMenu.contains(event.target)) langMenu.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && langMenu.open) {
        langMenu.open = false;
        langMenu.querySelector('summary').focus();
      }
    });
  }

  // Top bar: a rule once the page scrolls.
  const topbar = document.querySelector('[data-topbar]');
  if (topbar) {
    const update = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // Mobile menu.
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  // Mods: copy a third-party source link, to paste in Stein Client.
  for (const button of document.querySelectorAll('[data-copy]')) {
    if (!navigator.clipboard) break;
    button.hidden = false;
    const label = button.querySelector('span');
    const original = label.textContent;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
      } catch {
        return;
      }
      label.textContent = button.dataset.copied;
      setTimeout(() => { label.textContent = original; }, 1600);
    });
  }

  // Changelog: filter by component, kept in the address (?c=client).
  const filters = document.querySelector('[data-filters]');
  if (filters) {
    const entries = [...document.querySelectorAll('.entry[data-component]')];
    const buttons = [...filters.querySelectorAll('[data-filter]')];
    const apply = (value) => {
      const known = buttons.some((button) => button.dataset.filter === value);
      const active = known ? value : 'all';
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === active)));
      entries.forEach((entry) => { entry.hidden = active !== 'all' && entry.dataset.component !== active; });
      return active;
    };

    filters.hidden = false;
    const fromHash = location.hash && document.getElementById(location.hash.slice(1))?.dataset.component;
    apply(fromHash ? 'all' : new URLSearchParams(location.search).get('c') || 'all');

    filters.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      const active = apply(button.dataset.filter);
      const url = new URL(location.href);
      if (active === 'all') url.searchParams.delete('c');
      else url.searchParams.set('c', active);
      url.hash = '';
      history.replaceState(null, '', url);
    });
  }
})();
