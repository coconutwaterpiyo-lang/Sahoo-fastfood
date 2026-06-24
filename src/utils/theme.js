// ─── Design tokens ────────────────────────────────────────────────────────────
export const Gold = "#D4AF37";
export const GoldLight = "#F0D060";
export const GoldDark = "#B8860B";
export const Bg = "#0A0A0A";
export const Surface = "#111111";
export const Surface2 = "#1A1A1A";
export const Border = "#2A2A2A";
export const TextMuted = "#888888";
export const TextDim = "#555555";
export const Success = "#25D366";
export const Error = "#E53935";

// ─── Shared style objects ─────────────────────────────────────────────────────
export const primaryBtn = {
  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
  border: "none",
  borderRadius: 10,
  padding: "14px",
  color: "#000",
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
  width: "100%",
};

export const outlineBtn = {
  background: "none",
  border: `1px solid ${Border}`,
  borderRadius: 8,
  padding: "8px 16px",
  color: TextMuted,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

export const goldOutlineBtn = {
  background: "none",
  border: `1px solid ${Gold}`,
  borderRadius: 8,
  padding: "8px 16px",
  color: Gold,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

export const inputStyle = {
  width: "100%",
  background: Surface2,
  border: `1px solid ${Border}`,
  borderRadius: 8,
  padding: "12px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle = {
  color: TextMuted,
  fontSize: 13,
  display: "block",
  marginBottom: 6,
};

export const qtyBtnStyle = {
  background: Surface2,
  border: `1px solid ${Border}`,
  borderRadius: 6,
  width: 28,
  height: 28,
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 16,
};
