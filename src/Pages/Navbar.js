import React, { useState, useContext } from "react";
import { FaUser, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserContext from "../UserContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleProfile = () => setProfileOpen(prev => !prev);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/assets/logo.png" alt="Syncaliva Logo" className="logo-img" />
        </div>
      </div>

      <div className="navbar-center">
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/body-shield")}>Body Shield</li>
          <li onClick={() => navigate("/mind-mirror")}>Mind Mirror</li>
          <li onClick={() => navigate("/symptom-radar")}>Symptom Radar</li>
          <li onClick={() => navigate("/safe-habits-lab")}>Safe Habits</li>
        </ul>
      </div>

      <div className="navbar-right">
        <div className="hamburger-menu" onClick={toggleMenu}>
          <FaBars />
        </div>
        <div className="user-container">
          <div className="user-icon" onClick={toggleProfile} aria-label="User Profile">
            <FaUser />
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              {user ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                <>
                  <button onClick={() => navigate("/signin")}>Sign In</button>
                  <button onClick={() => navigate("/signup")}>Sign Up</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
