import React, { FC } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const AuthRoute: FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <></>;
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
