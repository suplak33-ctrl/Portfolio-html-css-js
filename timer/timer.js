const minutes=document.getElementById("minutes");
const seconds=document.getElementById("seconds");

const start=document.getElementById("startBtn");
const pause=document.getElementById("pauseBtn");
const reset=document.getElementById("resetBtn");
const set=document.getElementById("setBtn");

const input=document.getElementById("customMinutes");

const progress=document.getElementById("progressCircle");

let total=1500;
let time=1500;

let timer=null;

const circumference=2*Math.PI*110;

progress.style.strokeDasharray=circumference;

function update(){

const m=Math.floor(time/60);
const s=time%60;

minutes.textContent=String(m).padStart(2,"0");
seconds.textContent=String(s).padStart(2,"0");

const offset=circumference-(time/total)*circumference;

progress.style.strokeDashoffset=offset;

}

update();

start.onclick=()=>{

if(timer) return;

timer=setInterval(()=>{

time--;

update();

if(time<=0){

clearInterval(timer);

timer=null;

new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg").play();

alert("Time's up!");

}

},1000);

};

pause.onclick=()=>{

clearInterval(timer);

timer=null;

};

reset.onclick=()=>{

clearInterval(timer);

timer=null;

time=total;

update();

};

set.onclick=()=>{

const m=parseInt(input.value);

if(!m||m<1) return;

total=m*60;

time=total;

update();

};

document.addEventListener("keydown",(e)=>{

if(e.code==="Space"){

e.preventDefault();

if(timer){

pause.click();

}else{

start.click();

}

}

if(e.key.toLowerCase()==="r"){

reset.click();

}

});