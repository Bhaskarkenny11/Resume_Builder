import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { SkillItem } from '../../types/resume';
import { Plus, X, Tag } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { currentResume, addSkill, removeSkill } = useResumeStore();
  const [skillInput, setSkillInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Frontend');
  const [selectedLevel, setSelectedLevel] = useState<SkillItem['level']>('Advanced');

  if (!currentResume) return null;
  const skills = currentResume.content.skills;

  const categories = ['Frontend', 'Backend', 'Database', 'Cloud/DevOps', 'Architecture', 'Tools', 'General'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    addSkill(skillInput.trim(), selectedCategory, selectedLevel);
    setSkillInput('');
  };

  // Group by category for organized display
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, SkillItem[]>);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-mono font-bold text-white">Skills & Proficiencies</h3>
        <p className="text-xs font-mono text-zinc-400">Group skills by area so ATS algorithms and recruiters can scan quickly</p>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAdd} className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl p-4 shadow-[inset_0_2px_5px_rgba(0,0,0,0.7)] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1 flex-1 w-full">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. TypeScript, React, Docker..."
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-mono bg-[#090C10] text-zinc-200 border border-white/[0.09] hover:border-white/[0.18] rounded-xl focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0E1218] text-white">{c}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-3 py-2 text-xs font-mono bg-[#090C10] text-zinc-200 border border-white/[0.09] hover:border-white/[0.18] rounded-xl focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]"
            >
              <option value="Beginner" className="bg-[#0E1218] text-white">Beginner</option>
              <option value="Intermediate" className="bg-[#0E1218] text-white">Intermediate</option>
              <option value="Advanced" className="bg-[#0E1218] text-white">Advanced</option>
              <option value="Expert" className="bg-[#0E1218] text-white">Expert</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 shadow-md cursor-pointer whitespace-nowrap"
              style={{
                background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                boxShadow: '0 0 15px rgba(163, 230, 53, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
              }}
            >
              <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Grouped Skills Tags */}
      <div className="space-y-4">
        {Object.entries(groupedSkills).map(([cat, list]) => (
          <div key={cat} className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">{cat}</h4>
            <div className="flex flex-wrap gap-2">
              {list.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#090C10] border border-white/[0.08] hover:border-lime-500/40 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] group transition-all text-xs"
                >
                  <span className="font-mono font-medium text-zinc-200">{skill.name}</span>
                  {skill.level && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-lime-400 font-mono">
                      {skill.level}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors ml-0.5"
                    title="Remove skill"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="p-8 text-center text-xs font-mono text-zinc-500 border border-dashed border-white/[0.1] rounded-2xl bg-[#090C10]">
            No skills added yet. Add core technical and professional competencies above.
          </div>
        )}
      </div>
    </div>
  );
};
