// src/utils/auth.ts

export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}
