import { create } from 'zustand';
import { 
  ResumeRecord, 
  ResumeCategory,
  ResumeContent, 
  CountryPresetId, 
  TemplateId, 
  PersonalDetails, 
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  ProjectItem, 
  CertificationItem, 
  LanguageItem, 
  CustomSection, 
  SectionMeta, 
  ResumeStyleSettings,
  LocalSecuritySettings 
} from '../types/resume';
import { db, getGlobalSettings, saveGlobalSettings } from '../db';
import { SAMPLE_RESUME_CONTENT, DEFAULT_STYLE } from '../lib/constants';
import { recordPageView, recordAction } from '../lib/analyticsTracker';
import { loadAllCustomFontsIntoDOM } from '../lib/customAssetsManager';

let autoSaveTimer: any = null;

interface ResumeState {
  currentResume: ResumeRecord | null;
  activeTab: 'editor' | 'dashboard' | 'admin';
  isSaving: boolean;
  lastSavedAt: number | null;
  zoom: number;
  previewDevice: 'desktop' | 'mobile';
  
  // Modals & Gate
  showPinSetupModal: boolean;
  showUnlockModal: boolean;
  showUploadModal: boolean;
  security: LocalSecuritySettings;
  pendingTemplate?: TemplateId;
  pendingCategory?: ResumeCategory;

  // Actions
  initialize: () => Promise<void>;
  setActiveTab: (tab: 'editor' | 'dashboard' | 'admin') => void;
  setZoom: (zoom: number) => void;
  loadResume: (id: string) => Promise<void>;
  createNewResume: (overrideGate?: boolean, templateId?: TemplateId, category?: ResumeCategory) => Promise<boolean>;
  duplicateResume: (id: string) => Promise<string>;
  deleteResume: (id: string) => Promise<void>;

  // Form Field Updaters
  setResumeTitle: (title: string) => void;
  setResumeCategory: (category: ResumeCategory) => void;
  setCountryPreset: (presetId: CountryPresetId) => void;
  setTemplate: (templateId: TemplateId) => void;
  updatePersonalDetails: (patch: Partial<PersonalDetails>) => void;
  updateSummary: (summary: string) => void;

  // Experience
  addExperienceItem: () => void;
  updateExperienceItem: (id: string, patch: Partial<ExperienceItem>) => void;
  removeExperienceItem: (id: string) => void;
  reorderExperienceItems: (items: ExperienceItem[]) => void;

  // Education
  addEducationItem: () => void;
  updateEducationItem: (id: string, patch: Partial<EducationItem>) => void;
  removeEducationItem: (id: string) => void;
  reorderEducationItems: (items: EducationItem[]) => void;

  // Skills
  addSkill: (name: string, category?: string, level?: SkillItem['level']) => void;
  updateSkill: (id: string, patch: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (items: SkillItem[]) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, patch: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (items: ProjectItem[]) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, patch: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, patch: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Custom Sections
  addCustomSection: (title?: string) => string;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, patch: any) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;
  removeCustomSection: (sectionId: string) => void;

  // Ordering & Styles
  updateSectionOrder: (newOrder: SectionMeta[]) => void;
  updateStyle: (patch: Partial<ResumeStyleSettings>) => void;

  // Persistence
  triggerDebouncedSave: () => void;
  forceSave: () => Promise<void>;
  
  // Gate & Modals
  setShowPinSetupModal: (open: boolean) => void;
  setShowUnlockModal: (open: boolean) => void;
  setShowUploadModal: (open: boolean) => void;
  configureLocalProfile: (workspaceName: string, pinHash?: string) => Promise<void>;
  unlockWorkspace: () => void;
  lockWorkspace: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  currentResume: null,
  activeTab: 'dashboard',
  isSaving: false,
  lastSavedAt: null,
  zoom: 0.85,
  previewDevice: 'desktop',

  showPinSetupModal: false,
  showUnlockModal: false,
  showUploadModal: false,
  pendingTemplate: undefined,
  pendingCategory: undefined,
  security: {
    workspaceName: '',
    pinHash: undefined,
    isLocked: false,
  },

  initialize: async () => {
    const settings = await getGlobalSettings();
    set({ security: settings.security, activeTab: 'dashboard' });

    // Check if security lock applies
    if (settings.security.pinHash && settings.security.isLocked) {
      set({ showUnlockModal: true });
    }

    // Load most recent resume or seed initial
    const count = await db.resumes.count();
    let targetResume: ResumeRecord | undefined;
    if (count === 0) {
      const initial: ResumeRecord = {
        id: 'resume-1',
        title: 'Full Stack Architect Resume',
        template_id: 'modern_clean',
        country_preset: 'us_ca',
        content: SAMPLE_RESUME_CONTENT,
        created_at: Date.now(),
        updated_at: Date.now(),
        is_pinned: true,
      };
      await db.resumes.add(initial);
      targetResume = initial;
    } else {
      targetResume = await db.resumes.orderBy('updated_at').reverse().first();
    }

    if (targetResume) {
      set({ currentResume: targetResume, lastSavedAt: targetResume.updated_at });
    }
    loadAllCustomFontsIntoDOM();
    recordPageView('dashboard');
  },

  setActiveTab: (tab) => {
    recordPageView(tab);
    set({ activeTab: tab });
  },
  setZoom: (zoom) => set({ zoom }),

  loadResume: async (id: string) => {
    const record = await db.resumes.get(id);
    if (record) {
      recordPageView('editor');
      set({ currentResume: record, activeTab: 'editor', lastSavedAt: record.updated_at });
    }
  },

  createNewResume: async (overrideGate = false, templateId?: TemplateId, category?: ResumeCategory) => {
    const resumesCount = await db.resumes.count();
    const { security } = get();

    // Check Local Profile Gate:
    // If user already has 1 or more resumes and has NOT configured a local profile workspace name,
    // intercept and prompt the "Protect & Organize Your Resumes Locally" modal!
    if (!overrideGate && resumesCount >= 1 && !security.workspaceName && !security.pinHash) {
      set({ showPinSetupModal: true, pendingTemplate: templateId, pendingCategory: category });
      return false;
    }

    const chosenTemplate: TemplateId = templateId || 'traditional';
    const chosenCategory: ResumeCategory = category || 'Software & Tech';
    const newId = `resume-${Date.now()}`;

    const defaultAccent = 
      chosenTemplate === 'professional' ? '#064e3b' :
      chosenTemplate === 'momentum_ats' ? '#d97706' :
      chosenTemplate === 'prime_ats' ? '#1d4ed8' :
      chosenTemplate === 'traditional' ? '#334155' :
      chosenTemplate === 'classic_ats' ? '#0f172a' : '#2563eb';

    const defaultFont = 
      (chosenTemplate === 'traditional' || chosenTemplate === 'executive_minimalist')
        ? 'merriweather'
        : chosenTemplate === 'prime_ats'
        ? 'jakarta'
        : 'inter';

    const formatTitle = (id: string) => {
      return id.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const newResume: ResumeRecord = {
      id: newId,
      title: templateId
        ? `${formatTitle(templateId)} Resume (${resumesCount + 1})`
        : `Untitled Resume (${resumesCount + 1})`,
      template_id: chosenTemplate,
      country_preset: 'us_ca',
      category: chosenCategory,
      content: {
        ...SAMPLE_RESUME_CONTENT,
        style: {
          ...DEFAULT_STYLE,
          templateId: chosenTemplate,
          accentColor: defaultAccent,
          fontFamily: defaultFont,
        },
        personal: {
          ...SAMPLE_RESUME_CONTENT.personal,
          fullName: 'Your Name',
          jobTitle: 'Your Target Role',
          email: 'youremail@example.com',
          phone: '+1 (555) 000-0000',
        },
      },
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    await db.resumes.add(newResume);
    set({ 
      currentResume: newResume, 
      activeTab: 'editor', 
      lastSavedAt: newResume.updated_at,
      pendingTemplate: undefined,
      pendingCategory: undefined
    });
    return true;
  },

  duplicateResume: async (id: string) => {
    const original = await db.resumes.get(id);
    if (!original) throw new Error('Resume not found');
    const newId = `resume-${Date.now()}`;
    const duplicate: ResumeRecord = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_pinned: false,
    };
    await db.resumes.add(duplicate);
    return newId;
  },

  deleteResume: async (id: string) => {
    await db.resumes.delete(id);
    const remaining = await db.resumes.orderBy('updated_at').reverse().first();
    if (remaining) {
      set({ currentResume: remaining });
    } else {
      // Create fresh if all deleted
      await get().createNewResume(true);
    }
  },

  // Field updaters
  setResumeTitle: (title) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        title,
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  setResumeCategory: (category) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        category,
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  setCountryPreset: (presetId) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        country_preset: presetId,
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  setTemplate: (templateId) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        template_id: templateId,
        content: {
          ...currentResume.content,
          style: {
            ...currentResume.content.style,
            templateId,
          },
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updatePersonalDetails: (patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          personal: {
            ...currentResume.content.personal,
            ...patch,
          },
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateSummary: (summary) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          summary,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Experience
  addExperienceItem: () => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      role: 'Job Role',
      startDate: new Date().toISOString().slice(0, 7),
      endDate: '',
      current: true,
      description: '• Spearheaded key initiative resulting in measurable growth.\n• Collaborated with cross-functional teams to deliver high quality features.',
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          experience: [newItem, ...currentResume.content.experience],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateExperienceItem: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          experience: currentResume.content.experience.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeExperienceItem: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          experience: currentResume.content.experience.filter((i) => i.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  reorderExperienceItems: (items) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          experience: items,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Education
  addEducationItem: () => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'University / College Name',
      degree: 'Degree / Major',
      startDate: '',
      endDate: '',
      current: false,
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          education: [newItem, ...currentResume.content.education],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateEducationItem: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          education: currentResume.content.education.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeEducationItem: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          education: currentResume.content.education.filter((i) => i.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  reorderEducationItems: (items) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          education: items,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Skills
  addSkill: (name, category = 'General', level = 'Advanced') => {
    const { currentResume } = get();
    if (!currentResume || !name.trim()) return;
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category: category.trim(),
      level,
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          skills: [...currentResume.content.skills, newSkill],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateSkill: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          skills: currentResume.content.skills.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeSkill: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          skills: currentResume.content.skills.filter((s) => s.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  reorderSkills: (items) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          skills: items,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Projects
  addProject: () => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Project Name',
      subtitle: 'Key Technology / Focus Area',
      description: '• Developed high performance application utilizing modern architecture patterns.\n• Integrated continuous deployment with automated testing.',
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          projects: [newProj, ...currentResume.content.projects],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateProject: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          projects: currentResume.content.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeProject: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          projects: currentResume.content.projects.filter((p) => p.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  reorderProjects: (items) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          projects: items,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Certifications
  addCertification: () => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: 'Certification Name',
      issuer: 'Issuing Organization',
      issueDate: new Date().toISOString().slice(0, 7),
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          certifications: [newCert, ...currentResume.content.certifications],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateCertification: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          certifications: currentResume.content.certifications.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeCertification: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          certifications: currentResume.content.certifications.filter((c) => c.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Languages
  addLanguage: () => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: 'Language',
      proficiency: 'Professional Working',
      cefrLevel: 'B2',
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          languages: [...currentResume.content.languages, newLang],
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateLanguage: (id, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          languages: currentResume.content.languages.map((l) =>
            l.id === id ? { ...l, ...patch } : l
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeLanguage: (id) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          languages: currentResume.content.languages.filter((l) => l.id !== id),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Custom Sections
  addCustomSection: (title?: string) => {
    const { currentResume } = get();
    if (!currentResume) return '';
    const id = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id,
      title: title?.trim() || 'Custom Section',
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          description: '',
        },
      ],
    };
    const newOrder: SectionMeta[] = [
      ...currentResume.content.sectionOrder,
      { id, type: 'custom', title: newSection.title, enabled: true },
    ];
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: [...currentResume.content.customSections, newSection],
          sectionOrder: newOrder,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
    return id;
  },

  updateCustomSectionTitle: (sectionId, title) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: currentResume.content.customSections.map((sec) =>
            sec.id === sectionId ? { ...sec, title } : sec
          ),
          sectionOrder: currentResume.content.sectionOrder.map((sec) =>
            sec.id === sectionId ? { ...sec, title } : sec
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  addCustomSectionItem: (sectionId) => {
    const { currentResume } = get();
    if (!currentResume) return;
    const newItem = {
      id: `item-${Date.now()}`,
      title: 'New Entry',
      subtitle: '',
      description: '',
    };
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: currentResume.content.customSections.map((sec) =>
            sec.id === sectionId ? { ...sec, items: [...sec.items, newItem] } : sec
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateCustomSectionItem: (sectionId, itemId, patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: currentResume.content.customSections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  items: sec.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
                }
              : sec
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeCustomSectionItem: (sectionId, itemId) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: currentResume.content.customSections.map((sec) =>
            sec.id === sectionId
              ? {
                  ...sec,
                  items: sec.items.filter((i) => i.id !== itemId),
                }
              : sec
          ),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  removeCustomSection: (sectionId) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          customSections: currentResume.content.customSections.filter((s) => s.id !== sectionId),
          sectionOrder: currentResume.content.sectionOrder.filter((s) => s.id !== sectionId),
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateSectionOrder: (newOrder) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          sectionOrder: newOrder,
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  updateStyle: (patch) => {
    const { currentResume } = get();
    if (!currentResume) return;
    set({
      currentResume: {
        ...currentResume,
        content: {
          ...currentResume.content,
          style: {
            ...currentResume.content.style,
            ...patch,
          },
        },
        updated_at: Date.now(),
      },
    });
    get().triggerDebouncedSave();
  },

  // Zero-data loss 500ms debounce persistence engine
  triggerDebouncedSave: () => {
    set({ isSaving: true });
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    autoSaveTimer = setTimeout(async () => {
      await get().forceSave();
    }, 500);
  },

  forceSave: async () => {
    const { currentResume } = get();
    if (!currentResume) return;
    try {
      const now = Date.now();
      const updated: ResumeRecord = {
        ...currentResume,
        updated_at: now,
      };
      await db.resumes.put(updated);
      set({ isSaving: false, lastSavedAt: now });
    } catch (err) {
      console.error('Failed to auto-save resume to IndexedDB:', err);
      set({ isSaving: false });
    }
  },

  // Modals & Profile Gate
  setShowPinSetupModal: (open) => set({ showPinSetupModal: open }),
  setShowUnlockModal: (open) => set({ showUnlockModal: open }),
  setShowUploadModal: (open) => set({ showUploadModal: open }),

  configureLocalProfile: async (workspaceName: string, pinHash?: string) => {
    const patch: LocalSecuritySettings = {
      workspaceName,
      pinHash,
      isLocked: false,
      unlockedAt: Date.now(),
    };
    await saveGlobalSettings({ security: patch });
    const { pendingTemplate, pendingCategory } = get();
    set({ security: patch, showPinSetupModal: false });
    // After configuring, proceed to create new resume with chosen template & category
    await get().createNewResume(true, pendingTemplate, pendingCategory);
  },

  unlockWorkspace: () => {
    set((state) => ({
      security: { ...state.security, isLocked: false },
      showUnlockModal: false,
    }));
  },

  lockWorkspace: async () => {
    const patch: LocalSecuritySettings = {
      ...get().security,
      isLocked: true,
    };
    await saveGlobalSettings({ security: patch });
    set({ security: patch, showUnlockModal: true });
  },
}));
