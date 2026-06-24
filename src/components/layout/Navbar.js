import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { logout } from "../../services/authService";
import { Logo } from "../ui/index";
import { Gold, GoldDark, Border } from "../../utils/theme";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseUser, userData } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (path) => { navigate(path); setMenuOpen(false); };

  const handleLogout = async () => {
    await logout();
    showToast("Logged out");
    nav("/");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${Border}`,
        boxShadow: `0 2px 30px rgba(212,175,55,0.08)`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => nav("/")}
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <Logo size={44} />
          <div>
            <div style={{ color: Gold, fontWeight: 800, fontSize: 15, lineHeight: 1.1, letterSpacing: 0.5 }}>
              Sahoo Family
            </div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, letterSpacing: 2 }}>FASTFOOD</div>
          </div>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.path;
            return (
              <button
                key={l.path}
                onClick={() => nav(l.path)}
                style={{
                  background: "none",
                  border: "none",
                  color: active ? Gold : "#ccc",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  padding: "8px 14px",
                  cursor: "pointer",
                  borderBottom: active ? `2px solid ${Gold}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {firebaseUser ? (
            <>
              <IconBtn icon="❤️" onClick={() => nav("/wishlist")} label="Wishlist" />
              <IconBtn icon="📦" onClick={() => nav("/orders")} label="Orders" />
              <IconBtn icon="👤" onClick={() => nav("/profile")} label="Profile" />
              {userData?.isAdmin && (
                <IconBtn icon="⚙️" onClick={() => nav("/admin")} label="Admin" />
              )}
              <button
                onClick={() => nav("/cart")}
                style={{
                  position: "relative",
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  border: "none",
                  borderRadius: 24,
                  padding: "8px 16px",
                  cursor: "pointer",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#E53935",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      fontSize: 11,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: `1px solid ${Border}`,
                  color: "#999",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => nav("/login")}
                style={{
                  background: "none",
                  border: `1px solid ${Gold}`,
                  color: Gold,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                onClick={() => nav("/register")}
                style={{
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  border: "none",
                  color: "#000",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function IconBtn({ icon, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        background: "none",
        border: `1px solid ${Border}`,
        borderRadius: 8,
        padding: "8px 10px",
        cursor: "pointer",
        fontSize: 16,
        color: "#fff",
        transition: "all 0.2s",
      }}
    >
      {icon}
    </button>
  );
}
