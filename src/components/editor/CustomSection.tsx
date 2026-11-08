import React, { useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CustomSection as CustomSecType } from '../../types/resume';
import { Plus, Trash2, Sparkles } from 'lucide-react';

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
      {/* Section Header */}
      <div className="p-4 bg-[#0B0E14] border border-white/[0.08] rounded-2xl shadow-[inset_0_2px_5px_rgba(0,0,0,0.7)] space-y-3">
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
            Section Title
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={titleInputRef}
              type="text"
              value={section.title}
              onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
              placeholder="e.g. Publications, Volunteer Work, Awards"
              className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono font-bold text-white bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] rounded-xl focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.18)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all"
            />
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete the entire "${section.title}" section?`)) {
                  removeCustomSection(section.id);
                }
              }}
              className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors shrink-0"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div>
          <div className="text-[10px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Popular Suggestions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateCustomSectionTitle(section.id, s)}
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg font-medium transition-all border ${
                  section.title.toLowerCase() === s.toLowerCase()
                    ? 'bg-lime-400 text-black font-bold border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                    : 'bg-[#12161E] text-zinc-300 hover:text-white hover:bg-[#181D26] border-white/[0.08]'
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
        {section.items.map((item) => (
          <div key={item.id} className="p-4 bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] space-y-3 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1">
                    Title / Topic / Name
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, { title: e.target.value })}
                    placeholder="e.g. Lead Speaker or Paper Title"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1">
                    Organization / Event / Context
                  </label>
                  <input
                    type="text"
                    value={item.subtitle || ''}
                    onChange={(e) => updateCustomSectionItem(section.id, item.id, { subtitle: e.target.value })}
                    placeholder="e.g. Tech Summit 2024"
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-lime-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCustomSectionItem(section.id, item.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl mt-4 transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1">
                Description / Key Highlights
              </label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
                placeholder="Details, key outcomes, or bullet points..."
                className="w-full p-3 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus:ring-1 focus:ring-lime-500/30 rounded-xl text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all focus:outline-none leading-relaxed font-sans"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={() => addCustomSectionItem(section.id)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-lime-400" />
        <span>Add Entry</span>
      </button>
    </div>
  );
};
