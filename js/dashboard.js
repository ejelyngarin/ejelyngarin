/* Dashboard popups: capture-phase click handling keeps every card responsive. */
(() => {
  'use strict';
  function initDashboard() {
    const source = document.querySelector('.dashboard-source');
    const overlay = document.getElementById('dashboard-overlay');
    const panel = overlay && overlay.querySelector('.dashboard-panel');
    const content = document.getElementById('dashboard-panel-content');
    const title = document.getElementById('dashboard-panel-title');
    if (!source || !overlay || !panel || !content || !title) return;

    // Move the dialog to body so no page/container stacking context can cover it.
    if (overlay.parentElement !== document.body) document.body.appendChild(overlay);

    const sections = Array.from(source.children).filter(node => node.matches('section'));
    let active = null;
    let restoreFocus = null;
    let restoreParent = null;
    let restoreNext = null;

    const pageType = document.querySelector('#editorial-gallery') ? 'achievements'
      : document.querySelector('.family-section') ? 'parents' : 'about';
    const maps = {
      about: {
        story: [0, 'My Story'], profile: [1, 'Profile & Quick Facts'], details: [2, 'Personal Details'],
        education: [3, 'Education'], personality: [4, 'Personality & Values'], interests: [5, 'Interests & Hobbies']
      },
      achievements: {
        gallery: [0, 'Achievement Gallery'], academic: [1, 'Academic Recognition'],
        leadership: [2, 'Leadership & Participation'], lessons: [3, 'Lessons Beyond Awards']
      },
      parents: { family: [0, 'My Family'], gratitude: [1, 'A Note of Gratitude'] }
    };
    const map = maps[pageType];

    function open(key, trigger) {
      const entry = map[key];
      if (!entry || !sections[entry[0]]) return;
      if (active) restoreActive();
      active = sections[entry[0]];
      restoreParent = active.parentNode;
      restoreNext = active.nextSibling;
      restoreFocus = trigger;
      title.textContent = entry[1];
      content.replaceChildren(active);
      overlay.hidden = false;
      overlay.removeAttribute('hidden');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dashboard-open');
      document.body.style.overflow = 'hidden';
      content.scrollTop = 0;
      const close = overlay.querySelector('.dashboard-close');
      if (close) close.focus();
    }

    function restoreActive() {
      if (!active || !restoreParent) return;
      if (restoreNext && restoreNext.parentNode === restoreParent) restoreParent.insertBefore(active, restoreNext);
      else restoreParent.appendChild(active);
      active = null;
      restoreParent = null;
      restoreNext = null;
    }

    function close() {
      if (overlay.hidden) return;
      restoreActive();
      content.replaceChildren();
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('dashboard-open');
      document.body.style.overflow = '';
      if (restoreFocus && restoreFocus.isConnected) restoreFocus.focus();
    }

    // Capture phase means the dashboard opens even if another page script handles clicks.
    document.addEventListener('click', event => {
      const trigger = event.target instanceof Element ? event.target.closest('[data-dashboard-open]') : null;
      if (!trigger) return;
      const key = trigger.getAttribute('data-dashboard-open');
      if (!map[key]) return;
      event.preventDefault();
      event.stopPropagation();
      open(key, trigger);
    }, true);

    const closeButton = overlay.querySelector('.dashboard-close');
    if (closeButton) closeButton.addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) close(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDashboard, { once: true });
  else initDashboard();
})();

/* Page 02 revision: static multi-page controls for Profile and Interests. */
(() => {
  function setupPager(rootSelector, pageSelector, prevSelector, nextSelector, countSelector) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const pages = Array.from(root.querySelectorAll(pageSelector));
    let page = 0;
    const draw = () => {
      pages.forEach((el,i)=>el.classList.toggle('is-active', i===page));
      const prev=root.querySelector(prevSelector), next=root.querySelector(nextSelector), count=root.querySelector(countSelector);
      if(prev) prev.disabled=page===0;
      if(next) next.disabled=page===pages.length-1;
      if(count) count.textContent=`Page ${page+1} of ${pages.length}`;
    };
    root.addEventListener('click', e=>{
      if(e.target.closest(prevSelector) && page>0){page--;draw();}
      if(e.target.closest(nextSelector) && page<pages.length-1){page++;draw();}
    });
    draw();
  }
  const init=()=>{
    setupPager('[data-static-pager]','[data-pager-page]','[data-static-prev]','[data-static-next]','[data-static-count]');
    setupPager('[data-interest-pager]','[data-interest-page]','[data-interest-prev]','[data-interest-next]','[data-interest-count]');
    setupPager('[data-personality-pager]','[data-personality-page]','[data-personality-prev]','[data-personality-next]','[data-personality-count]');
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
