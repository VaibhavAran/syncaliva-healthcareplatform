// src/pages/SignIn.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import "../css/auth.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const saveToken = async (user) => {
    const token = await user.getIdToken();
    localStorage.setItem("token", token);
  };

  const checkProfileExists = async (user) => {
  const token = await user.getIdToken();
  const res = await fetch("http://localhost:5000/api/users/profile/check", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.exists;
};

const handleEmailSignIn = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveToken(userCredential.user);

    const exists = await checkProfileExists(userCredential.user);
    navigate(exists ? "/home" : "/profile-setup");
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      setError("User not found. Please register first.");
    } else {
      setError(err.message);
    }
  }
};

const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await saveToken(userCredential.user);

    const exists = await checkProfileExists(userCredential.user);
    navigate(exists ? "/home" : "/profile-setup");
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleEmailSignIn}>
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
        <button type="submit" className="email-btn">
          Sign In with Email
        </button>
      </form>

      <button onClick={handleGoogleSignIn} className="google-btn">
        <img
          src="/assets/google-icon.png"
          alt="Google Icon"
          className="google-icon"
        />
        Sign In with Google
      </button>

      <p className="switch-auth">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
