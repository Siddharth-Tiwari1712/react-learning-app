// STAGE 4: layout route component. <Outlet/> is where the matched child route
// renders (Angular analogue: <router-outlet>).
import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { throttle } from "../../utils/throttle.js";

function Layout() {
  const { user, logout } = useAuth(); // re-renders when auth value changes
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // programmatic navigation
  const [showTop, setShowTop] = useState(false);

  // THROTTLED scroll listener: scroll fires dozens of times/second.
  // Effect with cleanup: add the listener on mount, remove on unmount.
  useEffect(() => {
    const onScroll = throttle(() => setShowTop(window.scrollY > 300), 150);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
        {/* NavLink adds the "active" class when its URL matches. */}
        <nav aria-label="Main">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/employees">Employees</NavLink>
        </nav>
        <div className="topbar__right">
          <span>{user.username} ({user.role})</span>
          <button className="btn btn--ghost" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"} mode
          </button>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {showTop && (
        <button className="btn fab" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Top
        </button>
      )}
    </div>
  );
}

export default Layout;
