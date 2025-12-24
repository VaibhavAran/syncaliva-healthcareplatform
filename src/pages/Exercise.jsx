import React, { useEffect, useState, useRef } from "react";
import workoutsData from "../data/workouts.json";
import yogaData from "../data/yoga.json";
import "../css/exercise.css";

function getAgeGroup(age) {
  if (age < 13) return "child";
  if (age < 20) return "teen";
  if (age < 60) return "adult";
  return "senior";
}

function getWorkouts(profile) {
  const ageGroup = getAgeGroup(profile.age);
  const disease = profile.disease || "None";
  return workoutsData?.[ageGroup]?.[disease] || workoutsData?.[ageGroup]?.["None"] || [];
}

function getYoga(profile) {
  const ageGroup = getAgeGroup(profile.age);
  const disease = profile.disease || "None";
  return yogaData?.[ageGroup]?.[disease] || yogaData?.[ageGroup]?.["None"] || [];
}

// 🔊 Voice
function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  msg.voice =
    voices.find((v) => v.name?.includes("Google UK English Female")) ||
    voices.find((v) => v.name?.includes("Microsoft Aria")) ||
    voices[0];
  msg.pitch = 1;
  msg.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

export default function Exercise() {
  const [userProfile] = useState({ age: 22, disease: "None" });
  const [workouts, setWorkouts] = useState([]);
  const [yogaList, setYogaList] = useState([]);
  const [tab, setTab] = useState("workout");

  const [sessionOpen, setSessionOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const timerRef = useRef(null);
  const REST_TIME = 20;

  useEffect(() => {
    setWorkouts(getWorkouts(userProfile));
    setYogaList(getYoga(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (!sessionOpen || isPaused || sessionComplete) return;

    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && sessionOpen) {
      const list = activeSection === "workout" ? workouts : yogaList;

      if (isRest) {
        if (currentIndex < list.length) {
          const ex = list[currentIndex];
          setIsRest(false);
          setTimeLeft(ex.duration);
          speak(`Start ${ex.name}`);
        } else finishSession();
      } else {
        if (currentIndex < list.length - 1) {
          setIsRest(true);
          setCurrentIndex((i) => i + 1);
          setTimeLeft(REST_TIME);
          speak(`Rest now. Up next ${list[currentIndex + 1].name}`);
        } else finishSession();
      }
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isPaused, isRest, sessionOpen, sessionComplete, currentIndex, activeSection, workouts, yogaList]);

  const startSession = (section) => {
    const list = section === "workout" ? workouts : yogaList;
    if (!list.length) return;

    setActiveSection(section);
    setCurrentIndex(0);
    setTimeLeft(list[0].duration);
    setIsRest(false);
    setSessionComplete(false);
    setIsPaused(false);
    setSessionOpen(true);
    speak(`Starting ${section}. First: ${list[0].name}`);
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
    speak(isPaused ? "Resumed" : "Paused");
  };

  const skipExercise = () => {
    const list = activeSection === "workout" ? workouts : yogaList;

    if (!isRest) {
      if (currentIndex < list.length - 1) {
        setIsRest(true);
        setCurrentIndex((i) => i + 1);
        setTimeLeft(REST_TIME);
        speak(`Skipped. Rest now. Up next ${list[currentIndex + 1].name}`);
      } else finishSession();
    } else {
      if (currentIndex < list.length) {
        const ex = list[currentIndex];
        setIsRest(false);
        setTimeLeft(ex.duration);
        speak(`Start ${ex.name}`);
      } else finishSession();
    }
  };

  const finishSession = () => {
    speak(`Well done! You finished your ${activeSection} session.`);
    setSessionComplete(true);
    setTimeLeft(0);
    setIsRest(false);
  };

  const closeSession = () => {
    window.speechSynthesis.cancel();
    setSessionOpen(false);
    setActiveSection(null);
    setCurrentIndex(0);
    setTimeLeft(0);
    setIsRest(false);
    setSessionComplete(false);
  };

  const listForTab = tab === "workout" ? workouts : yogaList;
  const activeList = activeSection === "workout" ? workouts : yogaList;
  const currentExercise = activeList[currentIndex] || {};
  const progressPct =
    activeList.length === 0
      ? 0
      : ((currentIndex + (isRest ? 0 : 1)) / activeList.length) * 100;

  return (
    <div className="exercise-container">
      <h1 className="page-title">Your Personalised Exercise and Yoga</h1>

      {/* Tabs + Start button row */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={tab === "workout" ? "active" : ""}
            onClick={() => setTab("workout")}
          >
            🏋️ Workouts
          </button>
          <button
            className={tab === "yoga" ? "active" : ""}
            onClick={() => setTab("yoga")}
          >
            🧘 Yoga
          </button>
        </div>
        <button className="start-btn-row" onClick={() => startSession(tab)}>
          Start {tab === "workout" ? "Workouts" : "Yoga"}
        </button>
      </div>

      {/* Cards */}
      <div className="exercise-grid">
        {listForTab.map((item, i) => (
          <div key={i} className="exercise-card">
            <div className="card-head">
              <h3>{item.name}</h3>
              <span className="badge">{item.duration}s</span>
            </div>
            {item.description && <p className="desc">{item.description}</p>}
          </div>
        ))}
      </div>

      {/* Session Modal */}
      {sessionOpen && (
        <div className="session-modal">
          <div className="session-card xl">
            <button className="close-btn" onClick={closeSession}>
              ✖
            </button>

            {!sessionComplete && (
              <div className="session-top">
                <div className="progress-mini">
                  <div
                    className="progress-mini-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="step-count">
                  {Math.min(currentIndex + (isRest ? 0 : 1), activeList.length)} / {activeList.length}
                </div>
              </div>
            )}

            {sessionComplete ? (
              <>
                <h2 className="done-title">🎉 Well Done!</h2>
                <p className="done-sub">You completed your {activeSection} session.</p>
              </>
            ) : isRest ? (
              <>
                <h2 className="title">⏸ Rest</h2>
                <p className="subtitle">
                  Up Next: <b>{activeList[currentIndex]?.name || "Done"}</b>
                </p>
              </>
            ) : (
              <>
                <h2 className="title">{currentExercise.name}</h2>
                {currentExercise.description && (
                  <p className="subtitle">{currentExercise.description}</p>
                )}
              </>
            )}

            <div className="big-timer">{timeLeft}s</div>

            {!sessionComplete && (
              <>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="controls">
                  <button onClick={togglePause} className="btn pause">
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button onClick={skipExercise} className="btn skip">
                    Skip
                  </button>
                  <button onClick={finishSession} className="btn end">
                    End
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
