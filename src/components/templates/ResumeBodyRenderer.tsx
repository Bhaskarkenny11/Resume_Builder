import React from 'react';
import { ResumeRecord, AccentColorTargets } from '../../types/resume';
import { formatDate, getSecondaryAccent } from '../../lib/utils';
import { sanitizeUrl } from '../../lib/security';
import { SectionHeadingRenderer } from './SectionHeadingRenderer';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Globe2, 
  Layers,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

interface ResumeBodyRendererProps {
  resume: ResumeRecord;
  headingStyleOverride?: any;
}

export const ResumeBodyRenderer: React.FC<ResumeBodyRendererProps> = ({
  resume,
  headingStyleOverride,
}) => {
  const { content } = resume;
  const { 
    summary, 
    experience, 
    education, 
    skills, 
    projects, 
    certifications, 
    languages, 
    customSections, 
    sectionOrder, 
    style 
  } = content;

  const effectiveAccent = style.accentColor && style.accentColor !== 'none' ? style.accentColor : '#1e40af';
  const secondaryAccent = style.colorPaletteMode === 'multi' ? getSecondaryAccent(effectiveAccent) : effectiveAccent;
  const headingStyle = headingStyleOverride || style.sectionHeadingStyle || 'underline_accent';
  const capitalization = style.sectionCapitalization || 'uppercase';
  const iconStyle = style.sectionIconStyle || 'none';

  const accentTargets: AccentColorTargets = style.accentTargets || {
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

  // Entry Layout helpers
  const listBulletChar = style.listStyle === 'hyphen' ? '–' : '•';
  const isIndentBody = Boolean(style.indentBody);
  const isDateBelowTitle = style.dateLocationPosition === 'below_title';
  const isSubTitleFirst = style.workExperienceOrder === 'subtitle_title';
  const isEducationSchoolFirst = style.educationOrder === 'subtitle_title';
  const isStructureColumns = style.entryStructure === 'columns';
  const splitPercent = style.splitPercent || 55;

  const getFontStyleClass = (variant?: 'regular' | 'bold' | 'italic') => {
    switch (variant) {
      case 'bold': return 'font-bold not-italic';
      case 'italic': return 'italic font-normal';
      default: return 'font-normal not-italic';
    }
  };

  // Helper for rendering date & location string with order
  const renderDateAndLocation = (dateStr: string, locationStr?: string) => {
    const isDateFirst = style.dateLocationOrder !== 'location_date';
    const isLocationBelowDate = style.locationPlacement === 'below_date';

    const dateElem = (
      <span 
        className={getFontStyleClass(style.dateFontStyle)}
        style={{ color: accentTargets.dates ? secondaryAccent : '#64748b' }}
      >
        {dateStr}
      </span>
    );

    const locElem = locationStr ? (
      <span 
        className={getFontStyleClass(style.locationFontStyle)}
        style={{ color: '#64748b' }}
      >
        {locationStr}
      </span>
    ) : null;

    if (!locationStr) {
      return dateElem;
    }

    if (isLocationBelowDate) {
      return (
        <div className="flex flex-col text-right items-end">
          {dateElem}
          {locElem}
        </div>
      );
    }

    // Same line
    if (isDateFirst) {
      return (
        <span className="flex items-center gap-1.5 justify-end">
          {dateElem}
          <span className="text-slate-400">•</span>
          {locElem}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 justify-end">
        {locElem}
        <span className="text-slate-400">•</span>
        {dateElem}
      </span>
    );
  };

  return (
    <div className="space-y-3.5 mt-2.5">
      {sectionOrder.map((sectionMeta) => {
        if (!sectionMeta.enabled) return null;

        switch (sectionMeta.type) {
          case 'personal':
            return null;

          case 'summary':
            // Suppress in body if displayed in header
            if (style.displaySummaryInHeader) return null;
            if (!summary || !summary.trim()) return null;
            return (
              <section key={sectionMeta.id} className="space-y-1">
                {style.showSummaryHeading !== false && (
                  <SectionHeadingRenderer
                    title={sectionMeta.title || 'Professional Summary'}
                    icon={<FileText className="w-3 h-3" />}
                    headingStyle={headingStyle}
                    capitalization={capitalization}
                    iconStyle={iconStyle}
                    accentColor={effectiveAccent}
                    accentTargets={accentTargets}
                  />
                )}
                <p className="text-slate-700 leading-relaxed text-justify mt-1">
                  {summary}
                </p>
              </section>
            );

          case 'experience':
            if (experience.length === 0) return null;
            const expColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.experienceColumns || 1];

            return (
              <section key={sectionMeta.id} className="space-y-2">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Work Experience'}
                  icon={<Briefcase className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />
                <div className={style.experienceLayout === 'grid' ? `grid ${expColsClass} gap-3` : style.experienceLayout === 'compact' ? 'space-y-1.5' : 'space-y-3'}>
                  {experience.map((exp, expIdx) => {
                    const primaryTitle = isSubTitleFirst ? exp.company : exp.role;
                    const secondaryTitle = isSubTitleFirst ? exp.role : exp.company;
                    const dateText = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
                    const isSubtitleBelow = style.subtitlePlacement === 'below_title';

                    // Group promotions badge indicator
                    const showPromotionBadge = style.groupPromotions && expIdx > 0 && experience[expIdx - 1].company.toLowerCase() === exp.company.toLowerCase();

                    // Structure: Columns vs Full Width
                    if (isStructureColumns && style.experienceLayout !== 'grid') {
                      return (
                        <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-slate-100 first:border-0 first:pt-0">
                          {/* Left Column: Metadata */}
                          <div className="md:col-span-4 space-y-0.5">
                            <div 
                              className={`font-bold text-xs sm:text-sm ${getFontStyleClass(style.subtitleFontStyle)}`}
                              style={{ color: accentTargets.entryTitle ? effectiveAccent : '#0f172a' }}
                            >
                              {primaryTitle}
                            </div>
                            {secondaryTitle && (
                              <div 
                                className="text-xs text-slate-600 font-medium"
                                style={{ color: accentTargets.entrySubtitle ? effectiveAccent : undefined }}
                              >
                                {secondaryTitle}
                              </div>
                            )}
                            <div className="text-[11px] font-mono text-slate-500 pt-0.5">
                              {renderDateAndLocation(dateText, exp.location)}
                            </div>
                            {showPromotionBadge && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 mt-1">
                                <TrendingUp className="w-2.5 h-2.5" />
                                Promotion
                              </span>
                            )}
                          </div>

                          {/* Right Column: Description */}
                          <div className={`md:col-span-8 text-slate-700 text-[0.95em] space-y-1 ${isIndentBody ? 'pl-4' : ''}`}>
                            {exp.description ? (
                              exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                                <p key={idx} className="flex items-start gap-1.5 leading-snug">
                                  <span 
                                    className="shrink-0"
                                    style={{ color: accentTargets.dotsBarsBubbles ? secondaryAccent : '#94a3b8' }}
                                  >
                                    {listBulletChar}
                                  </span>
                                  <span>{bullet.replace(/^[-•*·]\s*/, '')}</span>
                                </p>
                              ))
                            ) : null}
                          </div>
                        </div>
                      );
                    }

                    // Full Width Structure or Grid Card
                    return (
                      <div key={exp.id} className={style.experienceLayout === 'grid' ? 'p-2.5 border border-slate-200/80 rounded-lg bg-slate-50/40 space-y-1' : 'space-y-0.5'}>
                        {showPromotionBadge && (
                          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded-md w-fit border border-amber-200">
                            <TrendingUp className="w-3 h-3" />
                            <span>Internal Promotion / Progression</span>
                          </div>
                        )}

                        <div 
                          className={`flex ${isDateBelowTitle || style.experienceLayout === 'grid' ? 'flex-col' : 'justify-between items-baseline'} gap-1`}
                          style={
                            !isDateBelowTitle && style.experienceLayout !== 'grid' && style.splitPercent
                              ? { display: 'grid', gridTemplateColumns: `${splitPercent}% ${100 - splitPercent}%` }
                              : undefined
                          }
                        >
                          {/* Title block */}
                          <div className="min-w-0">
                            <span 
                              className="font-bold text-slate-900 text-xs sm:text-sm"
                              style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                            >
                              {primaryTitle}
                            </span>
                            {!isSubtitleBelow && secondaryTitle && (
                              <span 
                                className={`text-slate-600 ml-1.5 ${getFontStyleClass(style.subtitleFontStyle)}`}
                                style={{ color: accentTargets.entrySubtitle ? effectiveAccent : undefined }}
                              >
                                · {secondaryTitle}
                              </span>
                            )}
                            {isSubtitleBelow && secondaryTitle && (
                              <div 
                                className={`text-xs text-slate-600 mt-0.5 ${getFontStyleClass(style.subtitleFontStyle)}`}
                                style={{ color: accentTargets.entrySubtitle ? effectiveAccent : undefined }}
                              >
                                {secondaryTitle}
                              </div>
                            )}
                          </div>

                          {/* Date and Location block */}
                          <div className={`text-[11px] font-mono shrink-0 ${isDateBelowTitle || style.experienceLayout === 'grid' ? 'mt-0.5' : 'text-right'}`}>
                            {renderDateAndLocation(dateText, exp.location)}
                          </div>
                        </div>

                        {exp.description && (
                          <div className={`text-slate-700 space-y-0.5 mt-1 text-[0.95em] ${isIndentBody ? 'pl-6' : 'pl-1'}`}>
                            {exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                              <p key={idx} className="flex items-start gap-1.5 leading-snug">
                                <span 
                                  className="shrink-0"
                                  style={{ color: accentTargets.dotsBarsBubbles ? secondaryAccent : '#94a3b8' }}
                                >
                                  {listBulletChar}
                                </span>
                                <span>{bullet.replace(/^[-•*·]\s*/, '')}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'education':
            if (education.length === 0) return null;
            const eduColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.educationColumns || 1];

            return (
              <section key={sectionMeta.id} className="space-y-1.5">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Education'}
                  icon={<GraduationCap className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />
                <div className={style.educationLayout === 'grid' ? `grid ${eduColsClass} gap-2` : style.educationLayout === 'compact' ? 'space-y-1' : 'space-y-2'}>
                  {education.map((edu) => {
                    const primary = isEducationSchoolFirst ? edu.institution : `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`;
                    const secondary = isEducationSchoolFirst ? `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}` : edu.institution;
                    const dateText = `${formatDate(edu.startDate)} – ${edu.current ? 'Present' : formatDate(edu.endDate)}`;

                    return (
                      <div key={edu.id} className={style.educationLayout === 'grid' ? 'p-2 border border-slate-200/80 rounded bg-slate-50/40 space-y-1' : 'flex justify-between items-baseline gap-2'}>
                        <div>
                          <div 
                            className="font-bold text-xs text-slate-900"
                            style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                          >
                            {primary}
                          </div>
                          <div 
                            className={`text-slate-600 text-xs ${getFontStyleClass(style.subtitleFontStyle)}`}
                            style={{ color: accentTargets.entrySubtitle ? effectiveAccent : undefined }}
                          >
                            {secondary}
                            {edu.grade && <span className="font-mono text-slate-500 ml-1.5">({edu.grade})</span>}
                          </div>
                        </div>
                        <span className="text-[11px] font-mono shrink-0">
                          {renderDateAndLocation(dateText, edu.location)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );

          case 'skills':
            if (skills.length === 0) return null;
            const colsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-2',
              3: 'grid-cols-3',
              4: 'grid-cols-4',
            }[style.skillsColumns || 3];

            const bubbleBg = accentTargets.dotsBarsBubbles ? `${secondaryAccent}18` : '#f1f5f9';
            const bubbleBorder = accentTargets.dotsBarsBubbles ? `${secondaryAccent}40` : '#e2e8f0';
            const bubbleText = accentTargets.dotsBarsBubbles ? secondaryAccent : '#1e293b';

            return (
              <section key={sectionMeta.id} className="space-y-1">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Skills & Technologies'}
                  icon={<Wrench className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />

                {/* Level Format: Progress bars / meter */}
                {style.skillsLayout === 'level' ? (
                  <div className={`grid ${colsClass} gap-x-4 gap-y-2 mt-1 text-xs`}>
                    {skills.map((skill) => {
                      const pct = skill.level === 'Beginner' ? 25 : skill.level === 'Intermediate' ? 50 : skill.level === 'Advanced' ? 75 : 100;
                      return (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex justify-between text-slate-800 font-medium">
                            <span>{skill.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{skill.level || 'Expert'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: secondaryAccent }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : style.skillsLayout === 'grid' ? (
                  <div className={`grid ${colsClass} gap-x-4 gap-y-1 mt-1 text-xs`}>
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between text-slate-800 py-0.5">
                        <span className="font-medium flex items-center gap-1.5">
                          <span style={{ color: secondaryAccent }}>{listBulletChar}</span>
                          <span>{skill.name}</span>
                        </span>
                        {skill.level && (
                          <span className="text-[10px] text-slate-400 font-mono">({skill.level})</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : style.skillsLayout === 'rows' ? (
                  <div className="space-y-1 mt-1 text-xs">
                    {skills.map((skill) => (
                      <div key={skill.id} className="flex items-center gap-2 text-slate-800">
                        <span style={{ color: secondaryAccent }}>{listBulletChar}</span>
                        <span className="font-medium">{skill.name}</span>
                        {skill.level && <span className="text-[10px] text-slate-500">· {skill.level}</span>}
                      </div>
                    ))}
                  </div>
                ) : style.skillsLayout === 'compact' ? (
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {skills.map((s, idx) => (
                      <React.Fragment key={s.id}>
                        <span className="font-medium">{s.name}</span>
                        {s.level && <span className="text-slate-400 text-[10px] ml-0.5">({s.level})</span>}
                        {idx < skills.length - 1 && <span className="text-slate-400 mx-1.5">•</span>}
                      </React.Fragment>
                    ))}
                  </p>
                ) : (
                  // Default / 'bubble' format
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-all"
                        style={{
                          backgroundColor: bubbleBg,
                          borderColor: bubbleBorder,
                          borderWidth: '1px',
                          color: bubbleText,
                        }}
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="opacity-70 text-[10px] ml-1">· {skill.level}</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            );

          case 'projects':
            if (projects.length === 0) return null;
            const projColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.projectsColumns || 1];

            return (
              <section key={sectionMeta.id} className="space-y-1.5">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Projects'}
                  icon={<FolderGit2 className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />
                {style.projectsLayout === 'bubble' ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                        style={{
                          backgroundColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}15` : '#f8fafc',
                          borderColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}40` : '#e2e8f0',
                        }}
                      >
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        {proj.subtitle && <span className="text-slate-500 text-[10px]">({proj.subtitle})</span>}
                        {proj.link && (
                          <a href={sanitizeUrl(proj.link)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={style.projectsLayout === 'grid' ? `grid ${projColsClass} gap-3` : style.projectsLayout === 'compact' ? 'space-y-1' : 'space-y-2'}>
                    {projects.map((proj) => (
                      <div key={proj.id} className={style.projectsLayout === 'grid' ? 'p-2.5 border border-slate-200/80 rounded-lg bg-slate-50/40 space-y-1' : 'space-y-0.5'}>
                        <div className="flex justify-between items-baseline gap-2">
                          <span 
                            className="font-bold text-xs text-slate-900"
                            style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                          >
                            {proj.title}
                            {proj.subtitle && (
                              <span className="font-normal text-slate-600 ml-1.5">· {proj.subtitle}</span>
                            )}
                          </span>
                          {proj.link && (
                            <a
                              href={sanitizeUrl(proj.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono hover:underline inline-flex items-center gap-1"
                              style={{ color: accentTargets.linkIcons ? effectiveAccent : '#2563eb' }}
                            >
                              <span>{proj.link.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        {proj.description && (
                          <p className={`text-slate-700 text-[0.95em] leading-relaxed ${isIndentBody ? 'pl-6' : 'pl-1'}`}>
                            {proj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );

          case 'certifications':
            if (certifications.length === 0) return null;
            const certColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.certificatesColumns || 2];

            return (
              <section key={sectionMeta.id} className="space-y-1">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Certifications'}
                  icon={<Award className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />
                {style.certificatesLayout === 'bubble' ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {certifications.map((cert) => (
                      <span
                        key={cert.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border"
                        style={{
                          backgroundColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}15` : '#f1f5f9',
                          borderColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}40` : '#e2e8f0',
                        }}
                      >
                        <span className="font-bold text-slate-900">{cert.name}</span>
                        {cert.issuer && <span className="opacity-75 text-[10px] ml-1">({cert.issuer})</span>}
                      </span>
                    ))}
                  </div>
                ) : style.certificatesLayout === 'grid' ? (
                  <div className={`grid ${certColsClass} gap-2`}>
                    {certifications.map((cert) => (
                      <div key={cert.id} className="p-2 border border-slate-200 rounded text-xs bg-slate-50/50">
                        <div 
                          className="font-bold text-slate-900"
                          style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                        >
                          {cert.name}
                        </div>
                        {cert.issuer && <div className="text-slate-500 text-[11px]">{cert.issuer}</div>}
                        {cert.issueDate && (
                          <div 
                            className="font-mono text-[10px] mt-0.5"
                            style={{ color: accentTargets.dates ? secondaryAccent : '#94a3b8' }}
                          >
                            {formatDate(cert.issueDate)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : style.certificatesLayout === 'compact' ? (
                  <div className="space-y-0.5 text-xs">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-baseline gap-2">
                        <span className="font-medium text-slate-800">{cert.name} {cert.issuer && <span className="text-slate-500 text-[11px]">({cert.issuer})</span>}</span>
                        {cert.issueDate && <span className="font-mono text-[10px] text-slate-400">{formatDate(cert.issueDate)}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between text-xs gap-2">
                        <span className="text-slate-900">
                          <span 
                            className="font-bold"
                            style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                          >
                            {cert.name}
                          </span>
                          {cert.issuer && ` — ${cert.issuer}`}
                        </span>
                        {cert.issueDate && (
                          <span 
                            className="font-mono text-[11px] shrink-0"
                            style={{ color: accentTargets.dates ? secondaryAccent : '#64748b' }}
                          >
                            {formatDate(cert.issueDate)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );

          case 'languages':
            if (languages.length === 0) return null;
            const langColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.languagesColumns || 2];
            const sepChar = style.languagesSeparator === 'pipe' ? '|' : style.languagesSeparator === 'comma' ? ',' : '•';

            return (
              <section key={sectionMeta.id} className="space-y-1">
                <SectionHeadingRenderer
                  title={sectionMeta.title || 'Languages'}
                  icon={<Globe2 className="w-3 h-3" />}
                  headingStyle={headingStyle}
                  capitalization={capitalization}
                  iconStyle={iconStyle}
                  accentColor={effectiveAccent}
                  accentTargets={accentTargets}
                />
                {style.languagesLayout === 'grid' ? (
                  <div className={`grid ${langColsClass} gap-2 mt-1 text-xs`}>
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between p-1.5 border border-slate-200/80 rounded bg-slate-50/40">
                        <span className="font-bold text-slate-900">{lang.language}</span>
                        {lang.proficiency && (
                          <span className="text-slate-500 text-[11px]">{lang.proficiency}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : style.languagesLayout === 'rows' ? (
                  <div className="space-y-1 mt-1 text-xs">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex items-center gap-2 text-slate-800">
                        <span style={{ color: secondaryAccent }}>{listBulletChar}</span>
                        <span className="font-bold">{lang.language}</span>
                        {lang.proficiency && <span className="text-slate-500">· {lang.proficiency}</span>}
                      </div>
                    ))}
                  </div>
                ) : style.languagesLayout === 'bubble' ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {languages.map((lang) => (
                      <span
                        key={lang.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border"
                        style={{
                          backgroundColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}15` : '#f1f5f9',
                          borderColor: accentTargets.dotsBarsBubbles ? `${secondaryAccent}40` : '#e2e8f0',
                        }}
                      >
                        <span className="font-bold">{lang.language}</span>
                        {lang.proficiency && <span className="opacity-75 text-[10px] ml-1">({lang.proficiency})</span>}
                      </span>
                    ))}
                  </div>
                ) : (
                  // Compact / inline
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-1">
                    {languages.map((lang, idx) => (
                      <span key={lang.id} className="text-slate-800 flex items-center gap-1.5">
                        <span className="font-bold">{lang.language}</span>
                        {lang.proficiency && (
                          <span className="text-slate-500 text-[11px]">({lang.proficiency})</span>
                        )}
                        {idx < languages.length - 1 && (
                          <span className="text-slate-300 ml-1">{sepChar}</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            );

          case 'custom':
            if (customSections.length === 0) return null;
            const customColsClass = {
              1: 'grid-cols-1',
              2: 'grid-cols-1 md:grid-cols-2',
              3: 'grid-cols-1 md:grid-cols-3',
              4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
            }[style.customSectionsColumns || 1];

            return (
              <div key={sectionMeta.id} className="space-y-3">
                {customSections.map((sec) => (
                  <section key={sec.id} className="space-y-1.5">
                    <SectionHeadingRenderer
                      title={sec.title}
                      icon={<Layers className="w-3 h-3" />}
                      headingStyle={headingStyle}
                      capitalization={capitalization}
                      iconStyle={iconStyle}
                      accentColor={effectiveAccent}
                      accentTargets={accentTargets}
                    />
                    <div className={style.customSectionsLayout === 'grid' ? `grid ${customColsClass} gap-2` : style.customSectionsLayout === 'compact' ? 'space-y-1' : 'space-y-2'}>
                      {sec.items.map((item) => (
                        <div key={item.id} className={style.customSectionsLayout === 'grid' ? 'p-2 border border-slate-200/80 rounded bg-slate-50/40 space-y-0.5' : 'space-y-0.5'}>
                          <div className="flex justify-between items-baseline gap-2">
                            <span 
                              className="font-bold text-xs text-slate-900"
                              style={{ color: accentTargets.entryTitle ? effectiveAccent : undefined }}
                            >
                              {item.title}
                              {item.subtitle && (
                                <span className="font-normal text-slate-600 ml-1.5">· {item.subtitle}</span>
                              )}
                            </span>
                            {item.date && (
                              <span 
                                className="text-[11px] font-mono shrink-0"
                                style={{ color: accentTargets.dates ? secondaryAccent : '#64748b' }}
                              >
                                {item.date}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className={`text-slate-700 text-[0.95em] leading-relaxed ${isIndentBody ? 'pl-6' : 'pl-1'}`}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
