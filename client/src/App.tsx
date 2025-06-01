import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './routes/ProtectedRoute'
import DoctorDashboardLayout from './pages/Dashboard/Doctor/DoctorDashboardLayout'
import ClientDashboardLayout from './pages/Dashboard/Client/ClientDashboardLayout'
import Records from './pages/Dashboard/Doctor/Records'
import Profile from './pages/Dashboard/Doctor/Profile'
import Settings from './pages/Dashboard/Doctor/Settings'
import { jwtDecode } from 'jwt-decode'

type DecodedToken = { role?: 'doctor' | 'owner' }

function getRoleFromToken(): 'doctor' | 'owner' | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.role || null
  } catch {
    return null
  }
}

function App() {
  const role = getRoleFromToken()

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Doctor Routes */}
        {role === 'doctor' && (
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DoctorDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<p>Doctor Dashboard</p>} />
            <Route path='records' element={<Records />} />
            <Route path='profile' element={<Profile />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        )}

        {/* Client Routes */}
        {role === 'owner' && (
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <ClientDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<p>Client Dashboard</p>} />
            {/* Add client-specific subroutes here */}
          </Route>
        )}

        {/* Fallback for unauthorized roles */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
