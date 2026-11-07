import { CustomFontConfig, CustomTemplateConfig } from '../types/resume';
import { FONT_OPTIONS } from './constants';
import { PREBUILT_TEMPLATES, TemplateConfig } from './templatesConfig';

const CUSTOM_FONTS_KEY = 'novafolio_custom_fonts';
const CUSTOM_TEMPLATES_KEY = 'novafolio_custom_templates';

// Pre-seeded popular web fonts
const INITIAL_CUSTOM_FONTS: CustomFontConfig[] = [
  {
    id: 'fnt-poppins',
    name: 'Poppins',
    family: 'Poppins',
    category: 'Clean Geometric',
    url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    isCustom: true,
  },
  {
    id: 'fnt-playfair',
    name: 'Playfair Display',
    family: 'Playfair Display',
    category: 'Display Serif',
    url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap',
    isCustom: true,
  },
  {
    id: 'fnt-fira-code',
    name: 'Fira Code',
    family: 'Fira Code',
    category: 'Tech Monospace',
    url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap',
    isCustom: true,
  },
];

export function getCustomFonts(): CustomFontConfig[] {
  try {
    const raw = localStorage.getItem(CUSTOM_FONTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  // Initialize defaults
  saveCustomFonts(INITIAL_CUSTOM_FONTS);
  return INITIAL_CUSTOM_FONTS;
}

export function saveCustomFonts(fonts: CustomFontConfig[]) {
  try {
    localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(fonts));
  } catch (e) {
    console.error(e);
  }
}

export function loadAllCustomFontsIntoDOM(): void {
  if (typeof window === 'undefined') return;
  const fonts = getCustomFonts();
  fonts.forEach((font) => {
    const id = `font-link-${font.id}`;
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = font.url || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  });
}

export function addCustomFont(font: Omit<CustomFontConfig, 'id'>): CustomFontConfig {
  const fonts = getCustomFonts();
  const newFont: CustomFontConfig = {
    ...font,
    id: `fnt-${Date.now()}`,
    isCustom: true,
    url: font.url || `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family)}:wght@300;400;500;600;700&display=swap`,
  };

  fonts.push(newFont);
  saveCustomFonts(fonts);
  loadAllCustomFontsIntoDOM();
  return newFont;
}

export function removeCustomFont(id: string): void {
  const fonts = getCustomFonts().filter((f) => f.id !== id);
  saveCustomFonts(fonts);
  const el = document.getElementById(`font-link-${id}`);
  if (el) el.remove();
}

/**
 * Returns merged font options for the Resume Editor font picker
 */
export function getAllAvailableFonts(): { id: string; name: string; category: string; family: string; isCustom?: boolean }[] {
  const customFonts = getCustomFonts();
  const baseFonts = FONT_OPTIONS.map((f) => ({
    id: f.id,
    name: f.name,
    category: f.category,
    family: f.id === 'merriweather' ? 'Merriweather' : f.id === 'mono' ? 'JetBrains Mono' : f.name,
    isCustom: false,
  }));

  const customs = customFonts.map((cf) => ({
    id: cf.family.toLowerCase().replace(/\s+/g, '_'),
    name: cf.name,
    category: cf.category,
    family: cf.family,
    isCustom: true,
  }));

  return [...baseFonts, ...customs];
}

// -------------------------------------------------------------
// CUSTOM TEMPLATES
// -------------------------------------------------------------

export function getCustomTemplates(): CustomTemplateConfig[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveCustomTemplates(tpls: CustomTemplateConfig[]) {
  try {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(tpls));
  } catch (e) {
    console.error(e);
  }
}

export function addCustomTemplate(tpl: Omit<CustomTemplateConfig, 'id' | 'created_at'>): CustomTemplateConfig {
  const templates = getCustomTemplates();
  const newTpl: CustomTemplateConfig = {
    ...tpl,
    id: `tpl-${Date.now()}`,
    created_at: Date.now(),
  };
  templates.push(newTpl);
  saveCustomTemplates(templates);
  return newTpl;
}

export function removeCustomTemplate(id: string): void {
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  saveCustomTemplates(templates);
}

/**
 * Returns merged templates (prebuilt + custom) for Dashboard and Gallery
 */
export function getAllTemplates(): TemplateConfig[] {
  const customTemplates = getCustomTemplates();
  const mappedCustoms: TemplateConfig[] = customTemplates.map((ct) => ({
    id: (ct.baseTemplateId || 'modern_clean') as any,
    name: ct.name,
    headline: ct.headline,
    stats: 'Custom Admin Template',
    badge: 'Custom',
    category: ct.category,
    categoryTag: ct.categoryTag,
    layoutTag: ct.layoutTag,
    atsRating: ct.atsRating,
    description: ct.description,
    features: ct.features,
    accentColor: ct.accentColor,
    fontFamily: (ct.fontFamily as any) || 'inter',
  }));

  return [...PREBUILT_TEMPLATES, ...mappedCustoms];
}
