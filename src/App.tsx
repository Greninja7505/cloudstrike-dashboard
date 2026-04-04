import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalTestProvider } from "./context/GlobalTestContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ControlPanel from "./pages/ControlPanel";
import HowItWorks from "./pages/HowItWorks";
import History from "./pages/History";
import NotFound from "./pages/NotFound";


import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    // Optionally log error
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#0a1628", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: 'Roboto Mono, monospace', background: "#111827", borderRadius: 12, padding: 32, boxShadow: "0 0 32px #0006", maxWidth: 600, width: "100%" }}>
            <h1 style={{ fontSize: 28, marginBottom: 16, color: "#60a5fa" }}>Something went wrong</h1>
            <pre style={{ fontFamily: 'Roboto Mono, monospace', fontSize: 16, color: "#f87171", whiteSpace: "pre-wrap" }}>{this.state.error.message}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <GlobalTestProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/control-panel" element={<ControlPanel />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalTestProvider>
  </ErrorBoundary>
);

export default App;
