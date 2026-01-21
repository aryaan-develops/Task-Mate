
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PriorityPage from './pages/PriorityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminAssignTaskPage from './pages/AdminAssignTaskPage';
import YourTasksPage from './pages/YourTasksPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-blue-50 text-blue-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout for the main app (Sidebar + Outlet)
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white p-4 border-b border-slate-100 z-40 flex items-center justify-between">
        <span className="font-bold text-slate-700 text-lg">MyTasks</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen pt-20 md:pt-8 w-full">
        <Outlet />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Main Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/priority" element={<PriorityPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/assign-task" element={<AdminAssignTaskPage />} />
            <Route path="/assign-task" element={<AdminAssignTaskPage />} />
            <Route path="/your-tasks" element={<YourTasksPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;