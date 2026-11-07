import { TemplateId } from '../types/resume';

export type DashboardTemplateCategory = 'ATS Standard' | 'Two-Column' | 'Modern Executive' | 'Minimal';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  headline: string;
  stats: string;
  badge: string;
  category: string;
  categoryTag: DashboardTemplateCategory;
  layoutTag: string;
  atsRating: string;
  description: string;
  features: string[];
  accentColor: string;
  fontFamily: 'merriweather' | 'inter' | 'jakarta' | 'outfit' | 'roboto';
}

export const PREBUILT_TEMPLATES: TemplateConfig[] = [
  {
    id: 'traditional',
    name: 'Traditional',
    headline: 'The Time-Tested Standard',
    stats: '3,100,000+ users chose this template',
    badge: 'Most Popular',
    category: 'Corporate, Law, Finance & Healthcare',
    categoryTag: 'ATS Standard',
    layoutTag: 'Editorial Serif',
    atsRating: '99% ATS',
    description: 'Sophisticated editorial serif typography with shaded section banners, 3-column contact strip, and diamond bullet points.',
    features: [
      'Editorial Serif Typography',
      'Shaded Section Banners',
      'Diamond Bullet Points (◆)',
      '3-Part Balanced Contact Header',
    ],
    accentColor: '#334155',
    fontFamily: 'merriweather',
  },
  {
    id: 'professional',
    name: 'Professional',
    headline: 'The Two-Column Powerhouse',
    stats: '2,800,000+ users chose this template',
    badge: 'Two-Column Sidebar',
    category: 'Management, Business, Creative & Tech',
    categoryTag: 'Two-Column',
    layoutTag: 'Split Sidebar',
    atsRating: '94% ATS',
    description: 'Iconic two-column format with dark accent sidebar, circular photo badge, visual skill progress bars, and high-contrast right column.',
    features: [
      'Dark Forest / Slate Left Column',
      'Prominent Circular Headshot',
      'Horizontal Skill Progress Bars',
      'Chronological Timeline Layout',
    ],
    accentColor: '#064e3b',
    fontFamily: 'inter',
  },
  {
    id: 'momentum_ats',
    name: 'Momentum ATS',
    headline: 'Maximum Interview Conversion',
    stats: '1,950,000+ users chose this template',
    badge: 'ATS-Optimized',
    category: 'Software, Tech, Product & Operations',
    categoryTag: 'ATS Standard',
    layoutTag: 'Skills Matrix',
    atsRating: '99% ATS',
    description: 'Engineered for 99% ATS parsing accuracy with a signature gold accent line and a 4-column Areas of Expertise skill matrix.',
    features: [
      'Gold Accent Underline Header',
      '4-Column Skills & Tools Grid',
      'Single-Column Linear Hierarchy',
      'Strict Recruiter Parsing Format',
    ],
    accentColor: '#d97706',
    fontFamily: 'inter',
  },
  {
    id: 'classic_ats',
    name: 'Classic ATS',
    headline: 'Clean Single-Column Precision',
    stats: '2,200,000+ users chose this template',
    badge: 'Recruiter Favorite',
    category: 'All Industries, Entry to Senior Level',
    categoryTag: 'ATS Standard',
    layoutTag: 'Linear Single-Column',
    atsRating: '100% ATS',
    description: 'Minimalist single-column ATS layout with hairline dividers, centered header, and right-aligned dates for instant readability.',
    features: [
      'Crisp Hairline Horizontal Rules',
      'Centered Contact Bar',
      'Zero Clutter ATS Architecture',
      'Standardized Bullet Hierarchies',
    ],
    accentColor: '#0f172a',
    fontFamily: 'inter',
  },
  {
    id: 'prime_ats',
    name: 'Prime ATS',
    headline: 'Modern Tech & Corporate',
    stats: '1,420,000+ users chose this template',
    badge: 'Corporate Tech',
    category: 'Engineering, Cloud, Data & Analytics',
    categoryTag: 'Modern Executive',
    layoutTag: 'Tech Corporate',
    atsRating: '97% ATS',
    description: 'Royal blue accent branding with top-right headshot photo badge, full-width section underline dividers, and tabular skill tags.',
    features: [
      'Royal Blue Accent Header',
      'Top-Right Headshot Badge',
      'Full-Width Underline Dividers',
      'Tabular Technical Skills Layout',
    ],
    accentColor: '#1d4ed8',
    fontFamily: 'jakarta',
  },
  {
    id: 'modern_clean',
    name: 'Modern Clean',
    headline: 'FlowCV-Inspired Contemporary',
    stats: '1,150,000+ users chose this template',
    badge: 'FlowCV Style',
    category: 'Frontend, Design, Marketing & Startups',
    categoryTag: 'Minimal',
    layoutTag: 'Contemporary Sans',
    atsRating: '98% ATS',
    description: 'FlowCV-inspired aesthetic with clean sans-serif typography, subtle accent pills, and balanced whitespace.',
    features: [
      'Modern Sans-Serif Clean Lines',
      'Subtle Tag Badges & Dividers',
      'Dual-Tone Header Treatment',
      'Balanced Spacing & Readability',
    ],
    accentColor: '#2563eb',
    fontFamily: 'outfit',
  },
  {
    id: 'executive_minimalist',
    name: 'Executive',
    headline: 'Editorial C-Suite Leadership',
    stats: '890,000+ users chose this template',
    badge: 'Leadership',
    category: 'VP, Directors, Partners & Consultants',
    categoryTag: 'Modern Executive',
    layoutTag: 'Executive Serif',
    atsRating: '97% ATS',
    description: 'Editorial serif layout with generous whitespace, centered prestige header, and refined typography for executive profiles.',
    features: [
      'Refined Editorial Serif Fonts',
      'Generous Margins & Spacing',
      'Centered Prestige Name Banner',
      'Subtle Hairline Accent Accents',
    ],
    accentColor: '#1e293b',
    fontFamily: 'merriweather',
  },
  {
    id: 'minimal',
    name: 'Minimalist ATS',
    headline: 'High-Density Monochrome Focus',
    stats: '1,340,000+ users chose this template',
    badge: 'Pure Minimal',
    category: 'Software, Research, Academia & Design',
    categoryTag: 'Minimal',
    layoutTag: 'Pure Monochrome',
    atsRating: '100% ATS',
    description: 'Ultra-clean typography with razor-sharp margins, left-aligned metadata, and maximum ATS readability score.',
    features: [
      'Pure Monochrome Hierarchy',
      'High Information Density',
      '100% Machine-Readable Syntax',
      'Zero Graphic Friction',
    ],
    accentColor: '#18181b',
    fontFamily: 'inter',
  },
];
