import { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "../services/productService";

export function useProducts(categoryFilter = "All", searchQuery = "") {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.available) return false;
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  const refetch = () => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return { products, filtered, loading, error, refetch, setProducts };
}
