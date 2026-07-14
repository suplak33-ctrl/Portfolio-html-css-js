/* =========================================================
   Ngima — portfolio interactions
   ========================================================= */

// ---------- mobile menu ----------
const menulist = document.getElementById("menulist");
const icon = document.getElementById("icon");
menulist.style.maxHeight = "0px";

function toggleMenu() {
  if (menulist.style.maxHeight === "0px") {
    menulist.style.maxHeight = "350px";
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-x");
  } else {
    menulist.style.maxHeight = "0px";
    icon.classList.remove("fa-x");
    icon.classList.add("fa-bars");
  }
  icon.classList.toggle("rotate");
}
window.toggleMenu = toggleMenu;

// close menu after tapping a link (mobile)
document.querySelectorAll("#menulist a").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 600) toggleMenu();
  });
});

// ---------- cursor blur blob ----------
const blur = document.getElementById("cursorBlur");
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  blur.classList.add("active");
});
document.addEventListener("mouseleave", () => blur.classList.remove("active"));

function animateBlur() {
  // easing for a smooth trailing feel
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  blur.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateBlur);
}
animateBlur();

// grow the blob a bit over interactive elements
const hoverTargets = document.querySelectorAll(
  "a, button, .project-card, .skill-card, .game-card, .photo-frame, input, textarea"
);
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    blur.style.width = "460px";
    blur.style.height = "460px";
    blur.style.opacity = "0.9";
  });
  el.addEventListener("mouseleave", () => {
    blur.style.width = "340px";
    blur.style.height = "340px";
    blur.style.opacity = "0.7";
  });
});

// ---------- section-by-section scroll buttons ----------
const topBtn = document.getElementById("scrollTopBtn");
const bottomBtn = document.getElementById("scrollBottomBtn");

// collect every major section in document order
const sections = Array.from(
  document.querySelectorAll(
    ".hero, .skills-section, .projects-section, .games-section, .contact-section"
  )
);

// find the index of the section currently in view
function currentSectionIndex() {
  const y = window.scrollY;
  // a section is "active" when its top has crossed ~30% of the viewport
  const line = y + window.innerHeight * 0.3;

  let idx = 0;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].offsetTop <= line) idx = i;
  }
  return idx;
}

function scrollToSection(i) {
  const target = sections[Math.max(0, Math.min(sections.length - 1, i))];
  if (!target) return;
  window.scrollTo({ top: target.offsetTop - 10, behavior: "smooth" });
}

topBtn.addEventListener("click", () => {
  // if already very close to a section's top, jump to the previous one
  const i = currentSectionIndex();
  const atTop = window.scrollY - sections[i].offsetTop < 40;
  scrollToSection(atTop ? i - 1 : i);
});

bottomBtn.addEventListener("click", () => {
  scrollToSection(currentSectionIndex() + 1);
});

function updateScrollButtons() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight - 4;
  const i = currentSectionIndex();

  // top arrow: show once you've left the first section
  topBtn.classList.toggle("visible", y > 200);
  // bottom arrow: hide when the last section is reached
  bottomBtn.classList.toggle(
    "visible",
    i < sections.length - 1 && y < max
  );
}
window.addEventListener("scroll", updateScrollButtons, { passive: true });
window.addEventListener("load", updateScrollButtons);
window.addEventListener("resize", updateScrollButtons);

// ---------- reveal on scroll ----------
const revealEls = document.querySelectorAll(
  ".skill-card, .project-card, .game-card, .contact-message, .contact-social, .section-head, .projects-header, .contact-intro"
);
revealEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity .7s ease, transform .7s ease";
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }, i * 40);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// ---------- year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- tiny form guard ----------
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".send-btn");
    const original = btn.innerHTML;
    btn.innerHTML = 'Sent ✓';
    btn.style.background = "#22c55e";
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = "";
      form.reset();
    }, 1800);
  });
}
