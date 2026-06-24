import { useState, useEffect } from "react";
import { fetchUserOrders, fetchAllOrders } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

export function useOrders(adminMode = false) {
  const { firebaseUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!firebaseUser) { setOrders([]); setLoading(false); return; }
    setLoading(true);
    try {
      const data = adminMode
        ? await fetchAllOrders()
        : await fetchUserOrders(firebaseUser.uid);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [firebaseUser, adminMode]); // eslint-disable-line

  return { orders, loading, error, refetch: load, setOrders };
}
