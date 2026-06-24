import React, { useState, useEffect } from 'react';
import { Task, TeamMember, SubTask, TaskStatus, TaskPriority } from '../types';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
  teamMembers: TeamMember[];
  projects: string[];
}

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit, teamMembers, projects }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [project, setProject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<TeamMember[]>([]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setProject(taskToEdit.project);
      setDueDate(taskToEdit.dueDate);
      setSelectedAssignees(taskToEdit.assignees || []);
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      // Clear fields for new task
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setProject(projects[0] || 'Marketing App');
      
      // Default to one week from today
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      setDueDate(nextWeek.toISOString().split('T')[0]);
      setSelectedAssignees([]);
      setSubtasks([]);
    }
  }, [taskToEdit, isOpen, projects]);

  if (!isOpen) return null;

  const handleAssigneeToggle = (member: TeamMember) => {
    if (selectedAssignees.some(a => a.id === member.id)) {
      setSelectedAssignees(selectedAssignees.filter(a => a.id !== member.id));
    } else {
      setSelectedAssignees([...selectedAssignees, member]);
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(sub => sub.id === id ? { ...sub, completed: !sub.completed } : sub));
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(sub => sub.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedTask: Task = {
      id: taskToEdit?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      project,
      dueDate,
      assignees: selectedAssignees,
      subtasks,
      createdAt: taskToEdit?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(savedTask);
    onClose();
  };

  return (
    <div id="task-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-800 text-base">
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h3>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Task Title *</label>
            <input
              id="modal-task-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build Secure JWT Token Refresh Flow"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Description</label>
            <textarea
              id="modal-task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clear, actionable breakdown of the deliverables..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Project</label>
              <select
                id="modal-task-project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              >
                {projects.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Due Date</label>
              <input
                id="modal-task-duedate"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Status</label>
              <select
                id="modal-task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Completed (Done)</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((prio) => (
                  <button
                    id={`modal-prio-${prio}`}
                    key={prio}
                    type="button"
                    onClick={() => setPriority(prio)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                      priority === prio
                        ? prio === 'high'
                          ? 'bg-rose-50 border-rose-400 text-rose-700'
                          : prio === 'medium'
                          ? 'bg-amber-50 border-amber-400 text-amber-700'
                          : 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignees checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Assignees</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {teamMembers.map((member) => {
                const isSelected = selectedAssignees.some(a => a.id === member.id);
                return (
                  <button
                    id={`assignee-toggle-${member.id}`}
                    key={member.id}
                    type="button"
                    onClick={() => handleAssigneeToggle(member)}
                    className={`flex items-center gap-2.5 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected ? 'border-indigo-400 bg-indigo-50/50' : 'border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${member.color}`}>
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700 truncate">{member.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks Manager */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Subtask Deliverables</label>
            
            {/* Subtasks List */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5 max-h-40 overflow-y-auto p-1">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-150 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(sub.id)}
                      className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${sub.completed ? 'text-emerald-500 fill-emerald-50' : 'text-slate-300'}`} />
                      <span className={`text-xs text-slate-700 truncate ${sub.completed ? 'line-through text-slate-400' : ''}`}>
                        {sub.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Subtask Input */}
            <div className="flex gap-2">
              <input
                id="modal-new-subtask-input"
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                id="modal-add-subtask-btn"
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            id="modal-cancel-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="modal-submit-btn"
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>

      </div>
    </div>
  );
}
