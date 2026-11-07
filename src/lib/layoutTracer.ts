import { extractTextFromPdf } from './parser/pdfParser';
import { extractTextFromDocx } from './parser/docxParser';
import { parseResumeText } from './parser/heuristicParser';
import { CustomTemplateConfig } from '../types/resume';
import { DashboardTemplateCategory } from './templatesConfig';
import { validateResumeFile } from './security';

export interface TracedTemplateResult {
  name: string;
  headline: string;
  categoryTag: DashboardTemplateCategory;
  layoutTag: string;
  accentColor: string;
  fontFamily: string;
  baseTemplateId: string;
  atsRating: string;
  description: string;
  features: string[];
  detectedColumns: 'single' | 'two-column';
  detectedStyle: string;
}

export async function traceResumeFile(file: File): Promise<TracedTemplateResult> {
  // 1. Strict Bank-Grade File Security & Magic Byte Validation
  const validation = await validateResumeFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid or potentially malicious file format.');
  }

  const detectedType = validation.detectedType;
  let rawText = '';

  if (detectedType === 'pdf') {
    rawText = await extractTextFromPdf(file);
  } else if (detectedType === 'docx') {
    rawText = await extractTextFromDocx(file);
  } else {
    rawText = await file.text();
  }

  return traceLayoutFromText(rawText, file.name);
}

export function traceLayoutFromText(rawText: string, fileName: string = 'Resume'): TracedTemplateResult {
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const fullTextLower = rawText.toLowerCase();

  // 1. Detect Column Structure & Base Engine
  // Cues for two-column resumes: presence of sidebar labels on adjacent lines, skills/details formatted as blocks
  const isTwoColumn = 
    fullTextLower.includes('skills\n') && (fullTextLower.includes('details\n') || fullTextLower.includes('languages\n')) ||
    lines.some(l => l.length < 15 && /(skills|languages|details|contact|expertise)/i.test(l) && lines.length > 30);

  // 2. Detect Domain / Industry & Category
  const isTech = /(software|developer|engineer|frontend|backend|fullstack|react|node|cloud|devops|aws|python|java|typescript|architect)/i.test(rawText);
  const isFinanceOrLegal = /(finance|accounting|audit|cpa|equity|analyst|portfolio|attorney|legal|compliance|banking)/i.test(rawText);
  const isExecutiveOrOps = /(director|vp|vice president|chief|executive|head of|operations|supply chain|p&l|stakeholder)/i.test(rawText);
  const isCreative = /(designer|ui\/ux|product design|art director|creative|photographer|copywriter|branding)/i.test(rawText);

  let categoryTag: DashboardTemplateCategory = 'ATS Standard';
  let baseTemplateId = 'modern_clean';
  let layoutTag = 'Linear ATS';
  let accentColor = '#2563eb'; // Royal Indigo
  let fontFamily = 'inter';
  let detectedStyle = 'Modern Clean FlowCV Engine';

  if (isTwoColumn) {
    categoryTag = 'Two-Column';
    baseTemplateId = 'professional';
    layoutTag = 'Split Sidebar';
    accentColor = isTech ? '#064e3b' : isFinanceOrLegal ? '#1e3a8a' : '#0f172a';
    fontFamily = 'inter';
    detectedStyle = 'Dual Column Split Architecture';
  } else if (isFinanceOrLegal) {
    categoryTag = 'ATS Standard';
    baseTemplateId = 'traditional';
    layoutTag = 'Editorial Serif';
    accentColor = '#334155'; // Dark Slate
    fontFamily = 'merriweather';
    detectedStyle = 'Editorial Serif Classic Layout';
  } else if (isExecutiveOrOps) {
    categoryTag = 'Modern Executive';
    baseTemplateId = 'momentum_ats';
    layoutTag = 'Skills Matrix & Gold Rule';
    accentColor = '#d97706'; // Warm Amber
    fontFamily = 'jakarta';
    detectedStyle = 'Executive Operations Matrix';
  } else if (isCreative) {
    categoryTag = 'Minimal';
    baseTemplateId = 'executive';
    layoutTag = 'Minimalist High-Contrast';
    accentColor = '#0f172a'; // Deep Monolith
    fontFamily = 'outfit';
    detectedStyle = 'Clean Geometric Minimalist';
  } else {
    // Standard Tech / ATS
    categoryTag = 'ATS Standard';
    baseTemplateId = 'classic_ats';
    layoutTag = 'Clean Single-Column';
    accentColor = '#1e40af';
    fontFamily = isTech ? 'jakarta' : 'inter';
    detectedStyle = 'Universal Single-Column ATS Format';
  }

  // 3. Detect ATS Parsing Score
  const hasStandardHeadings = /(experience|employment|work history)/i.test(rawText) && /(education|academic)/i.test(rawText);
  const atsRating = hasStandardHeadings ? (isTwoColumn ? '96% ATS' : '99% ATS') : '95% ATS';

  // 4. Generate Meaningful Name and Headline
  const roleMatch = rawText.match(/(full[\s-]?stack\s*(?:developer|engineer)|frontend\s*(?:developer|engineer)|software\s*(?:engineer|developer)|cloud\s*architect|operations\s*(?:director|manager)|financial\s*analyst|product\s*manager)/i);
  const detectedRole = roleMatch ? roleMatch[0] : (isTech ? 'Technical' : isExecutiveOrOps ? 'Executive' : 'Professional');

  const titleCaseRole = detectedRole.replace(/\b\w/g, (c) => c.toUpperCase());
  const templateName = `${titleCaseRole} ${layoutTag.split(' ')[0]}`;

  return {
    name: templateName,
    headline: `Traced from ${cleanName} • Engineered for high interview yield`,
    categoryTag,
    layoutTag,
    accentColor,
    fontFamily,
    baseTemplateId,
    atsRating,
    description: `Auto-traced ${categoryTag.toLowerCase()} resume format featuring ${layoutTag.toLowerCase()} architecture, optimized typography hierarchy, and strict keyword indexability.`,
    features: [
      `${layoutTag} Structure`,
      `${atsRating} Recruiter Score`,
      `${fontFamily === 'merriweather' ? 'Editorial Serif' : 'Sans-Serif High Contrast'} Stack`,
      `Accent Rule (${accentColor})`,
    ],
    detectedColumns: isTwoColumn ? 'two-column' : 'single',
    detectedStyle,
  };
}
