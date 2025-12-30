// src/LoginPage.jsx

import { useState } from 'react';
import './LoginPage.css'; 

const API_URL = 'http://localhost:3001/api/users';

// Accept new props: onNavigateToSignUp and successMessage
export default function LoginPage({ onLoginSuccess, onNavigateToSignUp, successMessage }) {
  const [email, setEmail] =useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // --- MODIFIED ERROR HANDLING ---
        let errorMsg = 'Invalid credentials'; // Default message
        
        if (response.status === 403) {
          // If server sends 403, user is not an admin
          errorMsg = 'Access denied. You are not an admin.';
        }
        
        // Try to parse a message from the server, fall back to our message
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorMsg);
        // --- END OF MODIFICATION ---
      }

      onLoginSuccess(); 

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h1 className="login-title">ITP App Login</h1>
        <p className="login-subtitle">Access your ITP booking system</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* ADDED: Show success message from signup */}
          {successMessage && !error && (
            <div className="login-success-message">
              {successMessage}
            </div>
          )}
          
          {/* Show error message */}
          {error && <div className="login-error-message">{error}</div>}
          
          <div className="login-form-group">
            {/* ... (email field) ... */}
            <label htmlFor="email" className="login-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <div className="login-form-group">
            {/* ... (password field) ... */}
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* ADDED: Link to Sign Up page */}
        <p className="login-toggle">
          <span onClick={onNavigateToSignUp}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}