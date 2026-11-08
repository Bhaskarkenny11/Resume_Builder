import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getAllTemplates } from '../../lib/customAssetsManager';
import { TemplateId, ResumeRecord } from '../../types/resume';
import { DotMatrixBadge } from './DotMatrixBadge';
import { AtsAcademicDocumentView } from './AtsAcademicDocumentView';
import { triggerPdfDownload } from '../templates/PdfDocument';
import { 
  X, 
  Sparkles, 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Plane,
  ChevronLeft,
  ChevronRight,
  FileCheck2
} from 'lucide-react';

interface AvionicsDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: TemplateId | null;
}

export const AvionicsDocumentModal: React.FC<AvionicsDocumentModalProps> = ({
  isOpen,
  onClose,
  templateId,
}) => {
  const { currentResume, activeTab, setTemplate, createNewResume } = useResumeStore();
  const templates = getAllTemplates();

  const [activeTemplateId, setActiveTemplateId] = useState<TemplateId>('classic_ats');
  const [zoom, setZoom] = useState(0.85);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (templateId) {
      setActiveTemplateId(templateId);
    } else if (currentResume?.template_id) {
      setActiveTemplateId(currentResume.template_id);
    }
  }, [templateId, currentResume, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentTpl = templates.find((t) => t.id === activeTemplateId) || templates[0];
  const tplIdx = templates.findIndex((t) => t.id === activeTemplateId);

  const handlePrev = () => {
    const nextIdx = tplIdx > 0 ? tplIdx - 1 : templates.length - 1;
    setActiveTemplateId(templates[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = tplIdx < templates.length - 1 ? tplIdx + 1 : 0;
    setActiveTemplateId(templates[nextIdx].id);
  };

  const handleLaunchInEditor = async () => {
    if (activeTab === 'dashboard') {
      await createNewResume(false, activeTemplateId);
    } else {
      setTemplate(activeTemplateId);
    }
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!currentResume) return;
    try {
      setIsExporting(true);
      await triggerPdfDownload({
        ...currentResume,
        template_id: activeTemplateId,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Derive 3-letter codes for active template
  const codePrefix = activeTemplateId.slice(0, 3).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden select-none">
      {/* 1. TOP AVIONICS HARDWARE COCKPIT STATUS BAR */}
      <header className="h-16 shrink-0 bg-[#0E1116] border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        {/* Left: Flight Telemetry & Template Badge */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 bg-[#080A0E] px-3 py-1.5 rounded-xl border border-white/[0.06] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <DotMatrixBadge code={codePrefix} size="sm" glow={true} />
            <span className="text-amber-500 font-bold text-xs select-none">→</span>
            <DotMatrixBadge code="DOC" size="sm" glow={true} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight truncate">
                {currentTpl.name}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentTpl.atsRating}</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 truncate hidden md:block">
              ATS Academic & Executive Standard // Pure Vector Clarity
            </p>
          </div>
        </div>

        {/* Center: Template Switcher Carousel Arrows */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#080A0E] px-2 py-1 rounded-full border border-white/[0.06]">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
            title="Previous Template"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-zinc-400 px-2 min-w-[120px] text-center truncate">
            {tplIdx + 1} of {templates.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
            title="Next Template"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Controls & Close */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-[#080A0E] px-2 py-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setZoom((z) => Math.max(0.45, Math.round((z - 0.1) * 10) / 10))}
              disabled={zoom <= 0.45}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-zinc-400 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.3, Math.round((z + 0.1) * 10) / 10))}
              disabled={zoom >= 1.3}
              className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(0.85)}
              className="p-1 text-zinc-500 hover:text-white transition-colors ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Print Shortcut Button */}
          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-medium border border-white/[0.08] transition-colors flex items-center gap-1.5"
            title="Print Document directly"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-white/[0.08] transition-colors"
            title="Close Inspector (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CANVAS AREA: Renders the Pure White (#FFFFFF) Document Sheet */}
      <div className="flex-1 overflow-auto p-4 sm:p-10 flex justify-center items-start relative select-text bg-[#08090D]">
        {/* Subtle Avionics Radial Radar Glow in Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(132, 204, 22, 0.15) 0%, transparent 65%)',
          }}
        />

        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative transition-transform duration-100 ease-out py-2 pb-24"
        >
          {/* Document Sheet Component: Pure White with Academic ATS Typography */}
          <AtsAcademicDocumentView
            resume={useSampleData ? null : currentResume}
            templateId={activeTemplateId}
          />
        </div>
      </div>

      {/* 3. BOTTOM COCKPIT LAUNCH CONSOLE BAR */}
      <footer className="h-20 shrink-0 bg-[#0E1116] border-t border-white/[0.08] px-4 sm:px-8 flex items-center justify-between gap-4 z-20 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
        {/* Left: Spec Indicators */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)] animate-pulse shrink-0" />
          <div>
            <div className="text-xs font-mono font-bold text-white tracking-wider">
              ATS READY // 100% PARSE ACCURACY
            </div>
            <div className="text-[10px] font-mono text-zinc-400 hidden sm:block">
              Ivy League Academic Hierarchy • Pure Black Dividers • Clean Bullet Rhythm
            </div>
          </div>
        </div>

        {/* Right Action: Luminous Lime Capsule Launch Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 text-xs font-semibold border border-white/[0.08] transition-colors flex items-center gap-1.5"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce text-lime-400' : ''}`} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Glowing Chartreuse-Lime Launch Capsule Button */}
          <button
            type="button"
            onClick={handleLaunchInEditor}
            className="relative h-11 px-6 rounded-full flex items-center gap-2.5 font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 group shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
              boxShadow: '0 0 25px rgba(163, 230, 53, 0.75), inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -2px 3px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Top Gloss Reflection */}
            <div className="absolute inset-x-3 top-0.5 h-[3px] rounded-full bg-white/60 pointer-events-none" />

            <Plane className="w-4 h-4 text-black fill-black transition-transform duration-200 group-hover:translate-x-1" />
            <span>Launch In Editor</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
