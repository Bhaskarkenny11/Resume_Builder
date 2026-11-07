import React from 'react';
import { ResumeRecord } from '../../types/resume';
import { hexToRgba, getSecondaryAccent } from '../../lib/utils';
import { getAllAvailableFonts } from '../../lib/customAssetsManager';

interface ResumeThemeWrapperProps {
  resume: ResumeRecord;
  children: React.ReactNode;
  defaultFontFamily?: string;
  className?: string;
}

export const ResumeThemeWrapper: React.FC<ResumeThemeWrapperProps> = ({
  resume,
  children,
  defaultFontFamily = 'font-sans',
  className = '',
}) => {
  const { style } = resume.content;
  const effectiveAccent = style.accentColor && style.accentColor !== 'none' ? style.accentColor : '#1e40af';
  const themePlacement = style.colorThemePlacement || 'full_page';
  const paletteMode = style.colorPaletteMode || 'single';

  const availableFonts = getAllAvailableFonts();
  const matchedFont = availableFonts.find((f) => f.id === style.fontFamily);

  const getFontFamilyClass = () => {
    if (matchedFont?.isCustom) return '';
    switch (style.fontFamily) {
      case 'merriweather': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'jakarta': return 'font-heading';
      case 'roboto': return 'font-sans';
      case 'outfit': return 'font-sans';
      default: return defaultFontFamily;
    }
  };

  // Determine wrapper background and borders based on FlowCV Theme Placement
  let backgroundStyle: React.CSSProperties = {
    padding: `${style.marginMm || 14}mm`,
    fontSize: `${style.fontSize || 9.5}pt`,
    lineHeight: style.lineHeight || 1.4,
  };

  if (matchedFont?.isCustom) {
    backgroundStyle.fontFamily = `'${matchedFont.family}', sans-serif`;
  }

  let themeClasses = 'w-full box-border transition-all relative overflow-hidden';

  if (themePlacement === 'full_page') {
    backgroundStyle.backgroundColor = hexToRgba(effectiveAccent, 0.045);
    backgroundStyle.border = 'none';
  } else if (themePlacement === 'border') {
    backgroundStyle.backgroundColor = '#ffffff';
    backgroundStyle.border = `4px solid ${effectiveAccent}`;
  } else {
    // 'header'
    backgroundStyle.backgroundColor = '#ffffff';
    backgroundStyle.border = 'none';
  }

  return (
    <div
      className={`${themeClasses} ${getFontFamilyClass()} ${className}`}
      style={backgroundStyle}
    >
      {/* If Palette Mode is 'image', render elegant watermark background texture */}
      {paletteMode === 'image' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
          style={{
            backgroundImage: `radial-gradient(${effectiveAccent} 1.5px, transparent 1.5px), radial-gradient(${effectiveAccent} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />
      )}

      {/* Main Resume Content sitting above texture */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
