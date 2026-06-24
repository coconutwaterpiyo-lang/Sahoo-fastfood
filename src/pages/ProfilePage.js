import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { logout } from "../services/authService";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";
import { Gold, GoldDark, Border, Surface, Surface2, inputStyle, labelStyle, primaryBtn } from "../utils/theme";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { firebaseUser, userData, refreshUserData } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name) { showToast("Name is required", "error"); return; }
    setSaving(true);
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), {
        ...form,
        updatedAt: serverTimestamp(),
      });
      await refreshUserData();
      setEditing(false);
      showToast("Profile updated!");
    } catch {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast("Logged out");
    navigate("/");
  };

  const fields = [
    { k: "name", label: "Full Name", type: "text" },
    { k: "phone", label: "Phone Number", type: "tel" },
    { k: "address", label: "Default Address", type: "text" },
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg,${Gold},${GoldDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 32, fontWeight: 800, color: "#000",
            border: `3px solid ${Gold}`,
          }}>
            {userData?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 22, margin: "0 0 4px" }}>{userData?.name}</h2>
          <p style={{ color: "#888", fontSize: 13 }}>{firebaseUser?.email}</p>
          {userData?.isAdmin && (
            <span style={{ background: `${Gold}22`, color: Gold, border: `1px solid ${Gold}44`, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
              ⚙️ Admin
            </span>
          )}
        </div>

        {/* Profile Card */}
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ color: "#fff", fontWeight: 700, margin: 0 }}>Personal Details</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ background: "none", border: `1px solid ${Gold}`, borderRadius: 8, padding: "6px 14px", color: Gold, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {fields.map((f) => (
            <div key={f.k} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              {editing ? (
                <input
                  type={f.type}
                  value={form[f.k]}
                  onChange={(e) => set(f.k, e.target.value)}
                  style={inputStyle}
                />
              ) : (
                <div style={{ color: userData?.[f.k] ? "#fff" : "#555", fontSize: 14, padding: "10px 0" }}>
                  {userData?.[f.k] || "Not set"}
                </div>
              )}
            </div>
          ))}

          {editing && (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, flex: 1, padding: "12px", fontSize: 14 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => { setEditing(false); setForm({ name: userData?.name || "", phone: userData?.phone || "", address: userData?.address || "" }); }}
                style={{ flex: 1, background: "none", border: `1px solid ${Border}`, borderRadius: 10, padding: "12px", color: "#888", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "📦", label: "My Orders", path: "/orders" },
            { icon: "❤️", label: "Wishlist", path: "/wishlist" },
            { icon: "🍽️", label: "Browse Menu", path: "/menu" },
            ...(userData?.isAdmin ? [{ icon: "⚙️", label: "Admin Panel", path: "/admin" }] : []),
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                background: Surface2, border: `1px solid ${Border}`, borderRadius: 12, padding: "16px",
                color: "#ccc", fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", background: "#1a0a0a", border: "1px solid #E53935",
            borderRadius: 12, padding: "14px", color: "#E53935",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}
