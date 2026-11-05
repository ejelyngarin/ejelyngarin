/* Reliable dashboard panels for About Me, Achievements, and Parents. */
(() => {
  'use strict';

  const source = document.querySelector('.dashboard-source');
  const overlay = document.getElementById('dashboard-overlay');
  const content = document.getElementById('dashboard-panel-content');
  const title = document.getElementById('dashboard-panel-title');
  if (!source || !overlay || !content || !title) return;

  const page = (location.pathname.split('/').pop() || 'personal.html').toLowerCase();
  const pageMap = {
    'personal.html': {
      story: 0, profile: 1, details: 2, education: 3, personality: 4, interests: 5,
      labels: ['My story', 'Profile & quick facts', 'Personal details', 'Education', 'Personality & values', 'Interests & hobbies']
    },
    'achievements.html': {
      gallery: 0, academic: 1, leadership: 2, lessons: 3,
      labels: ['Photo gallery', 'Academic recognition', 'Leadership & participation', 'Lessons beyond awards']
    },
    'parents.html': {
      family: 0, gratitude: 1,
      labels: ['My family', 'A note of gratitude']
    }
  };
  const config = pageMap[page];
  if (!config) return;

  const sections = Array.from(source.children).filter(el => el.tagName === 'SECTION');
  let activeSection = null;
  let lastTrigger = null;

  function openPanel(key, trigger) {
    const index = config[key];
    if (!Number.isInteger(index) || !sections[index]) return;

    if (activeSection) source.appendChild(activeSection);
    activeSection = sections[index];
    lastTrigger = trigger || document.activeElement;
    title.textContent = config.labels[index] || 'Explore';
    content.replaceChildren(activeSection);
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('dashboard-open');
    document.body.style.overflow = 'hidden';
    const closeButton = overlay.querySelector('.dashboard-close');
    if (closeButton) closeButton.focus();
    content.scrollTop = 0;
  }

  function closePanel() {
    if (overlay.hidden) return;
    if (activeSection) source.appendChild(activeSection);
    activeSection = null;
    content.replaceChildren();
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('dashboard-open');
    document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }

  // Delegation remains reliable even when the page content is moved into the panel.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-dashboard-open]');
    if (!trigger) return;
    event.preventDefault();
    openPanel(trigger.dataset.dashboardOpen, trigger);
  });

  const closeButton = overlay.querySelector('.dashboard-close');
  if (closeButton) closeButton.addEventListener('click', closePanel);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closePanel();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !overlay.hidden) closePanel();
  });
})();
