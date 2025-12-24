import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/landing.css";
import { HeartPulse, Brain, ShieldCheck, Smile } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register"); // Change if your register route is different
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo-section">
          <img src="/assets/logo.png" alt="Logo" className="landing-logo" />
        </div>
        <div className="landing-nav-buttons">
          <button
            className="landing-btn-outline"
            onClick={() => navigate("/SignIn")}
          >
            Sign In
          </button>
          <button className="landing-btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-hero-title">
          One Platform for Every Way of Wellness
        </h1>
        <p className="landing-hero-subtitle">
          From physical fitness to mental health, hygiene to immunity — we’ve
          got you covered. Your all-in-one solution to live a healthier, happier
          life.
        </p>
        <div className="landing-hero-buttons">
          <button className="landing-btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="landing-btn-outline">Learn More</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-feature-card">
          <HeartPulse size={48} color="red" />
          <h3 className="landing-feature-title">Physical Health</h3>
          <p className="landing-feature-text">
            Workouts, nutrition tips, and medical resources to keep your body
            strong.
          </p>
        </div>

        <div className="landing-feature-card">
          <Brain size={48} color="purple" />
          <h3 className="landing-feature-title">Mental Wellness</h3>
          <p className="landing-feature-text">
            Meditation, therapy access, and stress management techniques.
          </p>
        </div>

        <div className="landing-feature-card">
          <ShieldCheck size={48} color="green" />
          <h3 className="landing-feature-title">Hygiene & Immunity</h3>
          <p className="landing-feature-text">
            Guides for hygiene practices and boosting your immunity.
          </p>
        </div>

        <div className="landing-feature-card">
          <Smile size={48} color="gold" />
          <h3 className="landing-feature-title">Lifestyle</h3>
          <p className="landing-feature-text">
            Healthy habits, routines, and preventive healthcare guidance.
          </p>
        </div>
      </section>

      {/* Footer / Call to Action */}
      <footer className="landing-footer">
        <h2 className="landing-footer-title">
          Start Your Wellness Journey Today
        </h2>
        <p className="landing-footer-subtitle">
          Join thousands who are transforming their lives with HealthSphere.
        </p>
        <button className="landing-btn-primary" onClick={handleGetStarted}>
          Get Started
        </button>
      </footer>
    </div>
  );
}
