import { useState, useEffect } from 'react';
import ProtectedPage from './ProtectedPage';
import '../css/SafeHabitsLab.css';
import { ShieldCheck, Repeat, Eye } from 'lucide-react';
import DangerZoneCard from '../components/DangerZoneCard';
import dangerZones from '../data/dangerZones.json';

const oneSmallChanges = [
  "Wipe your phone daily.",
  "Open your windows for fresh air.",
  "Wash your hands before meals.",
  "Stretch for 5 minutes after waking up.",
  "Sanitize doorknobs once a day.",
  "Drink water as the first thing in the morning.",
  "Dust your desk before starting work.",
  "Keep your shoes at the door."
];

const SafeHabitsLab = () => {
  const [todayTip, setTodayTip] = useState('');
  const [done, setDone] = useState(false);
  const [randomDanger, setRandomDanger] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * oneSmallChanges.length);
    setTodayTip(oneSmallChanges[randomIndex]);

    const dangerIndex = Math.floor(Math.random() * dangerZones.length);
    setRandomDanger(dangerZones[dangerIndex]);
  }, []);

  return (
    <ProtectedPage>
      {/* ✅ Hero Header */}
      <div className="safehabits-hero">
        <ShieldCheck className="hero-icon" size={50} />
        <div className="hero-text">
          <h1>Safe Habits Lab</h1>
          <p>Smarter daily routines for disease prevention and a cleaner environment</p>
        </div>
      </div>

      <div className="habits-container">
        {/* 🔁 One Small Change */}
        <div className="habit-section-card">
          <div className="section-top">
            <Repeat className="section-icon-1" size={24} />
            <h2>One Small Change</h2>
          </div>
          <div className="tip-box">{todayTip}</div>
          <button
            className={`habit-action ${done ? 'done' : ''}`}
            onClick={() => setDone(true)}
            disabled={done}
          >
            {done ? '✅ Completed!' : '✔️ I did this'}
          </button>
        </div>

        {/* 👁️ Screen Time & Eye Health */}
        <div className="eye-section-wrapper">
          <div className="eye-section-container">
            {/* Left: Image */}
            <div className="eye-image-side">
              <img src="/assets/image.png" alt="Posture" className="eye-image-strict" />
            </div>

            {/* Right: Tips */}
            <div className="eye-info-side">
              <div className="eye-info-header">
                <Eye className="section-icon-1" size={24} />
                <h2>Screen Time & Eye Health</h2>
              </div>
              <ul className="eye-list-strict">
                <li>👁️ <strong>20-20-20 Rule:</strong> Look 20ft away for 20s every 20 mins</li>
                <li>💧 Blink often to avoid dry eyes</li>
                <li>🪟 Sit near natural light & reduce glare</li>
                <li>🧍‍♂️ Screen should be at eye level with a straight back</li>
                <li>🔵 Use night mode or blue light filter in the evening</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 🧼 What Not to Touch */}
        {randomDanger && (
          <div className="habit-section-card">
            <div className="section-top">
              <img src="/assets/virus.png" alt="Germ Icon" className="section-icon-1" width={24} />
              <h2>Common Germ Zones</h2>
            </div>
            <DangerZoneCard {...randomDanger} />
          </div>
        )}

        {/* 💪 Boost Your Immunity Section */}
        <div className="immunity-section-wrapper">
          <div className="immunity-section-container">
            {/* Left Image */}
            <div className="immunity-img-box">
              <img
                src="https://img.icons8.com/color/160/shield.png"
                alt="Immunity Shield"
                className="immunity-image"
              />
              <p className="immunity-img-caption">Strong immunity protects from infections</p>
            </div>

            {/* Right Info */}
            <div className="immunity-info-box">
              <div className="immunity-header">
                <h2>Boost Your Immunity</h2>
              </div>
              <ul className="immunity-tips-list">
                <li>🥦 Eat more green veggies, fruits, and citrus (Vitamin C)</li>
                <li>😴 Get 7–8 hours of quality sleep every night</li>
                <li>🚶‍♂️ Stay active: 30 mins of daily movement is enough</li>
                <li>💧 Drink enough water to flush toxins out</li>
                <li>🧘‍♀️ Manage stress through breathing or meditation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};

export default SafeHabitsLab;
