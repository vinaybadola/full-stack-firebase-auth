import React, { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/Firebase";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      if (user.emailVerified) {
        const idToken = await user.getIdToken()
        // Send idToken to your backend for verification
        const response = await fetch("http://localhost:3001/api/authenticate/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idToken })
        })

        if (response.ok) {
          const data = await response.json()
          // Store the server token in localStorage or a secure cookie
          localStorage.setItem("authToken", data.token)
          // Redirect to dashboard or home page
          // history.push('/dashboard');
        } else {
          throw new Error("Login failed")
        }
      } else {
        setError("Please verify your email before logging in.")
      }
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.")
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default Login;