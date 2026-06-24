import React, { useState } from "react";
import { TrendingUp, Plus, X, FolderKanban, Palette, User } from "lucide-react";
import { Project, TeamMember } from "../types";

interface ProjectVelocityProps {
  projects: Project[];
  onAddProject: (newProject: Project) => void;
  teamMembers: TeamMember[];
}

const ACCENT_COLORS = [
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber/Orange
  "#ec4899", // Pink
  "#a855f7", // Purple
  "#06b6d4"  // Cyan/Teal
];

export default function ProjectVelocity({ projects, onAddProject, teamMembers }: ProjectVelocityProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#10b981");
  const [selectedLead, setSelectedLead] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!projectName.trim()) {
      setError("Please specify a project name");
      return;
    }

    if (projects.some(p => p.name.toLowerCase() === projectName.trim().toLowerCase())) {
      setError("Project name already exists");
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectName.trim(),
      color: selectedColor,
      velocity: 0,
      lead: selectedLead || teamMembers[0]?.name || "James Smith"
    };

    onAddProject(newProject);
    setProjectName("");
    setSelectedLead("");
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col select-none">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="space-y-0.5">
          <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />
            Project Velocity
          </h3>
          <p className="text-[10px] text-slate-400">Calculated completion ratios</p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-slate-100 cursor-pointer flex items-center gap-0.5 shadow-xs bg-slate-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3.5 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500 font-mono">New Project Setup</span>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <p className="text-[10.5px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Analytics Platform"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Color Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3 h-3 text-slate-400" /> Style Accent
              </label>
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700"
              >
                <option value="#10b981">🟢 Green</option>
                <option value="#6366f1">🔵 Indigo</option>
                <option value="#f59e0b">🟡 Amber</option>
                <option value="#ec4899">🌸 Pink</option>
                <option value="#a855f7">🟣 Purple</option>
                <option value="#06b6d4">🐬 Cyan</option>
              </select>
            </div>

            {/* Lead selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Project Lead
              </label>
              <select
                value={selectedLead}
                onChange={e => setSelectedLead(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700"
              >
                <option value="">Select Lead</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-1 border-t border-slate-200/50">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold hover:bg-slate-100/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      ) : null}

      {/* Projects Velocity Lists */}
      <div className="space-y-4 max-h-[25vh] overflow-y-auto pr-1">
        {projects.map(p => (
          <div key={p.id} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 flex items-center gap-1.5 truncate max-w-[170px]" title={p.name}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name}</span>
              </span>
              <span className="text-slate-900 font-mono text-[11px]">{p.velocity}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  backgroundColor: p.color, 
                  width: `${p.velocity}%` 
                }}
              />
            </div>
            {p.lead && (
              <span className="text-[9px] text-slate-400 font-medium block pl-4">
                Lead: {p.lead}
              </span>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-4 text-slate-400 text-xs italic flex flex-col items-center gap-1">
            <FolderKanban className="w-8 h-8 text-slate-300" />
            <span>No active projects</span>
          </div>
        )}
      </div>
    </div>
  );
}
