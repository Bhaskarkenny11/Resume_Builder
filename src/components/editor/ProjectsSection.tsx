import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ProjectItem } from '../../types/resume';
import { Plus, Trash2, Globe, Github, ChevronUp, ChevronDown } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { currentResume, addProject, updateProject, removeProject } = useResumeStore();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  if (!currentResume) return null;
  const projects = currentResume.content.projects;

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Projects & Open Source</h3>
          <p className="text-xs text-slate-500">Showcase personal or commercial initiatives and live links</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => {
          const isOpen = openIds[proj.id] !== false; // default open
          return (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all overflow-hidden"
            >
              <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border-b border-slate-100">
                <div onClick={() => toggleOpen(proj.id)} className="flex-1 cursor-pointer">
                  <span className="text-sm font-semibold text-slate-800">
                    {proj.title || 'Untitled Project'}
                  </span>
                  {proj.subtitle && (
                    <span className="text-xs text-slate-500 ml-2">
                      ({proj.subtitle})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleOpen(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder="e.g. KubePulse"
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Short Subtitle / Role
                      </label>
                      <input
                        type="text"
                        value={proj.subtitle || ''}
                        onChange={(e) => updateProject(proj.id, { subtitle: e.target.value })}
                        placeholder="e.g. Distributed Telemetry Agent"
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Live Demo Link
                      </label>
                      <div className="relative">
                        <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                          placeholder="https://myproject.com"
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        GitHub / Repo Link
                      </label>
                      <div className="relative">
                        <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={proj.githubUrl || ''}
                          onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                          placeholder="github.com/user/repo"
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Description & Impact
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder="• Engineered with Go, React, and eBPF. Starred by 3k+ developers..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
