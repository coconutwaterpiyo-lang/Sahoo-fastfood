import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

// ─── Create / fetch user document in Firestore ────────────────────────────────
async function upsertUserDoc(firebaseUser, extra = {}) {
  const ref = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || extra.name || "",
      email: firebaseUser.email,
      phone: extra.phone || "",
      address: "",
      photoURL: firebaseUser.photoURL || "",
      isAdmin: firebaseUser.email === process.env.REACT_APP_ADMIN_EMAIL,
      wishlist: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return (await getDoc(ref)).data();
}

// ─── Email Sign Up ────────────────────────────────────────────────────────────
export async function signUpWithEmail(name, email, phone, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  const userData = await upsertUserDoc(cred.user, { name, phone });
  return { firebaseUser: cred.user, userData };
}

// ─── Email Login ──────────────────────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userData = await upsertUserDoc(cred.user);
  return { firebaseUser: cred.user, userData };
}

// ─── Google Login ─────────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  const userData = await upsertUserDoc(cred.user);
  return { firebaseUser: cred.user, userData };
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ─── Fetch User Document ──────────────────────────────────────────────────────
export async function fetchUserDoc(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
}
