// Default export is required for React.lazy.
import { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../api/employeeApi.js";
import { Loading, ErrorMessage } from "../components/common/Status.jsx";

function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getEmployees({ signal: controller.signal })
      .then(setEmployees)
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  // useMemo: recompute stats only when `employees` changes.
  const stats = useMemo(() => {
    const byDept = {};
    employees.forEach((e) => { byDept[e.department] = (byDept[e.department] || 0) + 1; });
    return {
      total: employees.length,
      active: employees.filter((e) => e.isActive).length,
      byDept,
    };
  }, [employees]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="card"><h3>{stats.total}</h3><p className="muted">Total employees</p></div>
        <div className="card"><h3>{stats.active}</h3><p className="muted">Active</p></div>
        <div className="card"><h3>{stats.total - stats.active}</h3><p className="muted">Inactive</p></div>
      </div>
      <h3>By department</h3>
      <ul>
        {Object.entries(stats.byDept).map(([dept, n]) => <li key={dept}>{dept}: {n}</li>)}
      </ul>
    </section>
  );
}
export default DashboardPage;
