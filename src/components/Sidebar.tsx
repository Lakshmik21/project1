import React from "react";
import { LayoutDashboard, CheckSquare, Calendar, Folder, Plus, LogOut, Code, Award } from "lucide-react";
import { Project } from "../types";

interface SidebarProps {
  projects: Project[];
  activeProject: string | null;
  setActiveProject: (projectName: string | null) => void;
  activeTab: "dashboard" | "my-tasks" | "timeline";
  setActiveTab: (tab: "dashboard" | "my-tasks" | "timeline") => void;
  onAddProjectClick: () => void;
}

export default function Sidebar({
  projects,
  activeProject,
  setActiveProject,
  activeTab,
  setActiveTab,
  onAddProjectClick
}: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 flex flex-col shrink-0 h-full text-slate-400 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
          M
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg tracking-tight font-display leading-tight">
            TaskMaster
          </span>
          <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase font-mono">
            MERN STACK
          </span>
        </div>
      </div>

      {/* Navigation Body */}
      <nav className="mt-6 flex-1 overflow-y-auto px-3 space-y-7">
        {/* Main Views */}
        <div>
          <div className="px-3 mb-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Main
          </div>
          <div className="space-y-1">
            {/* Dashboard Link */}
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setActiveProject(null); // Clear project filter to show global dashboard
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "dashboard" && activeProject === null
                  ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500 pl-2 rounded-l-none font-semibold"
                  : "hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard Overview</span>
            </button>

            {/* My Tasks Link */}
            <button
              onClick={() => {
                setActiveTab("my-tasks");
                setActiveProject(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "my-tasks" && activeProject === null
                  ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500 pl-2 rounded-l-none font-semibold"
                  : "hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>My Tasks</span>
            </button>

            {/* Timeline Link */}
            <button
              onClick={() => {
                setActiveTab("timeline");
                setActiveProject(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "timeline" && activeProject === null
                  ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500 pl-2 rounded-l-none font-semibold"
                  : "hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Timeline Calendar</span>
            </button>
          </div>
        </div>

        {/* Dynamic Projects Lists */}
        <div>
          <div className="px-3 mb-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span>Projects</span>
            <button 
              onClick={onAddProjectClick}
              className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
              title="Create New Project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {projects.map(p => {
              const isSelected = activeProject === p.name;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p.name);
                    // Standardize back to dashboard view with filter active
                    setActiveTab("dashboard");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500 pl-2 rounded-l-none font-semibold"
                      : "hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${p.color} shrink-0`}></span>
                    <span className="truncate">{p.name}</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono shrink-0">
                    {p.velocity}%
                  </span>
                </button>
              );
            })}
            
            {projects.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-600 italic">No active projects</div>
            )}
          </div>
        </div>
      </nav>

      {/* User Session Profile Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-slate-700 hover:bg-indigo-600 border-2 border-slate-800 text-white font-semibold flex items-center justify-center text-sm shadow-inner transition-colors shrink-0">
            JS
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-slate-200 truncate leading-none mb-1">
              James Smith
            </span>
            <span className="text-[10.5px] text-slate-500 font-medium truncate">
              Product Manager
            </span>
          </div>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" title="Online" />
        </div>
      </div>
    </aside>
  );
}
