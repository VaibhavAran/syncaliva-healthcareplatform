import ProtectedPage from "./ProtectedPage";
import "../css/MindMirror.css";
import { useState, useEffect } from "react";
import DiarySection from "../components/DiarySection";
import CalmRoom from "../components/CalmRoom";
import YogaSession from "../components/YogaSession";
import Chatbot from "../components/Chatbot";

const MindMirror = () => {
  const [showDiary, setShowDiary] = useState(false);
  const [showCalmRoom, setShowCalmRoom] = useState(false);
  const [showYoga, setShowYoga] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // ✅ chatbot toggle

  const [breathPhase, setBreathPhase] = useState("Breathe In");
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let countdown;
    let breathInterval;
    const breathPhases = ["Breathe In", "Hold", "Breathe Out", "Hold"];
    let index = 0;

    if (isRunning && showCalmRoom) {
      setBreathPhase(breathPhases[index]);

      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            clearInterval(breathInterval);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      breathInterval = setInterval(() => {
        index = (index + 1) % breathPhases.length;
        setBreathPhase(breathPhases[index]);
      }, 4000);
    }

    return () => {
      clearInterval(countdown);
      clearInterval(breathInterval);
    };
  }, [isRunning, showCalmRoom]);

  useEffect(() => {
    document.body.style.overflow = showCalmRoom || showYoga ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCalmRoom, showYoga]);

  const showPopupMessage = (text) => {
    setMessage(text);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage("");
    }, 3000);
  };

  const startCalmRoom = () => {
    setShowCalmRoom(true);
    setTimer(60);
    setIsRunning(false);
    setBreathPhase("Breathe In");
  };

  return (
    <ProtectedPage>
      <div
        className="mind-mirror-container"
        style={{ display: showCalmRoom || showYoga ? "none" : "block" }}
      >
        {showMessage && <div className="popup-message">{message}</div>}

        <h1 className="main-title">🪞 Mind Mirror</h1>
        <p className="subtitle">
          Your personal sanctuary for mental wellness, self-reflection, and inner peace.
        </p>

        <div className="section-card purple">
          <div className="section-icon">✍️</div>
          <h2>Personal Diary</h2>
          <p>
            Reflect on your day, track emotions, and keep your thoughts secure.
          </p>
          <button
            className="action-button"
            onClick={() => setShowDiary(!showDiary)}
          >
            📝 Write My Diary
          </button>

          {showDiary && <DiarySection showPopupMessage={showPopupMessage} />}
        </div>

        <div className="section-card blue">
          <div className="section-icon">🕊️</div>
          <h2>Calm Room</h2>
          <p>
            Enter a peaceful space with breathing exercises and relaxing sounds.
          </p>
          <button className="action-button" onClick={startCalmRoom}>
            🧘 Enter Calm Room
          </button>
        </div>

        <div className="section-card green">
          <div className="section-icon">🧘‍♀️</div>
          <h2>Guided Mindful Movement</h2>
          <p>
            Yoga poses for stress relief and clarity, with breathing guidance.
          </p>
          <button className="action-button green" onClick={() => setShowYoga(true)}>
            ▶️ Start Guided Session
          </button>

          <div className="yoga-poses">
            <div className="pose-card">
              Deep Breathing
              <br />
              <span>60s</span>
            </div>
            <div className="pose-card">
              Seated Forward Bend
              <br />
              <span>60s</span>
            </div>
            <div className="pose-card">
              Child's Pose
              <br />
              <span>60s</span>
            </div>
            <div className="pose-card">
              Cobra Stretch
              <br />
              <span>60s</span>
            </div>
            <div className="pose-card">
              Humming Bee Breath
              <br />
              <span>45s</span>
            </div>
            <div className="pose-card">
              Tree Pose
              <br />
              <span>45s</span>
            </div>
          </div>
        </div>

        {/* Chatbot icon (click to toggle) */}
        <div
          className="chatbot-icon"
          onClick={() => setShowChatbot((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          💬
        </div>

        {/* Chatbot display */}
        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </div>

      {/* Calm Room Fullscreen */}
      {showCalmRoom && (
        <CalmRoom
          timer={timer}
          isRunning={isRunning}
          breathPhase={breathPhase}
          onStart={() => setIsRunning(true)}
          onPause={() => setIsRunning(false)}
          onStop={() => {
            setIsRunning(false);
            setTimer(60);
            setBreathPhase("Breathe In");
          }}
          onExit={() => {
            setIsRunning(false);
            setShowCalmRoom(false);
            setTimer(60);
          }}
        />
      )}

      {/* Yoga Session Fullscreen */}
      {showYoga && (
        <YogaSession
          onClose={() => {
            setShowYoga(false);
          }}
        />
      )}
    </ProtectedPage>
  );
};

export default MindMirror;
