import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import InformForm from './pages/InformForm';
import InformationTab from './pages/InformationTab';
import InquiryDetails from './pages/InquiryDetails';
import Messages from './pages/Messages';
import AdminManagement from './pages/AdminManagement';
import { AuthProvider } from './context/AuthContext';
import { MessageProvider } from './context/MessageContext';
import ProtectedRoute from './components/ProtectedRoute';





export function App() {
  return <AuthProvider>
      <MessageProvider>
        <Router>

          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />



              <Route path="/user-dashboard" element={<ProtectedRoute userType="user">
                    <UserDashboard />
                  </ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute userType="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>} />
              <Route path="/subadmin-dashboard" element={<ProtectedRoute userType="subadmin">
                    <SubAdminDashboard />
                  </ProtectedRoute>} />
              <Route path="/inform-form" element={<ProtectedRoute userType="user">
                    <InformForm />
                  </ProtectedRoute>} />
              <Route path="/information-tab" element={<ProtectedRoute userType={['admin', 'subadmin']}>
                    <InformationTab />
                  </ProtectedRoute>} />
              <Route path="/inquiry-details/:id" element={<ProtectedRoute userType={['admin', 'subadmin']}>
                    <InquiryDetails />
                  </ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute userType={['user', 'admin', 'subadmin']}>
                    <Messages />
                  </ProtectedRoute>} />
              <Route path="/admin-management" element={<ProtectedRoute userType="admin">
                    <AdminManagement />
                  </ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </MessageProvider>
    </AuthProvider>;
} 