import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Home from "./Home";

const LandingPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // if (user?.role === "seller") {
  //     return <Navigate to="/seller" replace />;
  // }

  return <Home />;
};

export default LandingPage;
