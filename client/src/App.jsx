import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

//if not logged in --> go to login page
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

//if logged in --> go to dashboard
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}