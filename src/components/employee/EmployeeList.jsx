import EmployeeCard from "./EmployeeCard.jsx";
import { Empty } from "../common/Status.jsx";

// PRESENTATIONAL component: receives data + callbacks, owns no data logic.
function EmployeeList({ employees, onToggle, onDelete, canDelete }) {
  if (employees.length === 0) return <Empty>No employees match your search.</Empty>;

  return (
    <ul className="list">
      {/* key = stable unique id, so React tracks each item across filter/sort/page changes */}
      {employees.map((e) => (
        <EmployeeCard key={e.id} employee={e} onToggle={onToggle} onDelete={onDelete} canDelete={canDelete} />
      ))}
    </ul>
  );
}

export default EmployeeList;
