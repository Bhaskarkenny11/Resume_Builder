import React from 'react';
import { SectionHeadingStyle, SectionCapitalization, SectionIconStyle, AccentColorTargets } from '../../types/resume';

interface SectionHeadingRendererProps {
  title: string;
  icon?: React.ReactNode;
  headingStyle?: SectionHeadingStyle;
  capitalization?: SectionCapitalization;
  iconStyle?: SectionIconStyle;
  accentColor?: string;
  accentTargets?: AccentColorTargets;
  className?: string;
}

export const SectionHeadingRenderer: React.FC<SectionHeadingRendererProps> = ({
  title,
  icon,
  headingStyle = 'full_underline',
  capitalization = 'uppercase',
  iconStyle = 'none',
  accentColor = '#1e40af',
  accentTargets = { headings: true, headingsLine: true },
  className = '',
}) => {
  // Format title casing
  const formattedTitle = 
    capitalization === 'capitalize'
      ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
      : title.toUpperCase();

  const isHeadingColored = accentTargets.headings !== false;
  const isLineColored = accentTargets.headingsLine !== false;
  const textColor = isHeadingColored ? accentColor : '#0f172a';
  const lineColor = isLineColored ? accentColor : '#cbd5e1';

  // Render Icon based on iconStyle
  const renderIcon = () => {
    if (iconStyle === 'none' || !icon) return null;

    if (iconStyle === 'filled') {
      return (
        <span 
          className="w-4 h-4 rounded-xs flex items-center justify-center shrink-0 text-white"
          style={{ backgroundColor: accentColor }}
        >
          {icon}
        </span>
      );
    }

    // 'outline'
    return (
      <span className="shrink-0" style={{ color: accentColor }}>
        {icon}
      </span>
    );
  };

  // Render Heading based on FlowCV 8 styles
  switch (headingStyle) {
    case 'underline_accent':
      return (
        <div data-resume-heading="true" className={`relative pb-1 mb-2 border-b border-slate-200 ${className}`}>
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
              {formattedTitle}
            </h3>
          </div>
          {/* Left accent bar on underline */}
          <div 
            className="absolute bottom-[-1px] left-0 h-[2px] w-12"
            style={{ backgroundColor: lineColor }}
          />
        </div>
      );

    case 'boxed':
      return (
        <div data-resume-heading="true" className={`mb-2.5 ${className}`}>
          <div 
            className="inline-flex items-center gap-2 px-2.5 py-0.5 border rounded-xs bg-slate-50/50"
            style={{ borderColor: lineColor }}
          >
            {renderIcon()}
            <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
              {formattedTitle}
            </h3>
          </div>
        </div>
      );

    case 'double_line':
      return (
        <div 
          data-resume-heading="true"
          className="border-t border-b py-1 mb-2.5" 
          style={{ borderColor: lineColor }}
        >
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
              {formattedTitle}
            </h3>
          </div>
        </div>
      );

    case 'overline_underline':
      return (
        <div 
          data-resume-heading="true"
          className="border-t border-b py-1 mb-2.5 text-center"
          style={{ borderColor: lineColor }}
        >
          <div className="flex items-center justify-center gap-2">
            {renderIcon()}
            <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
              {formattedTitle}
            </h3>
          </div>
        </div>
      );

    case 'left_bar':
      return (
        <div 
          data-resume-heading="true"
          className={`pl-2 mb-2 border-l-[3.5px] flex items-center gap-2 ${className}`}
          style={{ borderColor: lineColor }}
        >
          {renderIcon()}
          <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
            {formattedTitle}
          </h3>
        </div>
      );

    case 'shaded_banner':
      return (
        <div 
          data-resume-heading="true"
          className="px-2 py-1 mb-2 rounded-xs flex items-center gap-2"
          style={{ 
            backgroundColor: isLineColored ? `${accentColor}18` : '#f1f5f9',
            borderLeft: `3px solid ${lineColor}`
          }}
        >
          {renderIcon()}
          <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
            {formattedTitle}
          </h3>
        </div>
      );

    case 'wavy_dashed':
      return (
        <div 
          data-resume-heading="true"
          className={`pb-1 mb-2 border-b border-dashed ${className}`}
          style={{ borderColor: lineColor }}
        >
          <div className="flex items-center gap-2">
            {renderIcon()}
            <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
              {formattedTitle}
            </h3>
          </div>
        </div>
      );

    case 'full_underline':
    default:
      return (
        <div 
          data-resume-heading="true"
          className={`pb-1 mb-2 border-b-2 flex items-center gap-2 ${className}`}
          style={{ borderColor: lineColor }}
        >
          {renderIcon()}
          <h3 className="text-xs font-bold tracking-wider" style={{ color: textColor }}>
            {formattedTitle}
          </h3>
        </div>
      );
  }
};
