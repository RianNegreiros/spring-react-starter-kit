import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from './components/ui/sonner'
import Navigation from './components/Navigation'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import VerifyEmailPage from './pages/VerifyEmail'
import ResetPasswordPage from './pages/ResetPassword'
import ProfilePage from './pages/Profile'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import './index.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
