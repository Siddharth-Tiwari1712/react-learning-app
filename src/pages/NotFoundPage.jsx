import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="center">
      <h2>404 – Page not found</h2>
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}
export default NotFoundPage;
