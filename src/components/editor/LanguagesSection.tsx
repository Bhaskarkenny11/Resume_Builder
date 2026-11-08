import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { CEFRLevel } from '../../types/resume';
import { Plus, Trash2, Languages as LangIcon } from 'lucide-react';

export const LanguagesSection: React.FC = () => {
  const { currentResume, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  if (!currentResume) return null;
  const languages = currentResume.content.languages;
  const presetConfig = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const isCefr = presetConfig.features.cefrLanguageGrid;

  const cefrOptions: { value: CEFRLevel; label: string; desc: string }[] = [
    { value: 'A1', label: 'A1 - Beginner', desc: 'Basic phrases' },
    { value: 'A2', label: 'A2 - Elementary', desc: 'Routine tasks' },
    { value: 'B1', label: 'B1 - Intermediate', desc: 'Independent user' },
    { value: 'B2', label: 'B2 - Upper Intermediate', desc: 'Complex text & spontaneous' },
    { value: 'C1', label: 'C1 - Advanced', desc: 'Flexible for academic & professional' },
    { value: 'C2', label: 'C2 - Mastery', desc: 'Native or near-native precision' },
    { value: 'Native', label: 'Native / Bilingual', desc: 'Mother tongue' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold text-white">Languages</h3>
          <p className="text-xs font-mono text-zinc-400">
            {isCefr ? 'CEFR Framework (European standard A1-C2)' : 'Language proficiencies and fluency'}
          </p>
        </div>
        <button
          type="button"
          onClick={addLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Language</span>
        </button>
      </div>

      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="p-3.5 bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-3 transition-all">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Language Name */}
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <LangIcon className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                  placeholder="e.g. English, German, French"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>

              {/* Proficiency */}
              {isCefr ? (
                <div>
                  <select
                    value={lang.cefrLevel || 'B2'}
                    onChange={(e) => updateLanguage(lang.id, { cefrLevel: e.target.value as CEFRLevel, proficiency: e.target.options[e.target.selectedIndex].text })}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#090C10] text-zinc-200 border border-white/[0.09] hover:border-white/[0.18] rounded-xl focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]"
                  >
                    {cefrOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0E1218] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-[#090C10] text-zinc-200 border border-white/[0.09] hover:border-white/[0.18] rounded-xl focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]"
                  >
                    <option value="Elementary" className="bg-[#0E1218] text-white">Elementary</option>
                    <option value="Conversational" className="bg-[#0E1218] text-white">Conversational</option>
                    <option value="Professional Working" className="bg-[#0E1218] text-white">Professional Working</option>
                    <option value="Full Professional" className="bg-[#0E1218] text-white">Full Professional</option>
                    <option value="Native / Bilingual" className="bg-[#0E1218] text-white">Native / Bilingual</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeLanguage(lang.id)}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors shrink-0"
              title="Remove language"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {languages.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-white/[0.1] rounded-2xl bg-[#090C10] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
            <p className="text-xs font-mono text-zinc-400">No languages added yet.</p>
            <button
              type="button"
              onClick={addLanguage}
              className="mt-2 text-xs font-mono font-bold text-lime-400 hover:underline"
            >
              + Add a language
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
