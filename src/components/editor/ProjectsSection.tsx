import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, Globe, Github, ChevronUp, ChevronDown, FolderGit2, Tag } from 'lucide-react';

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
          <h3 className="text-sm font-mono font-bold text-white">Projects & Open Source</h3>
          <p className="text-xs font-mono text-zinc-400">Personal or commercial initiatives and live links</p>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((proj) => {
          const isOpen = openIds[proj.id] !== false; // default open
          return (
            <div
              key={proj.id}
              className="bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
            >
              <div className="flex items-center justify-between p-3.5 bg-[#0E1218] border-b border-white/[0.08]">
                <div onClick={() => toggleOpen(proj.id)} className="flex-1 cursor-pointer">
                  <span className="text-xs sm:text-sm font-mono font-bold text-white">
                    {proj.title || 'Untitled Project'}
                  </span>
                  {proj.subtitle && (
                    <span className="text-xs font-mono text-zinc-400 ml-2">
                      ({proj.subtitle})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleOpen(proj.id)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 space-y-3.5 bg-[#0E1218]/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Project Name */}
                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                        Project Name
                      </label>
                      <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                          <FolderGit2 className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                          placeholder="e.g. KubePulse"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                        Short Subtitle / Role
                      </label>
                      <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                          <Tag className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={proj.subtitle || ''}
                          onChange={(e) => updateProject(proj.id, { subtitle: e.target.value })}
                          placeholder="e.g. Distributed Telemetry Agent"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Live Demo */}
                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                        Live Demo Link
                      </label>
                      <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                          placeholder="https://myproject.com"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* GitHub Link */}
                    <div>
                      <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                        GitHub / Repo Link
                      </label>
                      <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                          <Github className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          value={proj.githubUrl || ''}
                          onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                          placeholder="github.com/user/repo"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                      Description & Impact
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder="• Engineered with Go, React, and eBPF. Starred by 3k+ developers..."
                      className="w-full p-3 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus:ring-1 focus:ring-lime-500/30 rounded-xl text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all focus:outline-none leading-relaxed font-sans"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-white/[0.1] rounded-2xl bg-[#090C10] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
            <p className="text-xs font-mono text-zinc-400">No project showcases added yet.</p>
            <button
              type="button"
              onClick={addProject}
              className="mt-2 text-xs font-mono font-bold text-lime-400 hover:underline"
            >
              + Add your first project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
