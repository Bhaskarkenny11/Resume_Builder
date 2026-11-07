import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { PREBUILT_TEMPLATES, TemplateConfig } from '../../lib/templatesConfig';
import { TemplateMiniPreview } from './TemplateMiniPreview';
import { TemplateId } from '../../types/resume';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users
} from 'lucide-react';

interface PrebuiltTemplatesShelfProps {
  onSelectTemplate?: (templateId: TemplateId) => void;
}

export const PrebuiltTemplatesShelf: React.FC<PrebuiltTemplatesShelfProps> = () => {
  const { createNewResume } = useResumeStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleUseTemplate = async (templateId: TemplateId) => {
    await createNewResume(false, templateId);
  };

  return (
    <section className="mb-10 w-full">
      {/* Header with Title and Scroll Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Resume.io Prebuilt Collection
            </span>
            <span className="text-xs text-slate-400">• 7 Professional Formats</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Prebuilt Resume Templates</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Select an ATS-optimized template recruiters love. Instant vector PDF generation with zero server lag.
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => scroll('left')}
            className="apple-glass-btn p-2 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
            title="Scroll templates left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="apple-glass-btn p-2 rounded-xl text-slate-300 hover:text-white transition-all shadow-sm active:scale-95"
            title="Scroll templates right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PREBUILT_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="group relative flex-none w-[265px] sm:w-[285px] snap-start apple-glass-card hover:border-blue-500/60 rounded-3xl p-4 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Top Meta info */}
            <div className="mb-3">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {tpl.name}
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 shrink-0">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-slate-500" />
                <span>{tpl.stats}</span>
              </p>
            </div>

            {/* Realistic Mini Document Container (A4 aspect-ratio 210/297) */}
            <div className="relative w-full aspect-[210/297] rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white group-hover:shadow-2xl transition-all duration-200">
              <TemplateMiniPreview templateId={tpl.id} />

              {/* Hover Overlay with Signature Apple-Glossy "Use this template" Button */}
              <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center p-4">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(tpl.id)}
                  className="apple-primary-btn w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use this template</span>
                </button>
                <p className="text-[10px] text-white/80 mt-2 font-medium text-center">
                  Instant Vector PDF & 100% Client-Side
                </p>
              </div>
            </div>

            {/* Bottom Details & Quick Button */}
            <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                {tpl.category.split(',')[0]}
              </span>

              <button
                type="button"
                onClick={() => handleUseTemplate(tpl.id)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline cursor-pointer"
              >
                <span>Select</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
