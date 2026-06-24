import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/index";
import { useToast } from "../context/ToastContext";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { Gold, GoldDark, Border, Surface, Surface2, inputStyle, labelStyle, primaryBtn } from "../utils/theme";

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleEmailLogin = async () => {
    if (!form.email || !form.password) { showToast("Please fill in all fields", "error"); return; }
    setLoading(true);
    try {
      const { userData } = await loginWithEmail(form.email, form.password);
      showToast(`Welcome back, ${userData.name || "friend"}!`);
      navigate(userData.isAdmin ? "/admin" : "/");
    } catch (err) {
      showToast(err.code === "auth/invalid-credential" ? "Invalid email or password" : err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { userData } = await loginWithGoogle();
      showToast(`Welcome, ${userData.name}!`);
      navigate(userData.isAdmin ? "/admin" : "/");
    } catch (err) {
      showToast("Google login failed", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={64} />
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 24, margin: "16px 0 4px" }}>Welcome Back</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 20, padding: 32 }}>
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: "100%",
              background: "#fff",
              border: `1px solid ${Border}`,
              borderRadius: 10,
              padding: "12px",
              color: "#333",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18 }} />
            {googleLoading ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: Border }} />
            <span style={{ color: "#555", fontSize: 12 }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: Border }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
            />
          </div>

          <button onClick={handleEmailLogin} disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, color: "#888", fontSize: 13 }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              style={{ background: "none", border: "none", color: Gold, cursor: "pointer", fontWeight: 700 }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
