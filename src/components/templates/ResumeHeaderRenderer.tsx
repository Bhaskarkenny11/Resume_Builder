import React from 'react';
import { 
  ResumeRecord, 
  HeaderAlignment, 
  HeaderDetailsLayout, 
  HeaderSeparator, 
  HeaderIconStyle,
  PhotoPosition,
  PhotoSize,
  PhotoShapeType,
} from '../../types/resume';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { DEFAULT_AVATAR_URL } from '../../lib/utils';
import { sanitizeUrl } from '../../lib/security';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Calendar, 
  Flag, 
  ShieldCheck, 
  Car 
} from 'lucide-react';

interface ResumeHeaderRendererProps {
  resume: ResumeRecord;
  className?: string;
  nameClassName?: string;
  jobTitleClassName?: string;
  accentColor?: string;
  isSerif?: boolean;
}

export const ResumeHeaderRenderer: React.FC<ResumeHeaderRendererProps> = ({
  resume,
  className = '',
  nameClassName = '',
  jobTitleClassName = '',
  accentColor,
  isSerif = false,
}) => {
  const { content, country_preset } = resume;
  const { personal, style, summary } = content;
  const preset = COUNTRY_PRESETS[country_preset] || COUNTRY_PRESETS.us_ca;
  const features = preset.features;

  const alignment: HeaderAlignment = style.headerAlignment || 'left';
  const detailsLayout: HeaderDetailsLayout = style.headerDetailsLayout || 'wrap';
  const separator: HeaderSeparator = style.headerSeparator || (style.showSectionIcons ? 'icon' : 'bullet');
  const iconStyle: HeaderIconStyle = style.headerIconStyle || 'plain';
  const effectiveAccent = accentColor || (style.accentColor && style.accentColor !== 'none' ? style.accentColor : '#1e40af');

  // Photo settings
  const isPhotoVisible = personal.showPhoto !== false;
  const photoSource = personal.photoUrl || DEFAULT_AVATAR_URL;
  const photoShape: PhotoShapeType = (personal.photoShape as any) || style.photoShapeType || 'circle';
  const photoSize: PhotoSize = style.photoSize || 'm';
  const photoPosition: PhotoPosition = style.photoPosition || 'left';
  const photoGrayscale = style.photoGrayscale || false;

  const isHeaderTheme = style.colorThemePlacement === 'header';

  const accentTargets = style.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingsLine: true,
    headerIcons: false,
    dotsBarsBubbles: false,
    dates: false,
    entryTitle: false,
    entrySubtitle: false,
    linkIcons: false,
  };

  // Construct contact items list
  interface ContactItem {
    id: string;
    text: string;
    href?: string;
    icon: React.ReactNode;
  }

  const items: ContactItem[] = [];

  if (personal.phone) {
    items.push({
      id: 'phone',
      text: personal.phone,
      href: `tel:${personal.phone}`,
      icon: <Phone className="w-3 h-3 shrink-0" />,
    });
  }
  if (personal.email) {
    items.push({
      id: 'email',
      text: personal.email,
      href: `mailto:${personal.email}`,
      icon: <Mail className="w-3 h-3 shrink-0" />,
    });
  }
  if (personal.location) {
    items.push({
      id: 'location',
      text: personal.location,
      icon: <MapPin className="w-3 h-3 shrink-0" />,
    });
  }
  if (personal.website) {
    items.push({
      id: 'website',
      text: personal.website.replace(/^https?:\/\//, ''),
      href: personal.website.startsWith('http') ? personal.website : `https://${personal.website}`,
      icon: <Globe className="w-3 h-3 shrink-0" />,
    });
  }
  if (personal.linkedin) {
    items.push({
      id: 'linkedin',
      text: personal.linkedin.replace(/^https?:\/\/(www\.)?/, ''),
      href: personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`,
      icon: <Linkedin className="w-3 h-3 shrink-0" />,
    });
  }
  if (personal.github) {
    items.push({
      id: 'github',
      text: personal.github.replace(/^https?:\/\/(www\.)?/, ''),
      href: personal.github.startsWith('http') ? personal.github : `https://${personal.github}`,
      icon: <Github className="w-3 h-3 shrink-0" />,
    });
  }

  // Country specific details
  if (features.birthDate && personal.birthDate) {
    items.push({
      id: 'birthDate',
      text: personal.birthDate,
      icon: <Calendar className="w-3 h-3 shrink-0" />,
    });
  }
  if (features.nationality && personal.nationality) {
    items.push({
      id: 'nationality',
      text: personal.nationality,
      icon: <Flag className="w-3 h-3 shrink-0" />,
    });
  }
  if (features.visaStatus && personal.visaStatus) {
    items.push({
      id: 'visaStatus',
      text: personal.visaStatus,
      icon: <ShieldCheck className="w-3 h-3 shrink-0" />,
    });
  }
  if (features.drivingLicense && personal.drivingLicense) {
    items.push({
      id: 'drivingLicense',
      text: personal.drivingLicense,
      icon: <Car className="w-3 h-3 shrink-0" />,
    });
  }

  // Render icon container based on FlowCV Icon Style
  const renderItemIcon = (icon: React.ReactNode) => {
    if (isHeaderTheme) {
      return (
        <span className="w-4 h-4 rounded-xs bg-white/20 text-white flex items-center justify-center shrink-0">
          {icon}
        </span>
      );
    }

    const iconAccent = accentTargets.headerIcons ? effectiveAccent : '#64748b';
    switch (iconStyle) {
      case 'circle_filled':
        return (
          <span 
            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white"
            style={{ backgroundColor: iconAccent }}
          >
            {icon}
          </span>
        );
      case 'square_filled':
        return (
          <span 
            className="w-4 h-4 rounded-xs flex items-center justify-center shrink-0 text-white"
            style={{ backgroundColor: iconAccent }}
          >
            {icon}
          </span>
        );
      case 'dark_square':
        return (
          <span className="w-4 h-4 rounded-xs bg-slate-900 text-white flex items-center justify-center shrink-0">
            {icon}
          </span>
        );
      case 'circle_outline':
        return (
          <span 
            className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
            style={{ borderColor: iconAccent, color: iconAccent }}
          >
            {icon}
          </span>
        );
      case 'square_outline':
        return (
          <span 
            className="w-4 h-4 rounded-xs border flex items-center justify-center shrink-0"
            style={{ borderColor: iconAccent, color: iconAccent }}
          >
            {icon}
          </span>
        );
      case 'minimal_border':
        return (
          <span className="w-4 h-4 rounded-none border border-slate-400 text-slate-700 flex items-center justify-center shrink-0">
            {icon}
          </span>
        );
      case 'plain':
      default:
        return (
          <span className="shrink-0" style={{ color: iconAccent }}>
            {icon}
          </span>
        );
    }
  };

  // Render photo component
  const renderPhoto = () => {
    if (!isPhotoVisible) return null;

    // Size dimensions
    const sizeClasses = {
      xs: photoShape.includes('portrait') ? 'w-10 h-13' : 'w-12 h-12',
      s: photoShape.includes('portrait') ? 'w-14 h-18' : 'w-16 h-16',
      m: photoShape.includes('portrait') ? 'w-18 h-24' : 'w-20 h-20',
      l: photoShape.includes('portrait') ? 'w-22 h-29' : 'w-24 h-24',
      xl: photoShape.includes('portrait') ? 'w-24 h-32' : 'w-28 h-28',
    }[photoSize] || 'w-20 h-20';

    // Shape border radiuses
    const shapeClasses = {
      circle: 'rounded-full aspect-square',
      square: 'rounded-none aspect-square',
      rounded: 'rounded-2xl aspect-square',
      portrait: 'rounded-none aspect-[3/4]',
      portrait_rounded: 'rounded-xl aspect-[3/4]',
    }[photoShape] || 'rounded-full aspect-square';

    return (
      <div 
        className={`overflow-hidden shrink-0 shadow-sm transition-all ${sizeClasses} ${shapeClasses} ${
          isHeaderTheme ? 'border-2 border-white/90 shadow-md ring-2 ring-white/30' : 'border-2 border-slate-200/90'
        }`}
      >
        <img 
          src={photoSource} 
          alt={personal.fullName || 'Profile'} 
          className={`w-full h-full object-cover ${photoGrayscale ? 'grayscale' : ''}`} 
        />
      </div>
    );
  };

  // Render contact detail items
  const renderDetails = () => {
    if (items.length === 0) return null;

    const textColor = isHeaderTheme ? 'text-white/90' : 'text-slate-600';
    const linkColor = isHeaderTheme ? 'text-white hover:underline' : 'text-slate-700 hover:underline';
    const bulletColor = isHeaderTheme ? 'text-white/60' : 'text-slate-400';
    const barColor = isHeaderTheme ? 'text-white/50' : 'text-slate-300';

    if (detailsLayout === 'columns') {
      return (
        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-2.5 text-[11px] ${textColor} ${
          alignment === 'center' ? 'text-center' : 'text-left'
        }`}>
          {items.map((item) => (
            <div key={item.id} className={`flex items-center gap-1.5 truncate ${alignment === 'center' ? 'justify-center' : 'justify-start'}`}>
              {separator === 'icon' && renderItemIcon(item.icon)}
              {separator === 'bullet' && <span className={`${bulletColor} font-bold`}>•</span>}
              {separator === 'bar' && <span className={`${barColor} font-light`}>|</span>}
              {item.href ? (
                <a href={sanitizeUrl(item.href)} target="_blank" rel="noopener noreferrer" className={`truncate ${linkColor}`}>
                  {item.text}
                </a>
              ) : (
                <span className="truncate">{item.text}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Wrap mode (FlowCV standard)
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] ${textColor} ${
        alignment === 'center' ? 'justify-center' : 'justify-start'
      }`}>
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div className="flex items-center gap-1.5">
              {separator === 'icon' && renderItemIcon(item.icon)}
              {item.href ? (
                <a href={sanitizeUrl(item.href)} target="_blank" rel="noopener noreferrer" className={linkColor}>
                  {item.text}
                </a>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
            {idx < items.length - 1 && (
              <>
                {separator === 'bullet' && (
                  <span className={`${bulletColor} font-bold select-none`}>•</span>
                )}
                {separator === 'bar' && (
                  <span className={`${barColor} font-light select-none`}>|</span>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Render summary inside header if enabled
  const renderSummaryInHeader = () => {
    if (!style.displaySummaryInHeader || !summary || !summary.trim()) return null;
    return (
      <div className={`mt-2.5 pt-2 text-[0.93em] leading-relaxed text-justify ${
        isHeaderTheme ? 'border-t border-white/20 text-white/95' : 'border-t border-slate-100 text-slate-600'
      }`}>
        {summary}
      </div>
    );
  };

  // Main text block for name, job title, and contact items
  const renderTextContent = () => {
    const nameColor = isHeaderTheme 
      ? '#ffffff' 
      : (accentTargets.name ? effectiveAccent : '#0f172a');

    const jobTitleColor = isHeaderTheme 
      ? 'rgba(255, 255, 255, 0.9)' 
      : (accentTargets.jobTitle ? effectiveAccent : '#475569');

    return (
      <div className={`flex-1 min-w-0 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
        <h1 
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isSerif ? 'font-serif' : 'font-sans'} ${nameClassName}`}
          style={{ color: nameColor }}
        >
          {personal.fullName || 'Your Name'}
        </h1>

        {personal.jobTitle && (
          <p 
            className={`text-xs sm:text-sm font-semibold tracking-wide uppercase mt-0.5 ${jobTitleClassName}`}
            style={{ color: jobTitleColor }}
          >
            {personal.jobTitle}
          </p>
        )}

        {renderDetails()}
        {renderSummaryInHeader()}
      </div>
    );
  };

  const headerContainerStyle = isHeaderTheme
    ? { backgroundColor: effectiveAccent, borderRadius: '0.625rem', padding: '1.25rem', marginBottom: '1.25rem' }
    : undefined;

  const headerContainerClasses = `pb-3 mb-3 transition-all ${
    isHeaderTheme ? 'shadow-sm text-white' : 'border-b border-slate-200'
  } ${className}`;

  // 1. Photo Top: Photo centered on top, profile details centered below it
  if (photoPosition === 'top') {
    return (
      <header data-resume-header="true" className={`${headerContainerClasses} flex flex-col items-center justify-center text-center`} style={headerContainerStyle}>
        {isPhotoVisible && <div className="mb-3">{renderPhoto()}</div>}
        {renderTextContent()}
      </header>
    );
  }

  // 2. Photo Right: Profile details on left, Photo on right
  if (photoPosition === 'right') {
    return (
      <header data-resume-header="true" className={`${headerContainerClasses} flex items-center justify-between gap-4 sm:gap-6`} style={headerContainerStyle}>
        {renderTextContent()}
        {isPhotoVisible && (
          <div className="shrink-0 order-last self-center">
            {renderPhoto()}
          </div>
        )}
      </header>
    );
  }

  // 3. Photo Left (default): Photo on left, Profile details on right
  return (
    <header data-resume-header="true" className={`${headerContainerClasses} flex items-center gap-4 sm:gap-6`} style={headerContainerStyle}>
      {isPhotoVisible && (
        <div className="shrink-0 self-center">
          {renderPhoto()}
        </div>
      )}
      {renderTextContent()}
    </header>
  );
};
