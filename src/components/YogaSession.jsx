import { useEffect, useState, useRef } from "react";

const yogaSequence = [
  {
    title: "Deep Breathing",
    duration: 60,
    video: "/assets/deep-breathing.mp4",
  },
  {
    title: "Seated Forward Bend",
    duration: 60,
    video: "/assets/seated-forward.mp4",
  },
  {
    title: "Child’s Pose",
    duration: 60,
    video: "/assets/child-pose.mp4",
  },
  {
    title: "Cobra Stretch",
    duration: 60,
    video: "/assets/cobra-stretch.mp4",
  },
  {
    title: "Humming Bee Breath",
    duration: 45,
    video: "/assets/humming.mp4",
  },
  {
    title: "Tree Pose",
    duration: 45,
    video: "/assets/tree-pose.mp4",
  },
];

const YogaSession = ({ onClose }) => {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(yogaSequence[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const speechRef = useRef(null);

  useEffect(() => {
    if (!isRunning || sessionCompleted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 6) speak("5 seconds remaining");
        if (prev === 1) {
          if (index >= yogaSequence.length - 1) {
            speak("Yoga session complete");
          }
        }

        if (prev <= 1) {
          clearInterval(timer);
          if (index < yogaSequence.length - 1) {
            const nextIndex = index + 1;
            setIndex(nextIndex);
            setSecondsLeft(yogaSequence[nextIndex].duration);
          } else {
            setSessionCompleted(true);
            setIsRunning(false);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, index, sessionCompleted]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
      speechRef.current = msg;
    }
  };

  const startSession = () => {
    if (sessionCompleted) return;
    setIsRunning(true);
    setHasStarted(true);
    speak(`Starting: ${yogaSequence[index].title}`);
  };

  const pauseSession = () => {
    setIsRunning(false);
    window.speechSynthesis.cancel();
  };

  const stopSession = () => {
    setIsRunning(false);
    setHasStarted(false);
    setSessionCompleted(false);
    setIndex(0);
    setSecondsLeft(yogaSequence[0].duration);
    window.speechSynthesis.cancel();
  };

  const skipPose = () => {
    if (index < yogaSequence.length - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setSecondsLeft(yogaSequence[nextIndex].duration);
      speak(`Skipping to: ${yogaSequence[nextIndex].title}`);
    } else {
      setSessionCompleted(true);
      setIsRunning(false);
      speak("Yoga session complete");
    }
  };

  const isTreePose = yogaSequence[index].title === "Tree Pose";

  return (
    <div className="yoga-session-overlay">
      <button className="exit-btn" onClick={onClose}>
        ❌
      </button>

      <div className="yoga-session-content">
        {sessionCompleted ? (
          <div className="completion-message">
            <h2>🎉 Session Completed!</h2>
            <p>Great job on completing your mindful movement. Stay healthy!</p>
          </div>
        ) : (
          <>
            <h2>{yogaSequence[index].title}</h2>

            <video
              key={index}
              src={yogaSequence[index].video}
              className={`yoga-media ${isTreePose ? "tree-pose-video" : ""}`}
              loop
              muted
              autoPlay
              playsInline
            />


            <div className="timer">{secondsLeft}s</div>

            <div className="controls">
              {!hasStarted ? (
                <button onClick={startSession}>▶️ Start</button>
              ) : (
                <>
                  {isRunning ? (
                    <button onClick={pauseSession}>⏸️ Pause</button>
                  ) : (
                    <button onClick={startSession}>▶️ Resume</button>
                  )}
                  <button onClick={stopSession}>⏹️ Stop</button>
                  <button onClick={skipPose}>⏭️ Skip</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YogaSession;
