// components/CalmRoom.jsx
import { useEffect, useRef } from "react";

const CalmRoom = ({
  timer,
  isRunning,
  breathPhase,
  onStart,
  onPause,
  onStop,
  onExit,
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isRunning) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isRunning]);

  return (
    <>
      <div className="fullscreen-overlay"></div>
      <div className="calm-room fullscreen">
        <button className="exit-btn" onClick={onExit}>
          ❌
        </button>

        <div className="breathing-wrapper">
          <div className="breathing-circle">{breathPhase}</div>
        </div>

        <div className="timer-display">⏱️ {timer}s</div>

        {!isRunning ? (
          <button onClick={onStart} className="calm-button">
            ▶️ Start
          </button>
        ) : (
          <div className="calm-controls">
            <button onClick={onPause} className="calm-button">
              ⏸️ Pause
            </button>
            <button onClick={onStop} className="calm-button">
              ⏹️ Stop
            </button>
          </div>
        )}

        <audio ref={audioRef} loop>
          <source
            src="/assets/music.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>
    </>
  );
};

export default CalmRoom;
