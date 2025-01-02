import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResendVerificationEmail.css'; // Import a CSS file for styling

const ResendVerificationEmail = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/resend-verification-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to resend verification link.');
      }

      setResendSuccess(true);
    } catch (error) {
      setError(error.message || 'An error occurred while resending the verification link.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="resend-verification-container">
      <h2>Resend Verification Email</h2>
      <p className="instruction-text">
        Enter your email address below to receive a new verification link.
      </p>

      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
      </div>

      <button
        onClick={handleResendVerification}
        disabled={isResending}
        className="resend-button"
      >
        {isResending ? 'Sending...' : 'Send Verification Link'}
      </button>

      {resendSuccess && (
        <p className="success-message">Verification link sent successfully!</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      <button
        onClick={() => navigate('/dashboard')}
        className="dashboard-button"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ResendVerificationEmail;