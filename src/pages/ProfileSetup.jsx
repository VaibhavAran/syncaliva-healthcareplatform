// src/pages/ProfileSetup.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const indianStates = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
    "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
    "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
    "Uttarakhand","West Bengal","Andaman and Nicobar Islands",
    "Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
    "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
  ];

  const diseaseOptions = [
    "None","Diabetes","Hypertension (High BP)","Asthma","Obesity",
    "Heart Disease","Thyroid Disorder","PCOS / PCOD","Arthritis",
    "Acidity / GERD","Anemia","Migraine","Depression / Anxiety",
    "Cholesterol Issues","Kidney Disease","Liver Disease", "Physically Disabled"
  ];

  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/users/profile/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.exists) {
        navigate("/home");
      } else {
        setLoading(false);
      }
    };
    checkProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await auth.currentUser.getIdToken();
    await fetch("http://localhost:5000/api/users/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, state, age, disease }),
    });
    navigate("/home");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <style>{`
        form { max-width:400px;margin:40px auto;padding:25px;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);display:flex;flex-direction:column;gap:15px;}
        input, select { padding:10px 12px;border:1px solid #ccc;border-radius:8px;font-size:14px;outline:none;transition:all 0.2s;}
        input:focus, select:focus { border-color:#4CAF50;box-shadow:0 0 6px rgba(76,175,80,0.4);}
        button { padding:12px;background:linear-gradient(135deg,#4CAF50,#2E7D32);color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;transition:background 0.3s, transform 0.2s;}
        button:hover { background:linear-gradient(135deg,#45A049,#1B5E20); transform:translateY(-2px);}
      `}</style>

      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" onChange={(e)=>setName(e.target.value)} required/>
        <select value={state} onChange={(e)=>setState(e.target.value)} required>
          <option value="">Select State</option>
          {indianStates.map((st, idx)=><option key={idx} value={st}>{st}</option>)}
        </select>
        <input
  type="number"
  placeholder="Age"
  min="1"
  max="120"
  onChange={(e) => setAge(e.target.value)}
  required
/>

        <select value={disease} onChange={(e)=>setDisease(e.target.value)} required>
          <option value="">Select Disease</option>
          {diseaseOptions.map((d, idx)=><option key={idx} value={d}>{d}</option>)}
        </select>
        <button type="submit">Save Profile</button>
      </form>
    </>
  );
}
