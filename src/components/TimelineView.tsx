import React from 'react';
import { Task } from '../types';
import { Calendar, CheckCircle2, Clock, Flame } from 'lucide-react';

export interface TimelineViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export default function TimelineView({ tasks, onEdit, onStatusChange }: TimelineViewProps) {
  // Categorize tasks by deadline proximity
  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date(todayStr);

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Saturday
    return { start, end };
  };

  const { start: thisWeekStart, end: thisWeekEnd } = getWeekRange(today);
  const nextWeekStart = new Date(thisWeekEnd);
  nextWeekStart.setDate(nextWeekStart.getDate() + 1);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

  const categorize = (task: Task) => {
    if (task.status === 'done') return 'completed';
    
    const taskDate = new Date(task.dueDate);
    const taskDateStr = task.dueDate;

    if (taskDateStr < todayStr) return 'overdue';
    if (taskDateStr === todayStr) return 'today';
    if (taskDate >= thisWeekStart && taskDate <= thisWeekEnd) return 'this_week';
    if (taskDate >= nextWeekStart && taskDate <= nextWeekEnd) return 'next_week';
    return 'future';
  };

  const categories = [
    { id: 'overdue', label: 'Overdue / Urgent', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-150', icon: <Flame className="w-4 h-4 text-rose-500 shrink-0" /> },
    { id: 'today', label: 'Due Today', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-150', icon: <Clock className="w-4 h-4 text-amber-500 shrink-0" /> },
    { id: 'this_week', label: 'This Week', color: 'text-indigo-600', bg: 'bg-indigo-50/40', border: 'border-indigo-150', icon: <Calendar className="w-4 h-4 text-indigo-500 shrink-0" /> },
    { id: 'next_week', label: 'Next Week', color: 'text-purple-600', bg: 'bg-purple-50/40', border: 'border-purple-150', icon: <Calendar className="w-4 h-4 text-purple-500 shrink-0" /> },
    { id: 'future', label: 'Future Horizons', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-150', icon: <Calendar className="w-4 h-4 text-slate-400 shrink-0" /> },
    { id: 'completed', label: 'Archived / Completed', color: 'text-emerald-600', bg: 'bg-emerald-50/40', border: 'border-emerald-150', icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> }
  ];

  const groupedTasks = tasks.reduce((acc, task) => {
    const cat = categorize(task);
    acc[cat].push(task);
    return acc;
  }, { overdue: [], today: [], this_week: [], next_week: [], future: [], completed: [] } as Record<string, Task[]>);

  const priorityColors = {
    high: 'border-l-4 border-l-rose-500',
    medium: 'border-l-4 border-l-amber-500',
    low: 'border-l-4 border-l-emerald-500'
  };

  return (
    <div id="timeline-view" className="flex-1 overflow-y-auto space-y-6 max-h-[75vh] pr-2">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Task Timeline Scheduler</h3>
          <p className="text-xs text-slate-500">Track milestones relative to today's date: <span className="font-semibold text-indigo-600">{todayStr}</span></p>
        </div>
        <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> High</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Medium</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Low</div>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {categories.map((category) => {
          const list = groupedTasks[category.id] || [];
          if (list.length === 0) return null;

          return (
            <div id={`timeline-cat-${category.id}`} key={category.id} className="relative pl-10 space-y-3">
              {/* Category Node Indicator */}
              <div className="absolute left-1 top-1.5 z-10 w-5.5 h-5.5 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>

              {/* Category Header */}
              <div className="flex items-center gap-2">
                {category.icon}
                <h4 className={`font-semibold text-xs uppercase tracking-wider ${category.color}`}>
                  {category.label} ({list.length})
                </h4>
              </div>

              {/* Task Cards in this category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((task) => (
                  <div
                    id={`timeline-card-${task.id}`}
                    key={task.id}
                    className={`bg-white p-4 rounded-xl border border-slate-150 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer ${priorityColors[task.priority]} flex flex-col justify-between gap-3`}
                    onClick={() => onEdit(task)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          {task.project}
                        </span>
                        <h5 className={`text-xs font-semibold text-slate-800 truncate ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                      
                      <div className="flex -space-x-1 shrink-0">
                        {task.assignees.map((a) => (
                          <div
                            key={a.id}
                            className={`w-5.5 h-5.5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white shrink-0 ${a.color}`}
                            title={a.name}
                          >
                            {a.initials}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Due {task.dueDate}
                      </span>
                      
                      <select
                        id={`timeline-status-${task.id}`}
                        value={task.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          onStatusChange(task.id, e.target.value as Task['status']);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-medium bg-slate-50 border border-slate-200 text-slate-600 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
