const API_KEY = "YOUR_API_KEY_HERE"; // <-- put your OpenWeatherMap API key here
const BASE = "https://api.openweathermap.org/data/2.5/weather";
const presetCities = ["Kathmandu","Seoul","New York","London","Tokyo"];

const q = el => document.querySelector(el);
const container = q("#cardsContainer");
const form = q("#searchForm");
const input = q("#cityInput");

function kelvinToCelsius(k){ return Math.round(k - 273.15) }
function round(n){ return Math.round(n) }

function makeCardData(data){
return {
id: data.id,
city: data.name,
country: data.sys?.country || "",
temp: kelvinToCelsius(data.main.temp),
feels: kelvinToCelsius(data.main.feels_like),
humidity: data.main.humidity,
desc: (data.weather && data.weather) ? data.weather.description : "—",
icon: (data.weather && data.weather) ? data.weather.icon : null,
wind: data.wind?.speed ?? 0
};
}

function createCardNode(d){
const card = document.createElement("article");
card.className = "card";
card.setAttribute("data-city", d.city);

card.innerHTML = `
<div class="card-row">
<div>
<div class="city">${escapeHtml(d.city)} <span class="small"> ${escapeHtml(d.country)}</span></div>
<div class="sub">${escapeHtml(capitalize(d.desc))}</div>
</div>
<div class="icon" aria-hidden="true">
${iconEmoji(d.icon)}
</div>
</div>

<div class="card-row" style="align-items:flex-end">
<div>
<div class="temp">${d.temp}°C</div>
<div class="small">Feels ${d.feels}° - Hum ${d.humidity}%</div>
</div>
<div class="details">
<div>Wind ${round(d.wind)} m/s</div>
</div>
</div>
`;
return card;
}

/* tiny helper to map icon code to simple emoji (keeps UI minimal) */
function iconEmoji(icon){
if(!icon) return "☁️";
if(icon.startsWith("01")) return "☀️";
if(icon.startsWith("02")||icon.startsWith("03")||icon.startsWith("04")) return "☁️";
if(icon.startsWith("09")||icon.startsWith("10")) return "🌧️";
if(icon.startsWith("11")) return "⛈️";
if(icon.startsWith("13")) return "❄️";
if(icon.startsWith("50")) return "🌫️";
return "☀️";
}

function capitalize(txt){ return txt ? txt.split(" ").map(s => s.charAt(0).toUpperCase()+s.slice(1)).join(" ") : "" }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

async function fetchCityWeather(city){
const url = ${BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY};
const res = await fetch(url);
if(!res.ok) throw new Error("City not found");
return res.json();
}

async function addCity(city){
try{
const raw = await fetchCityWeather(city);
const data = makeCardData(raw);
// remove existing same city card (update)
const existing = container.querySelector([data-city="${CSS.escape(data.city)}"]);
if(existing) existing.remove();
container.prepend(createCardNode(data));
}catch(e){
alert("Could not load city: " + city);
console.error(e);
} }

/* initial load of presets */
function loadPresets(){
presetCities.forEach(c => addCity(c));
}

form.addEventListener("submit", e=>{
e.preventDefault();
const city = input.value.trim();
if(!city) return;
addCity(city);
input.value = "";
});

/* small UX: click a card to refresh (no repeated styles, same card template used) */
container.addEventListener("click", e=>{
const card = e.target.closest(".card");
if(!card) return;
const city = card.getAttribute("data-city");
if(city) addCity(city);
});

loadPresets();