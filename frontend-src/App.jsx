import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CasesList from "./components/CasesList";
import EvidenceUpload from "./components/EvidenceUpload";
import EvidenceDetail from "./components/EvidenceDetail";
import AuditPage from "./components/AuditPage";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cases"
          element={
            <PrivateRoute>
              <CasesList />
            </PrivateRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <EvidenceUpload />
            </PrivateRoute>
          }
        />

        <Route
          path="/evidence/:id"
          element={
            <PrivateRoute>
              <EvidenceDetail />
            </PrivateRoute>
          }
        />

 <Route
    path="/audit"
    element={
      <PrivateRoute>
        <AuditPage />
      </PrivateRoute>
    }
  />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
