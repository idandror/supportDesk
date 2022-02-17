import React from 'react';
import { Navigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus)
  {
    console.log('in if');
    return <Spinner />;
  }

  console.log('in here');
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
