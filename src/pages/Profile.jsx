// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import "../css/dashboard.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        if (!auth.currentUser) {
          throw new Error("User not authenticated");
        }

        const token = await auth.currentUser.getIdToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.replace("/");
    } catch (err) {
      alert("Logout failed. Try again.");
    }
  };

  if (loading) return <p className="status-text">Loading profile...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-info-section">
          <h2>{profile?.name || "User"}</h2>
          <p>{auth.currentUser?.email}</p>

          <p>
            <strong>State:</strong> {profile?.state || "Not specified"}
          </p>
          <p>
            <strong>Age:</strong> {profile?.age || "Not specified"}
          </p>
          <p>
            <strong>Disease:</strong> {profile?.disease || "None"}
          </p>

          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
