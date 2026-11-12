
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const nav = $('.main-nav');
  const menu = $('.menu-toggle');
  if(menu && nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
  const page = document.body.dataset.page;
  const active = {home:'home',personal:'personal',achievements:'achievements',family:'family'}[page];
  const navLink = $(`.main-nav a[data-page="${active}"]`);
  if(navLink) navLink.classList.add('active');

  // Personal-information panels are navigable cards/tabs rather than a long scroll.
  $$('.section-tab').forEach(btn => btn.addEventListener('click', () => {
    $$('.section-tab').forEach(x=>x.classList.toggle('active',x===btn));
    $$('.info-panel').forEach(p=>p.classList.toggle('active',p.id===`panel-${btn.dataset.panel}`));
  }));

  const lightbox = $('#lightbox'), lbImg = $('img',lightbox), lbCaption = $('figcaption',lightbox);
  let currentImages = [], currentIndex = 0;
  function showImage(index){
    if(!currentImages.length) return;
    currentIndex=(index+currentImages.length)%currentImages.length;
    const item=currentImages[currentIndex];
    lbImg.src=item.src; lbImg.alt=item.caption; lbCaption.textContent=item.caption;
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false');
  }
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lbImg.src='';lbImg.classList.remove('zoomed');}
  function bindPhotoCards(root){
    const cards=$$('.photo-card',root);
    currentImages=cards.map(c=>({src:c.dataset.src,caption:c.dataset.caption}));
    cards.forEach((card,i)=>card.addEventListener('click',()=>showImage(i)));
  }
  if(lightbox){
    lbImg.addEventListener('click',()=>lbImg.classList.toggle('zoomed'));
    $('.lightbox-close',lightbox).addEventListener('click',closeLightbox);
    $('.lightbox-prev',lightbox).addEventListener('click',()=>showImage(currentIndex-1));
    $('.lightbox-next',lightbox).addEventListener('click',()=>showImage(currentIndex+1));
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();if(e.key==='ArrowLeft'&&lightbox.classList.contains('open'))showImage(currentIndex-1);if(e.key==='ArrowRight'&&lightbox.classList.contains('open'))showImage(currentIndex+1);});
  }
  // The official identity logo opens in the same full-screen viewer with its caption.
  $$('.identity-logo-trigger').forEach(btn=>btn.addEventListener('click',()=>{
    currentImages=[{src:btn.dataset.src,caption:btn.dataset.caption}];
    showImage(0);
  }));

  const C=window.PORTFOLIO_CONTENT;
  if(page==='achievements'&&C){
    const view=$('#achievement-gallery'), photos=$('#gallery-photos'), title=$('#gallery-title');
    $$('.gallery-card').forEach(btn=>btn.addEventListener('click',()=>{
      const items=C.achievements[btn.dataset.gallery]||[];
      title.textContent=btn.dataset.gallery;
      photos.innerHTML=items.map(([file,caption])=>`<figure class="photo-card" data-src="assets/images/${file}" data-caption="${caption.replace(/"/g,'&quot;')}"><img src="assets/images/${file}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join('');
      view.classList.add('open');bindPhotoCards(photos);view.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    $('#gallery-back').addEventListener('click',()=>{view.classList.remove('open');photos.innerHTML='';});
  }
  if(page==='family'&&C){
    const view=$('#family-view'), photos=$('#family-photos'), letters=$('#letters-grid'), title=$('#family-title');
    const photoCard=(file,caption)=>`<figure class="photo-card" data-src="assets/images/${file}" data-caption="${caption.replace(/"/g,'&quot;')}"><img src="assets/images/${file}" alt="${caption}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
    $$('.family-card').forEach(btn=>btn.addEventListener('click',()=>{
      const key=btn.dataset.family;photos.innerHTML='';letters.innerHTML='';
      if(key==='letters'){
        title.textContent='Letters & tributes';
        letters.innerHTML=Object.entries(C.letters).map(([name,body])=>`<article class="letter-card"><h3>${name}</h3><p>${body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p></article>`).join('');
      } else {
        let items=[];
        if(key==='family-gallery') items=C.familyPhotos;
        if(key==='friends-childhood') items=C.friendPhotos['Childhood Friends'];
        if(key==='friends-highschool') items=C.friendPhotos['High School Friends'];
        if(key==='friends-ce') items=C.friendPhotos['College Friends · Civil Engineering'];
        if(key==='friends-it') items=C.friendPhotos['College Friends · Information Technology'];
        title.textContent=btn.querySelector('strong').textContent;
        photos.innerHTML=items.map(([file,name,caption])=>photoCard(file,caption)).join('');
        bindPhotoCards(photos);
      }
      view.classList.add('open');view.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    $('#family-back').addEventListener('click',()=>{view.classList.remove('open');photos.innerHTML='';letters.innerHTML='';});
  }
})();
