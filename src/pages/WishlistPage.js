import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { ProductCard } from "../components/ui/ProductCard";
import { EmptyState, LoadingPage } from "../components/ui/index";
import { useAuth } from "../context/AuthContext";
import { fetchProducts } from "../services/productService";
import { Gold } from "../utils/theme";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) { setLoading(false); return; }
    const wishlist = userData.wishlist || [];
    if (wishlist.length === 0) { setLoading(false); return; }

    fetchProducts()
      .then((all) => setProducts(all.filter((p) => wishlist.includes(p.id))))
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) return <LoadingPage />;

  if (!userData || products.length === 0) {
    return (
      <div style={{ paddingTop: 80 }}>
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          sub="Save your favourite dishes here"
          action="Browse Menu"
          onAction={() => navigate("/menu")}
        />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ color: Gold, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>My Wishlist</h1>
        <p style={{ color: "#888", marginBottom: 28 }}>{products.length} saved item{products.length !== 1 ? "s" : ""}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {products.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
