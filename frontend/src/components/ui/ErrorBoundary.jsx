import { Component } from "react";
import { Alert } from "./Alert";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("UI ErrorBoundary caught", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-20 max-w-xl px-4">
          <Alert type="error" message="Something went wrong. Please refresh the page." />
        </div>
      );
    }

    return this.props.children;
  }
}
