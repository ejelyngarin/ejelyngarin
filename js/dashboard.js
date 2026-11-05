(() => {
  "use strict";
  const source = document.querySelector(".dashboard-source");
  const overlay = document.querySelector("#dashboard-overlay");
  const content = document.querySelector("#dashboard-panel-content");
  const title = document.querySelector("#dashboard-panel-title");
  if (!source || !overlay || !content) return;

  const page = location.pathname.split("/").pop();
  const configs = {
    "personal.html": ["My story", "Profile & quick facts", "Personal details", "Education", "Personality & values", "Interests & hobbies"],
    "achievements.html": ["Photo gallery", "Academic recognition", "Leadership & participation", "Lessons beyond awards"],
    "parents.html": ["My family", "A note of gratitude"]
  };
  const sections = [...source.querySelectorAll(":scope > section")];
  const labels = configs[page] || [];
  const mapping = page === "personal.html"
    ? [0,1,2,3,4,5]
    : page === "achievements.html" ? [0,1,2,3] : [0,1];
  let activeSection = null;
  let lastTrigger = null;

  function close() {
    if (activeSection) source.appendChild(activeSection);
    activeSection = null;
    content.replaceChildren();
    overlay.hidden = true;
    document.body.classList.remove("dashboard-open");
    if (lastTrigger) lastTrigger.focus();
  }
  function open(key, trigger) {
    const index = ({
      "personal.html": {story:0,profile:1,details:2,education:3,personality:4,interests:5},
      "achievements.html": {gallery:0,academic:1,leadership:2,lessons:3},
      "parents.html": {family:0,gratitude:1}
    }[page] || {})[key];
    if (index === undefined || !sections[index]) return;
    if (activeSection) source.appendChild(activeSection);
    activeSection = sections[index];
    lastTrigger = trigger;
    title.textContent = labels[index] || "Explore";
    content.replaceChildren(activeSection);
    overlay.hidden = false;
    document.body.classList.add("dashboard-open");
    overlay.querySelector(".dashboard-close").focus();
    content.scrollTop = 0;
  }
  document.querySelectorAll("[data-dashboard-open]").forEach(button => {
    button.addEventListener("click", () => open(button.dataset.dashboardOpen, button));
  });
  overlay.querySelector(".dashboard-close").addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) close(); });
})();
