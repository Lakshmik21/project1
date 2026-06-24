import React from 'react';
import { Task, TaskStatus } from '../types';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Calendar, CheckSquare, Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onCreateInStatus?: (status: TaskStatus) => void;
}

export default function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange, onCreateInStatus }: KanbanBoardProps) {
  const columns: { id: TaskStatus; title: string; color: string; border: string; bg: string; text: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-500', border: 'border-slate-200', bg: 'bg-slate-50/50', text: 'text-slate-700' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-indigo-500', border: 'border-indigo-100', bg: 'bg-indigo-50/10', text: 'text-indigo-700' },
    { id: 'in_review', title: 'In Review', color: 'bg-purple-500', border: 'border-purple-100', bg: 'bg-purple-50/10', text: 'text-purple-700' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500', border: 'border-emerald-100', bg: 'bg-emerald-50/10', text: 'text-emerald-700' }
  ];

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-rose-50 text-rose-600">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-amber-50 text-amber-600">Med</span>;
      case 'low':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-emerald-50 text-emerald-600">Low</span>;
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'done';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'done') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div id="kanban-board" className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0 items-start overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div
            id={`kanban-col-${column.id}`}
            key={column.id}
            className={`flex flex-col rounded-xl border ${column.border} ${column.bg} p-4 w-full min-w-[250px] max-h-[70vh]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.color}`}></span>
                <h3 className={`font-semibold text-sm ${column.text}`}>{column.title}</h3>
                <span className="bg-slate-200/60 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              {onCreateInStatus && (
                <button
                  id={`create-task-col-${column.id}`}
                  onClick={() => onCreateInStatus(column.id)}
                  className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  title={`Add Task to ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[100px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-400">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
                  const totalSubtasks = task.subtasks.length;
                  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                  const prevStatus = getPrevStatus(task.status);
                  const nextStatus = getNextStatus(task.status);

                  return (
                    <div
                      id={`kanban-card-${task.id}`}
                      key={task.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col gap-3 group relative"
                    >
                      {/* Top badging */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wide bg-indigo-50 px-1.5 py-0.5 rounded truncate max-w-[120px]" title={task.project}>
                          {task.project}
                        </span>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 cursor-pointer" onClick={() => onEdit(task)}>
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                      </div>

                      {/* Subtasks Progress */}
                      {totalSubtasks > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Checklist ({completedSubtasks}/{totalSubtasks})</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-200" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                        </div>
                      )}

                      {/* Footer: Date and Assignees */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-50 gap-2 shrink-0">
                        {/* Due Date */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-rose-500 font-semibold' : ''}>
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Assignees */}
                        <div className="flex -space-x-1 overflow-hidden shrink-0">
                          {task.assignees.slice(0, 3).map((assignee) => (
                            <div
                              key={assignee.id}
                              className={`w-5.5 h-5.5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white ${assignee.color}`}
                              title={assignee.name}
                            >
                              {assignee.initials}
                            </div>
                          ))}
                          {task.assignees.length > 3 && (
                            <div className="w-5.5 h-5.5 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                              +{task.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Move and Modification Toolbar */}
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 bg-slate-50/50 -mx-4 -mb-4 p-2 rounded-b-xl opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150 gap-2">
                        {/* Left Action */}
                        <button
                          id={`move-left-${task.id}`}
                          onClick={() => prevStatus && onStatusChange(task.id, prevStatus)}
                          disabled={!prevStatus}
                          className={`p-1 rounded hover:bg-slate-200 transition-colors shrink-0 ${!prevStatus ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500'}`}
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit/Delete tools */}
                        <div className="flex items-center gap-1.5">
                          <button
                            id={`edit-card-${task.id}`}
                            onClick={() => onEdit(task)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            id={`delete-card-${task.id}`}
                            onClick={() => onDelete(task.id)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Right Action */}
                        <button
                          id={`move-right-${task.id}`}
                          onClick={() => nextStatus && onStatusChange(task.id, nextStatus)}
                          disabled={!nextStatus}
                          className={`p-1 rounded hover:bg-slate-200 transition-colors shrink-0 ${!nextStatus ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500'}`}
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
