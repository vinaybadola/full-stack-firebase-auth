import React from "react"
import { useAuth } from "../../context/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Email: {user?.email}</p>
      <p>Email Verified: {user?.emailVerified ? "Yes" : "No"}</p>
    </div>
  )
}

export default Dashboard;