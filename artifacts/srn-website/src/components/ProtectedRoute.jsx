import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5EC]">
        <div className="w-16 h-16 rounded-full border-4 border-[#E8622A]/20 border-t-[#E8622A] animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (location.pathname === "/login") return null;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && user.role !== requireRole) {
    if (location.pathname === "/dashboard") return null;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
