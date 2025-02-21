//App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Compiler from "./pages/Compiler";
import Leaderboard from "./pages/Leaderboard";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import ParticipantPage from "./pages/Participant";
import './index.css';
import React from "react";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/participant" element={<ParticipantPage />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
