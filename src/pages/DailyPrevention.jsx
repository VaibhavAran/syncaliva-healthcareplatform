import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import "../css/dailyPrevention.css";

export default function DailyPrevention() {
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [eye, setEye] = useState(null);
  const [immunity, setImmunity] = useState(null);
  const [oneChange, setOneChange] = useState(null);
  const [challenges, setChallenges] = useState({ physical: null, mental: null });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Please sign in.");
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();

        const res = await fetch("http://localhost:5000/api/prevention/content", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setDate(data.date);
        setEye(data.eye || null);
        setImmunity(data.immunity || null);
        setOneChange(data.oneChangeToday || null);
        setChallenges(data.challengesToday || { physical: null, mental: null });

        // Mark-as-done state from localStorage
        const key = `oneChangeDone:${user.uid}:${data.date}`;
        setDone(localStorage.getItem(key) === "1");
      } catch (e) {
        console.error(e);
        setError("Failed to load prevention content.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkDone = () => {
    if (!oneChange || done) return;
    const user = auth.currentUser;
    const key = `oneChangeDone:${user.uid}:${date}`;
    localStorage.setItem(key, "1");
    setDone(true);
  };

  if (loading) return <div className="dp-container"><p>Loading...</p></div>;
  if (error) return <div className="dp-container"><p className="error">{error}</p></div>;

  const renderDescription = (description) => {
    if (Array.isArray(description)) {
      return description.map((line, index) => <p key={index}>{line}</p>);
    }
    return <p>{description}</p>;
  };

  return (
    <div className="dp-container">
      <div className="dp-header">
        <h1>Daily Prevention</h1>
        <p className="dp-subtitle">Tiny habits today. Big health tomorrow.</p>
      </div>

      {/* Daily One Change */}
      {oneChange && (
        <section className="dp-highlight">
          <img
            src={oneChange.image_url || "/assets/change-default.jpg"}
            alt={oneChange.title}
            className="dp-highlight-img"
          />
          <div className="dp-highlight-content">
            <h2>🔄 Daily One Change</h2>
            <h3>{oneChange.title}</h3>
            <p>{oneChange.description}</p>
            <button
              className={`dp-cta ${done ? "done" : ""}`}
              onClick={handleMarkDone}
              disabled={done}
            >
              {done ? "Completed ✓" : "Mark as done"}
            </button>
            <p className="dp-date">For: {date}</p>
          </div>
        </section>
      )}
      
      <div className="dp-grid">
        {/* Eye Care */}
        {eye && (
          <section className="dp-section">
            <article className="dp-card">
              <img src={eye.image_url || "/assets/eye-default.jpg"} alt={eye.title} className="dp-card-img" />
              <div className="dp-card-content">
                <h3>👀 Eye & Screen Care</h3>
                <h4>{eye.title}</h4>
                {/* MODIFICATION HERE */}
                {renderDescription(eye.description)}
              </div>
            </article>
          </section>
        )}

        {/* Immunity */}
        {immunity && (
          <section className="dp-section">
            <article className="dp-card">
              <img src={immunity.image_url || "/assets/immunity.png"} alt={immunity.title} className="dp-card-img"/>
              <div className="dp-card-content">
                <h3>🛡️ Immunity Boost</h3>
                <h4>{immunity.title}</h4>
                {/* MODIFICATION HERE */}
                {renderDescription(immunity.description)}
              </div>
            </article>
          </section>
        )}
      </div>

      {/* Today’s Challenges */}
      <section className="dp-section">
        <h2>🎯 Today’s Challenges</h2>
        <div className="dp-challenges">
          {challenges.physical && (
            <div className="dp-challenge">
              <div className="dp-challenge-header">
                 <h3>🏃 Physical Challenge</h3>
              </div>
              <div className="dp-challenge-content">
                <p className="dp-ch-title">{challenges.physical.title}</p>
                <p>{challenges.physical.description}</p>
                {challenges.physical.duration_mins && (
                  <p className="dp-duration">~{challenges.physical.duration_mins} mins</p>
                )}
              </div>
            </div>
          )}
          {challenges.mental && (
            <div className="dp-challenge">
              <div className="dp-challenge-header">
                <h3>🧠 Mental Challenge</h3>
              </div>
              <div className="dp-challenge-content">
                <p className="dp-ch-title">{challenges.mental.title}</p>
                <p>{challenges.mental.description}</p>
                {challenges.mental.duration_mins && (
                  <p className="dp-duration">~{challenges.mental.duration_mins} mins</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}