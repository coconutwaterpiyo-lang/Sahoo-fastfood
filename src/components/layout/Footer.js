import { useNavigate } from "react-router-dom";
import { Logo } from "../ui/index";
import { Gold, GoldDark, Border } from "../../utils/theme";
import { WA_CHANNEL } from "../../utils/whatsapp";

const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918249790363";

export function Footer() {
  const navigate = useNavigate();

  const columns = [
    {
      h: "Menu",
      links: [
        ["Biryani", "/menu"],
        ["Burgers", "/menu"],
        ["Pizza", "/menu"],
        ["Momos", "/menu"],
        ["Beverages", "/menu"],
      ],
    },
    {
      h: "Account",
      links: [
        ["Login", "/login"],
        ["Register", "/register"],
        ["My Orders", "/orders"],
        ["Wishlist", "/wishlist"],
        ["Profile", "/profile"],
      ],
    },
    {
      h: "Info",
      links: [
        ["About Us", "/about"],
        ["Contact", "/contact"],
        ["Menu", "/menu"],
        ["Admin", "/admin"],
      ],
    },
  ];

  return (
    <footer
      style={{
        background: "#050505",
        borderTop: `1px solid ${Border}`,
        padding: "48px 20px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 32,
            marginBottom: 32,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Logo size={40} />
              <div>
                <div style={{ color: Gold, fontWeight: 800, fontSize: 14 }}>Sahoo Family</div>
                <div style={{ color: "#fff", fontSize: 12, letterSpacing: 2 }}>FASTFOOD</div>
              </div>
            </div>
            <p style={{ color: "#666", fontSize: 12, lineHeight: 1.6, maxWidth: 220 }}>
              Good Food · Great Taste · Happy Family
              <br />
              Serving Rajsunakhala with love since day one.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#25D366",
                  borderRadius: 8,
                  padding: "8px 14px",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                💬 WhatsApp
              </a>
              <a
                href={WA_CHANNEL}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  borderRadius: 8,
                  padding: "8px 14px",
                  color: "#000",
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                📢 Channel
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.h}>
              <h4 style={{ color: Gold, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>
                {col.h}
              </h4>
              {col.links.map(([label, path]) => (
                <div key={label} style={{ marginBottom: 6 }}>
                  <button
                    onClick={() => navigate(path)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#888",
                      fontSize: 12,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: `1px solid ${Border}`,
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
            © 2025 Sahoo Family Fastfood. All rights reserved.
          </p>
          <p style={{ color: "#555", fontSize: 12, margin: 0 }}>📍 Rajsunakhala, Odisha, India</p>
        </div>
      </div>
    </footer>
  );
}
