import React, { useRef, useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { ModernCleanTemplate } from '../templates/ModernCleanTemplate';
import { ClassicAtsTemplate } from '../templates/ClassicAtsTemplate';
import { ExecutiveMinimalistTemplate } from '../templates/ExecutiveMinimalistTemplate';
import { TraditionalTemplate } from '../templates/TraditionalTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { MomentumAtsTemplate } from '../templates/MomentumAtsTemplate';
import { PrimeAtsTemplate } from '../templates/PrimeAtsTemplate';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sliders, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface ResumePreviewContainerProps {
  onOpenDesignTab?: () => void;
}

export const ResumePreviewContainer: React.FC<ResumePreviewContainerProps> = ({ onOpenDesignTab }) => {
  const { currentResume, zoom, setZoom } = useResumeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  if (!currentResume) return null;

  const preset = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const isLetter = preset.paperSize === 'letter';

  // Standard dimensions in px (at standard 96 DPI screen scale)
  const baseWidthPx = isLetter ? 816 : 794;
  const baseHeightPx = isLetter ? 1056 : 1123;

  useEffect(() => {
    if (pageContainerRef.current) {
      const actualHeight = pageContainerRef.current.scrollHeight;
      const count = Math.ceil(actualHeight / baseHeightPx);
      setPageCount(Math.max(1, count));
    }
  }, [currentResume, baseHeightPx]);

  // Mobile / Small Screen Auto-Fit Effect:
  // Automatically scales the resume canvas so it cleanly fits the device screen width
  useEffect(() => {
    const handleAutoFit = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        const availableWidth = window.innerWidth - 32;
        const fitZoom = Math.max(0.38, Math.min(0.85, Math.round((availableWidth / baseWidthPx) * 100) / 100));
        setZoom(fitZoom);
      }
    };
    handleAutoFit();
    window.addEventListener('resize', handleAutoFit);
    return () => window.removeEventListener('resize', handleAutoFit);
  }, [baseWidthPx, setZoom]);

  const handleZoom = (delta: number) => {
    const next = Math.min(1.4, Math.max(0.45, Math.round((zoom + delta) * 100) / 100));
    setZoom(next);
  };

  const renderTemplate = () => {
    switch (currentResume.template_id) {
      case 'traditional':
        return <TraditionalTemplate resume={currentResume} />;
      case 'professional':
        return <ProfessionalTemplate resume={currentResume} />;
      case 'momentum_ats':
        return <MomentumAtsTemplate resume={currentResume} />;
      case 'prime_ats':
        return <PrimeAtsTemplate resume={currentResume} />;
      case 'classic_ats':
        return <ClassicAtsTemplate resume={currentResume} />;
      case 'executive_minimalist':
        return <ExecutiveMinimalistTemplate resume={currentResume} />;
      case 'minimal':
        return <ClassicAtsTemplate resume={currentResume} />;
      case 'modern_clean':
      default:
        return <ModernCleanTemplate resume={currentResume} />;
    }
  };

  return (
    <div className={`relative flex flex-col h-full bg-slate-200/60 overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md p-4' : ''
    }`}>
      {/* Top Floating Preview Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200 z-10 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
            <span className="truncate">{preset.name}</span>
            <span className="hidden sm:inline font-mono text-slate-400">({preset.paperSize.toUpperCase()})</span>
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs font-mono text-slate-500 shrink-0">
            {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => handleZoom(-0.1)}
            disabled={zoom <= 0.4}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs font-mono font-medium text-slate-600 w-9 sm:w-10 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => handleZoom(0.1)}
            disabled={zoom >= 1.4}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(0.85)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors hidden sm:inline-flex"
            title="Reset Zoom (85%)"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="h-3.5 w-px bg-slate-200 mx-1 sm:mx-1.5" />

          {/* Switch to Design Tab Shortcut */}
          {onOpenDesignTab && (
            <button
              onClick={onOpenDesignTab}
              className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1.5 transition-colors"
              title="Open Design & Style tab"
            >
              <Sliders className="w-3 h-3 text-blue-600" />
              <span className="hidden sm:inline">Change Template</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start relative select-text">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative transition-transform duration-100 ease-out"
        >
          {/* Paper Container */}
          <div
            ref={pageContainerRef}
            style={{
              width: `${baseWidthPx}px`,
              minHeight: `${baseHeightPx}px`,
            }}
            className="bg-white shadow-page-lg rounded-sm border border-slate-300/80 relative text-slate-900 overflow-hidden"
          >
            {/* Visual Page Break Guide */}
            {pageCount > 1 && (
              <div
                className="absolute left-0 right-0 border-b-2 border-dashed border-rose-300 pointer-events-none z-20 flex justify-end pr-2"
                style={{ top: `${baseHeightPx}px` }}
              >
                <span className="text-[10px] font-mono font-bold text-rose-500 bg-white/90 px-1 rounded shadow-2xs -translate-y-1/2">
                  --- Page 1 End ---
                </span>
              </div>
            )}

            {/* Template Rendering */}
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
