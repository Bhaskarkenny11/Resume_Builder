import { 
  ResumeContent, 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  ProjectItem, 
  CertificationItem, 
  LanguageItem 
} from '../../types/resume';
import { DEFAULT_STYLE } from '../constants';

interface ExtractedSections {
  rawHeader: string[];
  summaryLines: string[];
  experienceLines: string[];
  educationLines: string[];
  skillsLines: string[];
  projectsLines: string[];
  certificationsLines: string[];
  languagesLines: string[];
  otherLines: string[];
}

export function parseResumeText(rawText: string): ResumeContent {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const sections = segmentSections(lines);

  const personal = extractPersonalDetails(sections.rawHeader, lines);
  const summary = extractSummary(sections.summaryLines);
  const experience = extractExperience(sections.experienceLines, personal.jobTitle);
  const education = extractEducation(sections.educationLines);
  const skills = extractSkills(sections.skillsLines);
  const projects = extractProjects(sections.projectsLines);
  const certifications = extractCertifications(sections.certificationsLines);
  const languages = extractLanguages(sections.languagesLines);

  return {
    personal,
    summary,
    experience: experience.length > 0 ? experience : [
      {
        id: `exp-${Date.now()}`,
        company: 'Sample Company',
        role: personal.jobTitle || 'Software Engineer',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: '• Spearheaded software engineering workflows and feature delivery.',
      }
    ],
    education: education.length > 0 ? education : [
      {
        id: `edu-${Date.now()}`,
        institution: 'University / College',
        degree: 'Bachelor of Technology',
        startDate: '2018',
        endDate: '2022',
        current: false,
      }
    ],
    skills: skills.length > 0 ? skills : [
      { id: 'sk-1', name: 'JavaScript / TypeScript', category: 'General', level: 'Expert' },
      { id: 'sk-2', name: 'Problem Solving', category: 'General', level: 'Advanced' },
    ],
    projects,
    certifications,
    languages: languages.length > 0 ? languages : [
      { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual', cefrLevel: 'C2' }
    ],
    customSections: [],
    sectionOrder: [
      { id: 'sec-personal', type: 'personal', title: 'Personal Details', enabled: true },
      { id: 'sec-summary', type: 'summary', title: 'Professional Summary', enabled: true },
      { id: 'sec-experience', type: 'experience', title: 'Work Experience', enabled: true },
      { id: 'sec-education', type: 'education', title: 'Education', enabled: true },
      { id: 'sec-skills', type: 'skills', title: 'Skills & Proficiencies', enabled: true },
      { id: 'sec-projects', type: 'projects', title: 'Projects', enabled: true },
      { id: 'sec-certifications', type: 'certifications', title: 'Certifications', enabled: true },
      { id: 'sec-languages', type: 'languages', title: 'Languages', enabled: true },
    ],
    style: DEFAULT_STYLE,
  };
}

function segmentSections(lines: string[]): ExtractedSections {
  const result: ExtractedSections = {
    rawHeader: [],
    summaryLines: [],
    experienceLines: [],
    educationLines: [],
    skillsLines: [],
    projectsLines: [],
    certificationsLines: [],
    languagesLines: [],
    otherLines: [],
  };

  type SectionKey = keyof Omit<ExtractedSections, 'rawHeader' | 'otherLines'> | null;
  let currentSection: SectionKey = null;

  const headerRegexes: { key: SectionKey; regex: RegExp }[] = [
    { key: 'summaryLines', regex: /^(summary|professional summary|profile|about me|objective|executive summary)/i },
    { key: 'experienceLines', regex: /^(experience|work experience|employment history|professional experience|work history)/i },
    { key: 'educationLines', regex: /^(education|academic background|qualifications|academic history)/i },
    { key: 'skillsLines', regex: /^(skills|technical skills|competencies|core competencies|technologies|tools)/i },
    { key: 'projectsLines', regex: /^(projects|personal projects|key projects|academic projects)/i },
    { key: 'certificationsLines', regex: /^(certifications|certificates|licenses|accreditations)/i },
    { key: 'languagesLines', regex: /^(languages|language skills|language proficiency)/i },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const clean = line.replace(/[:\-_#*]/g, '').trim();

    let matchedKey: SectionKey = null;
    for (const h of headerRegexes) {
      if (h.regex.test(clean) && clean.length < 35) {
        matchedKey = h.key;
        break;
      }
    }

    if (matchedKey) {
      currentSection = matchedKey;
      continue;
    }

    if (!currentSection) {
      result.rawHeader.push(line);
    } else {
      result[currentSection].push(line);
    }
  }

  return result;
}

function extractPersonalDetails(headerLines: string[], allLines: string[]) {
  const fullText = allLines.join('\n');

  // Email
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // LinkedIn
  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_/%-]+)/i);
  let linkedin = '';
  if (linkedinMatch) {
    const cleanPath = linkedinMatch[1].replace(/\/+$/, '').split(' ')[0];
    linkedin = `linkedin.com/in/${cleanPath}`;
  }

  // GitHub
  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_/%-]+)/i);
  let github = '';
  if (githubMatch) {
    const cleanPath = githubMatch[1].replace(/\/+$/, '').split(' ')[0];
    github = `github.com/${cleanPath}`;
  }

  // Website / Portfolio (Vercel, Netlify, Custom domain)
  const urlMatches = fullText.match(/https?:\/\/[^\s]+|([a-zA-Z0-9-]+\.(?:vercel\.app|netlify\.app|dev|io|me))/gi);
  let website = '';
  if (urlMatches) {
    const customUrl = urlMatches.find((u) => !u.includes('linkedin.com') && !u.includes('github.com'));
    if (customUrl) {
      website = customUrl.startsWith('http') ? customUrl : `https://${customUrl}`;
    }
  }

  // Filter out any lines that are obviously links, emails, or phone numbers from header lines
  const isUrlOrContactLine = (line: string) => {
    const lower = line.toLowerCase();
    return (
      lower.includes('@') ||
      lower.includes('http') ||
      lower.includes('linkedin.com') ||
      lower.includes('github.com') ||
      lower.includes('vercel.app') ||
      lower.includes('netlify.app') ||
      lower.includes('.com') ||
      lower.includes('.io') ||
      lower.includes('.dev') ||
      /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(line)
    );
  };

  const cleanHeader = headerLines.filter((l) => !isUrlOrContactLine(l) && l.trim().length > 1);

  let fullName = 'Your Name';
  let jobTitle = 'Software Developer';
  let location = '';

  const knownTitlesRegex = /(full[\s-]?stack\s*(?:developer|engineer)|frontend\s*(?:developer|engineer)|backend\s*(?:developer|engineer)|software\s*(?:engineer|developer)|cloud\s*architect|solutions?\s*architect|data\s*(?:scientist|analyst|engineer)|devops\s*engineer|mobile\s*developer|product\s*manager|ui[\s/]?ux\s*designer)/i;
  const locationRegex = /(?:[A-Za-z\s.-]+,\s*[A-Za-z\s.-]+|[A-Za-z\s.-]+,\s*[A-Z]{2}\b|(?:remote|hybrid|san francisco|new york|london|seattle|austin|chicago|boston|toronto|berlin|paris|bangalore|hyderabad|mumbai|delhi|singapore|sydney|dubai|tokyo))/i;

  const isExcludedToken = (token: string) => {
    const l = token.toLowerCase();
    return (
      l.includes('@') ||
      l.includes('http') ||
      l.includes('linkedin.com') ||
      l.includes('github.com') ||
      l.includes('vercel.app') ||
      l.includes('netlify.app') ||
      l.includes('.com') ||
      l.includes('.io') ||
      l.includes('.dev') ||
      l.includes('.org') ||
      /(\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(token)
    );
  };

  // 1. Search for location in all header lines, splitting tokens by |, •, ·, ;, or tab
  for (const hLine of headerLines) {
    if (location) break;
    const parts = hLine.split(/[|•·;\t]/).map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      if (!isExcludedToken(part) && !knownTitlesRegex.test(part) && part.length >= 3 && part.length <= 60) {
        if (locationRegex.test(part) || part.includes(',')) {
          location = part.replace(/^location\s*[:\-]\s*/i, '').trim();
          break;
        }
      }
    }
  }

  // 2. Fallback: Search first 10 lines of document for location
  if (!location) {
    for (const line of allLines.slice(0, 10)) {
      const parts = line.split(/[|•·;\t]/).map((p) => p.trim()).filter(Boolean);
      for (const part of parts) {
        if (!isExcludedToken(part) && !knownTitlesRegex.test(part) && part.length >= 3 && part.length <= 60) {
          if (locationRegex.test(part) && (part.includes(',') || /(remote|hybrid|usa|india|uk|germany|canada)/i.test(part))) {
            location = part.replace(/^location\s*[:\-]\s*/i, '').trim();
            break;
          }
        }
      }
      if (location) break;
    }
  }

  if (cleanHeader.length > 0) {
    const firstLine = cleanHeader[0].trim();
    const titleMatch = firstLine.match(knownTitlesRegex);
    if (titleMatch && titleMatch.index && titleMatch.index > 3) {
      // Name and Title were placed on the same line! e.g. "Bhaskar Yerrolla Full Stack Developer"
      fullName = firstLine.substring(0, titleMatch.index).trim();
      jobTitle = titleMatch[0].trim();
    } else {
      fullName = firstLine;
    }
  }

  if (cleanHeader.length > 1 && jobTitle === 'Software Developer') {
    const secondLine = cleanHeader[1].trim();
    if (knownTitlesRegex.test(secondLine)) {
      jobTitle = secondLine;
    } else if (secondLine.includes(',') && !location) {
      location = secondLine;
    }
  }

  if (cleanHeader.length > 2 && !location) {
    const candidate = cleanHeader[2].trim();
    if (!candidate.toLowerCase().includes('http') && !candidate.toLowerCase().includes('github')) {
      location = candidate;
    }
  }

  return {
    fullName,
    jobTitle,
    email,
    phone,
    location,
    website,
    linkedin,
    github,
  };
}

function extractSummary(lines: string[]): string {
  return lines.join(' ').trim();
}

function extractExperience(lines: string[], fallbackRole?: string): ExperienceItem[] {
  const items: ExperienceItem[] = [];
  let currentItem: Partial<ExperienceItem> | null = null;
  let currentBullets: string[] = [];

  const datePattern = /(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4})\s*(?:–|—|-|to)\s*(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4}|present|current)/i;

  const isLinkOrNoise = (str: string) => {
    const l = str.toLowerCase();
    return l.includes('linkedin.com') || l.includes('github.com') || l.includes('vercel.app') || l.includes('http');
  };

  for (const line of lines) {
    if (isLinkOrNoise(line)) continue;

    const dateMatch = line.match(datePattern);
    const isBullet = /^[-•*·\d+.]\s*/.test(line);

    if (dateMatch && !isBullet) {
      if (currentItem && currentItem.company) {
        items.push({
          id: `exp-${items.length + 1}-${Date.now()}`,
          company: currentItem.company || 'Company',
          role: currentItem.role || fallbackRole || 'Software Engineer',
          location: currentItem.location || '',
          startDate: currentItem.startDate || '2020',
          endDate: currentItem.endDate || 'Present',
          current: currentItem.current || false,
          description: currentBullets.join('\n') || '• Contributed to key company goals.',
        });
        currentBullets = [];
      }

      const isCurrent = /present|current/i.test(dateMatch[2]);
      const dateStr = dateMatch[0];
      const remainder = line.replace(dateStr, '').trim();

      let company = remainder || 'Company';
      let loc = '';

      if (company.includes('|')) {
        const parts = company.split('|');
        company = parts[0].trim();
        loc = parts.slice(1).join(', ').trim();
      } else if (company.includes('·')) {
        const parts = company.split('·');
        company = parts[0].trim();
        loc = parts.slice(1).join(', ').trim();
      } else if (company.includes(' - ')) {
        const parts = company.split(' - ');
        company = parts[0].trim();
        loc = parts.slice(1).join(', ').trim();
      } else if (company.includes(',')) {
        const parts = company.split(',');
        if (parts.length >= 2) {
          company = parts[0].trim();
          loc = parts.slice(1).join(', ').trim();
        }
      }

      currentItem = {
        startDate: dateMatch[1].trim(),
        endDate: isCurrent ? '' : dateMatch[2].trim(),
        current: isCurrent,
        company: company || 'Company',
        role: fallbackRole || 'Software Engineer',
        location: loc,
      };
    } else if (isBullet) {
      const cleanBullet = line.replace(/^[-•*·\d+.]\s*/, '').trim();
      if (cleanBullet) {
        currentBullets.push(`• ${cleanBullet}`);
      }
    } else if (currentItem) {
      if (!currentItem.role || currentItem.role === 'Software Engineer') {
        currentItem.role = line;
      } else if (!currentItem.location && (line.includes(',') || /(remote|hybrid)/i.test(line))) {
        currentItem.location = line.trim();
      } else {
        currentBullets.push(`• ${line}`);
      }
    }
  }

  if (currentItem && currentItem.company) {
    items.push({
      id: `exp-${items.length + 1}-${Date.now()}`,
      company: currentItem.company,
      role: currentItem.role || fallbackRole || 'Software Engineer',
      location: currentItem.location || '',
      startDate: currentItem.startDate || '2020',
      endDate: currentItem.endDate || 'Present',
      current: currentItem.current || false,
      description: currentBullets.join('\n') || '• Accomplished milestones in core initiatives.',
    });
  }

  return items;
}

function extractEducation(lines: string[]): EducationItem[] {
  const items: EducationItem[] = [];
  const degreeRegex = /(bachelor|master|b\.s\.|m\.s\.|ph\.d\.|b\.tech|m\.tech|bba|mba|associate|degree|diploma)/i;
  const dateRegex = /(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4})\s*(?:–|—|-|to)\s*(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4}|present|current)/i;
  const singleYearRegex = /\b(19\d{2}|20\d{2})\b/;

  let currentEdu: Partial<EducationItem> | null = null;

  for (const line of lines) {
    const dateMatch = line.match(dateRegex);
    let lineClean = line;
    let sDate = '2018';
    let eDate = '2022';
    if (dateMatch) {
      sDate = dateMatch[1].trim();
      eDate = dateMatch[2].trim();
      lineClean = line.replace(dateMatch[0], '').trim();
    } else {
      const yearMatch = line.match(singleYearRegex);
      if (yearMatch) {
        sDate = yearMatch[0];
        eDate = yearMatch[0];
        lineClean = line.replace(yearMatch[0], '').trim();
      }
    }

    if (degreeRegex.test(lineClean)) {
      if (currentEdu && currentEdu.institution) {
        items.push({
          id: `edu-${items.length + 1}`,
          institution: currentEdu.institution,
          degree: currentEdu.degree || 'Degree',
          location: currentEdu.location || '',
          startDate: currentEdu.startDate || sDate,
          endDate: currentEdu.endDate || eDate,
          current: false,
        });
      }

      let degreeStr = lineClean;
      let instStr = 'University / Institute';
      let locStr = '';

      if (lineClean.includes('|') || lineClean.includes('·') || lineClean.includes(',')) {
        const parts = lineClean.split(/[|·,]/).map((p) => p.trim()).filter(Boolean);
        degreeStr = parts[0];
        if (parts.length > 1) instStr = parts[1];
        if (parts.length > 2) locStr = parts[2];
      }

      currentEdu = {
        degree: degreeStr,
        institution: instStr,
        location: locStr,
        startDate: sDate,
        endDate: eDate,
      };
    } else if (currentEdu) {
      if (currentEdu.institution === 'University / Institute') {
        if (lineClean.includes(',')) {
          const parts = lineClean.split(',');
          currentEdu.institution = parts[0].trim();
          currentEdu.location = parts.slice(1).join(', ').trim();
        } else {
          currentEdu.institution = lineClean;
        }
      } else if (!currentEdu.location && lineClean.includes(',')) {
        currentEdu.location = lineClean.trim();
      }
    } else {
      currentEdu = {
        institution: lineClean,
        degree: 'Bachelor of Technology',
        startDate: sDate,
        endDate: eDate,
      };
    }
  }

  if (currentEdu) {
    items.push({
      id: `edu-${items.length + 1}`,
      institution: currentEdu.institution || 'University / Institute',
      degree: currentEdu.degree || 'Degree',
      location: currentEdu.location || '',
      startDate: currentEdu.startDate || '2018',
      endDate: currentEdu.endDate || '2022',
      current: false,
    });
  }

  return items;
}

function extractSkills(lines: string[]): SkillItem[] {
  const items: SkillItem[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const rawTokens = line.split(/[,|•·;]/).map((t) => t.trim()).filter(Boolean);
    for (const token of rawTokens) {
      const clean = token.replace(/^[-*•]\s*/, '').trim();
      if (clean && clean.length < 35 && !seen.has(clean.toLowerCase())) {
        seen.add(clean.toLowerCase());
        items.push({
          id: `sk-${items.length + 1}`,
          name: clean,
          category: 'Core Skills',
          level: 'Advanced',
        });
      }
    }
  }

  return items;
}

function extractProjects(lines: string[]): ProjectItem[] {
  const projects: ProjectItem[] = [];
  let currentProj: Partial<ProjectItem> | null = null;
  let bullets: string[] = [];

  for (const line of lines) {
    const isBullet = /^[-•*·]/.test(line);
    if (!isBullet && line.length < 50 && !line.includes('•')) {
      if (currentProj && currentProj.title) {
        projects.push({
          id: `proj-${projects.length + 1}`,
          title: currentProj.title,
          description: bullets.join('\n'),
        });
        bullets = [];
      }
      currentProj = { title: line };
    } else {
      const clean = line.replace(/^[-•*·]\s*/, '').trim();
      if (clean) bullets.push(`• ${clean}`);
    }
  }

  if (currentProj && currentProj.title) {
    projects.push({
      id: `proj-${projects.length + 1}`,
      title: currentProj.title,
      description: bullets.join('\n'),
    });
  }

  return projects;
}

function extractCertifications(lines: string[]): CertificationItem[] {
  return lines.slice(0, 5).map((line, idx) => ({
    id: `cert-${idx + 1}`,
    name: line,
    issuer: 'Accredited Authority',
    issueDate: '2023',
  }));
}

function extractLanguages(lines: string[]): LanguageItem[] {
  const items: LanguageItem[] = [];
  const known = ['English', 'Spanish', 'German', 'French', 'Arabic', 'Hindi', 'Telugu', 'Mandarin', 'Japanese'];

  for (const line of lines) {
    for (const k of known) {
      if (new RegExp(`\\b${k}\\b`, 'i').test(line)) {
        let level = 'Professional Working';
        let cefr: any = 'B2';
        if (/native|fluent|bilingual|mother/i.test(line)) {
          level = 'Native / Bilingual';
          cefr = 'C2';
        } else if (/advanced|c1/i.test(line)) {
          level = 'Advanced';
          cefr = 'C1';
        } else if (/intermediate|b1/i.test(line)) {
          level = 'Intermediate';
          cefr = 'B1';
        }
        items.push({
          id: `lang-${items.length + 1}`,
          language: k,
          proficiency: level,
          cefrLevel: cefr,
        });
      }
    }
  }

  return items;
}
