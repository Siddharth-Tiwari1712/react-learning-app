// STAGE 6: Context API for authentication.
//
//   createContext -> <Provider value> -> useContext(Ctx) anywhere below
//
// Context solves PROP DRILLING (passing props through many layers).
// Angular analogue: an injected singleton service (React has no DI container;
// the Provider position in the tree decides who can read it).
//
// RE-RENDER WARNING: when the Provider's `value` changes (by reference), EVERY
// component that calls useContext(AuthContext) re-renders. So:
//  - keep contexts small and focused (Auth vs Theme, not one giant AppContext)
//  - memoize the value with useMemo
//  - Context is not built for high-frequency data (typing, mouse, timers)
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext(null);

// Simulated user database. NEVER do real auth in the browser like this.
const USERS = {
  admin: { password: "admin123", role: "admin" },
  user: { password: "user123", role: "user" },
};

export function AuthProvider({ children }) {
  // Lazy initializer: the function runs ONLY on first render (not every render).
  // sessionStorage clears when the tab closes; localStorage would persist.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("auth-user"));
    } catch {
      return null;
    }
  });

  // useCallback keeps the function identity stable between renders,
  // so the memoized context value below doesn't change needlessly.
  const login = useCallback(async (username, password) => {
    await new Promise((r) => setTimeout(r, 500)); // fake network
    const record = USERS[username];
    if (!record || record.password !== password) throw new Error("Invalid username or password");
    const loggedIn = { username, role: record.role };
    sessionStorage.setItem("auth-user", JSON.stringify(loggedIn));
    setUser(loggedIn); // triggers re-render of all consumers
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth-user");
    setUser(null);
  }, []);

  // useMemo: same object reference until `user` changes -> consumers don't
  // re-render just because the Provider's parent re-rendered.
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook wrapper: nicer API + helpful error if used outside the Provider.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
