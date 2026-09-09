import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { AdminRoute } from './components/auth/AdminRoute'
import AgendaPage from './pages/AgendaPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminAgendaPage from './pages/admin/AdminAgendaPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/admin/agenda"
            element={
              <AdminRoute>
                <AdminAgendaPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
