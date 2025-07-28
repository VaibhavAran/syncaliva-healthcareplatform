import { useState, useEffect } from 'react';
import ProtectedPage from './ProtectedPage';
import symptomData from '../data/Symptoms.json';
import '../css/SymptomRadar.css';

const SymptomRadar = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [selectedDisease, setSelectedDisease] = useState('');
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [language, setLanguage] = useState('en');

  const questions = [
    { key: 'fever', text: "Do you have a fever or chills?" },
    { key: 'fatigue', text: "Are you experiencing unusual fatigue?" },
    { key: 'cough', text: "Do you have a sore throat or dry cough?" },
    { key: 'bodypain', text: "Any muscle pain or body ache?" },
    { key: 'smell', text: "Have you lost your sense of taste or smell?" },
    { key: 'breath', text: "Are you experiencing shortness of breath?" },
    { key: 'headache', text: "Do you have a headache or pressure in the head?" },
    { key: 'nausea', text: "Any nausea, vomiting, or loose motions?" }
  ];

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const evaluate = () => {
    const severe = ['fever', 'smell', 'breath'];
    const moderate = ['cough', 'fatigue', 'bodypain', 'nausea'];
    const mild = ['headache'];

    let severeCount = 0;
    let moderateCount = 0;
    let mildCount = 0;

    Object.entries(answers).forEach(([key, value]) => {
      if (value === 'yes') {
        if (severe.includes(key)) severeCount++;
        else if (moderate.includes(key)) moderateCount++;
        else if (mild.includes(key)) mildCount++;
      }
    });

    let level = '';
    let message = '';

    if (severeCount >= 2 || (severeCount === 1 && moderateCount >= 2)) {
      level = "🚨 Doctor Visit Recommended";
      message = "You are showing key serious symptoms like high fever, breathing issues, or loss of smell. Please consult a doctor immediately and avoid self-medication.";
    } else if (moderateCount >= 3 || (severeCount === 1 && moderateCount === 1)) {
      level = "⚠️ Stay Alert & Monitor Closely";
      message = "You have moderate symptoms. Rest well, isolate if needed, try safe home remedies, and track your health for 2 days.";
    } else if (mildCount || moderateCount) {
      level = "✅ Mild Symptoms – Self Care Suggested";
      message = "Right now your symptoms appear mild. Maintain good sleep, hydration, and nutrition. If anything worsens, redo the check.";
    } else {
      level = "✅ No Concerning Symptoms";
      message = "You reported no symptoms. Great! Keep following healthy habits and continue self-checks regularly.";
    }

    setResult({ level, message });
    setSubmitted(true);
  };

  useEffect(() => {
    if (selectedDisease && symptomData[selectedDisease]) {
      setDiseaseInfo(symptomData[selectedDisease]);
    } else {
      setDiseaseInfo(null);
    }
  }, [selectedDisease]);

  // Helper to safely get text for selected language
  const getText = (dataObj) => {
    return dataObj?.[language] || dataObj?.['en'] || 'N/A';
  };

  return (
    <ProtectedPage>
      <div className="symptom-radar-header">
        <h1 className="symptom-title">🧭 Symptom Radar</h1>
        <p className="symptom-description">
          Stay ahead of health risks by checking daily symptoms and learning how to prevent illness.  
          This tool helps you self-assess and take smart next steps—before it’s too late.
        </p>
      </div>

      <div className="quiz-section">
        <h2 className="quiz-title">🤒 Daily Symptom Self-Check</h2>
        <p className="quiz-desc">Answer honestly to help detect early signs of illness.</p>

        {!submitted ? (
          <>
            <form className="quiz-form">
              {questions.map(({ key, text }) => (
                <div key={key} className="quiz-question">
                  <label>{text}</label>
                  <div className="quiz-options">
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="yes"
                        onChange={() => handleChange(key, 'yes')}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="no"
                        onChange={() => handleChange(key, 'no')}
                      /> No
                    </label>
                  </div>
                </div>
              ))}
            </form>

            <button className="submit-btn" type="button" onClick={evaluate}>Submit Quiz</button>
          </>
        ) : (
          result && (
            <div className="quiz-result-box">
              <h3>{result.level}</h3>
              <p>{result.message}</p>
              <button className="retake-btn" onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setResult(null);
              }}>
                Retake Quiz
              </button>
            </div>
          )
        )}
      </div>

      <div className="info-section">
        <h2 className="info-title">🩺 Learn About Common Symptoms and What They Mean</h2>
        <p className="info-desc">Explore causes, remedies, and care tips for common symptoms and illnesses.</p>

        <div className="selectors">
  <select
    className="disease-select"
    value={selectedDisease}
    onChange={(e) => setSelectedDisease(e.target.value)}
  >
    <option value="">Select a disease</option>
    {Object.keys(symptomData).map((disease) => (
      <option key={disease} value={disease}>{disease}</option>
    ))}
  </select>

  {selectedDisease && (
    <select
      className="language-select"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="mr">मराठी</option>
      <option value="ta">தமிழ்</option>
      <option value="bn">বাংলা</option>
    </select>
  )}
</div>


        {diseaseInfo && (
          <div className="disease-info-box">
            <h3>{selectedDisease}</h3>
            <p><strong>Description:</strong> {getText(diseaseInfo.description)}</p>

            <h4>🔍 Common Symptoms</h4>
            <ul>{getText(diseaseInfo.symptoms)?.map?.((item, idx) => <li key={idx}>{item}</li>)}</ul>

            <h4>🌿 Home Remedies</h4>
            <ul>{getText(diseaseInfo.homeRemedies)?.map?.((item, idx) => <li key={idx}>{item}</li>)}</ul>

            <h4>🚫 What to Avoid</h4>
            <ul>{getText(diseaseInfo.avoid)?.map?.((item, idx) => <li key={idx}>{item}</li>)}</ul>

            <h4>🛑 When to Consult a Doctor</h4>
            <ul>{getText(diseaseInfo.consultDoctorWhen)?.map?.((item, idx) => <li key={idx}>{item}</li>)}</ul>
          </div>
        )}
      </div>
    </ProtectedPage>
  );
};

export default SymptomRadar;
