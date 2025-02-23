import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/Auth";

export const ProtectedRoute = ({ redirectPath = "/signin" }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};
