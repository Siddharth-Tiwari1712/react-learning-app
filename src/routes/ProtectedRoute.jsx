// STAGE 4 + 6: route guard (Angular analogue: CanActivate).
// Used as a LAYOUT ROUTE: it renders <Outlet/> (the matched child route)
// or redirects. Remember: client-side guards are UX only. The SERVER must
// enforce real authorization.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where the user wanted to go so Login can send them back.
    // `replace` swaps the history entry so Back doesn't loop into the guard.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
