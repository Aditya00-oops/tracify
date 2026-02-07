import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import { ViewType } from "./types";

export default function App() {
  const [view, setView] = useState<ViewType>("Home");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar activeView={view} onNavigate={setView} />

      <div style={{ flex: 1, padding: 20 }}>
        {view === "Home" ? (
          <Dashboard />
        ) : (
          <h1>🚧 {view} coming soon</h1>
        )}
      </div>
    </div>
  );
}
