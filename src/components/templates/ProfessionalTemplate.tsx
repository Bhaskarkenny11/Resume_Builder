import React from 'react';
import { ResumeRecord, SectionGridColumns, PhotoShapeType } from '../../types/resume';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { formatDate, DEFAULT_AVATAR_URL } from '../../lib/utils';
import { ResumeBodyRenderer } from './ResumeBodyRenderer';
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
  Car,
  Wrench,
  Globe2
} from 'lucide-react';

interface TemplateProps {
  resume: ResumeRecord;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { content, country_preset } = resume;
  const { personal, skills, languages, style } = content;
  const preset = COUNTRY_PRESETS[country_preset] || COUNTRY_PRESETS.us_ca;
  const features = preset.features;

  const sidebarBg = style.accentColor && style.accentColor !== 'none' ? style.accentColor : '#064e3b';
  const isPhotoVisible = personal.showPhoto !== false;
  const photoSrc = personal.photoUrl || DEFAULT_AVATAR_URL;
  const photoShape: PhotoShapeType = (personal.photoShape as any) || style.photoShapeType || 'circle';

  const shapeClass = {
    circle: 'rounded-full aspect-square',
    square: 'rounded-none aspect-square',
    rounded: 'rounded-2xl aspect-square',
    portrait: 'rounded-none aspect-[3/4]',
    portrait_rounded: 'rounded-xl aspect-[3/4]',
  }[photoShape] || 'rounded-full aspect-square';

  return (
    <div
      className="w-full bg-white text-slate-900 font-sans box-border flex min-h-full transition-all"
      style={{
        fontSize: `${style.fontSize}pt`,
        lineHeight: style.lineHeight,
      }}
    >
      {/* LEFT SIDEBAR (~32% width) */}
      <aside
        className="w-[32%] text-white p-6 shrink-0 flex flex-col space-y-5"
        style={{ backgroundColor: sidebarBg }}
      >
        {/* Profile Photo */}
        {isPhotoVisible && (
          <div className={`w-24 h-24 overflow-hidden border-2 border-white/80 shadow-md mx-auto shrink-0 ${shapeClass}`}>
            <img 
              src={photoSrc} 
              alt={personal.fullName} 
              className={`w-full h-full object-cover ${style.photoGrayscale ? 'grayscale' : ''}`} 
            />
          </div>
        )}

        {/* Name and Job Title in sidebar */}
        <div className="text-center space-y-1 pb-3 border-b border-white/20">
          <h1 className="text-xl font-bold tracking-tight text-white">
            {personal.fullName || 'Your Name'}
          </h1>
          {personal.jobTitle && (
            <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
              {personal.jobTitle}
            </p>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-2.5 text-xs text-white/90">
          <div className="font-bold text-[11px] uppercase tracking-wider text-white/70">Contact</div>
          {personal.email && (
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{personal.location}</span>
            </div>
          )}
          {personal.website && (
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{personal.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-2 truncate">
              <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{personal.linkedin.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personal.github && (
            <div className="flex items-center gap-2 truncate">
              <Github className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{personal.github.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>

        {/* Sidebar Skills if enabled */}
        {skills.length > 0 && (
          <div className="space-y-2 text-xs pt-2 border-t border-white/20">
            <div className="font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              <Wrench className="w-3 h-3" />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 rounded-sm bg-white/15 text-white text-[10px]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Languages if enabled */}
        {languages.length > 0 && (
          <div className="space-y-2 text-xs pt-2 border-t border-white/20">
            <div className="font-bold text-[11px] uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              <Globe2 className="w-3 h-3" />
              <span>Languages</span>
            </div>
            <div className="space-y-1">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-[11px] text-white/90">
                  <span className="font-medium">{l.language}</span>
                  <span className="text-white/60">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT AREA (~68% width) */}
      <main
        className="w-[68%] p-6 flex flex-col justify-between"
        style={{
          padding: `${style.marginMm}mm`,
        }}
      >
        <ResumeBodyRenderer resume={resume} />
      </main>
    </div>
  );
};
