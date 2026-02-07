import React from "react";
import { ViewType } from "../types";

interface SidebarProps {
  activeView?: ViewType;
  onNavigate?: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView = "Home",
  onNavigate
}) => {
  const items: { id: ViewType; icon: string; label: string }[] = [
    { id: "Home", icon: "✨", label: "Dashboard" },
    { id: "Calendar", icon: "🗓️", label: "Calendar" },
    { id: "Habits", icon: "🔄", label: "Habit Tracker" },
    { id: "Tasks", icon: "📋", label: "All Tasks" },
    { id: "Timer", icon: "⏱️", label: "Study Timer" },
    { id: "Projects", icon: "📁", label: "Projects" },
    { id: "Stats", icon: "📈", label: "Statistics" },
    { id: "Chat", icon: "💬", label: "AI Chat" },
    { id: "Categories", icon: "🎨", label: "Colors" },
    { id: "AI", icon: "🧠", label: "AI Strategist" }
  ];

  return (
    <aside className="w-64 h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <h1 className="text-xl font-bold mb-6">Tracify</h1>

      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              console.log("CLICK:", item.id);
              if (onNavigate) onNavigate(item.id);
            }}
            className={`w-full text-left px-4 py-2 rounded ${
              activeView === item.id
                ? "bg-indigo-500 text-white"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
