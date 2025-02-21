// src/AppRoutes.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import Participant from './pages/Participant';
import Compiler from './pages/Compiler';
import Leaderboard from './pages/Leaderboard';
import supabase from './supabaseClient';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
        }
      }
    };
    fetchUserRole();
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" />;
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Admin />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/participant" 
            element={
              <PrivateRoute allowedRoles={['participant']}>
                <Participant />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/compiler/:questionId" 
            element={
              <PrivateRoute allowedRoles={['participant']}>
                <Compiler />
              </PrivateRoute>
            } 
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
