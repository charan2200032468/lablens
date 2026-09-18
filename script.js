// LabLens V2 - Load instruments from JSON
let instruments = [];

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

    // Add simple icons for display
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
      // Make keywords searchable as string
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

// Simple details popup (we will improve this in Step 6)
function showDetails(id) {
  const item = instruments.find(i => i.id === id);
  if (!item) return;

  alert(
    item.name + "\n\n" +
    "Category: " + item.category + "\n" +
    "Application: " + item.application + "\n" +
    "Technology: " + item.technology + "\n" +
    "Price: " + item.price + "\n\n" +
    item.description + "\n\n" +
    "Measurement: " + (item.specifications?.measurement || "") + "\n" +
    "Sample Type: " + (item.specifications?.sampleType || "") + "\n" +
    "Use Case: " + (item.specifications?.useCase || "")
  );
}

search.addEventListener("input", render);
application.addEventListener("change", render);
budget.addEventListener("change", render);

// Start by loading the JSON
loadInstruments();
