(function(){
  const panels=[...document.querySelectorAll('.panel')];let index=0;
  function show(i){if(!panels.length)return;index=(i+panels.length)%panels.length;panels.forEach((p,n)=>p.classList.toggle('active',n===index));const c=document.querySelector('.counter');if(c)c.textContent=`${String(index+1).padStart(2,'0')} / ${String(panels.length).padStart(2,'0')}`;}
  document.querySelector('[data-next]')?.addEventListener('click',()=>show(index+1));
  document.querySelector('[data-prev]')?.addEventListener('click',()=>show(index-1));
  document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.jump))));
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);if(e.key==='ArrowLeft')show(index-1);if(e.key==='Escape')closeModal();});
  const modal=document.querySelector('.modal');
  function closeModal(){modal?.classList.remove('open');}
  document.querySelectorAll('[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>{
    const title=btn.dataset.title||btn.textContent.trim();const imgs=btn.dataset.gallery.split('|').filter(Boolean);
    modal.querySelector('.modal-title').textContent=title;
    modal.querySelector('.gallery').innerHTML=imgs.map(x=>{const [src,cap]=x.split('~');return `<figure><img src="assets/images/${src}" alt="${cap||title}"><figcaption>${cap||title}</figcaption></figure>`}).join('');
    modal.classList.add('open');
  }));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModal));
  modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  // Full-size photo viewer: keeps the original aspect ratio and allows click-to-zoom viewing.
  const viewer=document.createElement('div');
  viewer.className='image-viewer';
  viewer.innerHTML='<button class="btn zoom-close" type="button">✕ CLOSE</button><img alt="Full-size portfolio photo">';
  document.body.appendChild(viewer);
  const viewerImg=viewer.querySelector('img');
  function openViewer(img){viewerImg.src=img.currentSrc||img.src;viewerImg.alt=img.alt||'Portfolio photo';viewer.classList.add('open');}
  function closeViewer(){viewer.classList.remove('open');viewerImg.removeAttribute('src');}
  document.addEventListener('click',e=>{const img=e.target.closest('.gallery img,.tribute-photo img');if(img){e.preventDefault();openViewer(img);}});
  viewer.querySelector('.zoom-close').addEventListener('click',e=>{e.stopPropagation();closeViewer();});
  viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer.classList.contains('open'))closeViewer();});
  show(0);
})();
