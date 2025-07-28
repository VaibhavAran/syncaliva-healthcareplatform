import React, { useState } from "react";
import ProtectedPage from "./ProtectedPage";
import {
  ChevronDown,
  ChevronUp,
  HeartPulse,
  MapPin,
  Zap,
  Salad,
} from "lucide-react";
import "../css/BodyShield.css";
import workoutData from "../data/workouts.json";
import dietData from "../data/dietPlans.json";

const BodyShield = () => {
  const [showWorkout, setShowWorkout] = useState(false);
  const [showDiet, setShowDiet] = useState(false);

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [generatedWorkout, setGeneratedWorkout] = useState(null);

  const [selectedState, setSelectedState] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [generatedDiet, setGeneratedDiet] = useState(null);

  const moods = ["Lazy", "Energetic", "Stressed", "Angry", "Happy"];
  const times = [
    "5 minutes",
    "10 minutes",
    "15 minutes",
    "20 minutes",
    "30 minutes",
  ];
  const states = [
    "Maharashtra",
    "Kerala",
    "Punjab",
    "Gujarat",
    "Tamil Nadu",
    "West Bengal",
    "Rajasthan",
    "Karnataka",
    "Andhra Pradesh",
    "Assam",
    "Uttar Pradesh",
    "Odisha",
    "Goa",
    "Bihar",
  ];

  const foodTypes = ["Veg", "Non-Veg"];

  const handleGenerateWorkout = () => {
    const key = `${selectedMood}-${selectedTime}`;
    const plan = workoutData[key];
    setGeneratedWorkout(plan || null);
  };

  const handleGenerateDiet = () => {
    const key = `${selectedState}-${selectedFoodType}`;
    const plan = dietData[key];
    setGeneratedDiet(plan || null);
  };

  return (
    <ProtectedPage>
      <div className="bodyshield-hero">
        <span className="hero-icon">🛡️</span>
        <h1 className="hero-title">Body Shield</h1>
        <p className="hero-subtitle">
          Your journey to better health starts here!
        </p>
        <div className="star-rating">⭐ ⭐ ⭐ ⭐ ⭐</div>
      </div>

      <div className="bodyshield-page">
        {/* WORKOUT GENERATOR */}
        <div className="feature-card orange">
          <div className="feature-content">
            <HeartPulse size={32} />
            <div>
              <h2>Mood & Time Workout Generator</h2>
              <p>
                Stressed? Lazy? Got 10 mins? Let us suggest the right moves!
              </p>
              <button onClick={() => setShowWorkout(!showWorkout)}>
                Let's Do It! {showWorkout ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </div>

          <div className={`expand-container ${showWorkout ? "show" : ""}`}>
            <div className="expand-box">
              <label>How are you feeling?</label>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
              >
                <option value="">Select your mood</option>
                {moods.map((mood) => (
                  <option key={mood} value={mood}>
                    {mood}
                  </option>
                ))}
              </select>

              <label>How much time do you have?</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select time</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <button
                className="generate-btn"
                onClick={handleGenerateWorkout}
                disabled={!selectedMood || !selectedTime}
              >
                Generate My Workout!
              </button>

              {generatedWorkout && (
                <div className="workout-result improved">
                  <h3>{generatedWorkout.title}</h3>
                  <p className="duration">
                    ⏱ Duration: {generatedWorkout.duration}
                  </p>
                  <div className="exercise-grid">
                    {generatedWorkout.exercises.map((ex, idx) => (
                      <div className="exercise-card" key={idx}>
                        <div className="exercise-name">
                          <Zap size={16} /> {ex.name || ex}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DIET EXPLORER */}
        <div className="feature-card green">
          <div className="feature-content">
            <MapPin size={32} />
            <div>
              <h2>Indian States Diet Explorer</h2>
              <p>
                Local food, local strength! Explore your state's health secrets.
              </p>
              <button onClick={() => setShowDiet(!showDiet)}>
                Let's Explore! {showDiet ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
          </div>

          <div className={`expand-container ${showDiet ? "show" : ""}`}>
            <div className="expand-box">
              <label>Select your state:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Choose a state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <label>Select food type:</label>
              <select
                value={selectedFoodType}
                onChange={(e) => setSelectedFoodType(e.target.value)}
              >
                <option value="">Choose type</option>
                {foodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <button
                className="generate-btn green"
                onClick={handleGenerateDiet}
                disabled={!selectedState || !selectedFoodType}
              >
                Show Diet Plan!
              </button>

              {generatedDiet && (
                <div className="diet-result">
                  <h3>
                    {generatedDiet.state} - {generatedDiet.type} Diet
                  </h3>
                  {["breakfast", "lunch", "evening", "dinner"].map((meal) => (
                    <div className="meal-block" key={meal}>
                      <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}:</h4>
                      <ul>
                        {generatedDiet[meal].map((item, idx) => (
                          <li key={idx}>
                            <Salad size={16} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* POSTURE */}
        <div className="feature-card posture">
          <h2 className="posture-title">🧘 Posture Tips</h2>
          <div className="posture-section">
            <div className="posture-box standing">
              <img
                src="/assets/Standing-position.png"
                alt="Standing Posture"
                className="posture-image"
              />
              <div className="posture-header">Standing Posture</div>
              <ul>
                <li>💙 Keep your head up and shoulders back</li>
                <li>💙 Distribute weight evenly on both feet</li>
                <li>💙 Keep knees slightly bent</li>
                <li>💙 Engage your core muscles</li>
              </ul>
            </div>

            <div className="posture-box sitting">
              <img
                src="/assets/sitting-position.png"
                alt="Sitting Posture"
                className="posture-image"
              />
              <div className="posture-header">Sitting Posture</div>
              <ul>
                <li>💚 Keep feet flat on the floor</li>
                <li>💚 Back straight against chair</li>
                <li>💚 Monitor at eye level</li>
                <li>💚 Take breaks every 30 minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default BodyShield;
