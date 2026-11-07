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

  type SectionKey = keyof Omit<ExtractedSections, 'rawHeader'> | null;
  let currentSection: SectionKey = null;

  const headerRegexes: { key: SectionKey; regex: RegExp }[] = [
    { key: 'summaryLines', regex: /^(summary|professional summary|profile|about me|objective|executive summary)/i },
    { key: 'experienceLines', regex: /^(experience|work experience|employment history|professional experience|work history)/i },
    { key: 'educationLines', regex: /^(education|academic background|qualifications|academic history)/i },
    { key: 'skillsLines', regex: /^(skills|technical skills|competencies|core competencies|technologies|tools|skills & proficiencies)/i },
    { key: 'projectsLines', regex: /^(projects|personal projects|key projects|academic projects)/i },
    { key: 'certificationsLines', regex: /^(certifications|certificates|licenses|accreditations)/i },
    { key: 'languagesLines', regex: /^(languages|language skills|language proficiency)/i },
    { key: 'otherLines', regex: /^(personal details|personal information|personal data|declaration|additional details|additional information|hobbies|interests|interests & hobbies)/i },
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

  // Date of Birth
  const dobMatch = fullText.match(/(?:date\s*of\s*birth|dob|birth\s*date)\s*[:—\-–]?\s*([0-9]{1,2}(?:st|nd|rd|th)?[\s\/\-\.][A-Za-z]+[\s\/\-\.][0-9]{4}|[0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4}|[A-Za-z]+[\s\/\-\.][0-9]{1,2}(?:st|nd|rd|th)?[\s\/\-\.,]+[0-9]{4}|[0-9]{4}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{1,2}|\d{1,2}\s+[A-Za-z]+\s+\d{4})/i);
  let birthDate = '';
  if (dobMatch) {
    birthDate = dobMatch[1].trim();
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
    birthDate: birthDate || undefined,
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

  const degreeKeywordsRegex = /\b(bachelor|b\.?tech|b\.?e\.?|b\.?sc|b\.?com|b\.?a\.?|bba|bca|b\.?des|b\.?pharm|mbbs|master|m\.?tech|m\.?e\.?|m\.?sc|m\.?com|m\.?a\.?|mba|mca|m\.?des|m\.?pharm|md|ph\.?d|doctorate|associate|diploma|degree|intermediate|secondary|senior secondary|higher secondary|high school|school certificate|matriculation|ssc|hsc|puc|cbse|icse|10th|12th|class x|class xii|post graduate|undergraduate|graduate)\b/i;

  const institutionKeywordsRegex = /\b(university|college|institute|school|academy|polytechnic|campus|vidyalaya|vidyapeeth|trust|faculty|department)\b/i;

  const dateRangeRegex = /(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4})\s*(?:–|—|-|to)\s*(\b(?:jan[a-z]*\.?|feb[a-z]*\.?|mar[a-z]*\.?|apr[a-z]*\.?|may|jun[a-z]*\.?|jul[a-z]*\.?|aug[a-z]*\.?|sep[a-z]*\.?|oct[a-z]*\.?|nov[a-z]*\.?|dec[a-z]*\.?|\d{1,2}\/)?\s*\d{4}|present|current)/i;
  const singleYearRegex = /\b(19\d{2}|20\d{2})\b/;
  const gradeRegex = /\b(?:gpa|cgpa|percentage|score|marks|grade)?\s*[:=]?\s*(\d+(?:\.\d+)?\s*(?:\/\s*\d+|%)|\b(?:first class|distinction|magna cum laude|summa cum laude)\b)/i;

  let currentItem: Partial<EducationItem> | null = null;

  const finalizeCurrentItem = () => {
    if (currentItem && (currentItem.degree || currentItem.institution)) {
      items.push({
        id: `edu-${items.length + 1}-${Date.now()}`,
        degree: currentItem.degree || 'Degree / Qualification',
        institution: currentItem.institution || 'University / Institute',
        location: currentItem.location || '',
        startDate: currentItem.startDate || '2018',
        endDate: currentItem.endDate || '2022',
        current: Boolean(currentItem.current),
        grade: currentItem.grade || undefined,
        description: currentItem.description || undefined,
      });
      currentItem = null;
    }
  };

  const isPersonalOrNoiseRegex = /\b(date of birth|dob|birth\s*date|father'?s?\s*name|mother'?s?\s*name|marital\s*status|nationality|gender|blood\s*group|religion|languages?\s*known|permanent\s*address|declaration|hobbies|interests?|passport)\b/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Filter out personal attributes, declarations, and profile noise from education
    if (isPersonalOrNoiseRegex.test(line)) {
      continue;
    }

    // Check for date in the line
    const dateMatch = line.match(dateRangeRegex);
    let sDate = '';
    let eDate = '';
    let isCurrent = false;
    let textWithoutDate = line;

    if (dateMatch) {
      sDate = dateMatch[1].trim();
      eDate = dateMatch[2].trim();
      isCurrent = /present|current/i.test(eDate);
      textWithoutDate = line.replace(dateMatch[0], '').trim();
    } else {
      const yearMatch = line.match(singleYearRegex);
      if (yearMatch) {
        sDate = yearMatch[0];
        eDate = yearMatch[0];
        textWithoutDate = line.replace(yearMatch[0], '').trim();
      }
    }

    // Check for grade / GPA in the line
    let grade = '';
    const gradeMatch = textWithoutDate.match(gradeRegex);
    if (gradeMatch) {
      grade = gradeMatch[1].trim();
      textWithoutDate = textWithoutDate.replace(gradeMatch[0], '').trim();
    }

    // Clean leading/trailing punctuation left after removing date
    const cleanText = textWithoutDate.replace(/^[|·,–—\-]\s*|\s*[|·,–—\-]$/g, '').trim();

    // Determine if this line represents a NEW education entry
    const hasDegree = degreeKeywordsRegex.test(cleanText);
    const hasInst = institutionKeywordsRegex.test(cleanText);
    const hasDate = Boolean(sDate);

    // An item MUST have a degree keyword OR an institution keyword to be a valid education item
    if (!hasDegree && !hasInst) {
      if (currentItem && (sDate || grade) && !cleanText) {
        if (sDate) { currentItem.startDate = sDate; currentItem.endDate = eDate; }
        if (grade) currentItem.grade = grade;
      }
      continue;
    }

    const isNewItem = (hasDegree && currentItem && Boolean(currentItem.degree || currentItem.institution)) ||
                      (hasInst && currentItem && Boolean(currentItem.institution && currentItem.degree)) ||
                      (hasDate && cleanText && currentItem && Boolean(currentItem.degree && currentItem.institution));

    if (isNewItem) {
      finalizeCurrentItem();
    }

    // Parse cleanText into degree, institution, location
    let degreeStr = '';
    let instStr = '';
    let locStr = '';

    if (cleanText.includes(',') || cleanText.includes('|') || cleanText.includes('·') || cleanText.includes(' - ') || cleanText.includes(' – ')) {
      const parts = cleanText.split(/[,|·]|\s+[-–—]\s+/).map((p) => p.trim()).filter(Boolean);
      
      if (parts.length >= 2) {
        const part0HasDegree = degreeKeywordsRegex.test(parts[0]);
        const part1HasInst = institutionKeywordsRegex.test(parts[1]);
        const part0HasInst = institutionKeywordsRegex.test(parts[0]);
        const part1HasDegree = degreeKeywordsRegex.test(parts[1]);

        if (part0HasInst && !part0HasDegree) {
          instStr = parts[0];
          degreeStr = parts[1];
          locStr = parts.slice(2).join(', ');
        } else if (part0HasDegree || part1HasInst) {
          degreeStr = parts[0];
          instStr = parts[1];
          locStr = parts.slice(2).join(', ');
        } else {
          degreeStr = parts[0];
          instStr = parts[1];
          locStr = parts.slice(2).join(', ');
        }
      } else if (parts.length === 1) {
        if (hasDegree) degreeStr = parts[0];
        else if (hasInst) instStr = parts[0];
        else degreeStr = parts[0];
      }
    } else if (cleanText) {
      if (hasDegree && !hasInst) {
        degreeStr = cleanText;
      } else if (hasInst && !hasDegree) {
        instStr = cleanText;
      } else {
        degreeStr = cleanText;
      }
    }

    if (!currentItem) {
      currentItem = {
        degree: degreeStr || (cleanText && !hasInst ? cleanText : 'Degree'),
        institution: instStr || '',
        location: locStr,
        startDate: sDate || '',
        endDate: eDate || '',
        current: isCurrent,
        grade: grade || undefined,
      };
    } else {
      // Merge with current item if appropriate
      if (degreeStr && (!currentItem.degree || currentItem.degree === 'Degree')) {
        currentItem.degree = degreeStr;
      }
      if (instStr && (!currentItem.institution || currentItem.institution === 'University / Institute')) {
        currentItem.institution = instStr;
      }
      if (locStr && !currentItem.location) {
        currentItem.location = locStr;
      }
      if (sDate) {
        currentItem.startDate = sDate;
        currentItem.endDate = eDate;
        currentItem.current = isCurrent;
      }
      if (grade && !currentItem.grade) {
        currentItem.grade = grade;
      }
    }
  }

  finalizeCurrentItem();

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
