// components/DiarySection.jsx
import { useState } from "react";

const DiarySection = ({ showPopupMessage }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState("");
  const [diaries, setDiaries] = useState([]);

  const handleSave = () => {
    if (!title || !content || !password) {
      showPopupMessage("⚠️ Please fill all fields and set a password.");
      return;
    }

    const diaryEntry = {
      title,
      content,
      password,
      timestamp: new Date().toLocaleString(),
    };

    const stored = JSON.parse(localStorage.getItem("diaries")) || [];
    stored.push(diaryEntry);
    localStorage.setItem("diaries", JSON.stringify(stored));

    showPopupMessage("✅ Diary saved successfully!");
    setTitle("");
    setContent("");
    setPassword("");
  };

  const handleView = () => {
    const stored = JSON.parse(localStorage.getItem("diaries")) || [];
    const matched = stored.filter((d) => d.password === viewPassword);
    if (matched.length === 0) {
      showPopupMessage("❌ No diary found with this password.");
    }
    setDiaries(matched);
    setViewPassword("");
  };

  const handleDelete = (entryToDelete) => {
    const stored = JSON.parse(localStorage.getItem("diaries")) || [];
    const updated = stored.filter(
      (entry) =>
        !(
          entry.title === entryToDelete.title &&
          entry.content === entryToDelete.content &&
          entry.timestamp === entryToDelete.timestamp
        )
    );
    localStorage.setItem("diaries", JSON.stringify(updated));
    setDiaries((prev) =>
      prev.filter(
        (entry) =>
          !(
            entry.title === entryToDelete.title &&
            entry.content === entryToDelete.content &&
            entry.timestamp === entryToDelete.timestamp
          )
      )
    );
    showPopupMessage("🗑️ Diary deleted.");
  };

  return (
    <div className="diary-box">
      <h3>📝 New Diary Entry</h3>
      <input
        type="text"
        placeholder="Diary Title"
        value={title}
        name="diaryTitle"
        autoComplete="off"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your thoughts..."
        value={content}
        name="diaryContent"
        autoComplete="off"
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="password"
        placeholder="Set a password"
        value={password}
        name="diarySetPass"
        autoComplete="new-password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSave}>💾 Save Diary</button>

      <h4 className="view-old-diary">🔐 View Old Diaries</h4>
      <input
        type="password"
        placeholder="Enter password to view"
        value={viewPassword}
        name="diaryViewPass"
        autoComplete="new-password"
        onChange={(e) => setViewPassword(e.target.value)}
      />
      <button onClick={handleView}>📖 View Diary</button>

      {diaries.length > 0 && (
        <div className="old-diaries">
          <h5>📚 Your Diaries</h5>
          {diaries.map((entry, index) => (
            <div key={index} className="diary-entry">
              <strong>{entry.title}</strong> <span>({entry.timestamp})</span>
              <p>{entry.content}</p>
              <button onClick={() => handleDelete(entry)}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiarySection;
