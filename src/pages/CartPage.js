import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { EmptyState } from "../components/ui/index";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Gold, GoldDark, Border, Surface, Surface2, qtyBtnStyle } from "../utils/theme";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();
  const { firebaseUser } = useAuth();

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 80 }}>
        <EmptyState icon="🛒" title="Your cart is empty" sub="Add some delicious items to your cart" action="Browse Menu" onAction={() => navigate("/menu")} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ color: Gold, fontWeight: 900, fontSize: 28, marginBottom: 24 }}>Your Cart</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24 }}>
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  background: Surface,
                  border: `1px solid ${Border}`,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ fontSize: 40 }}>{item.imageUrl
                  ? <img src={item.imageUrl} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                  : item.emoji || "🍽️"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: Gold, fontWeight: 700 }}>₹{item.price} each</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={qtyBtnStyle}>-</button>
                  <span style={{ color: "#fff", fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={qtyBtnStyle}>+</button>
                </div>
                <div style={{ color: Gold, fontWeight: 800, minWidth: 60, textAlign: "right" }}>₹{item.price * item.qty}</div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#E53935", cursor: "pointer", fontSize: 18 }}>🗑️</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ width: 260 }}>
            <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 20, position: "sticky", top: 90 }}>
              <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 16 }}>Order Summary</h3>
              {cart.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#888", fontSize: 12 }}>{i.name} ×{i.qty}</span>
                  <span style={{ color: "#ccc", fontSize: 12 }}>₹{i.price * i.qty}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${Border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>Delivery</span>
                <span style={{ color: "#25D366", fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ color: Gold, fontWeight: 900, fontSize: 18 }}>₹{cartTotal}</span>
              </div>
              <button
                onClick={() => navigate(firebaseUser ? "/checkout" : "/login")}
                style={{
                  width: "100%", marginTop: 16,
                  background: `linear-gradient(135deg,${Gold},${GoldDark})`,
                  border: "none", borderRadius: 12, padding: "14px",
                  color: "#000", fontWeight: 800, fontSize: 14, cursor: "pointer",
                }}
              >
                Proceed to Checkout →
              </button>
              <button
                onClick={() => navigate("/menu")}
                style={{
                  width: "100%", marginTop: 8, background: "none",
                  border: `1px solid ${Border}`, borderRadius: 12, padding: "12px",
                  color: "#888", fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
