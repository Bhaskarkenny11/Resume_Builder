import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { ResumeRecord, SectionMeta } from '../../types/resume';
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
  const [paginatedResumes, setPaginatedResumes] = useState<ResumeRecord[]>([]);

  const measuringRef = useRef<HTMLDivElement>(null);

  if (!currentResume) return null;

  const preset = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const isLetter = preset.paperSize === 'letter';

  // Standard dimensions in px (at standard 96 DPI screen scale)
  const baseWidthPx = isLetter ? 816 : 794;
  const baseHeightPx = isLetter ? 1056 : 1123;

  // Mobile / Small Screen Auto-Fit Effect:
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

  const calculatePages = useCallback(() => {
    const container = measuringRef.current;
    if (!container) return;

    const totalHeight = container.getBoundingClientRect().height;
    if (totalHeight === 0) return;

    const marginMm = currentResume.content.style.marginMm || 14;
    const marginPx = Math.round(marginMm * 3.7795); // mm to px

    // Target content limits per page (leaving a small gap at page bottom for clean presentation)
    const bottomGapPx = 36;
    const page1ContentLimit = baseHeightPx - (2 * marginPx) - bottomGapPx;
    const page2ContentLimit = baseHeightPx - (2 * marginPx) - bottomGapPx;

    const headerEl = container.querySelector<HTMLElement>('[data-resume-header="true"]');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 130;

    const activeSections = currentResume.content.sectionOrder.filter(
      (s) => s.enabled && s.type !== 'personal'
    );

    const pageBuckets: {
      sections: SectionMeta[];
      expItemCount?: number;
    }[] = [{ sections: [] }];

    let currentPageIdx = 0;
    let currentUsedHeight = headerHeight; // Page 1 starts with header
    let currentLimit = page1ContentLimit;

    for (const sec of activeSections) {
      const secEl = container.querySelector<HTMLElement>(`[data-section-id="${sec.id}"]`);
      const secHeight = secEl ? secEl.getBoundingClientRect().height : 120;

      // Check if entire section fits comfortably in remaining space
      if (currentUsedHeight + secHeight <= currentLimit) {
        pageBuckets[currentPageIdx].sections.push(sec);
        currentUsedHeight += secHeight + 14;
      } else {
        // Section overflows current page space.
        // If we are on Page 1 and this section fits on Page 2, keep the section together!
        if (currentPageIdx === 0 && secHeight <= page2ContentLimit) {
          currentPageIdx = 1;
          pageBuckets.push({ sections: [sec] });
          currentUsedHeight = secHeight + 14;
          currentLimit = page2ContentLimit;
        } else if (sec.type === 'experience' && currentResume.content.experience.length > 2) {
          // Extra long experience section: split individual job items between pages
          const expItems = currentResume.content.experience;
          const itemEls = Array.from(secEl?.querySelectorAll<HTMLElement>('[data-resume-item="true"]') || []);
          const headingH = 35;
          let acc = headingH;
          let splitIdx = 0;

          for (let i = 0; i < itemEls.length; i++) {
            const itH = itemEls[i].getBoundingClientRect().height || 90;
            if (currentUsedHeight + acc + itH <= currentLimit) {
              acc += itH + 8;
              splitIdx = i + 1;
            } else {
              break;
            }
          }

          if (splitIdx > 0 && splitIdx < expItems.length) {
            pageBuckets[currentPageIdx].sections.push(sec);
            pageBuckets[currentPageIdx].expItemCount = splitIdx;
            currentPageIdx++;
            pageBuckets.push({ sections: [sec], expItemCount: expItems.length - splitIdx });
            currentUsedHeight = (secHeight - acc) + 14;
            currentLimit = page2ContentLimit;
          } else {
            currentPageIdx++;
            pageBuckets.push({ sections: [sec] });
            currentUsedHeight = secHeight + 14;
            currentLimit = page2ContentLimit;
          }
        } else {
          // Push entire section to next page
          currentPageIdx++;
          pageBuckets.push({ sections: [sec] });
          currentUsedHeight = secHeight + 14;
          currentLimit = page2ContentLimit;
        }
      }
    }

    // Build discrete ResumeRecord copies for each page
    const newPages: ResumeRecord[] = pageBuckets.map((bucket, idx) => {
      const pageSecIds = new Set(bucket.sections.map((s) => s.id));
      let pageExp = currentResume.content.experience;

      if (bucket.expItemCount !== undefined) {
        if (idx === 0) {
          pageExp = currentResume.content.experience.slice(0, bucket.expItemCount);
        } else {
          const prevCount = pageBuckets[0].expItemCount || 0;
          pageExp = currentResume.content.experience.slice(prevCount);
        }
      }

      return {
        ...currentResume,
        content: {
          ...currentResume.content,
          experience: pageExp,
          sectionOrder: currentResume.content.sectionOrder.filter((s) => pageSecIds.has(s.id)),
        },
      };
    });

    setPaginatedResumes(newPages);
    setPageCount(newPages.length);
  }, [currentResume, baseHeightPx]);

  useEffect(() => {
    calculatePages();
  }, [calculatePages, currentResume, baseHeightPx, baseWidthPx]);

  useEffect(() => {
    const el = measuringRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      calculatePages();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [calculatePages]);

  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        calculatePages();
      });
    }
  }, [calculatePages]);

  const renderTemplate = (resumeToRender: ResumeRecord, hideHeader = false) => {
    switch (resumeToRender.template_id) {
      case 'traditional':
        return <TraditionalTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'professional':
        return <ProfessionalTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'momentum_ats':
        return <MomentumAtsTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'prime_ats':
        return <PrimeAtsTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'classic_ats':
        return <ClassicAtsTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'executive_minimalist':
        return <ExecutiveMinimalistTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'minimal':
        return <ClassicAtsTemplate resume={resumeToRender} hideHeader={hideHeader} />;
      case 'modern_clean':
      default:
        return <ModernCleanTemplate resume={resumeToRender} hideHeader={hideHeader} />;
    }
  };

  const pagesToDisplay = paginatedResumes.length > 0 ? paginatedResumes : [currentResume];

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

      {/* Hidden Off-Screen Measuring Container (renders full resume unpaginated for height calculation) */}
      <div
        ref={measuringRef}
        style={{
          position: 'absolute',
          top: 0,
          left: '-99999px',
          width: `${baseWidthPx}px`,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -9999,
        }}
        aria-hidden="true"
      >
        {renderTemplate(currentResume, false)}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start relative select-text">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative transition-transform duration-100 ease-out flex flex-col items-center gap-8 py-2 pb-16"
        >
          {pagesToDisplay.map((pageResume, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Subtle Page Number Label */}
              {pagesToDisplay.length > 1 && (
                <div
                  style={{ width: `${baseWidthPx}px` }}
                  className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 px-1 select-none"
                >
                  <span className="font-semibold text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                    Page {idx + 1} of {pagesToDisplay.length}
                  </span>
                  <span className="text-slate-400 font-medium hidden sm:inline">
                    {preset.name} ({preset.paperSize.toUpperCase()})
                  </span>
                </div>
              )}

              {/* Physical Paper Sheet (Pure White Background, Discrete Paper Card with Shadow) */}
              <div
                style={{
                  width: `${baseWidthPx}px`,
                  minHeight: `${baseHeightPx}px`,
                  backgroundColor: '#ffffff',
                }}
                className="bg-white shadow-page-lg rounded-sm border border-slate-300/80 relative text-slate-900 overflow-hidden"
              >
                {/* Natural, unclipped template rendering for this page */}
                {renderTemplate(pageResume, idx > 0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
