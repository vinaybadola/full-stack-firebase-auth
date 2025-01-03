import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import '../../styles/auth/register.css'
import { Link } from "react-router-dom"

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
  
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include"
        }
      );
  
      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If the response is not JSON, use the status text
          errorData = { message: response.statusText || "Registration failed" };
        }
        alert(errorData.message || "Registration failed");
        throw new Error(errorData.message || "Registration failed");
      }
  
      // Handle successful response
      // const data = await response.json();
      window.localStorage.setItem("emailForSignIn", formData.email);
  
      setSuccess("Registration successful. Redirecting to the homepage...");
      setTimeout(() => {
        alert("Registration successful. Check your mail for verification link");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <div className="header">
          <h2>Create your account</h2>
        </div>

        <div className="form-container">
          <div className="social-buttons">
            <button type="button" className="social-button">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button type="button" className="social-button">
              <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <form onSubmit={handleRegister} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className="form-input"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className="form-input"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="form-input"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-spinner">
                  <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {error && (
            <div className="alert alert-error">
              <div className="alert-content">
                <h3 className="alert-title">Error</h3>
                <p className="alert-message">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <div className="alert-content">
                <h3 className="alert-title">Success</h3>
                <p className="alert-message">{success}</p>
              </div>
            </div>
          )}
      <div>
        <p className="login-text">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
        </div>
      </div>
    </div>
  )
}

export default Register;