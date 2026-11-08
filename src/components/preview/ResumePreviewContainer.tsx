import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { hexToRgba } from '../../lib/utils';
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

interface PageConfig {
  pageIndex: number;
  startY: number;
  endY: number;
  shiftY: number;
}

export const ResumePreviewContainer: React.FC<ResumePreviewContainerProps> = ({ onOpenDesignTab }) => {
  const { currentResume, zoom, setZoom } = useResumeStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pages, setPages] = useState<PageConfig[]>([
    { pageIndex: 0, startY: 0, endY: 0, shiftY: 0 },
  ]);

  const measuringRef = useRef<HTMLDivElement>(null);

  if (!currentResume) return null;

  const preset = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const isLetter = preset.paperSize === 'letter';

  // Standard dimensions in px (at standard 96 DPI screen scale)
  const baseWidthPx = isLetter ? 816 : 794;
  const baseHeightPx = isLetter ? 1056 : 1123;

  const marginMm = currentResume.content.style.marginMm || 14;
  const marginPx = Math.round(marginMm * 3.7795); // mm to px at 96 DPI

  const effectiveAccent = currentResume.content.style.accentColor && currentResume.content.style.accentColor !== 'none'
    ? currentResume.content.style.accentColor
    : '#1e40af';
  const themePlacement = currentResume.content.style.colorThemePlacement || 'full_page';
  const pageBgColor = themePlacement === 'full_page'
    ? hexToRgba(effectiveAccent, 0.045)
    : '#ffffff';

  const isTwoColumn = currentResume.template_id === 'professional';

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

    const containerRect = container.getBoundingClientRect();
    const totalHeight = containerRect.height;
    if (totalHeight === 0) return;

    const effectivePageHeight = baseHeightPx;

    // Single page fits entirely
    if (totalHeight <= effectivePageHeight) {
      setPageCount(1);
      setPages([
        {
          pageIndex: 0,
          startY: 0,
          endY: totalHeight,
          shiftY: 0,
        },
      ]);
      return;
    }

    // Multi-page calculation
    const newPages: PageConfig[] = [];
    let currentStartY = 0;
    let pageIdx = 0;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>('[data-resume-section="true"]')
    );

    while (currentStartY < totalHeight && pageIdx < 10) {
      const isFirstPage = pageIdx === 0;
      const pageAvailableHeight = isFirstPage
        ? effectivePageHeight - marginPx
        : effectivePageHeight - 2 * marginPx;

      const pageMaxTargetY = currentStartY + pageAvailableHeight;

      if (totalHeight <= pageMaxTargetY) {
        newPages.push({
          pageIndex: pageIdx,
          startY: currentStartY,
          endY: totalHeight,
          shiftY: isFirstPage ? 0 : marginPx - currentStartY,
        });
        break;
      }

      let bestBreakY = 0;
      let foundBreak = false;

      for (const section of sections) {
        const secRect = section.getBoundingClientRect();
        const secTop = secRect.top - containerRect.top;
        const secBottom = secRect.bottom - containerRect.top;

        if (secBottom <= currentStartY) continue;

        if (secBottom <= pageMaxTargetY) {
          bestBreakY = secBottom;
          continue;
        }

        // Section crosses page boundary. Check individual items inside:
        const allItems = Array.from(
          section.querySelectorAll<HTMLElement>('[data-resume-item="true"]')
        );

        // Filter to unplaced items that start or continue past currentStartY
        const unplacedItems = allItems.filter((it) => {
          const r = it.getBoundingClientRect();
          return r.bottom - containerRect.top > currentStartY + 1;
        });

        if (unplacedItems.length > 0) {
          const firstItemRect = unplacedItems[0].getBoundingClientRect();
          const firstItemBottom = firstItemRect.bottom - containerRect.top;

          if (firstItemBottom > pageMaxTargetY) {
            // First unplaced item doesn't fit on this page!
            // If the section hasn't started on this page, push the entire section
            if (secTop > currentStartY) {
              bestBreakY = secTop;
            } else {
              bestBreakY = firstItemRect.top - containerRect.top;
            }
            foundBreak = true;
            break;
          } else {
            let lastFittingBottom = firstItemBottom;
            for (let i = 1; i < unplacedItems.length; i++) {
              const itRect = unplacedItems[i].getBoundingClientRect();
              const itTop = itRect.top - containerRect.top;
              const itBottom = itRect.bottom - containerRect.top;

              if (itBottom <= pageMaxTargetY) {
                lastFittingBottom = itBottom;
              } else {
                bestBreakY = itTop;
                foundBreak = true;
                break;
              }
            }
            if (foundBreak) break;
            bestBreakY = lastFittingBottom;
          }
        } else {
          // Section has no sub-items (e.g. text summary block)
          bestBreakY = secTop > currentStartY ? secTop : pageMaxTargetY;
          foundBreak = true;
          break;
        }
      }

      if (bestBreakY <= currentStartY) {
        bestBreakY = pageMaxTargetY;
      }

      newPages.push({
        pageIndex: pageIdx,
        startY: currentStartY,
        endY: bestBreakY,
        shiftY: isFirstPage ? 0 : marginPx - currentStartY,
      });

      currentStartY = bestBreakY;
      pageIdx++;
    }

    setPageCount(newPages.length);
    setPages(newPages);
  }, [baseHeightPx, marginPx]);

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

  // Recalculate once web fonts have fully loaded
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        calculatePages();
      });
    }
  }, [calculatePages]);

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

      {/* Hidden Off-Screen Measuring Container */}
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
        {renderTemplate()}
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
          {pages.map((page, idx) => (
            <div key={page.pageIndex} className="flex flex-col items-center">
              {/* Subtle Page Number Label */}
              {pages.length > 1 && (
                <div
                  style={{ width: `${baseWidthPx}px` }}
                  className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5 px-1 select-none"
                >
                  <span className="font-semibold text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                    Page {idx + 1} of {pages.length}
                  </span>
                  <span className="text-slate-400 font-medium hidden sm:inline">
                    {preset.name} ({preset.paperSize.toUpperCase()})
                  </span>
                </div>
              )}

              {/* Physical Paper Sheet (Separate Card with Shadow & Border) */}
              <div
                style={{
                  width: `${baseWidthPx}px`,
                  height: `${baseHeightPx}px`,
                  backgroundColor: pageBgColor,
                }}
                className="bg-white shadow-page-lg rounded-sm border border-slate-300/80 relative text-slate-900 overflow-hidden"
              >
                {/* Content translated into this page frame */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${page.shiftY}px`,
                    left: 0,
                    width: `${baseWidthPx}px`,
                  }}
                >
                  {renderTemplate()}
                </div>

                {/* Top Margin Mask (for Page 2+ to guarantee clean top margin) */}
                {page.pageIndex > 0 && (
                  <div
                    className={`absolute top-0 pointer-events-none select-none z-20 ${
                      isTwoColumn ? 'left-[32%] right-0' : 'left-0 right-0'
                    }`}
                    style={{
                      height: `${marginPx}px`,
                      backgroundColor: pageBgColor,
                    }}
                  />
                )}

                {/* Bottom Margin Mask (to guarantee clean bottom margin & prevent overlap) */}
                <div
                  className={`absolute bottom-0 pointer-events-none select-none z-20 ${
                    isTwoColumn ? 'left-[32%] right-0' : 'left-0 right-0'
                  }`}
                  style={{
                    top: `${
                      page.pageIndex === 0
                        ? page.endY
                        : marginPx + (page.endY - page.startY)
                    }px`,
                    bottom: 0,
                    backgroundColor: pageBgColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
