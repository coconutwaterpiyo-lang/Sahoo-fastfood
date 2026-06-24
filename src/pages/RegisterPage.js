import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui/index";
import { useToast } from "../context/ToastContext";
import { signUpWithEmail, loginWithGoogle } from "../services/authService";
import { Gold, Border, Surface, inputStyle, labelStyle, primaryBtn } from "../utils/theme";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { showToast("Please fill all required fields", "error"); return; }
    if (form.password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setLoading(true);
    try {
      await signUpWithEmail(form.name, form.email, form.phone, form.password);
      showToast("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      showToast(err.code === "auth/email-already-in-use" ? "Email already in use" : err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      showToast("Signed up with Google!");
      navigate("/");
    } catch {
      showToast("Google signup failed", "error");
    }
  };

  const fields = [
    { k: "name", label: "Full Name *", type: "text", placeholder: "John Doe" },
    { k: "email", label: "Email Address *", type: "email", placeholder: "you@example.com" },
    { k: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXXXXXXX" },
    { k: "password", label: "Password *", type: "password", placeholder: "Min. 6 characters" },
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 40px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={64} />
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 24, margin: "16px 0 4px" }}>Create Account</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Join Sahoo Family Fastfood</p>
        </div>

        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 20, padding: 32 }}>
          <button
            onClick={handleGoogle}
            style={{
              width: "100%", background: "#fff", border: `1px solid ${Border}`,
              borderRadius: 10, padding: "12px", color: "#333", fontWeight: 700, fontSize: 14,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
            }}
          >
            <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18 }} />
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: Border }} />
            <span style={{ color: "#555", fontSize: 12 }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: Border }} />
          </div>

          {fields.map((f) => (
            <div key={f.k} style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{f.label}</label>
              <input
                style={inputStyle}
                type={f.type}
                placeholder={f.placeholder}
                value={form[f.k]}
                onChange={(e) => set(f.k, e.target.value)}
              />
            </div>
          ))}

          <button onClick={handleRegister} disabled={loading} style={{ ...primaryBtn, marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, color: "#888", fontSize: 13 }}>
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: Gold, cursor: "pointer", fontWeight: 700 }}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
