// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import "../css/dashboard.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;

      const token = await auth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/"; // redirect to landing page
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-info-section">
          <h2>{profile.name}</h2>
          <p>{auth.currentUser.email}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Disease:</strong> {profile.disease || "None"}</p>
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}
