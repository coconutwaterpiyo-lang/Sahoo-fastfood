import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ─── Firebase project config ─────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAXsfuJGqho-3MXFRb6ZaycrrXI_QNfMzY",
  authDomain: "sahoo-fastfood.firebaseapp.com",
  projectId: "sahoo-fastfood",
  storageBucket: "sahoo-fastfood.firebasestorage.app",
  messagingSenderId: "631569477442",
  appId: "1:631569477442:web:578ebaccd218e7dabe22db",
  measurementId: "G-6XYPK8K79C",
};

// ─── Initialize Firebase ─────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// ─── Export services ─────────────────────────────────────────────────────────
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
