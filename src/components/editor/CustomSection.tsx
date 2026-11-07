import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CustomSection as CustomSecType } from '../../types/resume';
import { Plus, Trash2, Calendar, Sparkles } from 'lucide-react';

interface CustomSectionProps {
  section: CustomSecType;
}

export const CustomSectionEditor: React.FC<CustomSectionProps> = ({ section }) => {
  const { 
    updateCustomSectionTitle, 
    addCustomSectionItem, 
    updateCustomSectionItem, 
    removeCustomSectionItem, 
    removeCustomSection 
  } = useResumeStore();

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto focus if title is generic default
  useEffect(() => {
    if (section.title === 'Custom Section' && titleInputRef.current) {
      titleInputRef.current.select();
    }
  }, []);

  const suggestions = [
    'Publications',
    'Volunteering',
    'Awards & Honors',
    'Speaking & Conferences',
    'Certificates',
    'Patents',
  ];

  return (
    <div className="space-y-4">
      {/* FlowCV-Style Section Header */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Section Title
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={titleInputRef}
              type="text"
              value={section.title}
              onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
              placeholder="e.g. Publications, Volunteer Work, Awards"
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete the entire "${section.title}" section?`)) {
                  removeCustomSection(section.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills (FlowCV style) */}
        <div>
          <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Popular Suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateCustomSectionTitle(section.id, s)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  section.title.toLowerCase() === s.toLowerCase()
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {section.items.map((item, idx) => (
          <div key={item.id} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Title / Topic / Name
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, { title: e.target.value })}
                    placeholder="e.g. Lead Speaker or Paper Title"
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                    Organization / Event / Context
                  </label>
                  <input
                    type="text"
                    value={item.subtitle || ''}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, { subtitle: e.target.value })}
                    placeholder="e.g. Tech Summit 2024"
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCustomSectionItem(section.id, item.id)}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md mt-4"
                title="Remove Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                Description / Key Highlights
              </label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
                placeholder="Details, key outcomes, or bullet points..."
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={() => addCustomSectionItem(section.id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Entry
      </button>
    </div>
  );
};
