import React from "react";
import '../css/Home.css';
import { Link } from "react-router-dom";
import {
  FaBullseye,
  FaTrophy,
  FaCalendarCheck,
  FaGlassWhiskey,
  FaDumbbell,
  FaBrain,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="home-container">
      {/* Top Header Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Your <span className="highlight">Health Journey</span> Starts Here
        </h1>
        <p className="hero-subtext">
          Build healthy habits through engaging, personalized experiences.
          <br />
          <strong>Prevention</strong> is your superpower.
        </p>
      </section>

      {/* Section Cards */}
      <section className="section-grid">
        {/* Section 1 */}
        <div className="section-card blue">
          <h2>Body Shield</h2>
          <p className="tag">Physical Health</p>
          <p>Mood-based workouts, nutrition plans, and posture guidance</p>
          <div className="tags">
            <span>Workout Generator</span>
            <span>Diet Plans</span>
            <span>Posture Tips</span>
          </div>
          <Link to="/body-shield" className="explore-button">
            Explore →
          </Link>
        </div>

        {/* Section 2 */}
        <div className="section-card purple">
          <h2>Mind Mirror</h2>
          <p className="tag">Mental Wellness</p>
          <p>Personal diary, chat bot, and mindfulness exercises</p>
          <div className="tags">
            <span>Mood Diary</span>
            <span>Mental Health Chat</span>
            <span>Calm Room</span>
            <span>Guided Yoga</span>
          </div>
          <Link to="/mind-mirror" className="explore-button">
            Explore →
          </Link>
        </div>

        {/* Section 3 */}
        <div className="section-card orange1">
          <h2>Symptom Radar</h2>
          <p className="tag">Early Detection</p>
          <p>Daily health checks and symptom awareness tools</p>
          <div className="tags">
            <span>Daily Check-ups</span>
            <span>Disease info</span>
            <span>Symptoms info</span>
          </div>
          <Link to="/symptom-radar" className="explore-button">
            Explore →
          </Link>
        </div>

        {/* Section 4 */}
        <div className="section-card green1">
          <h2>Safe Habits</h2>
          <p className="tag">Hygiene & Environment</p>
          <p>Hygiene and environmental health awareness</p>
          <div className="tags">
            <span>Eye Health</span>
            <span>immunity boost</span>
            <span>Touch Risk Guide</span>
          </div>
          <Link to="/safe-habits-lab" className="explore-button">
            Explore →
          </Link>
        </div>

        
      </section>

      {/* Health Impact Highlights */}
<section className="impact-section">
  <h2>💡 Why Daily Prevention Matters</h2>
  <p className="impact-subtext">
    Small steps today prevent big problems tomorrow. Here's what consistent self-care can do:
  </p>
  <div className="impact-grid">
    <div className="impact-card">
      <FaBullseye className="impact-icon" />
      <h3>87% Lower Risk</h3>
      <p>of lifestyle-related diseases through habit building.</p>
    </div>
    <div className="impact-card">
      <FaCalendarCheck className="impact-icon" />
      <h3>5 mins a Day</h3>
      <p>is all it takes to stay in tune with your body and mind.</p>
    </div>
    <div className="impact-card">
      <FaTrophy className="impact-icon" />
      <h3>Feel the Progress</h3>
      <p>Trackable improvements that keep you motivated every week.</p>
    </div>
  </div>
</section>

    </div>
  );
};

export default Home;
