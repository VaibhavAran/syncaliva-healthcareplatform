// src/pages/Register.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/register.css"; 
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkProfileExists = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5000/api/users/profile/check", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.exists;
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/profile-setup"); // always new users go to profile setup
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please sign in.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = getAdditionalUserInfo(result);

      if (isNewUser) {
        navigate("/profile-setup");
      } else {
        const exists = await checkProfileExists();
        navigate(exists ? "/home" : "/profile-setup");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleEmailRegister}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register with Email</button>
      </form>

      <button onClick={handleGoogleRegister} className="google-btn">
        <img src="/assets/google-icon.png" alt="Google Icon" className="google-icon" />
        Register with Google
      </button>

      <p className="signin-text">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}
