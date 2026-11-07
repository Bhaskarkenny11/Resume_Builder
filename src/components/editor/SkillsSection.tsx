import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { SkillItem } from '../../types/resume';
import { Plus, X, Tag } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { currentResume, addSkill, updateSkill, removeSkill } = useResumeStore();
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
        <h3 className="text-sm font-semibold text-slate-800">Skills & Proficiencies</h3>
        <p className="text-xs text-slate-500">Group skills by area so ATS algorithms and recruiters can scan quickly</p>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleAdd} className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. TypeScript, React, Docker..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Grouped Skills Tags */}
      <div className="space-y-4">
        {Object.entries(groupedSkills).map(([cat, list]) => (
          <div key={cat} className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{cat}</h4>
            <div className="flex flex-wrap gap-2">
              {list.map((skill) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-xs group transition-all text-xs"
                >
                  <span className="font-medium text-slate-800">{skill.name}</span>
                  {skill.level && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                      {skill.level}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition-colors ml-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
            No skills added yet. Add core technical and professional competencies above.
          </div>
        )}
      </div>
    </div>
  );
};
