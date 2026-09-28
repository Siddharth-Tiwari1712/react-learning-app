import { useState, useEffect } from "react";

// CUSTOM HOOK: a function starting with "use" that calls other hooks.
// It reuses STATEFUL LOGIC (not UI). Angular analogue: a service/util,
// but every component that calls it gets its own private state.
//
// Flow while typing "ab":
//   value "a" -> effect starts 300ms timer
//   value "ab" -> cleanup cancels old timer -> new timer
//   300ms of silence -> setDebounced("ab") -> re-render with new debounced value
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // CLEANUP runs before the next effect and on unmount.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
