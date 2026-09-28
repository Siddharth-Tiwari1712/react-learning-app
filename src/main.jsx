// ENTRY POINT (Stage 1). index.html loads this file.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // react-dom = the BROWSER renderer
import "./index.css";
import App from "./App.jsx";

// createRoot hands ownership of <div id="root"> to React.
// StrictMode (dev only) double-invokes renders and effects to expose impure code
// and missing cleanups. This is why you'll see effects run twice in development.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
