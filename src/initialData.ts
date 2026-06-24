import { Task, Project, TeamMember, ActivityLog } from './types';

export const INITIAL_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'James Smith', role: 'Product Manager', status: 'online', color: 'bg-indigo-600', initials: 'JS' },
  { id: 'tm2', name: 'Alex Lozano', role: 'Frontend Dev', status: 'online', color: 'bg-blue-500', initials: 'AL' },
  { id: 'tm3', name: 'Tanya Kim', role: 'Backend Dev', status: 'online', color: 'bg-amber-500', initials: 'TK' },
  { id: 'tm4', name: 'Marcus King', role: 'UX Designer', status: 'away', color: 'bg-purple-500', initials: 'MK' },
  { id: 'tm5', name: 'Sarah Chen', role: 'DevOps Engineer', status: 'offline', color: 'bg-emerald-500', initials: 'SC' }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Marketing App', color: '#10b981', velocity: 78, lead: 'James Smith' },
  { id: 'p2', name: 'E-Commerce API', color: '#6366f1', velocity: 34, lead: 'Tanya Kim' },
  { id: 'p3', name: 'Internal Operations', color: '#f59e0b', velocity: 90, lead: 'James Smith' }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task1',
    title: 'Finalize Express API documentation',
    description: 'Create extensive API endpoints list with expected request body and responses. Document all route paths and parameters.',
    status: 'todo',
    priority: 'high',
    project: 'E-Commerce API',
    dueDate: '2026-06-28',
    assignees: [INITIAL_TEAM[1], INITIAL_TEAM[2]], // AL, TK
    subtasks: [
      { id: 'sub1', title: 'Write Auth routes documentation', completed: false },
      { id: 'sub2', title: 'Write Products & Orders route specs', completed: false },
      { id: 'sub3', title: 'Format as OpenAPI / Swagger spec', completed: false }
    ],
    createdAt: '2026-06-20'
  },
  {
    id: 'task2',
    title: 'Connect MongoDB Cluster to Staging',
    description: 'Setup Mongoose cluster connection strings, configure environment variables, and verify connection pooling and safety guards.',
    status: 'in_progress',
    priority: 'medium',
    project: 'Marketing App',
    dueDate: '2026-06-26',
    assignees: [INITIAL_TEAM[3]], // MK
    subtasks: [
      { id: 'sub4', title: 'Create Sandbox cluster on MongoDB Atlas', completed: true },
      { id: 'sub5', title: 'Configure Whitelisting rules', completed: false },
      { id: 'sub6', title: 'Test environment variable fallback', completed: false }
    ],
    createdAt: '2026-06-21'
  },
  {
    id: 'task3',
    title: 'Initial Component Setup',
    description: 'Draft the layout system, integrate Tailwind, configure the main app frame, and assemble the primary layout navigation sidebars.',
    status: 'done',
    priority: 'low',
    project: 'Marketing App',
    dueDate: '2026-06-23',
    assignees: [INITIAL_TEAM[1], INITIAL_TEAM[3]], // AL, MK
    subtasks: [
      { id: 'sub7', title: 'Scaffold basic folder structure', completed: true },
      { id: 'sub8', title: 'Configure Vite & Tailwind variables', completed: true },
      { id: 'sub9', title: 'Build sidebar & dashboard columns', completed: true }
    ],
    createdAt: '2026-06-18'
  },
  {
    id: 'task4',
    title: 'Build Secure JWT Token Refresh Flow',
    description: 'Implement refresh tokens on HttpOnly cookies to keep user sessions secure. Ensure database token revocation works as intended.',
    status: 'in_progress',
    priority: 'high',
    project: 'E-Commerce API',
    dueDate: '2026-06-25',
    assignees: [INITIAL_TEAM[2], INITIAL_TEAM[4]], // TK, SC
    subtasks: [
      { id: 'sub10', title: 'Write cookie signing middleware', completed: true },
      { id: 'sub11', title: 'Create DB model for active refresh tokens', completed: false },
      { id: 'sub12', title: 'Add client interceptor in axios', completed: false }
    ],
    createdAt: '2026-06-22'
  },
  {
    id: 'task5',
    title: 'Launch Google Workspace Analytics integration',
    description: 'Create oauth integrations to import active spreadsheet inputs. Ensure proper permissions and rate limiting controls.',
    status: 'todo',
    priority: 'medium',
    project: 'Internal Operations',
    dueDate: '2026-07-02',
    assignees: [INITIAL_TEAM[0]], // JS
    subtasks: [
      { id: 'sub13', title: 'Register developer console client ID', completed: false },
      { id: 'sub14', title: 'Implement sheet reading parser service', completed: false }
    ],
    createdAt: '2026-06-24'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  { id: 'log1', taskTitle: 'Initial Component Setup', action: 'marked as completed', user: 'Alex Lozano', timestamp: '2 hours ago' },
  { id: 'log2', taskTitle: 'Build Secure JWT Token Refresh Flow', action: 'updated status to In Progress', user: 'Tanya Kim', timestamp: '4 hours ago' },
  { id: 'log3', taskTitle: 'Connect MongoDB Cluster to Staging', action: 'completed subtask: Create Sandbox cluster', user: 'Marcus King', timestamp: 'Yesterday' }
];
