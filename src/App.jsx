import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SubmissionsPage from './pages/SubmissionsPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              user
                ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              user
                ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
                : <AuthPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
