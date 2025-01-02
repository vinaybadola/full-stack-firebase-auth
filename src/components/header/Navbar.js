import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        {user ? (
          <>
            <li style={styles.li}>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            </li>
            <li style={styles.li}>
              <button onClick={logout} style={styles.link}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li style={styles.li}>
              <Link to="/register" style={styles.link}>Register</Link>
            </li>
            <li style={styles.li}>
              <Link to="/login" style={styles.link}>Login</Link>
            </li>
            <li style={styles.li}>
              <Link to="/resend-verification" style={styles.link}>Resend Verification</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#007bff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  li: {
    margin: '0 15px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
};

export default Navbar;