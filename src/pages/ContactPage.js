import { Footer } from "../components/layout/Footer";
import { Gold, GoldDark, Border, Surface } from "../utils/theme";
import { WA_CHANNEL } from "../utils/whatsapp";

const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918249790363";

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 36, margin: "0 0 8px" }}>
            Get in <span style={{ color: Gold }}>Touch</span>
          </h1>
          <p style={{ color: "#888", fontSize: 15 }}>We'd love to hear from you!</p>
        </div>

        <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "💬", title: "WhatsApp Order", desc: "Order directly via WhatsApp for fastest delivery", action: `https://wa.me/${WA_NUMBER}`, btn: "Chat Now", green: true },
            { icon: "📢", title: "WhatsApp Channel", desc: "Join our channel for offers, new items & updates", action: WA_CHANNEL, btn: "Join Channel", green: false },
          ].map((c) => (
            <div key={c.title} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: 48 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", fontWeight: 700, margin: "0 0 4px" }}>{c.title}</h3>
                <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{c.desc}</p>
              </div>
              <a
                href={c.action}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: c.green ? "#25D366" : `linear-gradient(135deg,${Gold},${GoldDark})`,
                  border: "none", borderRadius: 10, padding: "10px 20px",
                  color: c.green ? "#fff" : "#000", fontWeight: 700, fontSize: 13, textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {c.btn}
              </a>
            </div>
          ))}
        </div>

        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: Gold, fontWeight: 700, marginBottom: 16 }}>📍 Visit Us</h3>
          {[
            ["Location", "Rajsunakhala, Odisha, India"],
            ["Hours", "10:00 AM – 10:00 PM, Daily"],
            ["WhatsApp", "+91 8249790363"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <span style={{ color: "#555", fontSize: 13, minWidth: 80 }}>{k}</span>
              <span style={{ color: "#ccc", fontSize: 13 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
