import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  // Check for authentication (you can adjust this check depending on your logic)
  const isAuthenticated = localStorage.getItem("authToken");

  // If the user is authenticated, render the protected component, else redirect to login
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
