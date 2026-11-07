import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  pdf 
} from '@react-pdf/renderer';
import { ResumeRecord } from '../../types/resume';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { formatDate } from '../../lib/utils';

interface ResumePdfDocumentProps {
  resume: ResumeRecord;
}

export const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ resume }) => {
  const { content, country_preset, template_id } = resume;
  const { personal, summary, experience, education, skills, projects, certifications, languages, customSections, sectionOrder, style } = content;
  const preset = COUNTRY_PRESETS[country_preset] || COUNTRY_PRESETS.us_ca;
  const features = preset.features;

  const pageSize = preset.paperSize === 'letter' ? 'LETTER' : 'A4';
  const accent = style.accentColor || '#1e40af';
  const marginPt = (style.marginMm || 14) * 2.83465; // mm to pt conversion

  const isSerif = template_id === 'traditional' || template_id === 'executive_minimalist';
  const baseFont = isSerif ? 'Times-Roman' : 'Helvetica';
  const boldFont = isSerif ? 'Times-Bold' : 'Helvetica-Bold';
  const italicFont = isSerif ? 'Times-Italic' : 'Helvetica-Oblique';

  const isTraditional = template_id === 'traditional';
  const isPhotoVisible = Boolean(personal.photoUrl && personal.showPhoto !== false);

  const isCenter = style.headerAlignment === 'center';
  const isSplit = style.headerAlignment === 'split';

  const styles = StyleSheet.create({
    page: {
      padding: marginPt,
      fontSize: style.fontSize || 9.5,
      fontFamily: baseFont,
      color: '#1e293b',
      lineHeight: style.lineHeight || 1.4,
    },
    header: {
      marginBottom: 10,
      borderBottomWidth: isTraditional ? 1 : 1.5,
      borderBottomColor: isTraditional ? '#94a3b8' : (template_id === 'momentum_ats' ? accent : '#cbd5e1'),
      borderBottomStyle: 'solid',
      paddingBottom: 7,
      alignItems: isCenter ? 'center' : 'flex-start',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: isCenter ? 'center' : (isSplit ? 'space-between' : 'flex-start'),
      width: '100%',
    },
    headerLeft: {
      flex: 1,
      alignItems: isCenter ? 'center' : 'flex-start',
    },
    fullName: {
      fontSize: 20,
      fontFamily: boldFont,
      color: style.accentTargets?.name ? accent : '#0f172a',
      letterSpacing: -0.2,
      textTransform: isTraditional ? 'uppercase' : 'none',
    },
    jobTitle: {
      fontSize: 10.5,
      fontFamily: isTraditional ? italicFont : boldFont,
      color: style.accentTargets?.jobTitle ? accent : (isTraditional ? '#475569' : accent),
      marginTop: 2,
      textTransform: isTraditional ? 'none' : 'uppercase',
      letterSpacing: 0.5,
    },
    photo: {
      width: style.photoSize === 'xs' ? 36 : style.photoSize === 's' ? 44 : style.photoSize === 'l' ? 64 : style.photoSize === 'xl' ? 74 : 54,
      height: style.photoSize === 'xs' ? 36 : style.photoSize === 's' ? 44 : style.photoSize === 'l' ? 64 : style.photoSize === 'xl' ? 74 : 54,
      borderRadius: (style.photoShapeType || personal.photoShape) === 'circle' ? 37 : (style.photoShapeType || personal.photoShape) === 'square' ? 0 : 8,
      marginLeft: isCenter ? 0 : 10,
      marginBottom: isCenter ? 6 : 0,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: 5,
      fontSize: 8.5,
      color: '#475569',
      justifyContent: isCenter ? 'center' : 'flex-start',
    },
    countryDetails: {
      fontSize: 7.8,
      color: '#64748b',
      marginTop: 3,
    },
    section: {
      marginTop: 8,
      marginBottom: 2,
    },
    sectionTitle: {
      fontSize: 9.5,
      fontFamily: boldFont,
      color: isTraditional ? '#1e293b' : accent,
      textTransform: style.sectionCapitalization === 'capitalize' ? 'capitalize' : 'uppercase',
      letterSpacing: 0.8,
      backgroundColor: style.sectionHeadingStyle === 'shaded_banner' ? '#f1f5f9' : (isTraditional ? '#f1f5f9' : 'transparent'),
      textAlign: isCenter ? 'center' : 'left',
      borderBottomWidth: style.sectionHeadingStyle === 'double_line' ? 1.5 : 0.8,
      borderBottomColor: '#cbd5e1',
      borderBottomStyle: style.sectionHeadingStyle === 'wavy_dashed' ? 'dashed' : 'solid',
      borderTopWidth: style.sectionHeadingStyle === 'double_line' || style.sectionHeadingStyle === 'overline_underline' ? 0.8 : 0,
      borderTopColor: '#cbd5e1',
      borderTopStyle: 'solid',
      paddingVertical: isTraditional || style.sectionHeadingStyle === 'shaded_banner' ? 2.5 : 1,
      paddingHorizontal: isTraditional || style.sectionHeadingStyle === 'shaded_banner' ? 4 : 0,
      marginBottom: 4,
    },
    summaryText: {
      fontSize: 8.8,
      color: '#334155',
      lineHeight: 1.4,
      textAlign: 'justify',
    },
    expItem: {
      marginBottom: 5,
    },
    expHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    expRole: {
      fontFamily: boldFont,
      fontSize: 9.2,
      color: '#0f172a',
    },
    expCompany: {
      fontFamily: baseFont,
      fontSize: 8.8,
      color: '#475569',
    },
    expDate: {
      fontSize: 8.2,
      color: '#64748b',
    },
    bulletRow: {
      flexDirection: 'row',
      marginBottom: 1.5,
      paddingLeft: 4,
    },
    bulletDot: {
      width: 9,
      fontSize: 8,
      color: '#94a3b8',
    },
    bulletText: {
      flex: 1,
      fontSize: 8.5,
      color: '#334155',
      lineHeight: 1.35,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillBadge: {
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      fontSize: 8,
      color: '#334155',
    },
    langRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    langItem: {
      fontSize: 8.5,
      color: '#334155',
    },
  });

  return (
    <Document>
      <Page size={pageSize} style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          {isTraditional && isPhotoVisible && (
            <Image src={personal.photoUrl!} style={[styles.photo, { marginBottom: 6, alignSelf: 'center', marginLeft: 0 }]} />
          )}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.fullName}>{personal.fullName || 'Your Name'}</Text>
              {personal.jobTitle ? <Text style={styles.jobTitle}>{personal.jobTitle}</Text> : null}

              <View style={styles.contactRow}>
                {personal.email && <Text>{personal.email}</Text>}
                {personal.phone && <Text>• {personal.phone}</Text>}
                {personal.location && <Text>• {personal.location}</Text>}
                {personal.website && <Text>• {personal.website.replace(/^https?:\/\//, '')}</Text>}
                {personal.linkedin && <Text>• {personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</Text>}
                {personal.github && <Text>• {personal.github.replace(/^https?:\/\/(www\.)?/, '')}</Text>}
              </View>

              {(features.birthDate || features.nationality || features.visaStatus || features.drivingLicense) && (
                <View style={styles.countryDetails}>
                  <Text>
                    {[
                      features.birthDate && personal.birthDate ? `Born: ${personal.birthDate}` : null,
                      features.nationality && personal.nationality ? `Nationality: ${personal.nationality}` : null,
                      features.visaStatus && personal.visaStatus ? `Visa: ${personal.visaStatus}` : null,
                      features.drivingLicense && personal.drivingLicense ? `License: ${personal.drivingLicense}` : null,
                    ].filter(Boolean).join('  |  ')}
                  </Text>
                </View>
              )}
            </View>

            {!isTraditional && isPhotoVisible && (
              <Image src={personal.photoUrl!} style={styles.photo} />
            )}
          </View>
        </View>

        {/* SECTIONS */}
        {sectionOrder.map((sec) => {
          if (!sec.enabled) return null;

          switch (sec.type) {
            case 'personal':
              return null;

            case 'summary':
              if (style.displaySummaryInHeader) return null;
              if (!summary || !summary.trim()) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  {style.showSummaryHeading !== false && (
                    <Text style={styles.sectionTitle}>{isTraditional ? 'Profile' : 'Professional Summary'}</Text>
                  )}
                  <Text style={styles.summaryText}>{summary}</Text>
                </View>
              );

            case 'experience':
              if (experience.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {isTraditional ? 'Experience' : template_id === 'professional' ? 'Employment History' : 'Professional Experience'}
                  </Text>
                  {experience.map((exp) => {
                    const isSubFirst = style.workExperienceOrder === 'subtitle_title';
                    const titlePrimary = isSubFirst ? exp.company : exp.role;
                    const titleSecondary = isSubFirst ? exp.role : exp.company;
                    const bulletChar = style.listStyle === 'hyphen' ? '-' : '•';

                    return (
                      <View key={exp.id} style={styles.expItem}>
                        <View style={styles.expHeader}>
                          <Text>
                            <Text style={styles.expRole}>{titlePrimary}</Text>
                            <Text style={styles.expCompany}> — {titleSecondary}</Text>
                            {exp.location ? <Text style={styles.expCompany}> ({exp.location})</Text> : null}
                          </Text>
                          <Text style={styles.expDate}>
                            {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </Text>
                        </View>
                        {exp.description ? (
                          exp.description.split('\n').filter(Boolean).map((bullet, idx) => (
                            <View key={idx} style={styles.bulletRow}>
                              <Text style={styles.bulletDot}>{bulletChar}</Text>
                              <Text style={styles.bulletText}>{bullet.replace(/^[-•*·]\s*/, '')}</Text>
                            </View>
                          ))
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              );

            case 'education':
              if (education.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 4 }}>
                      <View style={styles.expHeader}>
                        <Text>
                          <Text style={styles.expRole}>{edu.degree}</Text>
                          <Text style={styles.expCompany}> — {edu.institution}</Text>
                          {edu.grade ? <Text style={styles.expDate}> ({edu.grade})</Text> : null}
                        </Text>
                        <Text style={styles.expDate}>
                          {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </Text>
                      </View>
                      {edu.description ? (
                        <Text style={{ fontSize: 7.8, color: '#64748b', paddingLeft: 4 }}>
                          {edu.description}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              );

            case 'skills':
              if (skills.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {template_id === 'momentum_ats' ? 'Areas of Expertise' : 'Skills & Technologies'}
                  </Text>
                  <View style={styles.skillsContainer}>
                    {skills.map((s) => (
                      <View key={s.id} style={styles.skillBadge}>
                        <Text>{s.name} {s.level ? `(${s.level})` : ''}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );

            case 'projects':
              if (projects.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {projects.map((proj) => (
                    <View key={proj.id} style={{ marginBottom: 4 }}>
                      <View style={styles.expHeader}>
                        <Text style={styles.expRole}>{proj.title} {proj.subtitle ? `— ${proj.subtitle}` : ''}</Text>
                        {proj.link ? <Text style={{ fontSize: 8, color: accent }}>{proj.link}</Text> : null}
                      </View>
                      {proj.description ? (
                        proj.description.split('\n').filter(Boolean).map((bullet, idx) => (
                          <View key={idx} style={styles.bulletRow}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{bullet.replace(/^[-•*·]\s*/, '')}</Text>
                          </View>
                        ))
                      ) : null}
                    </View>
                  ))}
                </View>
              );

            case 'certifications':
              if (certifications.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {certifications.map((c) => (
                    <View key={c.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={{ fontSize: 8.5, color: '#1e293b' }}>
                        <Text style={{ fontFamily: boldFont }}>{c.name}</Text> — {c.issuer}
                      </Text>
                      {c.issueDate ? <Text style={styles.expDate}>{formatDate(c.issueDate)}</Text> : null}
                    </View>
                  ))}
                </View>
              );

            case 'languages':
              if (languages.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  <View style={styles.langRow}>
                    {languages.map((l) => (
                      <Text key={l.id} style={styles.langItem}>
                        <Text style={{ fontFamily: boldFont }}>{l.language}: </Text>
                        {features.cefrLanguageGrid && l.cefrLevel ? `${l.cefrLevel} (${l.proficiency})` : l.proficiency}
                      </Text>
                    ))}
                  </View>
                </View>
              );

            case 'custom': {
              const customSec = customSections.find((s) => s.id === sec.id);
              if (!customSec || customSec.items.length === 0) return null;
              return (
                <View key={sec.id} style={styles.section}>
                  <Text style={styles.sectionTitle}>{customSec.title}</Text>
                  {customSec.items.map((item) => (
                    <View key={item.id} style={{ marginBottom: 3 }}>
                      <Text style={{ fontSize: 8.8, fontFamily: boldFont, color: '#1e293b' }}>
                        {item.title} {item.subtitle ? `— ${item.subtitle}` : ''}
                      </Text>
                      {item.description ? (
                        <Text style={{ fontSize: 8.2, color: '#334155', paddingLeft: 4 }}>
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              );
            }

            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
};

// Generates crisp vector PDF blob client-side
export async function generatePdfBlob(resume: ResumeRecord): Promise<Blob> {
  const doc = <ResumePdfDocument resume={resume} />;
  return await pdf(doc).toBlob();
}

// Download PDF helper directly in browser
export async function triggerPdfDownload(resume: ResumeRecord): Promise<void> {
  const blob = await generatePdfBlob(resume);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedTitle = (resume.title || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `${sanitizedTitle}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
