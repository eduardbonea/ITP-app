import { useState } from 'react';
import './SignUpPage.css'; // We will create this

// API base URL
const API_URL = 'http://localhost:3001/api';

export default function SignUpPage({ onSignUpSuccess, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // If registration is successful, call the function from props
      onSignUpSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-container">
        <h1 className="signup-title">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="signup-error-message">{error}</div>}
          
          <div className="signup-form-group">
            <label htmlFor="email" className="signup-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          
          <div className="signup-form-group">
            <label htmlFor="password" className="signup-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="signup-button" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="signup-toggle">
          Already have an account?{' '}
          <span onClick={onNavigateToLogin}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}