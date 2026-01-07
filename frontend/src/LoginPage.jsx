import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({
  onLoginSuccess,
  onNavigateToSignUp,
  successMessage,
  apiUrl,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMsg = "Invalid credentials";

        if (response.status === 403) {
          errorMsg = "Access denied. You are not an admin.";
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorMsg);
      }

      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
          {successMessage && !error && (
            <div className="login-success-message">{successMessage}</div>
          )}

          {error && <div className="login-error-message">{error}</div>}

          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
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
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-toggle">
          <span onClick={onNavigateToSignUp}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
