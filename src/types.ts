export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  dueDate?: string;
  time: string;
  categoryId: string;
  projectId: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
}

export interface Habit {
  id: string;
  name: string;
  completions: Record<string, boolean>;
  createdAt: string;
  color: string;
}

export interface DayStats {
  date: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  rating: "productive" | "average" | "unproductive" | "none";
}

/* 🔥 SINGLE SOURCE OF TRUTH */
export type ViewType =
  | "Home"
  | "Calendar"
  | "Habits"
  | "Tasks"
  | "Timer"
  | "Projects"
  | "Stats"
  | "Chat"
  | "Categories"
  | "AI";
