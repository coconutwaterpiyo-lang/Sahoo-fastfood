import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

export const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// ─── Place a new order ────────────────────────────────────────────────────────
export async function placeOrder({ userId, items, total, deliveryDetails }) {
  const orderId = "ORD" + Math.floor(10000 + Math.random() * 90000);

  const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
    orderId,
    userId,
    items,
    total,
    deliveryDetails,
    status: "Pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, orderId };
}

// ─── Fetch orders for a specific user ────────────────────────────────────────
export async function fetchUserOrders(userId) {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Fetch ALL orders (admin) ─────────────────────────────────────────────────
export async function fetchAllOrders() {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Update order status (admin) ──────────────────────────────────────────────
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
