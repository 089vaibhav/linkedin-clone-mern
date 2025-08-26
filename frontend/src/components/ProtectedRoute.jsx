// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // If user is logged in, render the child route (via <Outlet />).
  // Otherwise, navigate to the login page.
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;