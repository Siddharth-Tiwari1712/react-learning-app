// STAGE 4-6: login. Controlled inputs + context + navigation.
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // `state.from` was set by ProtectedRoute
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in? Redirect declaratively during render.
  if (user) return <Navigate to="/dashboard" replace />;

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password); // updates context -> consumers re-render
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="muted">Try admin / admin123 (can delete) or user / user123.</p>
        <div className="field">
          <label htmlFor="u">Username</label>
          <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="p">Password</label>
          <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="field__error" role="alert">{error}</p>}
        <button className="btn" disabled={loading || !username || !password}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
