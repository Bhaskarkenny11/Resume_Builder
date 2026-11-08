import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plane, Sparkles, ArrowRight } from 'lucide-react';

interface LuminousLimeSliderProps {
  onActivate: () => void;
  labelRight?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export const LuminousLimeSlider: React.FC<LuminousLimeSliderProps> = ({
  onActivate,
  labelRight = '-0H 00M',
  buttonLabel,
  disabled = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragProgress, setDragProgress] = useState(0); // 0 (left) to 1 (right)
  const [isDragging, setIsDragging] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  // Mouse / Touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isActivated) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled || isActivated || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackWidth = rect.width;
    // Assume capsule button is ~45% of width
    const maxTravel = trackWidth * 0.52;
    const currentX = Math.max(0, Math.min(e.clientX - rect.left - 12, maxTravel));
    const progress = Math.min(1, Math.max(0, currentX / maxTravel));
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // If dragged more than 55%, trigger activation!
    if (dragProgress >= 0.55) {
      triggerActivation();
    } else {
      // Snap back to left
      setDragProgress(0);
    }
  };

  const triggerActivation = useCallback(() => {
    setIsActivated(true);
    setDragProgress(1); // slide all the way to right

    // Play tactile vibration if supported on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }

    // Call onActivate callback after smooth transition
    setTimeout(() => {
      onActivate();
      // Reset after a brief moment so it can be used again
      setTimeout(() => {
        setIsActivated(false);
        setDragProgress(0);
      }, 700);
    }, 280);
  }, [onActivate]);

  // Click-to-slide shortcut: Clicking anywhere on the track or button activates it!
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isActivated || isDragging) return;
    e.stopPropagation();
    triggerActivation();
  };

  // Compute capsule width and translation
  const capsuleWidthPercent = 48; // ~48% width of track
  const maxTranslatePercent = 100 - capsuleWidthPercent;
  const currentTranslate = dragProgress * maxTranslatePercent;

  return (
    <div
      ref={trackRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="button"
      tabIndex={0}
      title="Slide or click to inspect and launch resume"
      className="group/slider relative h-12 w-full bg-[#090B0E] rounded-full p-1.5 shadow-[inset_0_3px_8px_rgba(0,0,0,0.92)] border border-white/[0.04] flex items-center select-none cursor-pointer overflow-hidden transition-all duration-300 hover:border-lime-500/25 active:scale-[0.99]"
      style={{ touchAction: 'none' }}
    >
      {/* Background Subtle Track Groove Lighting */}
      <div className="absolute inset-0 rounded-full pointer-events-none opacity-30 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />

      {/* Recessed Track Right Status Text (e.g. "-7H 01M" in flight tracker) */}
      <div 
        className="absolute right-4 z-0 text-zinc-500 font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 pointer-events-none transition-opacity duration-200 select-none"
        style={{
          opacity: 1 - dragProgress * 0.8,
        }}
      >
        <span>{labelRight}</span>
        <ArrowRight className="w-3 h-3 text-zinc-600 transition-transform duration-200 group-hover/slider:translate-x-0.5" />
      </div>

      {/* Luminous Lime Capsule Button */}
      <div
        className="relative z-10 h-full rounded-full flex items-center justify-between px-3.5 transition-all cursor-grab active:cursor-grabbing"
        style={{
          width: `${capsuleWidthPercent}%`,
          transform: `translateX(${currentTranslate}%)`,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 0.2s ease',
          background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
          boxShadow: isActivated
            ? '0 0 32px rgba(163, 230, 53, 0.95), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
            : '0 0 25px rgba(163, 230, 53, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.65), inset 0 -2px 3px rgba(0, 0, 0, 0.45)',
        }}
      >
        {/* Top Beveled Specular Highlight on Capsule */}
        <div className="absolute inset-x-2 top-0.5 h-[3px] rounded-full bg-white/50 pointer-events-none" />

        {/* Capsule Label / Micro-indicator */}
        <div className="flex items-center gap-1 min-w-0 pr-1">
          {buttonLabel ? (
            <span className="text-[11px] font-black uppercase tracking-wider text-black/85 truncate font-mono">
              {buttonLabel}
            </span>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
          )}
        </div>

        {/* Glowing White Airplane / Rocket Glyph at the front tip */}
        <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center shrink-0 border border-white/20 shadow-xs">
          <Plane 
            className={`w-3.5 h-3.5 text-white fill-white transition-transform duration-200 ${
              isActivated ? 'translate-x-1 scale-110' : 'group-hover/slider:translate-x-0.5'
            }`} 
          />
        </div>
      </div>
    </div>
  );
};
