import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// ─── Fetch all products ───────────────────────────────────────────────────────
export async function fetchProducts() {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Fetch products by category ───────────────────────────────────────────────
export async function fetchProductsByCategory(category) {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where("category", "==", category),
    where("available", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Fetch single product ─────────────────────────────────────────────────────
export async function fetchProduct(id) {
  const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── Add product ──────────────────────────────────────────────────────────────
export async function addProduct(productData, imageFile) {
  let imageUrl = "";

  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile);
  }

  const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
    ...productData,
    imageUrl,
    rating: 0,
    reviewCount: 0,
    available: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...productData, imageUrl };
}

// ─── Update product ───────────────────────────────────────────────────────────
export async function updateProduct(id, updates, imageFile) {
  let imageUrl = updates.imageUrl || "";

  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile, id);
  }

  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
    ...updates,
    imageUrl,
    updatedAt: serverTimestamp(),
  });
}

// ─── Delete product ───────────────────────────────────────────────────────────
export async function deleteProduct(id, imageUrl) {
  if (imageUrl) {
    try {
      await deleteObject(ref(storage, imageUrl));
    } catch (_) {
      // Image may already be gone – ignore
    }
  }
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
}

// ─── Upload product image to Firebase Storage ─────────────────────────────────
export async function uploadProductImage(file, productId = "new") {
  const ext = file.name.split(".").pop();
  const storageRef = ref(storage, `products/${productId}_${Date.now()}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Upload banner image ──────────────────────────────────────────────────────
export async function uploadBanner(file, slot = "main") {
  const ext = file.name.split(".").pop();
  const storageRef = ref(storage, `banners/${slot}_${Date.now()}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
