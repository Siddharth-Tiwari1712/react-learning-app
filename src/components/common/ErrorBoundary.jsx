import { Component } from "react";

// ERROR BOUNDARIES are the ONE place classes are still required:
// there is no hook equivalent of getDerivedStateFromError / componentDidCatch.
// They catch errors thrown while RENDERING their children (and lifecycle),
// NOT errors in event handlers or async code (use try/catch there).
// Try it: throw new Error("boom") inside a component's render.
class ErrorBoundary extends Component {
  state = { error: null };

  // Called during render phase: switch to fallback UI.
  static getDerivedStateFromError(error) {
    return { error };
  }

  // Called after commit: log to Sentry etc.
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="center" role="alert">
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button className="btn" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
