// src/components/Sidebar.jsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/dashboard.css";

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Home", path: "/home" },
    { name: "Exercise & Yoga", path: "/exercise" },
    { name: "Meditation & Mindfulness", path: "/meditation" },
    { name: "Disease Info", path: "/disease-info" },
    { name: "Hygiene Guide", path: "/hygiene" },
    { name: "Daily Prevention", path: "/daily-prevention" },
    { name: "Profile", path: "/profile" }, // Keep profile
  ];

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) setActiveTab(currentTab.name);
  }, [location.pathname, tabs, setActiveTab]);

  const handleClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
    setSidebarOpen(false);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <img src="/assets/logo.png" alt="Logo" className="sidebar-logo" />
      </div>
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className={activeTab === tab.name ? "active" : ""}
            onClick={() => handleClick(tab)}
          >
            {tab.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
