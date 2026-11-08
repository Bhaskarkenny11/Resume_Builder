import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getAllTemplates } from '../../lib/customAssetsManager';
import { TemplateMiniPreview } from './TemplateMiniPreview';
import { TemplateId } from '../../types/resume';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Plane,
  ShieldCheck 
} from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplateId?: TemplateId | null;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({ 
  isOpen, 
  onClose,
  initialTemplateId 
}) => {
  const { currentResume, activeTab, setTemplate, createNewResume } = useResumeStore();

  const templates = getAllTemplates();

  // Active index state
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (initialTemplateId) {
      const idx = templates.findIndex((t) => t.id === initialTemplateId);
      if (idx >= 0) setActiveIdx(idx);
    } else if (currentResume?.template_id) {
      const idx = templates.findIndex((t) => t.id === currentResume.template_id);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [initialTemplateId, currentResume, isOpen]);

  if (!isOpen) return null;

  const currentTpl = templates[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : templates.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < templates.length - 1 ? prev + 1 : 0));
  };

  const handleApply = async (id: TemplateId) => {
    if (activeTab === 'dashboard') {
      await createNewResume(false, id);
    } else {
      setTemplate(id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="bg-[#12161E] rounded-[32px] shadow-2xl max-w-4xl w-full border border-white/[0.08] overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0E1218] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold font-mono text-white tracking-tight">TEMPLATE SPECIFICATION</h2>
              <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-900/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentTpl.atsRating}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Engineered for strict ATS compliance and vector clarity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Showcase Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {/* Active Template Title & Hierarchy */}
          <div className="text-center mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-lime-400 bg-[#090B0E] border border-lime-500/30 px-3 py-1 rounded-full inline-block mb-1.5 shadow-[0_0_12px_rgba(163,230,53,0.15)]">
              {currentTpl.categoryTag} • {currentTpl.layoutTag}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              {currentTpl.name}
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {currentTpl.headline}
            </p>
          </div>

          {/* Interactive Carousel with Realistic Mini Preview & Details */}
          <div className="relative w-full flex items-center justify-center gap-2 sm:gap-4 py-1">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-xl bg-[#0E1218] border border-white/[0.08] hover:border-lime-500/40 hover:bg-[#161C26] text-zinc-300 hover:text-white transition-all z-20 shrink-0 active:scale-95 shadow-md"
              title="Previous Template"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Template Card Showcase */}
            <div 
              className="max-w-2xl w-full bg-[#0B0D12] border border-white/[0.08] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-5 sm:gap-6 min-h-[360px]"
              style={{
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.85)',
              }}
            >
              {/* Miniature Realistic Page Preview */}
              <div className="w-44 sm:w-52 md:w-56 mx-auto md:mx-0 shrink-0 aspect-[210/297] rounded-xl overflow-hidden shadow-2xl border border-white/[0.1] bg-white">
                <TemplateMiniPreview templateId={currentTpl.id} />
              </div>

              {/* Details & Features */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm font-bold font-mono text-white">{currentTpl.headline}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-mono">{currentTpl.description}</p>
                    <div className="mt-2 text-[11px] font-mono text-zinc-300 bg-[#12161E] px-2.5 py-1 rounded-md border border-white/[0.08] inline-block">
                      Recommended: {currentTpl.category}
                    </div>
                  </div>

                  {/* Key feature pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider">
                      Layout Specifications
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentTpl.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-[#090C10] p-2 rounded-xl border border-white/[0.08] font-mono">
                          <Check className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Big Luminous Lime Button */}
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleApply(currentTpl.id)}
                    className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-mono font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 shadow-md cursor-pointer"
                    style={{
                      background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                      boxShadow: '0 0 20px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <Plane className="w-4 h-4 text-black stroke-[2.5]" />
                    <span>Apply This Template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-xl bg-[#0E1218] border border-white/[0.08] hover:border-lime-500/40 hover:bg-[#161C26] text-zinc-300 hover:text-white transition-all z-20 shrink-0 active:scale-95 shadow-md"
              title="Next Template"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto p-1 max-w-full no-scrollbar">
            {templates.map((t, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'border-lime-500/50 bg-[#181D26] text-lime-400 font-bold shadow-[0_0_12px_rgba(163,230,53,0.2)]'
                      : 'border-white/[0.08] bg-[#0E1218] text-zinc-400 hover:text-white hover:bg-[#12161E]'
                  }`}
                >
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
