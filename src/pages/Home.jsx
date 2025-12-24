import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "../css/home.css";

export default function Home() {
  const [name, setName] = useState("");
  const [tip, setTip] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your wellness assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Scroll to last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Fetch user profile + daily tip
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setName(data.name || "User");
        } else {
          setName("User");
        }
      } catch {
        setName("User");
      }
    };

    const fetchTip = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prevention/tip");
        if (res.ok) {
          const data = await res.json();
          setTip(data.tip);
        } else {
          setTip("Stay hydrated and drink enough water 💧");
        }
      } catch {
        setTip("Take a deep breath and relax 😊");
      }
    };

    fetchProfile();
    fetchTip();
  }, [navigate]);

  // Send message to chatbot
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botReply = data.choices?.[0]?.message?.content || "I'm here to help! 😊";
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Sorry, I couldn't respond." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Chatbot error. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <h1>Hi {name} 👋</h1>
        <p>Your all-in-one wellness companion for body & mind</p>
        <button className="home-btn-primary" onClick={() => navigate("/exercise")}>
          Start Your Day
        </button>
      </section>

      {/* Snapshot Section */}
      <section className="home-snapshot">
        <h2>Today’s Snapshot</h2>
        <div className="home-snapshot-row">
          <div className="home-snap-item" onClick={() => navigate("/exercise")}>
            🏋️ <span>3 Workouts</span>
          </div>
          <div className="home-snap-item" onClick={() => navigate("/nutrition")}>
            🥗 <span>2 Meal Plans</span>
          </div>
          <div className="home-snap-item" onClick={() => navigate("/meditation")}>
            🧘 <span>1 Meditation</span>
          </div>
          <div className="home-snap-item" onClick={() => navigate("/hygiene")}>
            📚 <span>Hygiene Tips</span>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="home-featured">
        <h2>Explore Your Wellness</h2>

        <div className="home-feature-block">
          <h3>🏋️ Exercise</h3>
          <p>
            Build strength and stamina with guided exercises designed to prevent
            lifestyle diseases and keep you active daily.
          </p>
          <button className="home-btn-outline" onClick={() => navigate("/exercise")}>
            Explore
          </button>
        </div>

        <div className="home-feature-block">
          <h3>🥗 Nutrition</h3>
          <p>
            Discover healthy meals that boost immunity and energy. Learn how
            food can prevent common health issues.
          </p>
          <button className="home-btn-outline" onClick={() => navigate("/nutrition")}>
            Explore
          </button>
        </div>

        <div className="home-feature-block">
          <h3>🧘 Meditation</h3>
          <p>
            Reduce stress, sleep better, and improve mental clarity with simple
            guided meditation sessions.
          </p>
          <button className="home-btn-outline" onClick={() => navigate("/meditation")}>
            Explore
          </button>
        </div>

        <div className="home-feature-block">
          <h3>📚 Training</h3>
          <p>
            Learn from experts through training programs in fitness, nutrition,
            and mindfulness.
          </p>
          <button className="home-btn-outline" onClick={() => navigate("/training")}>
            Explore
          </button>
        </div>
      </section>

      {/* Tip Section */}
      <section className="home-tip-section">
        <h2>💡 Daily Health Tip</h2>
        <blockquote>{tip}</blockquote>
      </section>

      {/* Floating Chatbot */}
      <div className="chatbot-wrapper">
        {chatOpen && (
          <div className="chatbot-box">
            <div className="chatbot-header">
              <span>💬 Health Assistant</span>
              <button onClick={() => setChatOpen(false)}>✖</button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.sender === "user" ? "user" : "bot"}`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="chat-msg bot">⏳ Thinking...</div>}

              {/* dummy div to keep scroll at bottom */}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            
              />
              <button onClick={sendMessage}>➤</button>
            </div>
          </div>
        )}

        {!chatOpen && (
          <button className="chatbot-toggle" onClick={() => setChatOpen(true)}>
            💬
          </button>
        )}
      </div>
    </div>
  );
}
