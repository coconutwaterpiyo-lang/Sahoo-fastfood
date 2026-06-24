import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route so only authenticated users can access it.
 * If adminOnly=true, also requires userData.isAdmin === true.
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { firebaseUser, userData, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <span style={{ color: "#D4AF37", fontSize: 24 }}>Loading…</span>
      </div>
    );
  }

  if (!firebaseUser) return <Navigate to="/login" replace />;
  if (adminOnly && !userData?.isAdmin) return <Navigate to="/" replace />;

  return children;
}
