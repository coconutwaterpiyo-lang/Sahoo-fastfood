import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return { categories, loading, refetch: load, setCategories };
}
