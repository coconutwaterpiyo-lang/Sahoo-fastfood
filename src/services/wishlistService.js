import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

// Wishlist is stored as an array of product IDs in the user document

export async function addToWishlist(userId, productId) {
  await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
    wishlist: arrayUnion(productId),
  });
}

export async function removeFromWishlist(userId, productId) {
  await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
    wishlist: arrayRemove(productId),
  });
}
