// Reusable loading / error / empty UI (Stage 3).
export function Loading({ text = "Loading…" }) {
  // role="status" = polite announcement for screen readers (accessibility).
  return <p className="center" role="status">{text}</p>;
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>Error: {message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>;
}
