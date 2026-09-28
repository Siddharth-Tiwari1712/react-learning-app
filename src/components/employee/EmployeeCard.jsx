import { memo, useState } from "react";
import { Link } from "react-router-dom";

// React.memo: skip re-rendering this card when its props are shallow-equal to
// last time. It only helps if the parent passes STABLE props: primitives, the
// same employee object, and callbacks wrapped in useCallback (see EmployeesPage).
// Tip: add console.log("render", employee.name) and watch the console while
// typing in search. Remove memo and compare.
const EmployeeCard = memo(function EmployeeCard({ employee, onToggle, onDelete, canDelete }) {
  // Private state per card instance (Stage 1).
  const [showEmail, setShowEmail] = useState(false);

  // Child -> parent communication: we CALL the callback prop with data.
  // (Angular: @Output EventEmitter.emit)
  return (
    <li className="card">
      <div className="card__header">
        {/* Link navigates without a page reload -> /employees/:id */}
        <h3><Link to={`/employees/${employee.id}`}>{employee.name}</Link></h3>
        <span className={employee.isActive ? "badge badge--active" : "badge badge--inactive"}>
          {employee.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <p className="card__role">{employee.role}</p>
      <p className="muted">{employee.department}</p>
      {showEmail && <p className="muted">{employee.email}</p>}

      <div className="card__actions">
        <button className="btn btn--ghost" onClick={() => setShowEmail((s) => !s)} aria-expanded={showEmail}>
          {showEmail ? "Hide email" : "Show email"}
        </button>
        <button className="btn btn--ghost" onClick={() => onToggle(employee.id)}>
          {employee.isActive ? "Deactivate" : "Activate"}
        </button>
        {/* Authorization: only admins see Delete. */}
        {canDelete && (
          <button className="btn btn--danger" onClick={() => onDelete(employee.id)}>Delete</button>
        )}
      </div>
    </li>
  );
});

export default EmployeeCard;
