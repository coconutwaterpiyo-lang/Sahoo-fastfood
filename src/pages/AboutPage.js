import { Footer } from "../components/layout/Footer";
import { Gold, GoldDark, Border, Surface, TextMuted } from "../utils/theme";
import { WA_CHANNEL } from "../utils/whatsapp";

const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918249790363";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🍛</div>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(28px,5vw,44px)", margin: "0 0 12px" }}>
            About <span style={{ color: Gold }}>Sahoo Family Fastfood</span>
          </h1>
          <p style={{ color: TextMuted, fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Good Food · Great Taste · Happy Family
          </p>
        </div>

        {/* Story */}
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
          <h2 style={{ color: Gold, fontWeight: 800, marginBottom: 12 }}>Our Story</h2>
          <p style={{ color: "#bbb", lineHeight: 1.8, margin: 0 }}>
            Sahoo Family Fastfood began as a small dream — to bring restaurant-quality food to every home in Rajsunakhala.
            Started by the Sahoo family with passion and love for cooking, we've grown from a tiny stall to a beloved
            neighbourhood favourite. Every dish is crafted fresh daily using quality ingredients, traditional spices, and
            recipes that have been perfected over generations.
          </p>
        </div>

        {/* Values */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "🌿", title: "Fresh Ingredients", desc: "Sourced fresh every morning from local markets" },
            { icon: "❤️", title: "Made with Love", desc: "Every dish prepared with care and family recipes" },
            { icon: "🚀", title: "Fast Delivery", desc: "WhatsApp orders delivered quickly to your door" },
            { icon: "💰", title: "Affordable Prices", desc: "Great food for every pocket — no compromise" },
          ].map((v) => (
            <div key={v.title} style={{ background: "#0A0A0A", border: `1px solid ${Border}`, borderRadius: 16, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{v.icon}</div>
              <h3 style={{ color: Gold, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{v.title}</h3>
              <p style={{ color: TextMuted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 20, padding: 32 }}>
          <h2 style={{ color: Gold, fontWeight: 800, marginBottom: 20 }}>Find Us</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { icon: "📍", label: "Location", value: "Rajsunakhala, Odisha, India" },
              { icon: "🕐", label: "Hours", value: "10:00 AM – 10:00 PM (Daily)" },
              { icon: "💬", label: "WhatsApp", value: `+91 8249790363` },
              { icon: "📢", label: "Channel", value: "Join for exclusive offers" },
            ].map((i) => (
              <div key={i.label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24 }}>{i.icon}</span>
                <div>
                  <div style={{ color: TextMuted, fontSize: 12, marginBottom: 2 }}>{i.label}</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{i.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank" rel="noreferrer"
              style={{ background: "#25D366", borderRadius: 10, padding: "12px 24px", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href={WA_CHANNEL}
              target="_blank" rel="noreferrer"
              style={{ background: `linear-gradient(135deg,${Gold},${GoldDark})`, borderRadius: 10, padding: "12px 24px", color: "#000", fontWeight: 700, textDecoration: "none", fontSize: 14 }}
            >
              📢 Join Channel
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
