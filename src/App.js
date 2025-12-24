// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import ProfileSetup from "./pages/ProfileSetup";
import LandingPage from "./pages/landing";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Exercise from "./pages/Exercise";
import Nutrition from "./pages/Nutrition";
import Meditation from "./pages/Meditation";
import DiseaseInfo from "./pages/DiseaseInfo";
import Hygiene from "./pages/Hygiene";
import DailyPrevention from "./pages/DailyPrevention";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Home activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Exercise activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Nutrition activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meditation"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Meditation activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/disease-info"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <DiseaseInfo activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hygiene"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Hygiene activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-prevention"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <DailyPrevention activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>{(activeTab) => <Profile activeTab={activeTab} />}</Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
