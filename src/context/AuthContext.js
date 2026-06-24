import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { fetchUserDoc } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);   // Firestore user doc
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const data = await fetchUserDoc(fbUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Refresh Firestore user doc (e.g. after wishlist update)
  const refreshUserData = async () => {
    if (firebaseUser) {
      const data = await fetchUserDoc(firebaseUser.uid);
      setUserData(data);
    }
  };

  return (
    <AuthContext.Provider
      value={{ firebaseUser, userData, setUserData, authLoading, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
