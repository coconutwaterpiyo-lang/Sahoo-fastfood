import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { placeOrder } from "../services/orderService";
import { sendOrderViaWhatsApp } from "../utils/whatsapp";
import { Gold, GoldDark, Border, Surface, Surface2, inputStyle, labelStyle } from "../utils/theme";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { firebaseUser, userData } = useAuth();
  const { showToast } = useToast();
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    notes: "",
  });

  if (cart.length === 0) { navigate("/menu"); return null; }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    setPlacing(true);
    try {
      const { orderId } = await placeOrder({
        userId: firebaseUser.uid,
        items: cart,
        total: cartTotal,
        deliveryDetails: form,
      });

      sendOrderViaWhatsApp({ orderId, items: cart, total: cartTotal, deliveryDetails: form });
      clearCart();
      showToast("Order placed! Opening WhatsApp…");
      navigate("/orders");
    } catch (err) {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  const fields = [
    { k: "name", label: "Full Name *", placeholder: "Your name", type: "text" },
    { k: "phone", label: "Mobile Number *", placeholder: "+91 XXXXXXXXXX", type: "tel" },
    { k: "address", label: "Delivery Address *", placeholder: "House no, Street, Area…", type: "text" },
    { k: "notes", label: "Additional Notes (Optional)", placeholder: "Special instructions…", type: "text" },
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ color: Gold, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Your order will be sent via WhatsApp for confirmation.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24 }}>
          {/* Form */}
          <div>
            <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: 16 }}>Delivery Details</h3>
              {fields.map((f) => (
                <div key={f.k} style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.k]}
                    onChange={(e) => set(f.k, e.target.value)}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
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
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Total</span>
                <span style={{ color: Gold, fontWeight: 900, fontSize: 18 }}>₹{cartTotal}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: placing ? "#555" : "linear-gradient(135deg,#25D366,#1a9e4a)",
                  border: "none",
                  borderRadius: 12,
                  padding: "14px",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: placing ? "not-allowed" : "pointer",
                }}
              >
                {placing ? "Placing Order…" : "💬 Place Order via WhatsApp"}
              </button>
              <p style={{ color: "#666", fontSize: 11, textAlign: "center", marginTop: 8 }}>
                Opens WhatsApp to confirm with the restaurant.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
