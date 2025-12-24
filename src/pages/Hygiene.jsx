import React, { useState, useEffect } from "react";
import hygieneData from "../data/hygiene.json";
import "../css/hygiene.css";

// Category icons for a visual boost
const icons = {
  all: "🌟",
  environment: "🌿",
  physical: "💧",
  mental: "🧠",
  food: "🍎",
  digital: "💻",
};

export default function Hygiene() {
  const [todayZone, setTodayZone] = useState(null);
  const [season, setSeason] = useState("summer");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Daily risk zone
    const index = new Date().getDate() % hygieneData.risk_zones.length;
    setTodayZone(hygieneData.risk_zones[index]);

    // Detect season
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 9) setSeason("monsoon");
    else if (month >= 11 || month <= 2) setSeason("winter");
    else setSeason("summer");
  }, []);

  // NEW: Create a structured list of all tips with their category
  const allTips = Object.entries(hygieneData.hygiene_tips).flatMap(
    ([category, tips]) => tips.map((tipText) => ({ text: tipText, category }))
  );
  
  const tipsToDisplay =
    filter === "all"
      ? allTips
      : allTips.filter((tip) => tip.category === filter);

  // Updated search filter to check the 'text' property
  const filteredTips = tipsToDisplay.filter((tip) =>
    tip.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hygiene-page">
      <div className="hygiene-header">
        <h1>Hygiene & Wellness Guide</h1>
        <p>Your daily resource for staying healthy, safe, and balanced.</p>
      </div>

      {/* Today's Risk Zone */}
      {todayZone && (
        <section className="risk-card-section">
          <h2>🚨 Today's Focus Zone</h2>
          <div className="risk-card">
            <div className="risk-img-container">
              <img src={todayZone.image} alt={todayZone.name} className="risk-img" />
            </div>
            <div className="risk-content">
              <h3>{todayZone.name}</h3>
              <p>
                <b>Danger Level:</b>{" "}
                <span className={`danger ${todayZone.danger.toLowerCase()}`}>
                  {todayZone.danger}
                </span>
              </p>
              <p><b>Risk:</b> {todayZone.risk}</p>
              <p><b>Tip:</b> {todayZone.tip}</p>
              <p className="fun-fact">💡 <b>Did you know?</b> {todayZone.fact}</p>
            </div>
          </div>
        </section>
      )}

      <div className="hygiene-main-content">
        {/* Seasonal Tips */}
        <section className={`season-card ${season}`}>
          <div className="season-header">
            <h3>{hygieneData.seasonal_tips[season].title}</h3>
          </div>
          <ul className="season-tips-list">
            {hygieneData.seasonal_tips[season].tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>

        {/* Hygiene Library */}
        <section className="library">
          <h2>📚 Hygiene Tips Library</h2>

          <div className="search-box">
             <input
               type="text"
               placeholder="Search all tips (e.g., 'hand wash')"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>

          <div className="filters">
            {Object.keys(icons).map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {icons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="tips-grid">
            {filteredTips.length > 0 ? (
              filteredTips.map((tip, idx) => (
                <div key={idx} className="tip-card" data-category={tip.category}>
                  {tip.text}
                </div>
              ))
            ) : (
              <div className="no-tips">
                <p>No tips found for your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}