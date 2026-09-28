import { useId } from "react";

// COMPONENT COMPOSITION: Field wraps ANY input via a render-function child
// (Angular analogue: content projection / <ng-content>, but with data passed in).
// useId gives a stable unique id for label<->input association (accessibility).
function Field({ label, error, children }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? `${id}-err` : undefined })}
      {error && <span id={`${id}-err`} className="field__error" role="alert">{error}</span>}
    </div>
  );
}

export default Field;
