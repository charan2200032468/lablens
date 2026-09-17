const instruments = [
  {
    name: "UV-Vis Spectrophotometer",
    icon: "🔬",
    application: "Biochemistry",
    technology: "UV-Vis",
    budget: 2,
    price: "₹2L–₹5L",
    description:
      "Measures absorbance and is useful for concentration and enzyme activity studies.",
    keywords: "protein dna absorbance enzyme concentration"
  },
  {
    name: "Fluorometer",
    icon: "✨",
    application: "Molecular Biology",
    technology: "Fluorescence",
    budget: 3,
    price: "Above ₹5L",
    description:
      "Useful for highly sensitive fluorescence-based measurements.",
    keywords: "dna rna fluorescence nucleic acid"
  },
  {
    name: "Benchtop Centrifuge",
    icon: "⚙️",
    application: "Sample Preparation",
    technology: "Centrifugation",
    budget: 1,
    price: "Under ₹2L",
    description:
      "Separates sample components using centrifugal force.",
    keywords: "sample separation blood cell preparation centrifuge"
  },
  {
    name: "CO₂ Incubator",
    icon: "🧪",
    application: "Cell Culture",
    technology: "Controlled Atmosphere",
    budget: 3,
    price: "Above ₹5L",
    description:
      "Maintains controlled temperature and CO₂ conditions for cell culture.",
    keywords: "cell culture cells incubation tissue co2 incubator"
  },
  {
    name: "Microplate Reader",
    icon: "📊",
    application: "Biochemistry",
    technology: "Microplate",
    budget: 3,
    price: "Above ₹5L",
    description:
      "Supports high-throughput optical measurements in microplates.",
    keywords: "protein assay elisa high throughput microplate"
  },
  {
    name: "Micropipette Set",
    icon: "💧",
    application: "Molecular Biology",
    technology: "Liquid Handling",
    budget: 1,
    price: "Under ₹2L",
    description:
      "Provides accurate liquid transfer for routine laboratory workflows.",
    keywords: "dna sample liquid pcr pipette"
  }
];

const search = document.getElementById("search");
const application = document.getElementById("application");
const budget = document.getElementById("budget");
const results = document.getElementById("results");
const count = document.getElementById("count");
const recommendation = document.getElementById("recommendation");

function render() {
  const q = search.value.toLowerCase().trim();
  const app = application.value;
  const b = budget.value;

  const matches = instruments.filter((item) => {
    const text = (
      item.name +
      " " +
      item.description +
      " " +
      item.keywords
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
      </div>
    `;
  } else {
    results.innerHTML = matches
      .map(
        (item) => `
          <article class="instrument-card">
            <div class="icon">${item.icon}</div>

            <h3>${item.name}</h3>

            <span class="tag">${item.application}</span>
            <span class="tag">${item.technology}</span>

            <p>${item.description}</p>

            <strong>${item.price}</strong>

            <div class="score">
              ⭐ Smart Match: ${q ? "High" : "Available"}
            </div>
          </article>
        `
      )
      .join("");
  }

  if (q && matches.length) {
    recommendation.innerHTML = `
      <div class="panel">
        <h2>💡 Smart Recommendation</h2>

        <p>
          Based on <b>"${q}"</b>, 
          <strong>${matches[0].name}</strong> is a strong starting option
          because its application and keywords match your search.
        </p>
      </div>
    `;
  } else {
    recommendation.innerHTML = "";
  }
}

search.addEventListener("input", render);
application.addEventListener("change", render);
budget.addEventListener("change", render);

render();
