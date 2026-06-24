import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

// ─── Fetch reviews for a product ─────────────────────────────────────────────
export async function fetchProductReviews(productId) {
  const q = query(
    collection(db, COLLECTIONS.REVIEWS),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Fetch all reviews (admin) ────────────────────────────────────────────────
export async function fetchAllReviews() {
  const q = query(
    collection(db, COLLECTIONS.REVIEWS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Add a review ─────────────────────────────────────────────────────────────
export async function addReview({ productId, userId, userName, rating, text }) {
  const reviewRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
    productId,
    userId,
    userName,
    rating,
    text,
    createdAt: serverTimestamp(),
  });

  // Update product's rating & count (running average)
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await updateDoc(productRef, {
    reviewCount: increment(1),
    // Note: for a true avg, you'd use a Cloud Function.
    // This is a simple increment; recalculate in the admin panel.
  });

  return { id: reviewRef.id };
}

// ─── Delete a review (admin or own) ──────────────────────────────────────────
export async function deleteReview(reviewId) {
  await deleteDoc(doc(db, COLLECTIONS.REVIEWS, reviewId));
}
