// src/components/Layout.jsx

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "../css/dashboard.css";

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile toggle

  return (
    <div className="dashboard-container">
      {/* Hamburger button for small screens */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen} // pass state
        setSidebarOpen={setSidebarOpen} // allow Sidebar to close
      />

      <main className="main-content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        {children(activeTab, setActiveTab)}
      </main>
    </div>
  );
}
