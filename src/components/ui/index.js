import { Gold, GoldDark, Border, Surface, Surface2, TextMuted } from "../../utils/theme";

// ─── Logo ─────────────────────────────────────────────────────────────────────
export function Logo({ size = 48 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 35%, #2a2a00, #000)",
        border: `2px solid ${Gold}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 16px ${Gold}55`,
        fontSize: size * 0.38,
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      🍛
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ text }) {
  if (!text) return null;
  return (
    <span
      style={{
        background: `linear-gradient(135deg,${Gold},${GoldDark})`,
        color: "#000",
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 20,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}
    >
      {text}
    </span>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
export function Stars({ rating, size = 14 }) {
  return (
    <span style={{ color: Gold, fontSize: size }}>
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, sub }) {
  const words = title.split(" ");
  return (
    <div style={{ marginBottom: 32, textAlign: "center" }}>
      <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(22px,4vw,32px)", margin: "0 0 8px" }}>
        {words.map((w, i) =>
          i === words.length - 1 ? (
            <span key={i} style={{ color: Gold }}>
              {" "}{w}
            </span>
          ) : (
            <span key={i}>{i ? " " : ""}{w}</span>
          )
        )}
      </h2>
      <p style={{ color: TextMuted, fontSize: 14 }}>{sub}</p>
      <div
        style={{
          width: 48,
          height: 3,
          background: `linear-gradient(135deg,${Gold},${GoldDark})`,
          margin: "12px auto 0",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, sub, action, onAction }) {
  const primaryBtn = {
    background: `linear-gradient(135deg,${Gold},${GoldDark})`,
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    color: "#000",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  };
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
        <h2 style={{ color: "#fff", fontWeight: 700, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: TextMuted, marginBottom: 24 }}>{sub}</p>
        <button onClick={onAction} style={primaryBtn}>
          {action}
        </button>
      </div>
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${Border}`,
        borderTop: `3px solid ${Gold}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

// ─── LoadingPage ──────────────────────────────────────────────────────────────
export function LoadingPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", flexDirection: "column", gap: 16 }}>
      <Spinner size={48} />
      <span style={{ color: TextMuted, fontSize: 14 }}>Loading…</span>
    </div>
  );
}

// ─── ImageUploadBox ───────────────────────────────────────────────────────────
export function ImageUploadBox({ previewUrl, onChange, label = "Upload Image" }) {
  return (
    <div>
      <label style={{ color: TextMuted, fontSize: 13, display: "block", marginBottom: 8 }}>{label}</label>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, marginBottom: 8, border: `1px solid ${Border}` }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{
          display: "block",
          width: "100%",
          background: Surface2,
          border: `1px solid ${Border}`,
          borderRadius: 8,
          padding: "10px",
          color: "#ccc",
          fontSize: 13,
          cursor: "pointer",
        }}
      />
    </div>
  );
}
