import React, { useEffect, useState, useRef } from "react";
import { auth } from "../firebase";
import "../css/nutrition.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Nutrition() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preference, setPreference] = useState("veg");
  const [profile, setProfile] = useState(null);   // ✅ hold user profile

  const plansRef = useRef();

  // ✅ fetch user profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile. Please complete setup.");
      }
    };
    fetchProfile();
  }, []);

  // fetch plan when preference or profile changes
  useEffect(() => {
    if (profile) {
      fetchPlan(preference);
    }
  }, [preference, profile]);

  const fetchPlan = async (vegPreference) => {
    if (!profile) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("http://localhost:5000/api/nutrition/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vegPreference,
          age: profile.age,        // ✅ pass profile info
          state: profile.state,
          disease: profile.disease,
        }),
      });

      const data = await res.json();
      if (res.ok) setPlan(data);
      else setError(data.error || "Failed to generate plan");
    } catch {
      setError("Network error while generating plan");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!plansRef.current) return;
    const canvas = await html2canvas(plansRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`diet-plan.pdf`);
  };

  return (
    <div className="nutrition-wrapper">
      <h1 className="title"> Personalized Diet Plan</h1>

      <div className="controls">
        <button 
          onClick={() => setPreference("veg")} 
          className={preference === "veg" ? "active" : ""}
        >
          Vegetarian
        </button>
        <button 
          onClick={() => setPreference("non-veg")} 
          className={preference === "non-veg" ? "active" : ""}
        >
          Non-Vegetarian
        </button>
        <button onClick={() => fetchPlan(preference)} disabled={loading}>
          {loading ? "Regenerating..." : "Regenerate Plan"}
        </button>
        <button onClick={downloadPDF} className="download-btn">
          📥 Download PDF
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="plan-card" ref={plansRef}>
        <h2>{preference === "veg" ? "Vegetarian Plan" : "Non-Vegetarian Plan"}</h2>

        {!plan ? (
          <div className="plan-empty">{loading ? "Loading..." : "No plan yet."}</div>
        ) : (
          <div className="plan-body">
            {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
              <div key={meal} className="meal-section">
                <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
                {plan[meal]?.length > 0 ? (
                  <ul>
                    {plan[meal].map((i, idx) => {
                      const isNonVeg = /chicken|fish|egg|mutton|meat|prawn/i.test(i.toLowerCase());
                      return (
                        <li key={idx} className={isNonVeg ? "nonveg-item" : ""}>
                          {i} {isNonVeg && <span className="nv-tag">Non-Veg</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No suggestions</p>
                )}
              </div>
            ))}

            <div className="avoid-section">
              <h3>Avoid</h3>
              {plan.avoid?.length > 0 ? (
                <ul>
                  {plan.avoid.map((a, idx) => (
                    <li key={idx} className="avoid-item">{a}</li>
                  ))}
                </ul>
              ) : (
                <p>None listed</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
