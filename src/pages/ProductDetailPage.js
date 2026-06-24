import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Stars, Badge, LoadingPage } from "../components/ui/index";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../context/ToastContext";
import { fetchProduct } from "../services/productService";
import { fetchProductReviews, addReview } from "../services/reviewService";
import { Gold, GoldDark, Border, Surface, Surface2, TextMuted, primaryBtn } from "../utils/theme";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { firebaseUser, userData } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchProduct(id), fetchProductReviews(id)])
      .then(([prod, revs]) => {
        setProduct(prod);
        setReviews(revs);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    showToast(`${product.name} (×${qty}) added to cart`);
  };

  const handleSubmitReview = async () => {
    if (!firebaseUser) { showToast("Please login to leave a review", "info"); return; }
    if (!reviewForm.text.trim()) { showToast("Please write a review", "info"); return; }
    setSubmitting(true);
    try {
      await addReview({
        productId: id,
        userId: firebaseUser.uid,
        userName: userData?.name || firebaseUser.displayName || "Anonymous",
        rating: reviewForm.rating,
        text: reviewForm.text,
      });
      const updated = await fetchProductReviews(id);
      setReviews(updated);
      setReviewForm({ rating: 5, text: "" });
      showToast("Review submitted! Thank you ❤️");
    } catch (err) {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!product) return (
    <div style={{ paddingTop: 80, textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div>
        <div style={{ fontSize: 64 }}>🍽️</div>
        <h2 style={{ color: "#fff" }}>Product not found</h2>
        <button onClick={() => navigate("/menu")} style={{ ...primaryBtn, width: "auto", padding: "12px 28px", marginTop: 16 }}>
          Back to Menu
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: TextMuted, cursor: "pointer", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
        >
          ← Back
        </button>

        {/* Product detail card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Image */}
          <div
            style={{
              background: "linear-gradient(135deg,#1a1a1a,#222)",
              borderRadius: 20,
              border: `1px solid ${Border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 320,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }} />
            ) : (
              <span style={{ fontSize: 120 }}>{product.emoji || "🍽️"}</span>
            )}
            {product.badge && (
              <div style={{ position: "absolute", top: 16, left: 16 }}>
                <Badge text={product.badge} />
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(0,0,0,0.6)", border: `1px solid ${isInWishlist(product.id) ? Gold : Border}`,
                borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 20,
              }}
            >
              {isInWishlist(product.id) ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ color: Gold, fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
              {product.category}
            </div>
            <h1 style={{ color: "#fff", fontWeight: 900, fontSize: 28, margin: "0 0 12px" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Stars rating={product.rating || 0} size={16} />
              <span style={{ color: TextMuted, fontSize: 13 }}>{product.rating?.toFixed(1)} ({product.reviewCount || 0} reviews)</span>
            </div>
            <p style={{ color: "#bbb", lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>
            <div style={{ fontSize: 32, fontWeight: 900, color: Gold, marginBottom: 24 }}>₹{product.price}</div>

            {/* Qty selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ color: TextMuted, fontSize: 14 }}>Quantity:</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: Surface2, border: `1px solid ${Border}`, borderRadius: 8, width: 36, height: 36, color: "#fff", fontSize: 18, cursor: "pointer" }}>-</button>
              <span style={{ color: "#fff", fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: Surface2, border: `1px solid ${Border}`, borderRadius: 8, width: 36, height: 36, color: "#fff", fontSize: 18, cursor: "pointer" }}>+</button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{ ...primaryBtn, borderRadius: 14, fontSize: 16 }}
            >
              🛒 Add to Cart — ₹{product.price * qty}
            </button>
          </div>
        </div>

        {/* Reviews section */}
        <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 20 }}>
          Customer Reviews ({reviews.length})
        </h2>

        {reviews.length > 0 && (
          <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 12, padding: 16, display: "flex", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#000", fontWeight: 800, fontSize: 14, flexShrink: 0,
                }}>
                  {r.userName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{r.userName}</span>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  <p style={{ color: "#bbb", fontSize: 13, margin: 0 }}>{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write review */}
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ color: Gold, fontWeight: 700, marginBottom: 16 }}>Write a Review</h3>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: TextMuted, fontSize: 13, display: "block", marginBottom: 6 }}>Rating</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setReviewForm((r) => ({ ...r, rating: n }))}
                  style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: n <= reviewForm.rating ? Gold : "#444" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={reviewForm.text}
            onChange={(e) => setReviewForm((r) => ({ ...r, text: e.target.value }))}
            placeholder={firebaseUser ? "Share your experience..." : "Login to write a review"}
            disabled={!firebaseUser}
            rows={3}
            style={{
              width: "100%", background: Surface2, border: `1px solid ${Border}`,
              borderRadius: 8, padding: 12, color: "#fff", fontSize: 13,
              resize: "vertical", outline: "none", boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleSubmitReview}
            disabled={submitting || !firebaseUser}
            style={{
              marginTop: 12,
              background: firebaseUser ? `linear-gradient(135deg,${Gold},${GoldDark})` : "#333",
              border: "none", borderRadius: 8, padding: "10px 24px",
              color: firebaseUser ? "#000" : "#666", fontWeight: 700, fontSize: 13, cursor: firebaseUser ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
