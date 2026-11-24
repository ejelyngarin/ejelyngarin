(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const C = window.PORTFOLIO_CONTENT || {};
  const page = document.body.dataset.page;
  const nav = $('.main-nav'), menu = $('.menu-toggle');
  const active = $('.main-nav a[data-page="' + page + '"]');
  if (active) active.classList.add('active');
  if (menu && nav) menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  const modal = $('#content-modal'), modalTitle = $('#modal-title'), modalKicker = $('#modal-kicker');
  const modalContent = $('#modal-content'), controls = $('#modal-controls');
  const prev = $('#modal-prev'), next = $('#modal-next'), pageLabel = $('#modal-page');
  let modalPages = [], modalIndex = 0, modalImages = [], letterListMode = false;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function showModalPage(index) {
    if (!modalPages.length) return;
    modalIndex = Math.max(0, Math.min(index, modalPages.length - 1));
    modalContent.innerHTML = modalPages[modalIndex];
    pageLabel.textContent = String(modalIndex + 1).padStart(2,'0') + ' / ' + String(modalPages.length).padStart(2,'0');
    prev.disabled = modalIndex === 0;
    next.disabled = modalIndex === modalPages.length - 1;
    controls.classList.toggle('hidden', modalPages.length <= 1);
    bindModalPhotos();
  }
  function openModal(title, kicker, pages, images=[]) {
    modalTitle.textContent = title; modalKicker.textContent = kicker;
    modalPages = pages; modalImages = images; letterListMode = false;
    showModalPage(0);
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
  }
  function closeModal() {
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    modalContent.innerHTML = ''; modalPages = []; modalImages = [];
  }
  if (modal) {
    $('.modal-close', modal).addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    prev.addEventListener('click', () => showModalPage(modalIndex - 1));
    next.addEventListener('click', () => showModalPage(modalIndex + 1));
  }

  // Full-screen image viewer: fit first, click to magnify, arrows to move through the set.
  const lightbox = $('#lightbox'), lbImg = $('img', lightbox), lbCaption = $('figcaption', lightbox);
  let currentImages = [], currentIndex = 0;
  function showImage(index) {
    if (!currentImages.length) return;
    currentIndex = (index + currentImages.length) % currentImages.length;
    const item = currentImages[currentIndex];
    lbImg.src = item.src; lbImg.alt = item.caption;
    lbCaption.textContent = item.caption;
    lbImg.classList.remove('zoomed');
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true');
    lbImg.src = ''; lbImg.classList.remove('zoomed');
  }
  // Header logo and home portrait open the same full-image viewer, preserving original proportions.
  $$('[data-image-view]').forEach(el => {
    const open = () => { currentImages = [{src: el.dataset.imageView, caption: el.dataset.caption || el.getAttribute('alt') || 'Portfolio image'}]; showImage(0); };
    el.addEventListener('click', open);
    if (el.tagName === 'IMG') el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  function bindModalPhotos() {
    const cards = $$('.photo-card', modalContent);
    if (!cards.length) return;
    const set = cards.map(c => ({src:c.dataset.src, caption:c.dataset.caption}));
    cards.forEach((card, i) => card.addEventListener('click', () => { currentImages = set; showImage(i); }));
  }
  if (lightbox) {
    lbImg.addEventListener('click', () => lbImg.classList.toggle('zoomed'));
    $('.lightbox-close', lightbox).addEventListener('click', closeLightbox);
    $('.lightbox-prev', lightbox).addEventListener('click', () => showImage(currentIndex - 1));
    $('.lightbox-next', lightbox).addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }

  // About Me: each topic opens in a fixed modal. Dense sections are paginated, never scrolled.
  const topicLabels = {
    personal:'Personal Information', about:'My Story', education:'Education',
    personality:'Personality & Facts', skills:'Skills & Interests', values:'Personal Values', story:'Past · Present · Future'
  };
  function personalPages(panel) {
    const clone = panel.cloneNode(true);
    clone.removeAttribute('hidden'); clone.className = 'modal-source';
    const timeline = clone.querySelector('.timeline');
    if (timeline) {
      const items = [...timeline.children];
      return [0,1].map(n => `<div class="modal-source"><div class="timeline modal-timeline">${items.slice(n*4,n*4+4).map(x=>x.outerHTML).join('')}</div></div>`);
    }
    const values = clone.querySelector('.values-grid');
    if (values) {
      const items = [...values.children];
      const intro = clone.querySelector('.values-intro')?.outerHTML || '';
      const closing = clone.querySelector('.closing-note')?.outerHTML || '';
      return [0,1].map(n => `<div class="modal-source">${intro}<div class="values-grid">${items.slice(n*5,n*5+5).map(x=>x.outerHTML).join('')}</div>${n===1?closing:''}</div>`);
    }
    const interest = clone.querySelector('.interest-grid');
    if (interest) {
      const technicalPage = clone.querySelector('.technical-skills-block')?.outerHTML;
      const articles = [...interest.children];
      const hobby = articles[3]?.cloneNode(true);
      if (hobby) {
        const prose = hobby.querySelector('.prose');
        const paragraphs = prose ? [...prose.querySelectorAll('p')] : [];
        const first = hobby.cloneNode(true), second = hobby.cloneNode(true);
        const firstProse = first.querySelector('.prose'), secondProse = second.querySelector('.prose');
        if (firstProse && secondProse && paragraphs.length > 3) {
          firstProse.innerHTML = paragraphs.slice(0,3).map(p=>p.outerHTML).join('');
          secondProse.innerHTML = paragraphs.slice(3).map(p=>p.outerHTML).join('');
          second.querySelector('h2').textContent = 'More of what inspires me';
          const pages = [
            `<div class="modal-source"><div class="interest-grid">${articles.slice(0,2).map(x=>x.outerHTML).join('')}</div></div>`,
            `<div class="modal-source"><div class="interest-grid">${articles[2].outerHTML}${first.outerHTML}</div></div>`,
            `<div class="modal-source"><div class="interest-grid">${second.outerHTML}</div></div>`
          ];
          if (technicalPage) pages.unshift(`<div class="modal-source">${technicalPage}</div>`);
          return pages;
        }
      }
      const pages = [0,1].map(n => `<div class="modal-source"><div class="interest-grid">${articles.slice(n*2,n*2+2).map(x=>x.outerHTML).join('')}</div></div>`);
      if (technicalPage) pages.unshift(`<div class="modal-source">${technicalPage}</div>`);
      return pages;
    }
    return [`<div class="modal-source">${clone.innerHTML}</div>`];
  }
  $$('.profile-topic-card').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.panel, source = $('#panel-' + key);
    if (!source) return;
    openModal(topicLabels[key], 'PERSONAL INFORMATION · SECTION ' + String(Object.keys(topicLabels).indexOf(key)+1).padStart(2,'0'), personalPages(source));
  }));

  // Achievement collections.
  const achievementDescriptions = {
    'Academic Awards':'Academic milestones earned through effort, discipline, and continued learning.',
    'Clubs & Organizations':'Experiences and memories from school clubs and organizations.',
    'Leadership':'A moment representing responsibility, participation, and leadership.',
    'Research & Projects':'A research and project milestone from the academic journey.',
    'School Events':'Shared moments and experiences from school activities.',
    'Scouting & Community':'A memory of scouting, participation, and community involvement.'
  };
  function photoMarkup(file, caption, description='') {
    const full = description ? `${caption} — ${description}` : caption;
    return `<figure class="photo-card" data-src="assets/images/${escapeHTML(file)}" data-caption="${escapeHTML(full)}"><img src="assets/images/${escapeHTML(file)}" alt="${escapeHTML(caption)}"><figcaption><strong>${escapeHTML(caption)}</strong><small>${escapeHTML(description)}</small></figcaption></figure>`;
  }
  if (page === 'achievements') {
    const records = {
      academic: ['Academic achievements', ['With Honors — Kinder','With Honors — Grade 1','With Honors — Grade 2','With High Honors — Grade 3','With Honors — Grade 4','With Honors — Grade 5','With Honors — Grade 6','With Honors — Grades 7–8','With Honors — Grade 9','With Honors — Grade 10','With Honors — Senior High School','Best in Filipino','Best in Social Sciences','Best in Research Capstone Project Paper','Best in Product Innovation','Best in TLE']],
      leadership: ['Leadership & involvement', ['SPG Representative — Grade 3','YES-O President — Grade 5','Star Scout','Dancer Badge','Junior Girl Scout','Theater participant','Drum and Lyre Corps member','Science Club member','Filipino Club member','Tagapamayapa Filipino Club member']]
    };
    $$('[data-record]').forEach(btn => btn.addEventListener('click', () => {
      const [title, items] = records[btn.dataset.record];
      const pages = [];
      for (let i=0;i<items.length;i+=8) pages.push(`<ol class="record-list">${items.slice(i,i+8).map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ol>`);
      openModal(title, 'ACHIEVEMENTS · RECORDS', pages);
    }));
    $$('.gallery-card').forEach(btn => btn.addEventListener('click', () => {
      const title = btn.dataset.gallery, items = C.achievements?.[title] || [];
      const cards = items.map(([file, caption], i) => photoMarkup(file, `Milestone ${i+1}`, caption)).join('');
      openModal(title, 'ACHIEVEMENTS · PHOTO COLLECTION', [`<p class="modal-intro">${escapeHTML(achievementDescriptions[title] || '')}</p><div class="photo-grid achievement-photos">${cards}</div>`]);
    }));
  }

  // Family and friends galleries with concise gratitude messages under each photo.
  const gratitude = {
    family: {
      'Ate, Mama and Me':'Thank you for being my home, my roots, and a part of every chapter.',
      'Mother':'Thank you, Mama, for your sacrifices, love, and the strength you continue to give.',
      'Father':'Thank you for being part of my story and for the lessons life has brought along the way.',
      'Big Sister':'Thank you for sharing this journey with me and for the memories we continue to make.',
    },
    friends: {
      childhood:'Thank you for the first memories, laughter, and little moments that became part of my growing up.',
      highschool:'Thank you for the shared classrooms, challenges, and memories that made this chapter meaningful.',
      ce:'Thank you for being part of my Civil Engineering chapter and for the experiences we shared.',
      it:'Thank you for the new friendships, shared learning, and memories in this IT chapter.'
    }
  };
  function openFamilyGallery(key, title) {
    let items = [], group = 'family';
    if (key === 'family-gallery') items = C.familyPhotos || [];
    if (key === 'friends-childhood') { items = C.friendPhotos?.['Childhood Friends'] || []; group='childhood'; }
    if (key === 'friends-highschool') { items = C.friendPhotos?.['High School Friends'] || []; group='highschool'; }
    if (key === 'friends-ce') { items = C.friendPhotos?.['College Friends · Civil Engineering'] || []; group='ce'; }
    if (key === 'friends-it') { items = C.friendPhotos?.['College Friends · Information Technology'] || []; group='it'; }
    const cards = items.map(([file, name, caption]) => {
      const thanks = group === 'family' ? gratitude.family[name] : gratitude.friends[group];
      return photoMarkup(file, name, thanks || caption);
    }).join('');
    openModal(title, 'FAMILY & FRIENDS · PHOTO COLLECTION', [`<div class="photo-grid family-photos">${cards}</div>`]);
  }
  function splitLetter(text) {
    const paragraphs = String(text).split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
    const chunks=[];
    for(let i=0;i<paragraphs.length;i+=2) chunks.push(paragraphs.slice(i,i+2));
    return chunks.map((chunk,i)=>`<article class="letter-page"><span class="eyebrow">A PERSONAL LETTER</span><div class="letter-copy">${chunk.map(p=>`<p>${escapeHTML(p).replace(/\n/g,'<br>')}</p>`).join('')}</div><p class="letter-page-index">PAGE ${i+1} OF ${chunks.length}</p></article>`);
  }
  function openLetters() {
    const names = Object.keys(C.letters || {});
    const list = `<div class="letter-index">${names.map((name,i)=>`<button class="letter-index-card" data-letter="${escapeHTML(name)}"><span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHTML(name)}</strong><small>OPEN LETTER ↗</small></button>`).join('')}</div>`;
    openModal('Letters & Tributes','A COLLECTION OF PERSONAL LETTERS',[list]);
    letterListMode = true;
    modalContent.addEventListener('click', function handler(e) {
      const btn = e.target.closest('[data-letter]');
      if (!btn) return;
      const name = btn.dataset.letter;
      modalContent.removeEventListener('click', handler);
      modalTitle.textContent = 'To ' + name;
      modalKicker.textContent = 'LETTERS & TRIBUTES · ' + name.toUpperCase();
      modalPages = splitLetter(C.letters[name]);
      showModalPage(0);
      controls.classList.remove('hidden');
    });
  }
  if (page === 'family') {
    $$('.family-card').forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.family === 'letters') openLetters();
      else openFamilyGallery(btn.dataset.family, btn.querySelector('strong').textContent);
    }));
  }

  // Escape closes the topmost layer; arrow keys navigate image and letter pages.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lightbox?.classList.contains('open')) closeLightbox();
      else if (modal?.classList.contains('open')) closeModal();
    }
    if (lightbox?.classList.contains('open') && e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (lightbox?.classList.contains('open') && e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (modal?.classList.contains('open') && !lightbox?.classList.contains('open')) {
      if (e.key === 'ArrowLeft') showModalPage(modalIndex - 1);
      if (e.key === 'ArrowRight') showModalPage(modalIndex + 1);
    }
  });
})();
