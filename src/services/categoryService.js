import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

export async function fetchCategories() {
  const q = query(
    collection(db, COLLECTIONS.CATEGORIES),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCategory(data) {
  return addDoc(collection(db, COLLECTIONS.CATEGORIES), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateCategory(id, data) {
  return updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), data);
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}
