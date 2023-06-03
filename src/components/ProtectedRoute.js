import React from 'react';
import { Navigate } from "react-router-dom";

function ProtectedRoute({isLoggedIn, children}) {
  return (
    isLoggedIn ? children : <Navigate to="/sign-in" />
  )
}

export default ProtectedRoute;

