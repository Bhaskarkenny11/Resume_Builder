import React from 'react';
import { TemplateConfig } from '../../lib/templatesConfig';
import { DotMatrixBadge } from './DotMatrixBadge';
import { LuminousLimeSlider } from './LuminousLimeSlider';
import { TemplateMiniPreview } from './TemplateMiniPreview';
import { 
  ArrowRight, 
  ArrowLeftRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  Clock,
  Layers,
  FileText
} from 'lucide-react';

interface FlightCodeMapping {
  originCode: string;
  destCode: string;
  originLabel: string;
  destLabel: string;
  departureTime: string;
  arrivalTime: string;
  scoreText: string;
  amberAlert: string;
  etaText: string;
}

const TEMPLATE_FLIGHT_CODES: Record<string, FlightCodeMapping> = {
  classic_ats: {
    originCode: 'ATS',
    destCode: 'PRO',
    originLabel: 'Classic ATS',
    destLabel: 'Recruiter Pro',
    departureTime: 'SINGLE COLUMN',
    arrivalTime: '100% PARSING',
    scoreText: '100% ATS',
    amberAlert: 'ATS SCORE: 100%',
    etaText: 'EST. TIME: 2m',
  },
  traditional: {
    originCode: 'TRD',
    destCode: 'EXE',
    originLabel: 'Traditional',
    destLabel: 'Ivy Academic',
    departureTime: 'EDITORIAL SERIF',
    arrivalTime: 'LAW & FINANCE',
    scoreText: '99% ATS',
    amberAlert: 'HARVARD SPEC: PASS',
    etaText: 'EST. TIME: 3m',
  },
  momentum_ats: {
    originCode: 'SWE',
    destCode: 'SRE',
    originLabel: 'Momentum',
    destLabel: 'Staff Cloud',
    departureTime: 'SKILLS MATRIX',
    arrivalTime: 'TECH SCALE',
    scoreText: '99% ATS',
    amberAlert: 'PARSE RATE: 99.8%',
    etaText: 'EST. TIME: 2m',
  },
  professional: {
    originCode: 'TWO',
    destCode: 'COL',
    originLabel: 'Two-Column',
    destLabel: 'Executive',
    departureTime: 'FOREST ACCENT',
    arrivalTime: 'SPLIT TIMELINE',
    scoreText: '95% ATS',
    amberAlert: 'VISUAL IMPACT: HIGH',
    etaText: 'EST. TIME: 3m',
  },
  prime_ats: {
    originCode: 'DAT',
    destCode: 'ARC',
    originLabel: 'Prime ATS',
    destLabel: 'Solutions Arc',
    departureTime: 'ROYAL BLUE',
    arrivalTime: 'CLOUD / DEVOPS',
    scoreText: '98% ATS',
    amberAlert: 'ATS SCORE: 98%',
    etaText: 'EST. TIME: 2m',
  },
  modern_clean: {
    originCode: 'DES',
    destCode: 'DEV',
    originLabel: 'Modern Clean',
    destLabel: 'Digital Agile',
    departureTime: 'FLOWCV SANS',
    arrivalTime: 'CONTEMPORARY',
    scoreText: '98% ATS',
    amberAlert: 'READABILITY: MAX',
    etaText: 'EST. TIME: 2m',
  },
  executive_minimalist: {
    originCode: 'DIR',
    destCode: 'CEO',
    originLabel: 'Executive',
    destLabel: 'Boardroom',
    departureTime: 'C-SUITE SERIF',
    arrivalTime: 'PRESTIGE HIERARCHY',
    scoreText: '97% ATS',
    amberAlert: 'LEADERSHIP SPEC',
    etaText: 'EST. TIME: 4m',
  },
  minimal: {
    originCode: 'MIN',
    destCode: 'RES',
    originLabel: 'Pure Minimal',
    destLabel: 'Research ATS',
    departureTime: 'MONOCHROME',
    arrivalTime: 'ZERO FRICTION',
    scoreText: '100% ATS',
    amberAlert: 'ATS SCORE: 100%',
    etaText: 'EST. TIME: 1m',
  },
};

interface AvionicsTemplateCardProps {
  template: TemplateConfig;
  onPreview: (templateId: string) => void;
  onUseTemplate: (templateId: string) => void;
}

export const AvionicsTemplateCard: React.FC<AvionicsTemplateCardProps> = ({
  template,
  onPreview,
  onUseTemplate,
}) => {
  const flight = TEMPLATE_FLIGHT_CODES[template.id] || {
    originCode: 'ATS',
    destCode: 'DOC',
    originLabel: template.name,
    destLabel: template.categoryTag,
    departureTime: template.layoutTag.toUpperCase(),
    arrivalTime: template.atsRating,
    scoreText: template.atsRating,
    amberAlert: `ATS SCORE: ${template.atsRating}`,
    etaText: 'EST. TIME: 2m',
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-[32px] overflow-hidden border border-white/[0.08] transition-all duration-300 hover:border-lime-500/30 hover:-translate-y-1"
      style={{
        background: 'linear-gradient(180deg, #12151B 0%, #161A22 100%)',
        boxShadow:
          'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.75)',
      }}
    >
      {/* Dot-matrix perforation mesh background overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[32px] overflow-hidden opacity-35 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 1.2px, transparent 1.2px)',
          backgroundSize: '8px 8px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 20% 25%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 20% 25%, black 20%, transparent 80%)',
        }}
      />

      {/* Top Section: Flight Codes, Route Info & Recessed Display Sub-Panel */}
      <div className="relative z-10 p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left: 3-Letter Dot Matrix Flight Badges & Directional Route */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <DotMatrixBadge code={flight.originCode} size="md" glow={true} />
              
              <span className="text-amber-500 font-bold text-base select-none drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                →
              </span>

              <DotMatrixBadge code={flight.destCode} size="md" glow={true} />
            </div>

            {/* City / Template Subtitles Underneath */}
            <div className="grid grid-cols-2 gap-2 text-left pt-0.5">
              <div className="min-w-0">
                <div className="text-white font-semibold text-xs truncate tracking-tight">
                  {flight.originLabel}
                </div>
                <div className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider truncate">
                  {flight.departureTime}
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-white font-semibold text-xs truncate tracking-tight">
                  {flight.destLabel}
                </div>
                <div className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider truncate">
                  {flight.arrivalTime}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Recessed Secondary Display Sub-Panel */}
          <div
            className="w-36 shrink-0 bg-[#0B0D12] rounded-2xl p-2.5 sm:p-3 ring-1 ring-white/5 flex flex-col justify-between"
            style={{
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.85), 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Top row: ETA / SCORE with swap icon button */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-white font-mono text-xs font-bold tracking-tight">
                {flight.scoreText}
              </span>
              <button
                type="button"
                onClick={() => onPreview(template.id)}
                className="w-5 h-5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                title="Quick Inspect Document"
              >
                <ArrowLeftRight className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Middle row: Specification / Subtitle */}
            <div className="text-[10px] text-zinc-400 font-medium truncate mb-1.5">
              {template.categoryTag}
            </div>

            {/* Bottom: Glowing Amber Alert (DINNER IN 2:34H / ATS SCORE: 100%) */}
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] truncate">
              {flight.amberAlert}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Integrated Realistic Mini-Document Preview */}
      <div className="relative z-10 px-5 py-2">
        <div
          onClick={() => onPreview(template.id)}
          className="relative w-full aspect-[210/165] rounded-xl overflow-hidden bg-black/40 border border-white/[0.07] p-2 flex items-center justify-center cursor-pointer group/preview shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] hover:border-white/20 transition-all duration-300"
        >
          {/* Framed miniature document sheet */}
          <div className="w-[88%] h-full rounded-md overflow-hidden bg-white shadow-xl border border-neutral-300 transition-transform duration-300 ease-out group-hover/preview:scale-[1.03]">
            <TemplateMiniPreview templateId={template.id} />
          </div>

          {/* Quick HUD Hover Overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 z-20">
            <span className="text-xs font-mono font-bold text-lime-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-lime-400" />
              <span>Click to Inspect A4</span>
            </span>
            <span className="text-[10px] text-zinc-300 text-center font-mono">
              Academic & Executive Hierarchy
            </span>
          </div>

          {/* Corner Instrument Marks */}
          <div className="absolute top-1.5 left-2 text-[9px] font-mono text-zinc-600 pointer-events-none select-none">
            SPEC // A4
          </div>
          <div className="absolute top-1.5 right-2 text-[9px] font-mono text-zinc-600 pointer-events-none select-none">
            210x297
          </div>
        </div>

        {/* Feature Pills Strip */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
          <span className="truncate">{template.layoutTag}</span>
          <span className="text-zinc-500 font-bold">•</span>
          <span className="text-emerald-400 font-semibold">{flight.etaText}</span>
        </div>
      </div>

      {/* Bottom Section: Luminous Lime Capsule Track Slider */}
      {/* Strict Spacing Rule: px-5 pb-5 internal padding ensures it never clips outer rounded-[32px] corners */}
      <div className="relative z-10 px-5 pb-5 pt-1.5">
        <LuminousLimeSlider
          onActivate={() => onPreview(template.id)}
          labelRight="-0H 00M"
          buttonLabel="INSPECT"
        />
      </div>
    </div>
  );
};
