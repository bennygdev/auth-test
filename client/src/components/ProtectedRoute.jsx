import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null; 
  }

  // If not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;