 // Game state
 const secretMin = 1, secretMax = 100;
 let secret = rand(secretMin, secretMax);
 let tries = 0;
 let best = null;

 // Elements
 const guessInput = document.getElementById('guessInput');
 const guessBtn = document.getElementById('guessBtn');
 const resetBtn = document.getElementById('resetBtn');
 const hintBtn = document.getElementById('hintBtn');
 const messages = document.getElementById('messages');
 const messageBubble = document.getElementById('messageBubble');
 const progressBar = document.getElementById('progressBar');
 const triesText = document.getElementById('triesText');
 const triesCount = document.getElementById('triesCount');
 const bestScore = document.getElementById('bestScore');
 const secretMask = document.getElementById('secretMask');
 const nameInput = document.getElementById('nameInput');
 const avatar = document.getElementById('avatar');
 const displayName = document.getElementById('displayName');
 const displayUsername = document.getElementById('displayUsername');
 const confettiRoot = document.getElementById('confettiRoot');

 // Initialize username behavior
 nameInput.addEventListener('input', () => {
   const val = nameInput.value.trim();
   if(!val){
     displayName.textContent = 'Guest';
     displayUsername.textContent = '@guest' + 5;
     avatar.textContent = '?';
     return;
   }
   displayName.textContent = val;
   const clean = val.replace(/\s+/g, '').toLowerCase();
   const uname = '@' + clean + val.length;
   displayUsername.textContent = uname;
   avatar.textContent = (clean.slice(0,2) || '?').toUpperCase();
 });

 // Guess action
 guessBtn.addEventListener('click', onGuess);
 guessInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') onGuess(); });

 function onGuess(){
   const v = Number(guessInput.value);
   if(!Number.isInteger(v) || v < secretMin || v > secretMax){
     setMessage('Please enter a whole number between 1 and 100.', 'warning');
     pulseInput();
     return;
   }
   tries++;
   triesText.textContent = 'Tries: ' + tries;
   triesCount.textContent = tries;
   updateProgress();

   if(v === secret){
     setMessage('🎉 Correct! You guessed the number in ' + tries + ' tries.', 'positive');
     revealSecret();
     celebrate();
     recordBest();
     disableInputs();
   } else {
     const diff = Math.abs(secret - v);
     const near = diff <= 3;
     const direction = v < secret ? 'higher' : 'lower';
     const tone = near ? 'positive' : 'warning';
     setMessage(`Try ${tries}: ${direction.toUpperCase()} — your guess is ${near ? 'very close' : 'off by ' + diff}.`, tone);
     flashRange(v);
   }
   // small UX: clear input but keep focus
   guessInput.value = '';
   guessInput.focus();
 }

 // Hint toggles
 hintBtn.addEventListener('click', () => {
   if(tries >= 98){ setMessage('No more hints available.', 'warning'); return;}
   tries++;
   triesText.textContent = 'Tries: ' + tries;
   triesCount.textContent = tries;
   updateProgress();
   const parity = (secret % 2 === 0) ? 'even' : 'odd';
   setMessage('Hint: the number is ' + parity + '.', 'positive');
 });

 // Reset
 resetBtn.addEventListener('click', resetGame);

 function resetGame(){
   secret = rand(secretMin, secretMax);
   tries = 0;
   triesText.textContent = 'Tries: 0';
   triesCount.textContent = '0';
   progressBar.style.width = '0%';
   secretMask.textContent = '•••';
   setMessage('New game started — good luck!', 'positive');
   enableInputs();
   confettiRoot.innerHTML = '';
 }

 // Helpers
 function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

 function setMessage(text, tone='') {
   messageBubble.textContent = text;
   messageBubble.className = 'bubble';
   if(tone === 'positive') messageBubble.classList.add('positive');
   if(tone === 'warning') messageBubble.classList.add('warning');
   if(tone === 'error') messageBubble.classList.add('error');
 }

 function updateProgress(){
   const pct = Math.min(100, Math.round((tries / 12) * 100));
   progressBar.style.width = pct + '%';
   if(pct > 80) progressBar.style.filter = 'saturate(1.1)';
 }

 function revealSecret(){
   secretMask.textContent = secret;
 }

 function recordBest(){
   if(best === null || tries < best){
     best = tries;
     bestScore.textContent = tries;
   }
 }

 function disableInputs(){
   guessInput.disabled = true;
   guessBtn.disabled = true;
 }
 function enableInputs(){
   guessInput.disabled = false;
   guessBtn.disabled = false;
   guessInput.focus();
 }

 function pulseInput(){
   guessInput.style.transform = 'translateX(-6px)';
   setTimeout(()=> guessInput.style.transform = '', 120);
 }

 // Flash small indicator on the range to show guess position
 function flashRange(value){
   const el = document.createElement('div');
   el.style.position = 'absolute';
   el.style.left = ((value - secretMin)/(secretMax-secretMin))*100 + '%';
   el.style.top = '0';
   el.style.transform = 'translateX(-50%)';
   el.style.width = '8px';
   el.style.height = '8px';
   el.style.borderRadius = '50%';
   el.style.background = 'rgba(242,132,130,0.95)';
   el.style.boxShadow = '0 6px 12px rgba(242,132,130,0.14)';
   el.style.opacity = '1';
   document.querySelector('.range').appendChild(el);
   setTimeout(()=> {
     el.style.transition = 'opacity .8s, transform .8s';
     el.style.opacity = '0';
     el.style.transform = 'translateX(-50%) translateY(-12px) scale(.6)';
   },40);
   setTimeout(()=> el.remove(),900);
 }

 // Confetti celebration (small, lightweight)
 function celebrate(){
   const count = 24;
   for(let i=0;i<count;i++){
     const d = document.createElement('div');
     d.className = 'confetti';
     d.style.left = (50 + Math.random()*60 - 30) + '%';
     d.style.top = (20 + Math.random()*20) + '%';
     d.style.background = randomColor();
     confettiRoot.appendChild(d);
     // animate
     const dx = (Math.random()*200 - 100);
     const dy = (Math.random()*260 + 80);
     d.animate([
       { transform: `translate(0,0) rotate(0deg)`, opacity:1 },
       { transform: `translate(${dx}px, ${dy}px) rotate(${(Math.random()*720-360)}deg)`, opacity:0 }
     ], { duration: 1200 + Math.random()*800, easing: 'cubic-bezier(.2,.8,.2,1)'});
     setTimeout(()=> d.remove(), 2200);
   }
 }
 function randomColor(){
   const palette = ['#f28482','#1fab89','#7fd3cf','#ffd166','#a8dadc','#ff6b6b'];
   return palette[Math.floor(Math.random()*palette.length)];
 }

 // small keyboard shortcut: R to reset
 window.addEventListener('keydown', (e) => {
   if(e.key.toLowerCase() === 'r') resetGame();
 });

 // show initial message
 setMessage('Ready — enter your guess or press Enter. Press R to reset.', 'positive');

 // Accessibility: focus guess input
 guessInput.focus();

 // Expose secret for debugging with comment: console.log(secret);
 // console.log(secret);