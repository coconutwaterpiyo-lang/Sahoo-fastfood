import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { EmptyState, LoadingPage } from "../components/ui/index";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useOrders } from "../hooks/useOrders";
import { Gold, GoldDark, Border, Surface, Surface2 } from "../utils/theme";

const STATUS_COLORS = {
  Pending: "#F59E0B",
  Confirmed: "#3B82F6",
  Preparing: "#8B5CF6",
  "Out for Delivery": "#06B6D4",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { orders, loading } = useOrders();

  if (loading) return <LoadingPage />;

  if (orders.length === 0) {
    return (
      <div style={{ paddingTop: 80 }}>
        <EmptyState icon="📦" title="No orders yet" sub="Your orders will appear here after checkout" action="Browse Menu" onAction={() => navigate("/menu")} />
      </div>
    );
  }

  const handleReorder = (items) => {
    items.forEach((i) => addToCart(i));
    showToast("Items added to cart!");
    navigate("/cart");
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ color: Gold, fontWeight: 900, fontSize: 28, marginBottom: 24 }}>My Orders</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: Surface,
                border: `1px solid ${Border}`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ background: Surface2, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span style={{ color: Gold, fontWeight: 800 }}>{order.orderId}</span>
                  <span style={{ color: "#555", fontSize: 12, marginLeft: 12 }}>
                    {order.createdAt?.toDate?.()?.toLocaleDateString() || "—"}
                  </span>
                </div>
                <span style={{
                  background: STATUS_COLORS[order.status] + "22",
                  color: STATUS_COLORS[order.status] || Gold,
                  border: `1px solid ${STATUS_COLORS[order.status] || Gold}44`,
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div style={{ padding: "16px 20px" }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#ccc", fontSize: 13 }}>{item.name} ×{item.qty}</span>
                    <span style={{ color: "#888", fontSize: 13 }}>₹{item.price * item.qty}</span>
                  </div>
                ))}

                {order.deliveryDetails && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${Border}` }}>
                    <span style={{ color: "#555", fontSize: 12 }}>
                      📍 {order.deliveryDetails.address}
                    </span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${Border}` }}>
                  <span style={{ color: Gold, fontWeight: 800, fontSize: 16 }}>Total: ₹{order.total}</span>
                  <button
                    onClick={() => handleReorder(order.items)}
                    style={{
                      background: "none",
                      border: `1px solid ${Gold}`,
                      borderRadius: 8,
                      padding: "8px 16px",
                      color: Gold,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    🔄 Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
