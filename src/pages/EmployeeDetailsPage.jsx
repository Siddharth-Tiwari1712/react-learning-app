// STAGE 4: dynamic route /employees/:id
//   URL /employees/3 -> Route path "employees/:id" -> this component
//   -> useParams() returns { id: "3" } (always a STRING)
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployee } from "../api/employeeApi.js";
import { Loading, ErrorMessage } from "../components/common/Status.jsx";

function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedNote, setSavedNote] = useState("");

  // UNCONTROLLED input: the DOM keeps the value; we read it via a ref on submit.
  // useRef holds a mutable value that does NOT trigger re-render when changed.
  const noteRef = useRef(null);

  // Effect re-runs whenever `id` changes (navigating employee -> employee).
  // Cleanup aborts the previous request => no RACE CONDITION where a slow
  // old response overwrites a newer one.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getEmployee(id, { signal: controller.signal })
      .then(setEmployee)
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return (
    <>
      <ErrorMessage message={error} />
      <Link to="/employees">← Back to employees</Link>
    </>
  );

  return (
    <section className="card">
      <Link to="/employees">← Back to employees</Link>
      <h2>{employee.name}</h2>
      <p>{employee.role} · {employee.department} · {employee.employmentType}</p>
      <p className="muted">{employee.email}</p>
      <p>Status: {employee.isActive ? "Active" : "Inactive"}</p>
      <p>Skills: {employee.skills?.length ? employee.skills.join(", ") : "none listed"}</p>

      <form onSubmit={(e) => { e.preventDefault(); setSavedNote(noteRef.current.value); }}>
        <label htmlFor="note">Quick note (uncontrolled input) </label>
        <input id="note" ref={noteRef} defaultValue="" />{" "}
        <button className="btn btn--ghost">Save note</button>
      </form>
      {savedNote && <p>Saved note: {savedNote}</p>}
    </section>
  );
}
export default EmployeeDetailsPage;
