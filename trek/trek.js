const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("progressBar");
const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = `${progress}%`;
  navbar.classList.toggle("scrolled", scrollTop > 20);

  let current = "";
  document.querySelectorAll("section, footer").forEach(section => {
    const top = section.offsetTop - 140;
    if (scrollTop >= top) current = section.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => observer.observe(item));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const menuToggle = document.getElementById("menu-toggle");
      if (menuToggle) menuToggle.checked = false;
    }
  });
});