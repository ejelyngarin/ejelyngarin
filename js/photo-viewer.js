/* Opens portfolio photographs and school images in an accessible full-screen viewer. */
(() => {
  'use strict';
  const viewer = document.createElement('div');
  viewer.className = 'portfolio-photo-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', 'Photo viewer');
  viewer.innerHTML = `
    <button class="portfolio-photo-close" type="button" aria-label="Close photo">×</button>
    <button class="portfolio-photo-prev" type="button" aria-label="Previous photo">‹</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="portfolio-photo-next" type="button" aria-label="Next photo">›</button>`;
  document.body.appendChild(viewer);

  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  const closeButton = viewer.querySelector('.portfolio-photo-close');
  let images = [];
  let current = 0;
  let returnFocus = null;

  function show(index) {
    if (!images.length) return;
    current = (index + images.length) % images.length;
    const item = images[current];
    image.src = item.src;
    image.alt = item.alt || 'Portfolio photograph';
    caption.textContent = item.alt || '';
    viewer.querySelector('.portfolio-photo-prev').hidden = images.length < 2;
    viewer.querySelector('.portfolio-photo-next').hidden = images.length < 2;
  }
  function open(img) {
    // Group the visible photos in the currently opened section/card.
    const scope = img.closest('.dashboard-panel-content, .portfolio-modal-panel') || document;
    images = Array.from(scope.querySelectorAll('img'))
      .filter(el => el.getClientRects().length && !el.closest('.achievement-image-button'))
      .map(el => ({ src: el.currentSrc || el.src, alt: el.alt }));
    if (!images.length) images = [{ src: img.currentSrc || img.src, alt: img.alt }];
    current = Math.max(0, Array.from(scope.querySelectorAll('img')).filter(el => el.getClientRects().length && !el.closest('.achievement-image-button')).indexOf(img));
    returnFocus = img;
    show(current);
    viewer.hidden = false;
    document.body.classList.add('photo-viewer-open');
    closeButton.focus();
  }
  function close() {
    viewer.hidden = true;
    image.removeAttribute('src');
    caption.textContent = '';
    document.body.classList.remove('photo-viewer-open');
    if (returnFocus) returnFocus.focus();
  }

  document.addEventListener('click', event => {
    const img = event.target.closest('.dashboard-panel-content img, .portfolio-modal-panel img');
    if (!img || img.closest('.achievement-image-button')) return;
    event.preventDefault();
    open(img);
  });
  closeButton.addEventListener('click', close);
  viewer.addEventListener('click', event => { if (event.target === viewer) close(); });
  viewer.querySelector('.portfolio-photo-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.portfolio-photo-next').addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', event => {
    if (viewer.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
})();
