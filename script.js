// LabLens V2 - Load instruments from JSON
let instruments = [];
let shortlist = JSON.parse(localStorage.getItem("lablens-shortlist") || "[]");

const search = document.getElementById("search");
const application = document.getElementById("application");
const budget = document.getElementById("budget");
const results = document.getElementById("results");
const count = document.getElementById("count");
const recommendation = document.getElementById("recommendation");

// Load data from instruments.json
async function loadInstruments() {
  try {
    const response = await fetch("instruments.json");
    if (!response.ok) throw new Error("Failed to load instruments.json");
    instruments = await response.json();

    const icons = {
      "Spectrophotometer": "🔬",
      "Fluorescence Instrument": "✨",
      "Centrifuge": "⚙️",
      "Incubator": "🧪",
      "Microplate Reader": "📊",
      "Liquid Handling": "💧"
    };

    instruments.forEach(item => {
      item.icon = icons[item.category] || "🔬";
      if (Array.isArray(item.keywords)) {
        item.keywordsStr = item.keywords.join(" ");
      } else {
        item.keywordsStr = item.keywords || "";
      }
    });

    render();
  } catch (err) {
    console.error(err);
    results.innerHTML = `
      <div class="panel">
        <h3>Could not load instruments</h3>
        <p>Make sure instruments.json is in the same folder.</p>
      </div>`;
  }
}

function render() {
  const q = search.value.toLowerCase().trim();
  const app = application.value;
  const b = budget.value;

  const matches = instruments.filter((item) => {
    const text = (
      item.name + " " +
      item.description + " " +
      (item.keywordsStr || "") + " " +
      (item.category || "") + " " +
      (item.technology || "")
    ).toLowerCase();

    const searchOK = !q || text.includes(q);
    const appOK = !app || item.application === app;
    const budgetOK = !b || item.budget === Number(b);

    return searchOK && appOK && budgetOK;
  });

  count.textContent = matches.length;

  if (!matches.length) {
    results.innerHTML = `
      <div class="panel">
        <h3>No matching instruments</h3>
        <p>Try a broader search or remove a filter.</p>
      </div>`;
  } else {
    results.innerHTML = matches.map((item) => `
      <article class="instrument-card" data-id="${item.id}">
        <div class="icon">${item.icon || "🔬"}</div>
        <h3>${item.name}</h3>
        <span class="tag">${item.application}</span>
        <span class="tag">${item.technology}</span>
        <p>${item.description}</p>
        <strong>${item.price}</strong>
        <div class="score">⭐ Smart Match: ${q ? "High" : "Available"}</div>
        <button class="details-btn" onclick="showDetails(${item.id})">View Details</button>
      </article>
    `).join("");
  }

  if (q && matches.length) {
    recommendation.innerHTML = `
      <div class="panel">
        <h2>💡 Smart Recommendation</h2>
        <p>Based on <b>"${q}"</b>, 
        <strong>${matches[0].name}</strong> is a strong starting option
        because its application and keywords match your search.</p>
      </div>`;
  } else {
    recommendation.innerHTML = "";
  }
}

// Details View
function showDetails(id) {
  const item = instruments.find(i => i.id === id);
  if (!item) return;

  document.getElementById("results").style.display = "none";
  document.getElementById("recommendation").style.display = "none";

  const stats = document.querySelector(".stats");
  if (stats) stats.style.display = "none";

  const controlsPanel = document.querySelector(".controls")?.parentElement;
  if (controlsPanel) controlsPanel.style.display = "none";

  document.getElementById("details-panel").style.display = "block";

  document.getElementById("detail-name").textContent = item.name;
  document.getElementById("detail-desc").textContent = item.description;
  document.getElementById("detail-price").textContent = item.price;

  document.getElementById("detail-tags").innerHTML = `
    <span class="tag">${item.category || ""}</span>
    <span class="tag">${item.application || ""}</span>
    <span class="tag">${item.technology || ""}</span>
  `;

  const specs = item.specifications || {};
  document.getElementById("detail-specs").innerHTML = `
    <li><strong>Measurement:</strong> ${specs.measurement || "—"}</li>
    <li><strong>Sample Type:</strong> ${specs.sampleType || "—"}</li>
    <li><strong>Use Case:</strong> ${specs.useCase || "—"}</li>
  `;
}

function hideDetails() {
  document.getElementById("details-panel").style.display = "none";
  document.getElementById("results").style.display = "";
  document.getElementById("recommendation").style.display = "";

  const stats = document.querySelector(".stats");
  if (stats) stats.style.display = "";

  const controlsPanel = document.querySelector(".controls")?.parentElement;
  if (controlsPanel) controlsPanel.style.display = "";
}

function addToShortlist(id) {
  if (!shortlist.includes(id)) {
    shortlist.push(id);
    localStorage.setItem("lablens-shortlist", JSON.stringify(shortlist));
    alert("Instrument added to Shortlist!");
  } else {
    alert("Already in Shortlist");
  }
}

// Event listeners
search.addEventListener("input", render);
application.addEventListener("change", render);
budget.addEventListener("change", render);

// Safe event listeners (will not crash if element is missing)
const backBtn = document.getElementById("back-btn");
if (backBtn) {
  backBtn.addEventListener("click", hideDetails);
}

const shortlistBtn = document.getElementById("shortlist-btn");
if (shortlistBtn) {
  shortlistBtn.addEventListener("click", function() {
    const name = document.getElementById("detail-name").textContent;
    const item = instruments.find(i => i.name === name);
    if (item) {
      addToShortlist(item.id);
    }
  });
}

// Start loading
loadInstruments();
