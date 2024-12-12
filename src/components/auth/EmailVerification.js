import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { applyActionCode } from "firebase/auth"
import { auth } from "../../config/Firebase"

const EmailVerification = () => {
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      const actionCode = new URLSearchParams(location.search).get("oobCode");
      if (actionCode) {
        try {
          await applyActionCode(auth, actionCode);
  
          // Send request to backend to update `hasVerified`
          const response = await fetch("http://localhost:3001/api/authenticate/auth/verify-user-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: auth.currentUser.email }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to update verification status in the backend.");
          }
  
          setVerifying(false);
          setTimeout(() => navigate("/login"), 3000);
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
    return <div>Verifying your email...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div>Email verified successfully. Redirecting to login page...</div>
}

export default EmailVerification;
