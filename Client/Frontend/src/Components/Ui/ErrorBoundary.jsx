import React from "react";
import { showToast } from "./toast";
import FormButton from "./FormButton";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    try {
      console.error("Uncaught render error:", error, info);
      showToast((error && error.message) || "An unexpected error occurred", "error", 8000);
    } catch (e) {
      // ignore
      console.error(e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Something went wrong</h2>
            <p className="text-slate-600 mb-6">An unexpected error occurred in the application. You can reload the page or contact support.</p>
            <div className="flex justify-center gap-3">
              <FormButton
                variant="primary"
                onClick={() => window.location.reload()}
                className="!w-auto px-8"
              >
                Reload
              </FormButton>
              <FormButton
                variant="secondary"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="!w-auto px-8"
              >
                Dismiss
              </FormButton>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
