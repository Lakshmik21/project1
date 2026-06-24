import React from 'react';
import { Task, TeamMember } from '../types';
import { Calendar, CheckSquare, MoreVertical, Edit2, Trash2, ArrowRight } from 'lucide-react';

interface TaskCardProps {
  key?: React.Key;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityColors = {
    high: { bg: 'bg-rose-50 text-rose-600', text: 'High' },
    medium: { bg: 'bg-amber-50 text-amber-600', text: 'Med' },
    low: { bg: 'bg-emerald-50 text-emerald-600', text: 'Low' }
  };

  const statusList: { value: Task['status']; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' }
  ];

  return (
    <div id={`task-card-${task.id}`} className="p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 group">
      {/* Complete Checkbox */}
      <button
        id={`toggle-status-${task.id}`}
        onClick={() => onStatusChange(task.id, task.status === 'done' ? 'todo' : 'done')}
        className={`w-5 h-5 border-2 rounded shrink-0 cursor-pointer flex items-center justify-center transition-colors ${
          task.status === 'done'
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-indigo-500'
        }`}
      >
        {task.status === 'done' && (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded">
            {task.project}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${priorityColors[task.priority].bg}`}>
            {priorityColors[task.priority].text}
          </span>
          {task.status === 'in_review' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-purple-50 text-purple-600">
              In Review
            </span>
          )}
        </div>
        <h4 className={`text-sm font-medium text-slate-800 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description}</p>
        
        {/* Subtask progress and Due Date */}
        <div className="flex items-center gap-4 mt-2.5 text-slate-400">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-rose-500 font-medium' : 'text-slate-500'}>
              {task.dueDate}
            </span>
          </div>
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">{completedSubtasks}/{totalSubtasks} Subtasks ({progressPercent}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Assignees & Quick Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
        {/* Assignees */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {task.assignees.map((assignee) => (
            <div
              key={assignee.id}
              className={`w-6.5 h-6.5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${assignee.color}`}
              title={`${assignee.name} - ${assignee.role}`}
            >
              {assignee.initials}
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Status Quick-Cycle Dropdown */}
          <select
            id={`status-dropdown-${task.id}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            {statusList.map(st => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>

          {/* Edit Button */}
          <button
            id={`edit-task-btn-${task.id}`}
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-50 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            id={`delete-task-btn-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-50 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
