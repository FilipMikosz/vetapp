// src/routes/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './auth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  return isAuthenticated() ? children : <Navigate to='/login' replace />
}
