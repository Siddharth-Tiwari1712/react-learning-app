# React Learning App (Stages 1-7)

    npm install
    npm run dev

Login: admin / admin123 (can delete) or user / user123.

| Stage | Concepts | Where to look |
|---|---|---|
| 1 Fundamentals | JSX, props, keys, events | main.jsx, components/employee/* |
| 2 State | useState, lifting state, controlled inputs, derived state | pages/EmployeesPage.jsx, EmployeeCard.jsx |
| 3 Effects + API | useEffect, cleanup, AbortController, loading/error/empty | api/employeeApi.js, EmployeesPage, EmployeeDetailsPage |
| 4 Routing | Routes, NavLink, useParams, nested + protected routes, 404, lazy | App.jsx, routes/ProtectedRoute.jsx, components/common/Layout.jsx |
| 5 Forms | manual controlled form, then React Hook Form | components/forms/* |
| 6 Context | AuthContext, ThemeContext | context/* |
| 7 useReducer | employees reducer | reducers/employeesReducer.js |

Also included: useRef, useMemo, useCallback, React.memo, custom hook (debounce),
throttling, optimistic UI, error boundary, Suspense, env vars, session/local storage.

Debug: run `localStorage.setItem("simulate-error","1")` in the console to test error states.
