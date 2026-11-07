export type CountryPresetId = 'us_ca' | 'uk_eu' | 'dach' | 'gulf';

export interface CountryPresetConfig {
  id: CountryPresetId;
  name: string;
  flag: string;
  paperSize: 'letter' | 'a4';
  paperDimensions: {
    widthMm: number;
    heightMm: number;
    aspectRatio: number; // width / height
  };
  features: {
    photoUpload: boolean;
    birthDate: boolean;
    birthPlace: boolean;
    nationality: boolean;
    maritalStatus: boolean;
    gender: boolean;
    visaStatus: boolean;
    drivingLicense: boolean;
    personalStatement: boolean;
    cefrLanguageGrid: boolean;
  };
  description: string;
}

export type SectionType = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom';

export interface SectionMeta {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
}

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string; // Base64 data URL
  showPhoto?: boolean; // Whether photo is visible on this resume
  photoShape?: 'circle' | 'rounded' | 'square';
  
  // Country specific fields
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  maritalStatus?: string;
  gender?: string;
  visaStatus?: string;
  drivingLicense?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Bullet points separated by newlines
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade?: string; // GPA or honors
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category?: string; // e.g., 'Languages', 'Frameworks', 'Tools'
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  githubUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
  cefrLevel?: CEFRLevel;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type TemplateId = 
  | 'traditional'
  | 'professional'
  | 'momentum_ats'
  | 'classic_ats'
  | 'prime_ats'
  | 'executive_minimalist'
  | 'modern_clean'
  | 'minimal';

export type FontFamily = 'inter' | 'jakarta' | 'merriweather' | 'roboto' | 'outfit' | 'mono';

export type HeaderAlignment = 'left' | 'center' | 'split';
export type HeaderDetailsLayout = 'wrap' | 'columns';
export type HeaderSeparator = 'icon' | 'bullet' | 'bar';
export type HeaderIconStyle = 
  | 'plain' 
  | 'circle_filled' 
  | 'square_filled' 
  | 'dark_square'
  | 'circle_outline' 
  | 'square_outline' 
  | 'minimal_border';

export type SectionHeadingStyle = 
  | 'underline_accent'    // Style 1: Left accent underline
  | 'boxed'               // Style 2: Box outline
  | 'double_line'         // Style 3: Double line top and bottom
  | 'overline_underline'  // Style 4: Overline & underline centered
  | 'left_bar'            // Style 5: Left vertical accent bar
  | 'shaded_banner'       // Style 6: Shaded background banner
  | 'full_underline'      // Style 7: Full-width underline
  | 'wavy_dashed';        // Style 8: Dashed bottom line

export type SectionCapitalization = 'capitalize' | 'uppercase';
export type SectionIconStyle = 'none' | 'outline' | 'filled';

// FlowCV Photo Customization (Image 4)
export type PhotoPosition = 'left' | 'top' | 'right';
export type PhotoSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export type PhotoShapeType = 'circle' | 'square' | 'rounded' | 'portrait' | 'portrait_rounded';

// FlowCV Colors & Accent Targets (Image 3)
export type ColorThemePlacement = 'full_page' | 'header' | 'border';
export type ColorPaletteMode = 'single' | 'multi' | 'image';
export interface AccentColorTargets {
  name: boolean;
  jobTitle: boolean;
  headings: boolean;
  headingsLine: boolean;
  headerIcons: boolean;
  dotsBarsBubbles: boolean;
  dates: boolean;
  entryTitle: boolean;
  entrySubtitle: boolean;
  linkIcons: boolean;
}

// FlowCV Entry Layout (Image 1)
export type EntryStructure = 'full_width' | 'columns';
export type DateLocationPosition = 'right' | 'below_title';
export type SubtitlePlacement = 'same_line' | 'below_title';
export type LocationPlacement = 'same_line' | 'below_date';
export type FontStyleVariant = 'regular' | 'bold' | 'italic';
export type EntryListStyle = 'bullet' | 'hyphen';
export type DateLocationOrder = 'date_location' | 'location_date';

// FlowCV Section Customizations (Images 2 & 5)
export type TitleSubtitleOrder = 'title_subtitle' | 'subtitle_title'; // e.g., Job Title - Employer vs Employer - Job Title
export type SectionItemLayout = 'grid' | 'rows' | 'compact' | 'bubble' | 'level';
export type SectionGridColumns = 1 | 2 | 3 | 4;
export type ItemRowSpacing = 'tight' | 'spacious';
export type SubinfoStyle = 'colon' | 'dash' | 'bracket'; // ": Colon" | "- Dash" | "() Bracket"
export type InlineSeparator = 'bullet' | 'pipe' | 'comma';

export interface ResumeStyleSettings {
  templateId: TemplateId;
  accentColor: string;
  fontFamily: FontFamily;
  fontSize: number; // base in pt (e.g., 9.5 to 11.5)
  lineHeight: number; // ratio (e.g. 1.25 to 1.6)
  marginMm: number; // 10mm to 25mm
  showSectionIcons: boolean;
  headerAlignment: HeaderAlignment;
  compactMode: boolean;

  // FlowCV Header Customization (Image 2)
  headerDetailsLayout?: HeaderDetailsLayout;
  headerSeparator?: HeaderSeparator;
  headerIconStyle?: HeaderIconStyle;

  // FlowCV Section Headings Customization (Image 3)
  sectionHeadingStyle?: SectionHeadingStyle;
  sectionCapitalization?: SectionCapitalization;
  sectionIconStyle?: SectionIconStyle;

  // FlowCV Photo Customization (Image 4)
  photoPosition?: PhotoPosition;
  photoSize?: PhotoSize;
  photoGrayscale?: boolean;
  photoShapeType?: PhotoShapeType;

  // FlowCV Colors & Accent Targets (Image 3)
  colorThemePlacement?: ColorThemePlacement;
  colorPaletteMode?: ColorPaletteMode;
  accentTargets?: AccentColorTargets;

  // FlowCV Entry Layout (Image 1)
  entryStructure?: EntryStructure;
  dateLocationPosition?: DateLocationPosition;
  splitPercent?: number;
  subtitlePlacement?: SubtitlePlacement;
  locationPlacement?: LocationPlacement;
  subtitleFontStyle?: FontStyleVariant;
  dateFontStyle?: FontStyleVariant;
  locationFontStyle?: FontStyleVariant;
  indentBody?: boolean;
  listStyle?: EntryListStyle;
  dateLocationOrder?: DateLocationOrder;

  // FlowCV Section Customizations (Images 2 & 5)
  displaySummaryInHeader?: boolean;
  showSummaryHeading?: boolean;
  workExperienceOrder?: TitleSubtitleOrder;
  groupPromotions?: boolean;
  experienceLayout?: SectionItemLayout;
  experienceColumns?: SectionGridColumns;
  educationOrder?: TitleSubtitleOrder;
  educationLayout?: SectionItemLayout;
  educationColumns?: SectionGridColumns;
  projectsLayout?: SectionItemLayout;
  projectsColumns?: SectionGridColumns;
  skillsLayout?: SectionItemLayout;
  skillsColumns?: SectionGridColumns;
  skillsRowSpacing?: ItemRowSpacing;
  skillsStartWithBullet?: boolean;
  skillsSubinfoStyle?: SubinfoStyle;
  certificatesLayout?: SectionItemLayout;
  certificatesColumns?: SectionGridColumns;
  certificatesRowSpacing?: ItemRowSpacing;
  languagesLayout?: SectionItemLayout;
  languagesColumns?: SectionGridColumns;
  languagesSeparator?: InlineSeparator;
  languagesSubinfoStyle?: SubinfoStyle;
  customSectionsLayout?: SectionItemLayout;
  customSectionsColumns?: SectionGridColumns;
}

export interface ResumeContent {
  personal: PersonalDetails;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  sectionOrder: SectionMeta[];
  style: ResumeStyleSettings;
}

export type ResumeCategory = 
  | 'Software & Tech' 
  | 'Business & Operations' 
  | 'Design & Creative' 
  | 'Executive & Leadership' 
  | 'General';

export interface ResumeRecord {
  id: string;
  title: string;
  category?: ResumeCategory;
  template_id: TemplateId;
  country_preset: CountryPresetId;
  content: ResumeContent;
  created_at: number;
  updated_at: number;
  is_pinned?: boolean;
}

export interface LocalSecuritySettings {
  workspaceName?: string;
  pinHash?: string; // SHA-256 hash
  isLocked?: boolean;
  unlockedAt?: number;
}

export interface AppGlobalSettings {
  id: 'global_settings';
  theme: 'light' | 'dark' | 'system';
  security: LocalSecuritySettings;
  defaultCountryPreset: CountryPresetId;
  defaultTemplateId: TemplateId;
  customFonts?: CustomFontConfig[];
  customTemplates?: CustomTemplateConfig[];
  analyticsConfig?: AnalyticsConfig;
  adminPinHash?: string;
}

export interface CustomFontConfig {
  id: string;
  name: string;
  family: string;
  category: 'Modern Sans' | 'Crisp Tech' | 'Clean Geometric' | 'Classic Editorial' | 'Tech Monospace' | 'Display Serif' | 'Script';
  url?: string;
  isCustom?: boolean;
}

export interface CustomTemplateConfig {
  id: string;
  name: string;
  headline: string;
  description: string;
  category: string;
  categoryTag: 'ATS Standard' | 'Two-Column' | 'Modern Executive' | 'Minimal';
  layoutTag: string;
  atsRating: string;
  accentColor: string;
  fontFamily: string;
  features: string[];
  baseTemplateId?: string;
  created_at: number;
}

export interface AnalyticsSessionRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  page: string;
  referrer: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  action: 'visit' | 'create_resume' | 'export_pdf' | 'preview_template';
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalResumesCreated: number;
  totalExports: number;
  dailyVisits: { date: string; visits: number; uniques: number; exports: number }[];
  devices: { desktop: number; mobile: number; tablet: number };
  browsers: Record<string, number>;
  referrers: Record<string, number>;
  recentSessions: AnalyticsSessionRecord[];
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  customScriptUrl?: string;
  trackLocally: boolean;
  enableLiveSimulation: boolean;
}
