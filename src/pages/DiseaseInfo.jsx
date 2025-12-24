// src/pages/DiseaseInfo.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import diseaseInfo from "../data/diseaseInfo.json";  // <-- new JSON with prevention info
import diseaseLibrary from "../data/diseaseLibrary.json";
import injuries from "../data/injuries.json";
import "../css/diseaseInfo.css";

const DiseaseInfo = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [language, setLanguage] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [userDisease, setUserDisease] = useState(""); // will come from backend

  // Fetch user's disease from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserDisease(data.disease || "None");
    };

    fetchProfile();
  }, []);

  // Filtered Library & Injuries
  const filteredLibrary = Object.entries(diseaseLibrary).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInjuries = Object.entries(injuries).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="disease-container">
      {/* Tabs */}
      <div className="disease-header">
        <div className="tab-buttons">
          {userDisease && userDisease !== "None" && (
            <button
              className={activeTab === "my" ? "tab active" : "tab"}
              onClick={() => setActiveTab("my")}
            >
              My Condition
            </button>
          )}
          <button
            className={activeTab === "library" ? "tab active" : "tab"}
            onClick={() => setActiveTab("library")}
          >
            Disease Library
          </button>
          <button
            className={activeTab === "injuries" ? "tab active" : "tab"}
            onClick={() => setActiveTab("injuries")}
          >
            Injuries & First Aid
          </button>
        </div>

        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      {/* Search bar (not for "my") */}
      {activeTab !== "my" && (
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      <div className="disease-content">
        {/* My Condition (from backend) */}
        {/* My Condition (from backend) */}
{activeTab === "my" && userDisease !== "None" && (
  <div>
    <h2 className="section-title">{userDisease} – Prevention & Care</h2>
    {diseaseInfo[userDisease] ? (
      <>
        {/* Symptoms */}
        <div className="tip-section">
          <h3 className="sub-title">Symptoms</h3>
          <ul>
            {diseaseInfo[userDisease].symptoms?.[language]?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Prevention */}
        <div className="tip-section">
          <h3 className="sub-title">Prevention</h3>
          <ul>
            {diseaseInfo[userDisease].prevention?.[language]?.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Avoid */}
        <div className="tip-section avoid">
          <h3 className="sub-title">Avoid</h3>
          <ul>
            {diseaseInfo[userDisease].avoid?.[language]?.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        {/* Lifestyle */}
        <div className="tip-section">
          <h3 className="sub-title">Lifestyle</h3>
          <ul>
            {diseaseInfo[userDisease].lifestyle?.[language]?.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      </>
    ) : (
      <p>No prevention info available for {userDisease}</p>
    )}
  </div>
)}


        {/* Disease Library */}
        {activeTab === "library" && (
          <div>
            {filteredLibrary.map(([name, data]) => (
              <div key={name} className="card">
                <h2 className="card-title">{name}</h2>
                <p>{data.description[language]}</p>

                <div className="tip-section">
                  <h3 className="sub-title">Symptoms</h3>
                  <ul>
                    {data.symptoms[language]?.map((symptom, i) => (
                      <li key={i}>{symptom}</li>
                    ))}
                  </ul>
                </div>

                <div className="tip-section">
                  <h3 className="sub-title">Home Remedies</h3>
                  <ul>
                    {data.homeRemedies[language]?.map((remedy, i) => (
                      <li key={i}>{remedy}</li>
                    ))}
                  </ul>
                </div>

                <div className="tip-section avoid">
                  <h3 className="sub-title">Avoid</h3>
                  <ul>
                    {data.avoid[language]?.map((thing, i) => (
                      <li key={i}>{thing}</li>
                    ))}
                  </ul>
                </div>

                <div className="tip-section doctor-warning">
                  <h3 className="sub-title">Consult Doctor When</h3>
                  <ul>
                    {data.consultDoctorWhen[language]?.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Injuries */}
        {activeTab === "injuries" && (
          <div>
            {filteredInjuries.map(([name, data]) => (
              <div key={name} className="card">
                <h2 className="card-title">{name}</h2>
                <h3 className="sub-title">Do:</h3>
                <ul>
                  {data.do[language]?.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
                <h3 className="sub-title">Avoid:</h3>
                <ul>
                  {data.avoid[language]?.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseInfo;
