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
  Sparkles, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150">
      <div className="bg-zinc-950 rounded-2xl shadow-2xl max-w-4xl w-full border border-zinc-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-zinc-100">Template Preview</h2>
              <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-900/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{currentTpl.atsRating}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Engineered for strict ATS compliance and vector clarity.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Showcase Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {/* Active Template Title & Hierarchy */}
          <div className="text-center mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full inline-block mb-1.5">
              {currentTpl.categoryTag} • {currentTpl.layoutTag}
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
              {currentTpl.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {currentTpl.headline}
            </p>
          </div>

          {/* Interactive Carousel with Realistic Mini Preview & Details */}
          <div className="relative w-full flex items-center justify-center gap-2 sm:gap-4 py-1">
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all z-20 shrink-0 active:scale-95 shadow-sm"
              title="Previous Template"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Template Card Showcase */}
            <div className="max-w-2xl w-full bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-5 sm:gap-6 min-h-[360px]">
              {/* Miniature Realistic Page Preview */}
              <div className="w-44 sm:w-52 md:w-56 mx-auto md:mx-0 shrink-0 aspect-[210/297] rounded-lg overflow-hidden shadow-lg border border-zinc-300/30 bg-white">
                <TemplateMiniPreview templateId={currentTpl.id} />
              </div>

              {/* Details & Features */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">{currentTpl.headline}</h4>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{currentTpl.description}</p>
                    <div className="mt-2 text-[11px] font-mono text-zinc-300 bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700/50 inline-block">
                      Recommended: {currentTpl.category}
                    </div>
                  </div>

                  {/* Key feature pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-medium text-zinc-500 tracking-wider">
                      Layout Specifications
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentTpl.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Big "Use this template" Button */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleApply(currentTpl.id)}
                    className="b2b-btn-primary w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Use this template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all z-20 shrink-0 active:scale-95 shadow-sm"
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
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'border-zinc-600 bg-zinc-800 text-white font-semibold shadow-xs'
                      : 'border-zinc-800/80 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
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
