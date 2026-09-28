// The main feature page. Combines Stages 2, 3, 5, 7 plus performance hooks.
//
// DATA FLOW:
//   mount -> useEffect -> getEmployees() -> dispatch(FETCH_SUCCESS)
//   -> reducer -> state.items -> useMemo (search/filter/sort) -> page slice
//   -> <EmployeeList/> -> <EmployeeCard/> (memo)
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { employeesReducer, initialState } from "../reducers/employeesReducer.js";
import { getEmployees, createEmployee, toggleEmployee, deleteEmployee } from "../api/employeeApi.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useAuth } from "../context/AuthContext.jsx";
import EmployeeList from "../components/employee/EmployeeList.jsx";
import EmployeeForm from "../components/forms/EmployeeForm.jsx";
import EmployeeFormRHF from "../components/forms/EmployeeFormRHF.jsx";
import { Loading, ErrorMessage } from "../components/common/Status.jsx";

const PAGE_SIZE = 4;

function EmployeesPage() {
  const { user } = useAuth();
  const canDelete = user.role === "admin"; // authorization in the UI

  // useState vs useReducer vs Context:
  //  - useState: independent simple values (page, sortBy, formMode)
  //  - useReducer: related values with named transitions (list + status + filters)
  //  - Context: sharing across distant components (auth, theme)
  const [state, dispatch] = useReducer(employeesReducer, initialState);
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [formMode, setFormMode] = useState("manual"); // "manual" | "rhf" | "none"
  const [reloadKey, setReloadKey] = useState(0);
  const searchRef = useRef(null); // ref to the DOM <input> for imperative focus

  // DEBOUNCE: the input updates instantly (state.query) but filtering uses the
  // value that settled 300ms after the last keystroke.
  const debouncedQuery = useDebounce(state.query, 300);

  // STAGE 3: fetch on mount (and when reloadKey changes for "Retry").
  //   render -> effect -> request -> dispatch -> render -> cleanup(abort)
  // In Angular you'd use ngOnInit + unsubscribe in ngOnDestroy; here the effect
  // is a "synchronize with external system" tool and cleanup is returned.
  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });
    getEmployees({ signal: controller.signal })
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => {
        if (err.name === "AbortError") return; // cancelled: ignore (StrictMode does this in dev)
        dispatch({ type: "FETCH_ERROR", error: err.message });
      });
    return () => controller.abort();
  }, [reloadKey]);

  // DERIVED DATA with useMemo: recalculated only when its inputs change.
  // Not stored in state, so it can never go out of sync.
  const processed = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return state.items
      .filter((e) => (state.activeFilter === "all" ? true : state.activeFilter === "active" ? e.isActive : !e.isActive))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy])); // .filter returned a copy, so sorting is safe
  }, [state.items, state.activeFilter, debouncedQuery, sortBy]);

  // PAGINATION: clamp page so deleting the last item of a page can't strand us.
  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = processed.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // useCallback: stable function identity so React.memo on EmployeeCard works.
  // `dispatch` is guaranteed stable, so the dependency array can be empty.
  //
  // OPTIMISTIC UI: update the screen first, call the server, roll back on failure.
  const handleToggle = useCallback(async (id) => {
    dispatch({ type: "TOGGLE_ACTIVE", id });   // 1. instant UI
    try {
      await toggleEmployee(id);                // 2. server call
    } catch {
      dispatch({ type: "TOGGLE_ACTIVE", id }); // 3. failure: toggle back
      alert("Update failed, change reverted.");
    }
  }, []);

  // A ref that always points at the latest items lets the delete callback
  // take a rollback snapshot WITHOUT listing state.items as a dependency
  // (which would recreate the callback and defeat React.memo).
  const itemsRef = useRef(state.items);
  useEffect(() => { itemsRef.current = state.items; });

  const handleDelete = useCallback(async (id) => {
    const snapshot = itemsRef.current;
    dispatch({ type: "DELETE", id });                  // optimistic
    try {
      await deleteEmployee(id);
    } catch {
      dispatch({ type: "RESTORE", items: snapshot });  // rollback
      alert("Delete failed, employee restored.");
    }
  }, []);

  // Non-optimistic create: wait for the server (it assigns the id), then add.
  const handleAdd = useCallback(async (values) => {
    const created = await createEmployee(values);
    dispatch({ type: "ADD", payload: created });
    setPage(1);
  }, []);

  return (
    <section>
      <h2>Employees</h2>

      <div className="toolbar">
        {/* CONTROLLED search input; ref lets us focus it imperatively. */}
        <input
          ref={searchRef}
          type="search"
          placeholder="Search name or role…"
          aria-label="Search employees"
          value={state.query}
          onChange={(e) => { dispatch({ type: "SET_QUERY", query: e.target.value }); setPage(1); }}
        />
        <select aria-label="Filter by status" value={state.activeFilter}
          onChange={(e) => { dispatch({ type: "SET_ACTIVE_FILTER", value: e.target.value }); setPage(1); }}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select aria-label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="role">Sort: Role</option>
          <option value="department">Sort: Department</option>
        </select>
        <select aria-label="Form type" value={formMode} onChange={(e) => setFormMode(e.target.value)}>
          <option value="manual">Form: manual</option>
          <option value="rhf">Form: React Hook Form</option>
          <option value="none">Form: hidden</option>
        </select>
        <button className="btn btn--ghost" onClick={() => searchRef.current.focus()}>Focus search</button>
      </div>

      {formMode === "manual" && <EmployeeForm onSubmit={handleAdd} />}
      {formMode === "rhf" && <EmployeeFormRHF onSubmit={handleAdd} />}

      {/* LOADING / ERROR / SUCCESS: one status field drives the UI. */}
      {state.status === "loading" && <Loading text="Loading employees…" />}
      {state.status === "error" && (
        <ErrorMessage message={state.error} onRetry={() => setReloadKey((k) => k + 1)} />
      )}
      {state.status === "success" && (
        <>
          <p className="muted" aria-live="polite">{processed.length} result(s)</p>
          <EmployeeList employees={pageItems} onToggle={handleToggle} onDelete={handleDelete} canDelete={canDelete} />
          <div className="pager">
            <button className="btn btn--ghost" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn--ghost" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}

export default EmployeesPage;
