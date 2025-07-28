import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Pages/Navbar';
import Home from './Pages/Home';
import BodyShield from './Pages/BodyShield';
import MindMirror from './Pages/MindMirror';
import SymptomRadar from './Pages/SymptomRadar';
import SafeHabitsLab from './Pages/SafeHabitsLab';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <MainLayout />
      </Router>
    </UserContext.Provider>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideNavbarRoutes = ['/signin', '/signup'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/body-shield" element={<BodyShield />} />
        <Route path="/mind-mirror" element={<MindMirror />} />
        <Route path="/symptom-radar" element={<SymptomRadar />} />
        <Route path="/safe-habits-lab" element={<SafeHabitsLab />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
