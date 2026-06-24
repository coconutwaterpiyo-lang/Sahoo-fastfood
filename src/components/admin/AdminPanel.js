import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../../services/productService";
import { fetchAllOrders, updateOrderStatus, ORDER_STATUSES } from "../../services/orderService";
import { fetchCategories, addCategory, deleteCategory } from "../../services/categoryService";
import { fetchAllReviews, deleteReview } from "../../services/reviewService";
import { seedDatabase } from "../../firebase/seed";
import { Gold, GoldDark, Border, Surface, Surface2, TextMuted, inputStyle, labelStyle } from "../../utils/theme";

const TABS = ["📦 Products", "🛒 Orders", "🗂️ Categories", "⭐ Reviews", "⚙️ Settings"];

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending: "#F59E0B", Confirmed: "#3B82F6", Preparing: "#8B5CF6",
  "Out for Delivery": "#06B6D4", Delivered: "#10B981", Cancelled: "#EF4444",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState(0);

  // Redirect non-admins
  useEffect(() => {
    if (userData !== null && !userData?.isAdmin) {
      navigate("/");
      showToast("Access denied", "error");
    }
  }, [userData]); // eslint-disable-line

  if (!userData?.isAdmin) return null;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: Surface, borderBottom: `1px solid ${Border}`, padding: "20px 24px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <h1 style={{ color: Gold, fontWeight: 900, fontSize: 24, margin: "0 0 4px" }}>⚙️ Admin Panel</h1>
          <p style={{ color: TextMuted, fontSize: 13, margin: 0 }}>Sahoo Family Fastfood — Control Center</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: Surface2, borderBottom: `1px solid ${Border}`, padding: "0 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", gap: 0 }}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              style={{
                background: "none",
                border: "none",
                borderBottom: tab === i ? `3px solid ${Gold}` : "3px solid transparent",
                color: tab === i ? Gold : TextMuted,
                fontWeight: tab === i ? 700 : 500,
                fontSize: 13,
                padding: "16px 20px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px 24px" }}>
        {tab === 0 && <ProductsTab showToast={showToast} />}
        {tab === 1 && <OrdersTab showToast={showToast} />}
        {tab === 2 && <CategoriesTab showToast={showToast} />}
        {tab === 3 && <ReviewsTab showToast={showToast} />}
        {tab === 4 && <SettingsTab showToast={showToast} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, object = edit
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const emptyForm = { name: "", category: "", price: "", description: "", emoji: "", badge: "", available: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setImagePreview(""); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setImagePreview(p.imageUrl || ""); setImageFile(null); setShowForm(true); };

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) { showToast("Name, category & price required", "error"); return; }
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price) };
      if (editing) {
        await updateProduct(editing.id, data, imageFile);
        showToast("Product updated!");
      } else {
        await addProduct(data, imageFile);
        showToast("Product added!");
      }
      await loadAll();
      setShowForm(false);
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id, p.imageUrl);
      showToast("Product deleted");
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: "#fff", fontWeight: 800, margin: 0 }}>Products ({products.length})</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{ ...inputStyle, width: 220 }}
          />
          <button
            onClick={openAdd}
            style={{ background: `linear-gradient(135deg,${Gold},${GoldDark})`, border: "none", borderRadius: 10, padding: "10px 20px", color: "#000", fontWeight: 700, cursor: "pointer" }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111", border: `1px solid ${Border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ color: Gold, fontWeight: 800, marginBottom: 20 }}>{editing ? "Edit Product" : "Add New Product"}</h3>

            {[
              { k: "name", label: "Product Name *", placeholder: "e.g. Chicken Biryani" },
              { k: "description", label: "Description", placeholder: "Short description…" },
              { k: "emoji", label: "Emoji (fallback icon)", placeholder: "🍛" },
              { k: "badge", label: "Badge (optional)", placeholder: "Bestseller / Spicy / New" },
            ].map((f) => (
              <div key={f.k} style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{f.label}</label>
                <input value={form[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category || ""} onChange={(e) => set("category", e.target.value)} style={{ ...inputStyle }}>
                  <option value="">-- Select --</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input type="number" value={form.price || ""} onChange={(e) => set("price", e.target.value)} placeholder="120" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Product Image</label>
              {imagePreview && (
                <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginBottom: 8, border: `1px solid ${Border}` }} />
              )}
              <input type="file" accept="image/*" onChange={handleImage} style={{ ...inputStyle, padding: "8px" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <input type="checkbox" checked={form.available !== false} onChange={(e) => set("available", e.target.checked)} id="avail" style={{ width: 16, height: 16 }} />
              <label htmlFor="avail" style={{ color: "#ccc", fontSize: 13 }}>Available / In Stock</label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: `linear-gradient(135deg,${Gold},${GoldDark})`, border: "none", borderRadius: 10, padding: "12px", color: "#000", fontWeight: 800, cursor: "pointer" }}>
                {saving ? "Saving…" : editing ? "Update Product" : "Add Product"}
              </button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "none", border: `1px solid ${Border}`, borderRadius: 10, padding: "12px", color: "#888", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p style={{ color: TextMuted }}>Loading…</p>
      ) : (
        <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: Surface2 }}>
                {["Item", "Category", "Price", "Rating", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ color: TextMuted, fontSize: 12, fontWeight: 700, padding: "12px 16px", textAlign: "left", borderBottom: `1px solid ${Border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${Border}30` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                        : <span style={{ fontSize: 28 }}>{p.emoji || "🍽️"}</span>}
                      <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: 13 }}>{p.category}</td>
                  <td style={{ padding: "12px 16px", color: Gold, fontWeight: 700, fontSize: 14 }}>₹{p.price}</td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: 13 }}>⭐ {p.rating?.toFixed(1) || "–"} ({p.reviewCount || 0})</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: p.available ? "#10B98122" : "#EF444422", color: p.available ? "#10B981" : "#EF4444", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                      {p.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ background: `${Gold}22`, border: `1px solid ${Gold}44`, borderRadius: 6, padding: "5px 10px", color: Gold, fontSize: 12, cursor: "pointer" }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(p)} style={{ background: "#EF444422", border: "1px solid #EF444444", borderRadius: 6, padding: "5px 10px", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>🗑️ Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: TextMuted, textAlign: "center", padding: 32 }}>No products found</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function OrdersTab({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAllOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status } : x));
      showToast(`Order updated to "${status}"`);
    } catch {
      showToast("Update failed", "error");
    }
  };

  const displayed = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ color: "#fff", fontWeight: 800, margin: 0 }}>Orders ({orders.length})</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                background: filter === s ? `linear-gradient(135deg,${Gold},${GoldDark})` : "none",
                border: `1px solid ${filter === s ? "transparent" : Border}`,
                borderRadius: 20, padding: "6px 14px", fontSize: 12,
                color: filter === s ? "#000" : TextMuted, fontWeight: filter === s ? 700 : 400, cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p style={{ color: TextMuted }}>Loading…</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayed.map((order) => (
            <div key={order.id} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: Surface2, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <span style={{ color: Gold, fontWeight: 800, fontSize: 14 }}>{order.orderId}</span>
                  <span style={{ color: "#555", fontSize: 12, marginLeft: 12 }}>
                    {order.createdAt?.toDate?.()?.toLocaleString() || "—"}
                  </span>
                  {order.deliveryDetails && (
                    <span style={{ color: TextMuted, fontSize: 12, marginLeft: 12 }}>
                      👤 {order.deliveryDetails.name} · 📞 {order.deliveryDetails.phone}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: Gold, fontWeight: 800 }}>₹{order.total}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatus(order.id, e.target.value)}
                    style={{
                      background: STATUS_COLORS[order.status] + "22",
                      border: `1px solid ${STATUS_COLORS[order.status] || Gold}55`,
                      color: STATUS_COLORS[order.status] || Gold,
                      borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", outline: "none",
                    }}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ padding: "12px 20px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {order.items?.map((item, i) => (
                  <span key={i} style={{ background: "#0A0A0A", border: `1px solid ${Border}`, borderRadius: 8, padding: "4px 10px", color: "#ccc", fontSize: 12 }}>
                    {item.name} ×{item.qty}
                  </span>
                ))}
                {order.deliveryDetails?.address && (
                  <span style={{ color: "#555", fontSize: 12, width: "100%", marginTop: 4 }}>📍 {order.deliveryDetails.address}</span>
                )}
              </div>
            </div>
          ))}
          {displayed.length === 0 && <p style={{ color: TextMuted, textAlign: "center", padding: 40 }}>No orders in this status</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES TAB
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesTab({ showToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", icon: "", order: "" });

  useEffect(() => {
    fetchCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.name) { showToast("Name required", "error"); return; }
    try {
      await addCategory({ name: form.name, icon: form.icon, order: Number(form.order) || 99 });
      const updated = await fetchCategories();
      setCategories(updated);
      setForm({ name: "", icon: "", order: "" });
      showToast("Category added!");
    } catch {
      showToast("Failed to add", "error");
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This won't delete products in it.`)) return;
    await deleteCategory(cat.id);
    setCategories((c) => c.filter((x) => x.id !== cat.id));
    showToast("Deleted");
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 20 }}>Categories</h2>

      {/* Add form */}
      <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <h3 style={{ color: Gold, fontWeight: 700, marginBottom: 14 }}>Add Category</h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Biryani" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Icon</label>
            <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="🍛" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Order</label>
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} placeholder="1" style={inputStyle} />
          </div>
        </div>
        <button onClick={handleAdd} style={{ background: `linear-gradient(135deg,${Gold},${GoldDark})`, border: "none", borderRadius: 10, padding: "10px 24px", color: "#000", fontWeight: 700, cursor: "pointer" }}>
          + Add Category
        </button>
      </div>

      {/* List */}
      {loading ? <p style={{ color: TextMuted }}>Loading…</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((c) => (
            <div key={c.id} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: "#555", fontSize: 12 }}>#{c.order}</span>
              </div>
              <button onClick={() => handleDelete(c)} style={{ background: "#EF444422", border: "1px solid #EF444444", borderRadius: 6, padding: "5px 12px", color: "#EF4444", fontSize: 12, cursor: "pointer" }}>
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ReviewsTab({ showToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews().then(setReviews).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteReview(id);
    setReviews((r) => r.filter((x) => x.id !== id));
    showToast("Review deleted");
  };

  return (
    <div>
      <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 20 }}>Reviews ({reviews.length})</h2>
      {loading ? <p style={{ color: TextMuted }}>Loading…</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reviews.map((r) => (
            <div key={r.id} style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{r.userName}</span>
                  <span style={{ color: Gold, fontSize: 13 }}>{"★".repeat(r.rating)}</span>
                  <span style={{ color: "#555", fontSize: 11 }}>{r.createdAt?.toDate?.()?.toLocaleDateString() || "—"}</span>
                </div>
                <p style={{ color: "#bbb", fontSize: 13, margin: 0 }}>{r.text}</p>
              </div>
              <button onClick={() => handleDelete(r.id)} style={{ background: "#EF444422", border: "1px solid #EF444444", borderRadius: 6, padding: "5px 12px", color: "#EF4444", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
                🗑️
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p style={{ color: TextMuted, textAlign: "center", padding: 40 }}>No reviews yet</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
function SettingsTab({ showToast }) {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm("This will add initial categories and products to Firestore. Only run once. Continue?")) return;
    setSeeding(true);
    try {
      await seedDatabase();
      showToast("Database seeded! Refresh the page.");
    } catch (err) {
      showToast("Seed failed: " + err.message, "error");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: 24 }}>Settings</h2>

      <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <h3 style={{ color: Gold, fontWeight: 700, marginBottom: 8 }}>🌱 Seed Database</h3>
        <p style={{ color: TextMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          Populate Firestore with initial categories and all 22 sample products. Run this <strong style={{ color: "#fff" }}>only once</strong> on a fresh project.
        </p>
        <button
          onClick={handleSeed}
          disabled={seeding}
          style={{
            background: seeding ? "#333" : `linear-gradient(135deg,${Gold},${GoldDark})`,
            border: "none", borderRadius: 10, padding: "12px 24px",
            color: seeding ? "#888" : "#000", fontWeight: 700, fontSize: 14,
            cursor: seeding ? "not-allowed" : "pointer",
          }}
        >
          {seeding ? "Seeding…" : "🌱 Seed Initial Data"}
        </button>
      </div>

      <div style={{ background: Surface, border: `1px solid ${Border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ color: Gold, fontWeight: 700, marginBottom: 8 }}>ℹ️ Project Info</h3>
        {[
          ["Firebase Project", "sahoo-fastfood"],
          ["Auth Domain", "sahoo-fastfood.firebaseapp.com"],
          ["Storage Bucket", "sahoo-fastfood.firebasestorage.app"],
          ["Admin Email", process.env.REACT_APP_ADMIN_EMAIL || "admin@sahoo.com"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 16, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${Border}` }}>
            <span style={{ color: TextMuted, fontSize: 13, minWidth: 140 }}>{k}</span>
            <span style={{ color: "#ccc", fontSize: 13, fontFamily: "monospace" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
