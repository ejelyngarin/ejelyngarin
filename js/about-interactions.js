(() => {
  "use strict";
  const modal = document.querySelector("#about-modal");
  if (!modal) return;
  const title = modal.querySelector("#about-modal-title");
  const content = modal.querySelector("#about-modal-content");
  const closeButton = modal.querySelector(".modal-close");
  const panel = modal.querySelector('.portfolio-modal-panel');
  let lastTrigger = null;

  const schoolHistory = [
    ["images/san-pedro-elementary-logo.jpg","San Pedro Elementary School","2011–2017 · Kinder–Grade 5","San Pedro, Mabini, Pangasinan","With honors in Kinder and Grades 1, 2, 4, and 5; high honors in Grade 3."],
    ["images/mary-the-queen-logo.jpg","Mary the Queen Educational Foundation","2017–2018 · Grade 6","Alaminos City, Pangasinan","With honors."],
    ["images/mary-the-queen-logo.jpg","Mary the Queen Educational Foundation","2018–2021 · Grades 7–8","Alaminos City, Pangasinan","With honors; Theatre and Drum and Lyre Corps."],
    ["images/great-plebian-college-logo.jpg","The Great Plebian College","2021–2022 · Grade 9","Alaminos City, Pangasinan","With honors."],
    ["images/lyceum-northwestern-logo.jpg","Lyceum North-Western University","2022–2023 · Grade 10","Dagupan City, Pangasinan","With honors; Science Club."],
    ["images/lyceum-northwestern-logo.jpg","Lyceum North-Western University","2023–2025 · Senior High · STEM","Dagupan City, Pangasinan","Graduated with honors; Best in Research Capstone Project Paper and Best in Product Innovation; Filipino Club."],
    ["images/phinma-university-of-pangasinan-logo.jpg","PHINMA–University of Pangasinan","2025–2026 · First-year college","Dagupan City, Pangasinan","BS Civil Engineering. This experience taught me patience and helped me reflect on the path I wanted to pursue."],
    ["images/university-of-the-cordilleras-logo.jpg","University of the Cordilleras","2026–present · College","Baguio City, Philippines","BS Information Technology, Major in Networking and Security."]
  ];

  const pageData = {
    skills: {
      title: "Curiosity into capability.",
      intro: "I am interested in networking, cybersecurity, programming and web development, research and analysis, communication, and responsible technology.",
      items: [
        ["Networking","Learning how devices, networks, and services connect and exchange information."],
        ["Cybersecurity","Exploring digital threats, safe practices, risk awareness, and ways to help protect systems and users."],
        ["Programming & web","Practicing coding fundamentals and building websites to strengthen logic, troubleshooting, and design thinking."],
        ["Research & analysis","Gathering information, asking questions, comparing evidence, and working toward reasoned conclusions."],
        ["Communication","Using writing, reading, and reflection to express ideas clearly and understand different perspectives."],
        ["Responsible technology","Keeping privacy, fairness, accountability, and the human impact of technology in mind."]
      ], note: "These are areas I am interested in or actively developing—not claims of professional mastery."
    },
    values: {
      title: "The values I want to carry forward.",
      items: [
        ["Curiosity","I want to understand how and why things work, not simply memorize the answer."],
        ["Perseverance","Progress can come from consistent effort, honest reflection, and trying again after a difficult lesson."],
        ["Empathy","Technology affects real people. I want my decisions and future work to consider their needs, safety, and dignity."],
        ["Integrity","In security-related work especially, trust, privacy, and responsible use of knowledge matter."],
        ["Growth mindset","I am willing to be a beginner, ask for help, and improve through practice and feedback."],
        ["Service","I hope to use what I learn in ways that are useful beyond my own achievements."]
      ]
    },
    education: { title: "My educational background." },
    personality: { title: "Personality & Values" }
  };

  const details = {
    story: ["Past, present, and what comes next.", `<p>My school years included academic recognition, student leadership, scouting, performance activities, and opportunities to work with others. These experiences helped me practice responsibility, cooperation, preparation, and perseverance.</p><p>After studying Civil Engineering during my first year of college at PHINMA–University of Pangasinan in 2025–2026, I chose to move toward Information Technology. I am now continuing my studies at the University of the Cordilleras, focusing on Networking and Security.</p><p>My long-term direction is connected to information security and justice. I am interested in roles such as Cybersecurity Analyst, Security Operations Center (SOC) Analyst, and Security Engineer, while keeping an eventual interest in cybercrime prosecution.</p>`],
    career: ["A direction, not a finished map.", `<div class="static-stack"><article class="resource-item"><strong>NOW · Strengthen the fundamentals</strong><span>Build a strong foundation in programming, networking, operating systems, databases, and information security through coursework and small projects.</span></article><article class="resource-item"><strong>NEXT · Practice and document</strong><span>Create beginner-friendly projects, maintain clear notes, learn safe and ethical lab practices, and document what each project teaches me.</span></article><article class="resource-item"><strong>IN THE FUTURE · Grow into security work</strong><span>Work toward relevant training and entry-level opportunities in cybersecurity, such as SOC or security analysis, while exploring the legal and investigative side of cybercrime.</span></article></div>`]
  };

  function renderControls(page, total) {
    return `<div class="page-controls"><button type="button" class="page-btn" data-page-prev ${page===0?'disabled':''}>← Previous</button><span>Page ${page+1} of ${total}</span><button type="button" class="page-btn" data-page-next ${page===total-1?'disabled':''}>Next →</button></div>`;
  }
  function renderPairPager(key) {
    const data = pageData[key];
    const pages = [];
    for (let i=0;i<data.items.length;i+=2) pages.push(data.items.slice(i,i+2));
    let page = 0;
    title.textContent = data.title;
    const draw = () => {
      const cards = pages[page].map(([h,t]) => `<article class="resource-item pager-item"><strong>${h}</strong><span>${t}</span></article>`).join('');
      content.innerHTML = `${data.intro?`<p class="pager-intro">${data.intro}</p>`:''}<div class="pager-grid">${cards}</div>${data.note?`<p class="modal-note">${data.note}</p>`:''}${renderControls(page,pages.length)}`;
      content.querySelector('[data-page-prev]')?.addEventListener('click',()=>{ if(page>0){page--;draw();} });
      content.querySelector('[data-page-next]')?.addEventListener('click',()=>{ if(page<pages.length-1){page++;draw();} });
    };
    draw();
  }
  function renderEducation() {
    const pages=[]; for(let i=0;i<schoolHistory.length;i+=2) pages.push(schoolHistory.slice(i,i+2));
    let page=0; title.textContent=pageData.education.title;
    const draw=()=>{
      const schools=pages[page].map(s=>`<article class="about-school-item"><img src="${s[0]}" alt="${s[1]} logo"><div><p class="eyebrow">${s[2]}</p><h3>${s[1]}</h3><p>${s[3]}</p><p>${s[4]}</p></div></article>`).join('');
      content.innerHTML=`<p class="pager-intro">Every school left a chapter. Here are the schools and milestones that form my educational journey.</p><div class="about-school-list education-pages">${schools}</div>${renderControls(page,pages.length)}`;
      content.querySelector('[data-page-prev]')?.addEventListener('click',()=>{if(page){page--;draw();}});
      content.querySelector('[data-page-next]')?.addEventListener('click',()=>{if(page<pages.length-1){page++;draw();}});
    }; draw();
  }
  function renderPersonality() {
    const pages=[
      `<div class="personality-page"><p class="eyebrow">PERSONALITY &amp; PERSPECTIVE</p><h3>INFJ <em>The Advocate.</em></h3><p>Introspective, empathetic, and purpose-driven. I value integrity, compassion, and personal growth.</p></div>`,
      `<div class="personality-page"><p class="eyebrow">ABOUT ME · PAGE 02</p><h3>Personality &amp; perspective · INFJ — The Advocate.</h3><p>I am an introspective, empathetic, and purpose-driven individual who values integrity, compassion, and personal growth.</p><p>I enjoy understanding different perspectives, reflecting deeply on ideas, and finding meaningful ways to contribute to society. I am committed to continuous learning, responsible decision-making, and using my knowledge and skills to make a positive impact on others.</p><p>I see personality as a way to reflect on my preferences, not a limit on who I can become. I remain open to learning, changing, and discovering new strengths through experience.</p></div>`
    ]; let page=0; title.textContent=pageData.personality.title;
    const draw=()=>{ content.innerHTML=pages[page]+renderControls(page,pages.length); content.querySelector('[data-page-prev]')?.addEventListener('click',()=>{if(page){page--;draw();}}); content.querySelector('[data-page-next]')?.addEventListener('click',()=>{if(page<1){page++;draw();}}); }; draw();
  }

  function open(key, trigger) {
    lastTrigger = trigger; panel.classList.remove('about-no-scroll');
    if (key==='skills' || key==='values') renderPairPager(key);
    else if (key==='education') renderEducation();
    else if (key==='personality') renderPersonality();
    else {
      const item=details[key]; if(!item) return;
      title.textContent=item[0]; content.innerHTML=item[1];
      if(key==='career') panel.classList.add('about-no-scroll');
    }
    modal.classList.add("open"); document.body.style.overflow="hidden"; closeButton.focus();
  }
  function close(){ if(!modal.classList.contains("open"))return; modal.classList.remove("open"); document.body.style.overflow=""; panel.classList.remove('about-no-scroll'); if(lastTrigger)lastTrigger.focus(); }
  document.addEventListener("click", event=>{ const trigger=event.target.closest("[data-about]"); if(trigger)open(trigger.dataset.about,trigger); });
  closeButton.addEventListener("click",close); modal.addEventListener("click",event=>{if(event.target===modal)close();}); document.addEventListener("keydown",event=>{if(event.key==="Escape")close();});
})();
