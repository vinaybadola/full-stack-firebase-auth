import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/Firebase";

const EmailVerification = () => {
  const [verifying, setVerifying] = useState(false); // Button controls verification
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    const actionCode = new URLSearchParams(location.search).get("oobCode");
    if (!actionCode) {
      setError("Invalid verification link.");
      return;
    }

    try {
      await applyActionCode(auth, actionCode);

      // Wait for auth state to update
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const response = await fetch("http://localhost:3001/api/authenticate/auth/verify-user-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: user.email }),
            });

            if (!response.ok) {
              throw new Error("Failed to update verification status in the backend.");
            }

            setError("");
            navigate("/login"); // Redirect to login after success
          } catch (backendError) {
            setError("Backend verification failed.");
            console.error(backendError);
          }
        } else {
          setError("No authenticated user found.");
        }
      });
    } catch (err) {
      setError("Email verification failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Email Verification</h1>
      {verifying ? (
        <div>Verifying your email...</div>
      ) : (
        <button onClick={() => setVerifying(true) || handleVerify()}>Verify Email</button>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default EmailVerification;