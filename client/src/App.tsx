import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './routes/ProtectedRoute'
import DoctorDashboardLayout from './pages/Dashboard/Doctor/DoctorDashboardLayout'
import ClientDashboardLayout from './pages/Dashboard/Client/ClientDashboardLayout'
import Records from './pages/Dashboard/Doctor/Records'

import { jwtDecode } from 'jwt-decode'
import DoctorProfile from './pages/Dashboard/Doctor/DoctorProfile'
import DoctorSettings from './pages/Dashboard/Doctor/DoctorSettings'
import ClientProfile from './pages/Dashboard/Client/ClientProfile'
import ClientSettings from './pages/Dashboard/Client/ClientSettings'
import MyDoctors from './pages/Dashboard/Client/MyDoctors'
import MyAnimals from './pages/Dashboard/Client/MyAnimals'

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
            <Route path='profile' element={<DoctorProfile />} />
            <Route path='settings' element={<DoctorSettings />} />
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
            <Route path='my-doctors' element={<MyDoctors />} />
            <Route path='my-animals' element={<MyAnimals />} />
            <Route path='profile' element={<ClientProfile />} />
            <Route path='settings' element={<ClientSettings />} />
          </Route>
        )}

        {/* Fallback for unauthorized roles */}
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
