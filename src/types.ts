export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  color: string; // Tailwind class
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  color: string; // Hex color e.g., '#10b981'
  velocity: number; // Percent
  lead?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  dueDate: string;
  assignees: TeamMember[];
  subtasks: SubTask[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  taskTitle: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface DashboardStats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
