import React, { useState, useEffect } from 'react';
import { Task, Project, TeamMember, ActivityLog, TaskStatus, TaskPriority } from './types';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_TEAM,
  INITIAL_LOGS
} from './initialData';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import KanbanBoard from './components/KanbanBoard';
import TimelineView from './components/TimelineView';
import ProjectVelocity from './components/ProjectVelocity';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Layers,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  TrendingUp,
  X,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';

export default function App() {
  // --- Persistent LocalStorage States ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskmaster_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('taskmaster_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('taskmaster_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('taskmaster_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // --- UI Layout States ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'timeline' | 'kanban'>('dashboard');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  // --- Notification Toast ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- Save to LocalStorage on updates ---
  useEffect(() => {
    localStorage.setItem('taskmaster_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskmaster_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('taskmaster_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('taskmaster_logs', JSON.stringify(logs));
  }, [logs]);

  // --- Dynamic Stats Calculations ---
  useEffect(() => {
    // Recompute project velocity whenever tasks change
    const updatedProjects = projects.map(proj => {
      const projTasks = tasks.filter(t => t.project === proj.name);
      if (projTasks.length === 0) return { ...proj, velocity: 0 };
      const completed = projTasks.filter(t => t.status === 'done').length;
      return {
        ...proj,
        velocity: Math.round((completed / projTasks.length) * 100)
      };
    });

    // Simple check to avoid infinite re-render loops - only update state if values actually changed
    const velocitiesChanged = updatedProjects.some((p, idx) => p.velocity !== projects[idx]?.velocity);
    if (velocitiesChanged) {
      setProjects(updatedProjects);
    }
  }, [tasks]);

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => {
      const isPast = new Date(t.dueDate) < new Date();
      return isPast && t.status !== 'done';
    }).length
  };

  // --- Handlers ---
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveTask = (task: Task) => {
    const exists = tasks.some(t => t.id === task.id);
    let newTasks = [];

    if (exists) {
      newTasks = tasks.map(t => t.id === task.id ? task : t);
      // Log update activity
      const log: ActivityLog = {
        id: `log-${Date.now()}`,
        taskTitle: task.title,
        action: `updated task details (${task.status})`,
        user: 'James Smith',
        timestamp: 'Just now'
      };
      setLogs([log, ...logs]);
      showToast('Task details updated successfully!', 'success');
    } else {
      newTasks = [task, ...tasks];
      // Log addition activity
      const log: ActivityLog = {
        id: `log-${Date.now()}`,
        taskTitle: task.title,
        action: `created a new task in ${task.project}`,
        user: 'James Smith',
        timestamp: 'Just now'
      };
      setLogs([log, ...logs]);
      showToast('New task successfully drafted!', 'success');
    }
    setTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    if (window.confirm(`Are you sure you want to delete the task: "${taskToDelete.title}"?`)) {
      setTasks(tasks.filter(t => t.id !== id));
      const log: ActivityLog = {
        id: `log-${Date.now()}`,
        taskTitle: taskToDelete.title,
        action: 'deleted task from board',
        user: 'James Smith',
        timestamp: 'Just now'
      };
      setLogs([log, ...logs]);
      showToast('Task removed.', 'info');
    }
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const oldStatus = task.status;
    if (oldStatus === status) return;

    const updatedTasks = tasks.map(t => t.id === id ? { ...t, status } : t);
    setTasks(updatedTasks);

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      taskTitle: task.title,
      action: `shifted status from ${oldStatus.toUpperCase()} to ${status.toUpperCase()}`,
      user: 'James Smith',
      timestamp: 'Just now'
    };
    setLogs([log, ...logs]);
    showToast(`Task moved to ${status.replace('_', ' ')}!`, 'success');
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
    showToast(`Project "${newProject.name}" added to list.`, 'success');
  };

  const handleAddMockMember = () => {
    const names = ['Emma Watson', 'Liam Neeson', 'Noah Centineo', 'Chloe Bennett'];
    const roles = ['Data Scientist', 'Security Analyst', 'Mobile App Dev', 'QA Specialist'];
    const colors = ['bg-pink-500', 'bg-teal-500', 'bg-cyan-500', 'bg-violet-500'];
    const name = names[Math.floor(Math.random() * names.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initials = name.split(' ').map(n => n[0]).join('');

    const newMem: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      role,
      status: Math.random() > 0.3 ? 'online' : 'away',
      color,
      initials
    };

    setTeamMembers([...teamMembers, newMem]);
    showToast(`${name} joined the online workspace!`, 'info');
  };

  const toggleMemberStatus = (id: string) => {
    const updated = teamMembers.map(mem => {
      if (mem.id === id) {
        const nextStatus: TeamMember['status'] = mem.status === 'online' ? 'away' : mem.status === 'away' ? 'offline' : 'online';
        return { ...mem, status: nextStatus };
      }
      return mem;
    });
    setTeamMembers(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and projects back to initial demo data? This will overwrite your modifications.')) {
      setTasks(INITIAL_TASKS);
      setProjects(INITIAL_PROJECTS);
      setTeamMembers(INITIAL_TEAM);
      setLogs(INITIAL_LOGS);
      showToast('All board metrics reset to initial state.', 'info');
    }
  };

  // --- Filtering Tasks ---
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject =
      selectedProjectFilter === 'all' || task.project === selectedProjectFilter;
    return matchesSearch && matchesProject;
  });

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
        
        {/* Sidebar Brand Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-extrabold text-white shadow-md shadow-indigo-500/20">
              M
            </div>
            <span className="text-white font-bold text-lg tracking-tight">TaskMaster</span>
          </div>
          <span className="text-[9px] font-semibold uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded tracking-widest">
            MERN
          </span>
        </div>
        
        {/* Navigation Section */}
        <nav className="mt-6 flex-1 overflow-y-auto space-y-7">
          <div>
            <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Main Workspace</div>
            <div className="space-y-1">
              <button
                id="tab-dashboard"
                onClick={() => { setActiveTab('dashboard'); setSelectedProjectFilter('all'); }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                Dashboard View
              </button>

              <button
                id="tab-tasks"
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-4.5 h-4.5" />
                All Tasks Feed
                <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {tasks.length}
                </span>
              </button>

              <button
                id="tab-kanban"
                onClick={() => setActiveTab('kanban')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'kanban'
                    ? 'bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4.5 h-4.5" />
                Kanban Boards
              </button>

              <button
                id="tab-timeline"
                onClick={() => setActiveTab('timeline')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4.5 h-4.5" />
                Timeline Schedule
              </button>
            </div>
          </div>
          
          {/* Projects Filtering List */}
          <div>
            <div className="px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</div>
            <div className="space-y-1">
              <button
                id="proj-all"
                onClick={() => setSelectedProjectFilter('all')}
                className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                  selectedProjectFilter === 'all'
                    ? 'text-indigo-400 bg-indigo-600/5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Show All Projects
              </button>

              {projects.map((proj) => (
                <button
                  id={`proj-filter-${proj.id}`}
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectFilter(proj.name);
                    // Automatically jump to tasks if on general view to highlight the filter
                    if (activeTab === 'dashboard') {
                      setActiveTab('tasks');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-6 py-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                    selectedProjectFilter === proj.name
                      ? 'text-white bg-slate-800'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">
                    {tasks.filter(t => t.project === proj.name).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions & System Operations */}
          <div className="px-4">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium mb-2 flex items-center gap-1.5 leading-snug">
                <Info className="w-3.5 h-3.5 text-indigo-400" /> Live Demo Client Mode
              </p>
              <button
                id="reset-demo-btn"
                onClick={handleResetData}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-slate-700 cursor-pointer"
                title="Reset all fields to standard preseeded setup"
              >
                <RefreshCw className="w-3 h-3" /> Reset Mock DB
              </button>
            </div>
          </div>
        </nav>
        
        {/* Sidebar Profile Switcher */}
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold ring-2 ring-indigo-500/30">
              JS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">James Smith</span>
              <span className="text-xs text-slate-500 truncate">Workspace Lead</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          
          {/* Search bar input */}
          <div className="flex items-center flex-1">
            <div className="relative w-96">
              <input
                id="search-tasks-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks, descriptions, or subtasks..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              {searchTerm && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-6">
            
            {/* Quick Stats Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>All systems active</span>
            </div>

            {/* Notification triggers */}
            <button
              id="notif-bell-btn"
              onClick={() => showToast('Demo System Notification: No pending backend tasks.', 'info')}
              className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Primary Action */}
            <button
              id="create-task-main-btn"
              onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" /> Create Task
            </button>
          </div>
        </header>

        {/* TOAST NOTIFICATION CONTAINER */}
        {toast && (
          <div id="toast-notif" className="fixed top-20 right-8 z-50 flex items-center gap-2.5 px-4.5 py-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
            <p className="font-medium">{toast.message}</p>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <section className="p-8 flex-1 flex flex-col gap-8 overflow-y-auto">
          
          {/* PROJECT FILTER ACTIVE HEADER INFORMDER */}
          {selectedProjectFilter !== 'all' && (
            <div className="bg-indigo-50 border border-indigo-150 rounded-xl px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: projects.find(p => p.name === selectedProjectFilter)?.color || '#6366f1' }} />
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm">Filtering by: {selectedProjectFilter}</h4>
                  <p className="text-xs text-indigo-700">Displaying only metrics and deliverables related to this product line.</p>
                </div>
              </div>
              <button
                id="clear-proj-filter-btn"
                onClick={() => setSelectedProjectFilter('all')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100/50 transition-colors cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* STATS COUNT BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            
            {/* Total Tasks */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Deliverables</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Active
                </span>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Currently Processing</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-600">{stats.inProgress}</span>
                <span className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  In Progress
                </span>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Successfully Completed</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600">{stats.completed}</span>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                  Done
                </span>
              </div>
            </div>

            {/* Overdue */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Overdue Milestones</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600">{stats.overdue}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                  stats.overdue > 0 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                }`}>
                  {stats.overdue > 0 ? 'Needs Attention' : 'Safe'}
                </span>
              </div>
            </div>

          </div>

          {/* DYNAMIC VIEW CONTAINER TABS */}
          <div className="flex-1 min-h-0">
            {activeTab === 'dashboard' ? (
              
              /* DASHBOARD OVERVIEW (SPLIT COLUMN GRID) */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-start">
                
                {/* LEFT 2-COL: RECENT DELIVERABLES LIST */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm min-h-0 max-h-[58vh]">
                  
                  {/* Panel Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Recent Task Queue</h3>
                      <p className="text-[11px] text-slate-400">Displaying matching workflow tasks ({filteredTasks.length})</p>
                    </div>
                    <button
                      id="view-all-tasks-link"
                      onClick={() => setActiveTab('tasks')}
                      className="text-indigo-600 text-xs font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All Feed <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task feed scrollbox */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CheckSquare className="w-10 h-10 text-slate-300 mb-2" />
                        <h4 className="font-semibold text-slate-700 text-sm">No deliverables found</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Try searching for different keywords or clearing active project filters.
                        </p>
                      </div>
                    ) : (
                      filteredTasks.slice(0, 6).map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* RIGHT 1-COL: PROJECT METRICS & TEAM FEEDS */}
                <div className="flex flex-col gap-6">
                  
                  {/* PROJECT VELOCITY MODULE */}
                  <ProjectVelocity
                    projects={projects}
                    onAddProject={handleAddProject}
                    teamMembers={teamMembers}
                  />

                  {/* TEAM MEMBER STATUS FEED */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">Online Collaboration</h3>
                        <p className="text-[10px] text-slate-400">Manage statuses & active contributors</p>
                      </div>
                      <button
                        id="add-mock-member-btn"
                        onClick={handleAddMockMember}
                        className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                      >
                        + Add Member
                      </button>
                    </div>

                    <div className="space-y-3.5 max-h-[22vh] overflow-y-auto pr-1">
                      {teamMembers.map((member) => (
                        <div
                          id={`member-row-${member.id}`}
                          key={member.id}
                          className="flex items-center justify-between gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${member.color}`}>
                                {member.initials}
                              </div>
                              <span
                                className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                                  member.status === 'online'
                                    ? 'bg-emerald-500'
                                    : member.status === 'away'
                                    ? 'bg-amber-400'
                                    : 'bg-slate-300'
                                }`}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-800">{member.name}</span>
                              <span className="text-[10px] text-slate-400">{member.role}</span>
                            </div>
                          </div>

                          <button
                            id={`toggle-member-${member.id}`}
                            onClick={() => toggleMemberStatus(member.id)}
                            className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-slate-200"
                            title="Toggle mock online/away status"
                          >
                            {member.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RECENT AUDIT TRAIL LOGS */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-slate-800 text-sm mb-3">Auditing Activity Feed</h3>
                    <div className="space-y-3 max-h-[18vh] overflow-y-auto pr-1">
                      {logs.map((log) => (
                        <div key={log.id} className="text-[11px] text-slate-600 border-l-2 border-indigo-200 pl-3 py-1">
                          <p className="leading-snug">
                            <span className="font-bold text-slate-800">{log.user}</span> {log.action}{' '}
                            <span className="italic text-indigo-500">"{log.taskTitle}"</span>
                          </p>
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">{log.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            ) : activeTab === 'tasks' ? (
              
              /* ALL TASKS LIST STREAM */
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Complete Task List Archive</h3>
                    <p className="text-xs text-slate-400">Total deliverables matching constraints: {filteredTasks.length}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      id="tasks-project-dropdown"
                      value={selectedProjectFilter}
                      onChange={(e) => setSelectedProjectFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      <option value="all">All Projects</option>
                      {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                  {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <CheckSquare className="w-12 h-12 text-slate-200 mb-2" />
                      <h4 className="font-bold text-slate-700 text-sm">No tasks match your criteria</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">Try relaxing your project filter or resetting the database state.</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : activeTab === 'kanban' ? (
              
              /* KANBAN BOARDS COLUMN MANAGER */
              <div className="flex flex-col h-full min-h-0">
                <div className="bg-slate-100/50 p-3 rounded-lg mb-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    💡 Hover cards on desktop for arrow buttons to advance/regress statuses instantly!
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Board View
                  </span>
                </div>
                <KanbanBoard
                  tasks={filteredTasks}
                  onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  onCreateInStatus={(status) => {
                    setTaskToEdit(null);
                    setIsModalOpen(true);
                    // Pass status initialization parameter after rendering completes, 
                    // this will be handled elegantly via TaskModal's mounting state
                    setTimeout(() => {
                      const statusSelect = document.getElementById('modal-task-status') as HTMLSelectElement;
                      if (statusSelect) {
                        statusSelect.value = status;
                        // dispatch custom change event to trigger React hook update
                        statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                    }, 50);
                  }}
                />
              </div>
            ) : (
              
              /* TIMELINE PROGRESS FLOW */
              <TimelineView
                tasks={filteredTasks}
                onEdit={(t) => { setTaskToEdit(t); setIsModalOpen(true); }}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </section>
      </main>

      {/* TASK DETAILS MODAL */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        teamMembers={teamMembers}
        projects={projects.map(p => p.name)}
      />

    </div>
  );
}
