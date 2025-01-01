import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../../config/Firebase";
import "../../styles/auth/emailVerification.css";

const EmailVerification = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
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

  const handleResendVerification = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setIsResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/resend-verification-email`,
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
        throw new Error("Failed to resend verification link.");
      }

      setResendSuccess(true);
    } catch (error) {
      setError(error.message || "An error occurred while resending the verification link.");
    } finally {
      setIsResending(false);
    }
  };

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
        <div>
          <p>You can fill the form below to request a new verification link.</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleResendVerification} disabled={isResending}>
            {isResending ? "Sending..." : "Send verification link"}
          </button>
          {resendSuccess && <p>Verification link sent successfully!</p>}
          <button onClick={() => navigate("/dashboard")}>Back to dashboard</button>
        </div>
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