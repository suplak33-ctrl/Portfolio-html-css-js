// Smooth reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if(entry.isIntersecting) entry.target.classList.add('visible');
});
}, {threshold:0.12});
reveals.forEach(r => observer.observe(r));

// Simple booking handler (replace with real backend)
document.getElementById('bookingForm').addEventListener('submit', (e) => {
e.preventDefault();
alert('Thanks! Booking request received. We will contact you to confirm.');
e.target.reset();
});

// make mobile book button visible on small screens
function updateNav() {
const links = document.querySelector('.nav-links');
const mob = document.querySelector('.mobile-nav');
if(window.innerWidth < 720) { links.style.display='none'; mob.style.display='flex'; }
else { links.style.display='flex'; mob.style.display='none'; }
}
window.addEventListener('resize', updateNav);
updateNav();
