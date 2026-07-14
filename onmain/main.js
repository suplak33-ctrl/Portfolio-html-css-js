const start = new Date();
const target = new Date(start.getTime() + 21 * 24 * 60 * 60 * 1000);
const deadlineText = document.getElementById('deadlineText');
deadlineText.textContent = 'Locked deadline: ' + target.toLocaleString();

const pad = n => String(n).padStart(2, '0');
const ids = ['days','hours','minutes','seconds'];

function tick(){
  const now = new Date();
  let diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  [days,hours,minutes,seconds].forEach((v,i)=>document.getElementById(ids[i]).textContent = pad(v));
}
tick();
setInterval(tick, 1000);
