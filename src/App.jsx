// ROOT COMPONENT. Stages 4 (routing), 6 (context) and lazy loading live here.
//
//   URL -> <Routes> matches a <Route> -> its element renders inside <Outlet/>
//
//   BrowserRouter
//    └ AuthProvider (Stage 6)
//       └ ThemeProvider (Stage 6)
//          └ ErrorBoundary -> Suspense -> Routes
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Layout from "./components/common/Layout.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// CODE SPLITTING / LAZY LOADING:
// lazy() + dynamic import() makes the bundler put each page in its own JS chunk,
// downloaded only when first rendered. Check the Network tab when you navigate.
// (Angular equivalent: loadComponent / loadChildren.)
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage.jsx"));
const EmployeeDetailsPage = lazy(() => import("./pages/EmployeeDetailsPage.jsx"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          {/* ErrorBoundary catches render errors of anything below it
              (not event handlers, not async code). */}
          <ErrorBoundary>
            {/* Suspense shows the fallback while a lazy chunk is downloading. */}
            <Suspense fallback={<p className="center">Loading page…</p>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* PROTECTED ROUTES: a layout route with no path.
                    ProtectedRoute renders <Outlet/> if logged in, else redirects. */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="employees" element={<EmployeesPage />} />
                    {/* :id is a URL param, read with useParams() */}
                    <Route path="employees/:id" element={<EmployeeDetailsPage />} />
                  </Route>
                </Route>

                {/* 404: "*" matches anything not matched above */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
