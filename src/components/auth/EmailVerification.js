import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../config/Firebase";
import "../../styles/auth/emailVerification.css";

const EmailVerification = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = new URLSearchParams(location.search).get("oobCode");
      if (actionCode) {
        try {
          await applyActionCode(auth, actionCode);
          const email =
            new URLSearchParams(location.search).get("email") ||
            window.localStorage.getItem("emailForSignIn");

          if (!email) {
            throw new Error("Email not found");
          }

          // Send request to backend to update `hasVerified`
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/verify-email`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update verification status in the backend.");
          }

          setVerifying(false);
          setTimeout(() => navigate("/dashboard"), 3000);
        } catch (error) {
          setError("Email verification failed. Please try again.");
          console.error(error);
        }
      } else {
        setError("Invalid verification link.");
      }
      setVerifying(false);
    };

    verifyEmail();
  }, [location, navigate]);


  if (verifying) {
    return (
      <div className="verification-container">
        <div className="loader"></div>
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verification-container error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="verification-container success-message">
      <p>Email verified successfully. Redirecting to the dashboard...</p>
    </div>
  );
};

export default EmailVerification;