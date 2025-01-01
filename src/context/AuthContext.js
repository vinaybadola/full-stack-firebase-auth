import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/Firebase";

const AuthContext = createContext({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const firebaseToken = await firebaseUser.getIdToken();

          // Exchange Firebase token for backend token
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/api/exchange-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firebaseToken }),
              credentials: "include", // Include cookies in the request
            }
          );

          if (!response.ok) {
            throw new Error("Failed to exchange token.");
          }

          setUser(firebaseUser); // Set the user state
        } catch (error) {
          console.error("Authentication error:", error);
          setUser(null);
        }
      } else {
        setUser(null); // No user is logged in
      }
      setLoading(false); // Set loading to false
    });

    return unsubscribe; // Clean up the onAuthStateChanged listener
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};