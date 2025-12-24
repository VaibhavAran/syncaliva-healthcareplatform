// src/pages/Meditation.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { auth } from "../firebase";
import sessions from "../data/meditationSessions.json";
import tips from "../data/mindfulnessTips.json";
import "../css/meditation.css";

function isBreathingRestricted(disease) {
  if (!disease) return false;
  const s = disease.toLowerCase();
  return s.includes("asthma") || s.includes("respir") || s.includes("copd") || s.includes("bronch");
}

function pickDailyTip(list) {
  if (!list?.length) return "Take a mindful moment to check in with your breath.";
  const seed = new Date().toISOString().slice(0, 10).split("-").join("");
  const idx = Number(seed) % list.length;
  return list[idx];
}

export default function Meditation() {
  const [activeTab, setActiveTab] = useState("meditate");
  const [userDisease, setUserDisease] = useState("");

  const [selectedId, setSelectedId] = useState(sessions[0]?.id || "");
  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === selectedId) || sessions[0],
    [selectedId]
  );

  const [secondsLeft, setSecondsLeft] = useState(selectedSession?.duration * 60 || 300);
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const [phase, setPhase] = useState("inhale");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(4);
  const PHASES = { inhale: 4, hold: 4, exhale: 6 };

  const breathingBlocked = isBreathingRestricted(userDisease);

  const ttsRef = useRef(new SpeechSynthesisUtterance());
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    ttsRef.current.text = text;
    ttsRef.current.lang = "en-US";
    ttsRef.current.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ttsRef.current);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const profileRes = await fetch("http://localhost:5000/api/users/profile/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile?.disease) setUserDisease(profile.disease);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft((selectedSession?.duration || 5) * 60);
    setPhase("inhale");
    setPhaseTimeLeft(PHASES.inhale);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, [selectedSession?.id]);

  useEffect(() => {
    if (!isRunning) return;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          finishSession();
          return 0;
        }

        const newVal = prev - 1;

        // countdown announcements
        if ([10, 5, 3, 2, 1].includes(newVal)) {
          speak(`${newVal} seconds left`);
        }

        // body scan / gratitude periodic guidance
        if (selectedSession?.id === "body-scan" && newVal % 30 === 0) {
          speak("Notice the sensations in your body, from head to toe.");
        }
        if (selectedSession?.id === "gratitude" && newVal % 40 === 0) {
          speak("Bring to mind something you are grateful for right now.");
        }

        return newVal;
      });

      // ✅ deep breathing cycle
      if (selectedSession?.id === "deep-breathing" && !breathingBlocked) {
        setPhaseTimeLeft((t) => {
          if (t <= 1) {
            if (secondsLeft <= 1) {
              speak("Session completed");
              return 0;
            }
            const nextPhase =
              phase === "inhale" ? "hold" : phase === "hold" ? "exhale" : "inhale";
            setPhase(nextPhase);
            speak(nextPhase === "inhale" ? "Inhale" : nextPhase === "hold" ? "Hold" : "Exhale");
            return PHASES[nextPhase];
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, breathingBlocked, selectedSession?.id, phase, secondsLeft]);

  const finishSession = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsRunning(false);
    speak("Session completed");
  };

  const startSession = () => {
    setIsRunning(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});
    if (selectedSession?.id === "body-scan" || selectedSession?.id === "gratitude") {
      speak("Welcome. Let's begin your practice. Follow the guidance calmly.");
    }
    if (selectedSession?.id === "deep-breathing" && !breathingBlocked) {
      speak("Inhale");
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
    if (audioRef.current) audioRef.current.pause();
  };

  const resetSession = () => {
    setIsRunning(false);
    setSecondsLeft((selectedSession?.duration || 5) * 60);
    setPhase("inhale");
    setPhaseTimeLeft(PHASES.inhale);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const dailyTip = useMemo(() => pickDailyTip(tips), []);

  return (
    <div className="meditation-container">
      <div className="meditation-tabs">
        <button
          className={`m-tab ${activeTab === "meditate" ? "active" : ""}`}
          onClick={() => setActiveTab("meditate")}
        >
          Meditation
        </button>
        <button
          className={`m-tab ${activeTab === "tips" ? "active" : ""}`}
          onClick={() => setActiveTab("tips")}
        >
          Mindfulness Tips
        </button>
      </div>

      {activeTab === "meditate" && (
        <div className="meditation-grid">
          <div className="sessions-list card">
            <h3 className="section-title">Guided Sessions</h3>
            <div className="session-items">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  className={`session-item ${selectedId === s.id ? "selected" : ""}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className="session-title">{s.title}</div>
                  <div className="session-meta">
                    {s.duration} min • {s.focus}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="player card">
            <h3 className="section-title">{selectedSession?.title}</h3>
            <p className="player-desc">{selectedSession?.description}</p>

            <audio ref={audioRef} src={selectedSession?.audio} preload="auto" />

            <div className="timer">{fmt(secondsLeft)}</div>
            {secondsLeft <= 10 && secondsLeft > 0 && (
              <div className="countdown">✨ Ending in {secondsLeft}s ✨</div>
            )}
            <div className="controls">
              {!isRunning ? (
                <button className="primary" onClick={startSession} disabled={secondsLeft <= 0}>
                  ▶ Start
                </button>
              ) : (
                <button className="secondary" onClick={pauseSession}>
                  ⏸ Pause
                </button>
              )}
              <button className="ghost" onClick={resetSession}>
                ⟲ Reset
              </button>
            </div>

            {selectedSession?.id === "deep-breathing" && !breathingBlocked && (
              <div className="breathing-wrapper">
                <div className={`breathing-circle ${phase}`} />
                <div className="phase">
                  {phase === "inhale" ? "Inhale" : phase === "hold" ? "Hold" : "Exhale"}
                </div>
                <div className="phase-timer">{phaseTimeLeft}s</div>
                <div className="phase-hint">Follow the circle: inhale → hold → exhale</div>
              </div>
            )}

            {selectedSession?.id !== "deep-breathing" && (
              <div className="ai-guidance">
                <p>🎧 Relax and listen to the guided instructions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "tips" && (
        <div className="tips card">
          <h3 className="section-title">Today’s Mindfulness Tip</h3>
          <p className="daily-tip">🧠 {dailyTip}</p>

          <h4 className="tips-subtitle">More Quick Prompts</h4>
          <ul className="tips-list">
            {tips.slice(0, 8).map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
