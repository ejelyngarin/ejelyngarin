(() => {
  "use strict";
  const modal = document.querySelector("#about-modal");
  if (!modal) return;
  const title = modal.querySelector("#about-modal-title");
  const content = modal.querySelector("#about-modal-content");
  const closeButton = modal.querySelector(".modal-close");
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

  const details = {
    story: ["Past, present, and what comes next.", `<p>My school years included academic recognition, student leadership, scouting, performance activities, and opportunities to work with others. These experiences helped me practice responsibility, cooperation, preparation, and perseverance.</p><p>After studying Civil Engineering during my first year of college at PHINMA–University of Pangasinan in 2025–2026, I chose to move toward Information Technology. I am now continuing my studies at the University of the Cordilleras, focusing on Networking and Security.</p><p>My long-term direction is connected to information security and justice. I am interested in roles such as Cybersecurity Analyst, Security Operations Center (SOC) Analyst, and Security Engineer, while keeping an eventual interest in cybercrime prosecution.</p>`],
    skills: ["Curiosity into capability.", `<p>I am interested in networking, cybersecurity, programming and web development, research and analysis, communication, and responsible technology.</p><div class="resource-list"><article class="resource-item"><strong>Networking</strong><span>Learning how devices, networks, and services connect and exchange information.</span></article><article class="resource-item"><strong>Cybersecurity</strong><span>Exploring digital threats, safe practices, risk awareness, and ways to help protect systems and users.</span></article><article class="resource-item"><strong>Programming & web</strong><span>Practicing coding fundamentals and building websites to strengthen logic, troubleshooting, and design thinking.</span></article><article class="resource-item"><strong>Research & analysis</strong><span>Gathering information, asking questions, comparing evidence, and working toward reasoned conclusions.</span></article><article class="resource-item"><strong>Communication</strong><span>Using writing, reading, and reflection to express ideas clearly and understand different perspectives.</span></article><article class="resource-item"><strong>Responsible technology</strong><span>Keeping privacy, fairness, accountability, and the human impact of technology in mind.</span></article></div><p class="modal-note">These are areas I am interested in or actively developing—not claims of professional mastery.</p>`],
    values: ["The values I want to carry forward.", `<div class="resource-list"><article class="resource-item"><strong>Curiosity</strong><span>I want to understand how and why things work, not simply memorize the answer.</span></article><article class="resource-item"><strong>Perseverance</strong><span>Progress can come from consistent effort, honest reflection, and trying again after a difficult lesson.</span></article><article class="resource-item"><strong>Empathy</strong><span>Technology affects real people. I want my decisions and future work to consider their needs, safety, and dignity.</span></article><article class="resource-item"><strong>Integrity</strong><span>In security-related work especially, trust, privacy, and responsible use of knowledge matter.</span></article><article class="resource-item"><strong>Growth mindset</strong><span>I am willing to be a beginner, ask for help, and improve through practice and feedback.</span></article><article class="resource-item"><strong>Service</strong><span>I hope to use what I learn in ways that are useful beyond my own achievements.</span></article></div>`],
    career: ["A direction, not a finished map.", `<div class="resource-list"><article class="resource-item"><strong>NOW · Strengthen the fundamentals</strong><span>Build a strong foundation in programming, networking, operating systems, databases, and information security through coursework and small projects.</span></article><article class="resource-item"><strong>NEXT · Practice and document</strong><span>Create beginner-friendly projects, maintain clear notes, learn safe and ethical lab practices, and document what each project teaches me.</span></article><article class="resource-item"><strong>IN THE FUTURE · Grow into security work</strong><span>Work toward relevant training and entry-level opportunities in cybersecurity, such as SOC or security analysis, while exploring the legal and investigative side of cybercrime.</span></article></div>`],
    profile: ["Personal profile.", `<p>I am a Bachelor of Science in Information Technology student at the University of the Cordilleras in Baguio City, majoring in Networking and Security.</p><p>My interests include understanding how digital systems communicate, how security threats affect people and organizations, and how technology can be used thoughtfully. I also enjoy writing and reading, which help me reflect, communicate, and explore different perspectives.</p><p>I see learning as a process of asking better questions, practicing consistently, learning from mistakes, and becoming more responsible with the knowledge I gain.</p>`],
    quickfacts: ["Quick facts.", `<div class="resource-list"><article class="resource-item"><strong>Current institution</strong><span>University of the Cordilleras</span></article><article class="resource-item"><strong>Program</strong><span>BS Information Technology</span></article><article class="resource-item"><strong>Major</strong><span>Networking and Security</span></article><article class="resource-item"><strong>Current chapter</strong><span>College · 2026–present</span></article><article class="resource-item"><strong>Interests</strong><span>Cybersecurity, networking, writing, reading, and web development</span></article><article class="resource-item"><strong>Personal motto</strong><span>Use knowledge to serve.</span></article></div>`],
    name: ["Full name.", `<p>Ejelyn C. Garin</p>`],
    birthday: ["Birthday.", `<p>March 10, 2007</p>`],
    location: ["Location.", `<p>Pangasinan, Philippines</p>`],
    education: ["My educational background.", `<p>Every school left a chapter. Select or review the schools and milestones that form my educational journey.</p><div class="about-school-list">${schoolHistory.map(s => `<article class="about-school-item"><img src="${s[0]}" alt="${s[1]} logo"><div><p class="eyebrow">${s[2]}</p><h3>${s[1]}</h3><p>${s[3]}</p><p>${s[4]}</p></div></article>`).join("")}</div>`],
    personality: ["Personality & perspective · INFJ — The Advocate.", `<p>I am an introspective, empathetic, and purpose-driven individual who values integrity, compassion, and personal growth.</p><p>I enjoy understanding different perspectives, reflecting deeply on ideas, and finding meaningful ways to contribute to society. I am committed to continuous learning, responsible decision-making, and using my knowledge and skills to make a positive impact on others.</p><p>I see personality as a way to reflect on my preferences, not a limit on who I can become. I remain open to learning, changing, and discovering new strengths through experience.</p>`]
  };

  function open(key, trigger) {
    const item = details[key];
    if (!item) return;
    lastTrigger = trigger;
    title.textContent = item[0];
    content.innerHTML = item[1];
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }
  function close() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }
  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-about]");
    if (trigger) open(trigger.dataset.about, trigger);
  });
  closeButton.addEventListener("click", close);
  modal.addEventListener("click", event => { if (event.target === modal) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
})();