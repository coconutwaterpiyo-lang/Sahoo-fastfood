import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../hooks/useWishlist";
import { useToast } from "../../context/ToastContext";
import { Badge, Stars } from "./index";
import { Gold, GoldDark, Surface, Border } from "../../utils/theme";

export function ProductCard({ item }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const inWishlist = isInWishlist(item.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
    showToast(`${item.name} added to cart`);
  };

  return (
    <div
      style={{
        background: Surface,
        border: `1px solid ${Border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(212,175,55,0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.3)";
      }}
      onClick={() => navigate(`/product/${item.id}`)}
    >
      {/* Image area */}
      <div
        style={{
          height: 160,
          background: "linear-gradient(135deg,#1a1a1a,#222)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 72 }}>{item.emoji || "🍽️"}</span>
        )}

        {item.badge && (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge text={item.badge} />
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,0.6)",
            border: `1px solid ${inWishlist ? Gold : Border}`,
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            color: inWishlist ? Gold : "#fff",
          }}
        >
          {inWishlist ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{item.name}</h3>
          <span style={{ color: Gold, fontWeight: 800, fontSize: 15, flexShrink: 0 }}>₹{item.price}</span>
        </div>

        <p style={{ color: "#777", fontSize: 12, margin: "4px 0 8px", lineHeight: 1.5, minHeight: 34 }}>
          {item.description?.slice(0, 70)}{item.description?.length > 70 ? "…" : ""}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Stars rating={item.rating || 0} size={12} />
            <span style={{ color: "#555", fontSize: 11 }}>({item.reviewCount || 0})</span>
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              background: `linear-gradient(135deg,${Gold},${GoldDark})`,
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#000",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
