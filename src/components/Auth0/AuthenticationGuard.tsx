import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";


type Props = {
  children: React.ReactNode;
};

const AuthenticationGuard = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="p-4">Validando sesión... 🕵️‍♂️</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/HomePage" />;
  }

  return children;
};

export default AuthenticationGuard;
