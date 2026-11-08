import React from 'react';
import { ResumeRecord } from '../../types/resume';
import { SAMPLE_RESUME_CONTENT } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface AtsAcademicDocumentViewProps {
  resume?: ResumeRecord | null;
  templateId?: string;
}

export const AtsAcademicDocumentView: React.FC<AtsAcademicDocumentViewProps> = ({
  resume,
  templateId = 'classic_ats',
}) => {
  // Use either active resume content or default sample resume content
  const content = resume?.content || SAMPLE_RESUME_CONTENT;
  const { personal, summary, experience, education, skills, projects, certifications } = content;

  const isSerif = templateId === 'traditional' || templateId === 'executive_minimalist';
  const fontFamilyClass = isSerif ? 'font-serif' : 'font-sans';

  return (
    <div
      className={`w-full max-w-[794px] min-h-[1123px] bg-[#FFFFFF] text-black border border-neutral-300/80 shadow-2xl p-8 sm:p-12 mx-auto box-border ${fontFamilyClass} select-text transition-all leading-normal`}
      style={{
        fontSize: '9.5pt',
      }}
    >
      {/* 1. ACADEMIC & EXECUTIVE ATS HEADER */}
      <header className="text-center pb-3 border-b border-neutral-300 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase mb-1">
          {personal.fullName || 'Alex Vance'}
        </h1>
        {personal.jobTitle && (
          <p className="text-xs font-semibold text-zinc-800 uppercase tracking-widest mb-2">
            {personal.jobTitle}
          </p>
        )}

        {/* Clean ATS Contact Line (One or two lines with bullet separators) */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-zinc-700">
          {personal.location && (
            <span className="flex items-center gap-1">
              <span>{personal.location}</span>
            </span>
          )}
          {personal.phone && (
            <>
              <span className="text-neutral-400">•</span>
              <span>{personal.phone}</span>
            </>
          )}
          {personal.email && (
            <>
              <span className="text-neutral-400">•</span>
              <span>{personal.email}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span className="text-neutral-400">•</span>
              <span>{personal.linkedin.replace(/^https?:\/\//, '')}</span>
            </>
          )}
          {personal.website && (
            <>
              <span className="text-neutral-400">•</span>
              <span>{personal.website.replace(/^https?:\/\//, '')}</span>
            </>
          )}
        </div>
      </header>

      {/* 2. PROFESSIONAL SUMMARY */}
      {summary && summary.trim() && (
        <section className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Professional Summary
          </h2>
          <p className="text-zinc-800 text-[9.5pt] leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* 3. EDUCATION (Academic hierarchy: Degree bold, School italic, Dates tabular right) */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                {/* Top line: Degree bold left, Graduation date tabular right */}
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-black text-xs sm:text-sm">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="tabular-nums font-normal text-zinc-600 text-xs shrink-0">
                    {edu.startDate ? `${formatDate(edu.startDate)} – ` : ''}
                    {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>

                {/* Sub line: Institution italic left, Location right */}
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="italic font-normal text-zinc-700">
                    {edu.institution}
                    {edu.grade ? ` (GPA: ${edu.grade})` : ''}
                  </span>
                  {edu.location && (
                    <span className="text-zinc-600 italic font-normal text-[11px] shrink-0">
                      {edu.location}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="text-zinc-700 text-[9pt] pt-0.5 leading-snug">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. WORK EXPERIENCE (Title bold, Company italic, Dates tabular right, Round black bullets) */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                {/* Top line: Job Title bold left, Dates tabular right */}
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-black text-xs sm:text-sm">
                    {exp.role}
                  </span>
                  <span className="tabular-nums font-normal text-zinc-600 text-xs shrink-0">
                    {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>

                {/* Sub line: Company italic left, Location right */}
                <div className="flex justify-between items-baseline gap-2 text-xs">
                  <span className="italic font-normal text-zinc-700">
                    {exp.company}
                  </span>
                  {exp.location && (
                    <span className="text-zinc-600 italic font-normal text-[11px] shrink-0">
                      {exp.location}
                    </span>
                  )}
                </div>

                {/* Bullets: Concise, tight leading with round black bullet points */}
                {exp.description && (
                  <ul className="list-none space-y-1 mt-1 text-[9.5pt] text-zinc-800">
                    {exp.description
                      .split('\n')
                      .filter(Boolean)
                      .map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 leading-snug">
                          <span className="text-black text-[13px] leading-tight shrink-0 select-none">
                            •
                          </span>
                          <span>{bullet.replace(/^[-•*·]\s*/, '')}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. SKILLS & PROFICIENCIES */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Skills & Proficiencies
          </h2>
          <div className="text-xs text-zinc-850 space-y-1 leading-relaxed">
            <p>
              <strong className="font-bold text-black">Technologies & Tools: </strong>
              <span>{skills.map((s) => s.name).join(', ')}</span>
            </p>
          </div>
        </section>
      )}

      {/* 6. PROJECTS & OPEN SOURCE */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Projects & Open Source
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-black text-xs sm:text-sm">
                    {proj.title}
                    {proj.subtitle && (
                      <span className="italic font-normal text-zinc-700 text-xs ml-1.5">
                        — {proj.subtitle}
                      </span>
                    )}
                  </span>
                  {proj.link && (
                    <span className="tabular-nums font-mono text-[11px] text-zinc-600 shrink-0">
                      {proj.link.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-zinc-800 text-[9pt] leading-snug">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CERTIFICATIONS */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-black border-b-2 border-black pb-0.5 mb-2">
            Certifications
          </h2>
          <div className="space-y-1 text-xs">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline gap-2">
                <span>
                  <strong className="font-bold text-black">{cert.name}</strong>
                  {cert.issuer && <span className="italic text-zinc-700 ml-1">— {cert.issuer}</span>}
                </span>
                {cert.issueDate && (
                  <span className="tabular-nums font-normal text-zinc-600 text-[11px] shrink-0">
                    {formatDate(cert.issueDate)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
