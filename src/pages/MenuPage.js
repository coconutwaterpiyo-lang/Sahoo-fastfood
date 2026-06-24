import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { ProductCard } from "../components/ui/ProductCard";
import { SectionHeader, LoadingPage } from "../components/ui/index";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { Gold, GoldDark, Border, Surface, Surface2, TextMuted } from "../utils/theme";

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");

  const { filtered, loading } = useProducts(category, search);
  const { categories } = useCategories();

  const allCategories = ["All", ...categories.map((c) => c.name)];

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#110d00,#0A0A0A)",
          padding: "40px 20px",
          borderBottom: `1px solid ${Border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader title="Our Full Menu" sub="Freshly prepared, always delicious" />

          {/* Search */}
          <div style={{ maxWidth: 480, margin: "0 auto 24px", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, categories..."
              style={{
                width: "100%",
                background: Surface2,
                border: `1px solid ${Border}`,
                borderRadius: 12,
                padding: "12px 12px 12px 42px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat ? `linear-gradient(135deg,${Gold},${GoldDark})` : "none",
                  border: `1px solid ${category === cat ? "transparent" : Border}`,
                  borderRadius: 20,
                  padding: "8px 18px",
                  color: category === cat ? "#000" : "#ccc",
                  fontWeight: category === cat ? 700 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {loading ? (
          <LoadingPage />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <h3 style={{ color: "#fff", fontWeight: 700 }}>No items found</h3>
            <p style={{ color: TextMuted }}>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p style={{ color: TextMuted, fontSize: 13, marginBottom: 20 }}>
              Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              {category !== "All" ? ` in ${category}` : ""}
              {search ? ` matching "${search}"` : ""}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {filtered.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
