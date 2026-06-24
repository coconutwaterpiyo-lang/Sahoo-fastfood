import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { ProductCard } from "../components/ui/ProductCard";
import { SectionHeader, Stars } from "../components/ui/index";
import { fetchProducts } from "../services/productService";
import { fetchAllReviews } from "../services/reviewService";
import { Gold, GoldDark, Border, Surface, TextMuted } from "../utils/theme";
import { WA_CHANNEL } from "../utils/whatsapp";

const WA_NUMBER = process.env.REACT_APP_WA_NUMBER || "918249790363";

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProducts().then((products) => {
      // Show bestsellers / featured items on home
      const featured = products.filter((p) => p.badge && p.available).slice(0, 4);
      setFeaturedProducts(featured.length ? featured : products.slice(0, 4));
    });
    fetchAllReviews().then((r) => setReviews(r.slice(0, 5)));
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg,#0a0700 0%,#110d00 50%,#0A0A0A 100%)`,
          padding: "60px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "10%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle,${Gold}18 0%,transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div
              style={{
                display: "inline-block",
                background: `${Gold}22`,
                border: `1px solid ${Gold}44`,
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 12,
                color: Gold,
                fontWeight: 700,
                marginBottom: 20,
                letterSpacing: 1,
              }}
            >
              🍽️ Rajsunakhala's Favourite Fastfood
            </div>

            <h1
              style={{
                color: "#fff",
                fontWeight: 900,
                fontSize: "clamp(32px,5vw,56px)",
                lineHeight: 1.15,
                margin: "0 0 20px",
              }}
            >
              Delicious Food,
              <br />
              <span style={{ color: Gold }}>Delivered Fast</span>
            </h1>

            <p style={{ color: "#999", fontSize: 16, lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>
              From aromatic biryanis to crispy momos — freshly made with love and delivered hot to your door via WhatsApp.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/menu")}
                style={{
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 32px",
                  color: "#000",
                  fontWeight: 800,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: `0 4px 24px ${Gold}44`,
                }}
              >
                🍛 Order Now
              </button>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#25D366",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 32px",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 16,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                💬 WhatsApp Order
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[["22+", "Menu Items"], ["500+", "Happy Customers"], ["4.8★", "Avg Rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ color: Gold, fontWeight: 900, fontSize: 24 }}>{num}</div>
                  <div style={{ color: TextMuted, fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: `radial-gradient(circle at 40% 35%, #2a2a00, #000)`,
                border: `3px solid ${Gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 140,
                boxShadow: `0 0 60px ${Gold}44, 0 0 120px ${Gold}22`,
              }}
            >
              🍛
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section style={{ background: Surface, borderTop: `1px solid ${Border}`, borderBottom: `1px solid ${Border}`, padding: "20px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[["🍛", "Biryani"], ["🍔", "Burger"], ["🍕", "Pizza"], ["🍜", "Chowmein"], ["🥟", "Momos"], ["🍟", "Snacks"], ["🥤", "Beverages"]].map(([icon, cat]) => (
            <button
              key={cat}
              onClick={() => navigate(`/menu?category=${cat}`)}
              style={{
                background: "none",
                border: `1px solid ${Border}`,
                borderRadius: 24,
                padding: "10px 20px",
                color: "#ccc",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = Gold; e.currentTarget.style.color = Gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = Border; e.currentTarget.style.color = "#ccc"; }}
            >
              {icon} {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: "60px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionHeader title="Featured Items" sub="Our most loved dishes — freshly prepared every day" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {featuredProducts.map((item) => <ProductCard key={item.id} item={item} />)}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={() => navigate("/menu")}
                style={{
                  background: "none",
                  border: `2px solid ${Gold}`,
                  borderRadius: 12,
                  padding: "12px 32px",
                  color: Gold,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                View Full Menu →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Why us */}
      <section style={{ padding: "60px 20px", background: Surface }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <SectionHeader title="Why Choose Us" sub="More than just food — it's an experience" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20 }}>
            {[
              ["🚀", "Fast Delivery", "WhatsApp orders delivered in 30 minutes"],
              ["🌿", "Fresh Daily", "Ingredients sourced fresh every morning"],
              ["💰", "Affordable", "Great food at prices for every pocket"],
              ["❤️", "Made with Love", "Family recipes passed down through generations"],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                style={{
                  background: "#0A0A0A",
                  border: `1px solid ${Border}`,
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ color: Gold, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: TextMuted, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section style={{ padding: "60px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <SectionHeader title="Customer Reviews" sub="What our happy customers say" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#000", fontWeight: 800, fontSize: 16,
                    }}>
                      {r.userName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{r.userName}</div>
                      <Stars rating={r.rating} size={11} />
                    </div>
                  </div>
                  <p style={{ color: "#bbb", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{
          background: `linear-gradient(135deg,#110d00,#0A0A0A)`,
          border: `1px solid ${Gold}33`,
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#fff", fontWeight: 900, fontSize: 32, marginBottom: 12 }}>
          Ready to <span style={{ color: Gold }}>Order?</span>
        </h2>
        <p style={{ color: TextMuted, marginBottom: 28 }}>
          Browse our full menu or order directly via WhatsApp
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/menu")}
            style={{
              background: `linear-gradient(135deg,${Gold},${GoldDark})`,
              border: "none", borderRadius: 14, padding: "14px 32px",
              color: "#000", fontWeight: 800, fontSize: 15, cursor: "pointer",
            }}
          >
            View Full Menu
          </button>
          <a
            href={WA_CHANNEL}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "none", border: `2px solid ${Gold}`,
              borderRadius: 14, padding: "14px 32px",
              color: Gold, fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}
          >
            📢 Join Our Channel
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
