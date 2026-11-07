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
          <h3 className="text-sm font-semibold text-slate-800">Languages</h3>
          <p className="text-xs text-slate-500">
            {isCefr ? 'CEFR Framework (European standard A1-C2)' : 'Language proficiencies and fluency'}
          </p>
        </div>
        <button
          type="button"
          onClick={addLanguage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Language
        </button>
      </div>

      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="relative">
                <LangIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                  placeholder="e.g. English, German, French"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {isCefr ? (
                <div>
                  <select
                    value={lang.cefrLevel || 'B2'}
                    onChange={(e) => updateLanguage(lang.id, { cefrLevel: e.target.value as CEFRLevel, proficiency: e.target.options[e.target.selectedIndex].text })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {cefrOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
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
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="Conversational">Conversational</option>
                    <option value="Professional Working">Professional Working</option>
                    <option value="Full Professional">Full Professional</option>
                    <option value="Native / Bilingual">Native / Bilingual</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeLanguage(lang.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
