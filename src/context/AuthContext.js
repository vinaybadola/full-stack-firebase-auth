import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/Firebase";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

// const isTokenValid = (token) => {
//   if (!token) return false;
//   const decoded = jwtDecode(token);
//   return decoded.exp * 1000 > Date.now();
// };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firebaseToken = await firebaseUser.getIdToken();

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/api/exchange-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firebaseToken }),
              credentials: "include", 
            }
          );

          if (!response.ok) {
            throw new Error("Failed to exchange token.");
          }

          setUser(firebaseUser);
        } catch (error) {
          console.error("Authentication error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};