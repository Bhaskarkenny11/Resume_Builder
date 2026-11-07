import React, { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, exportDatabaseBackup, importDatabaseBackup } from '../../db';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeRecord, ResumeCategory, TemplateId } from '../../types/resume';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { triggerPdfDownload } from '../templates/PdfDocument';
import { AppleGradientBackground } from '../common/AppleGradientBackground';
import { TemplateConfig, DashboardTemplateCategory } from '../../lib/templatesConfig';
import { getAllTemplates } from '../../lib/customAssetsManager';
import { AdminAuthModal } from '../admin/AdminAuthModal';
import { TemplateMiniPreview } from './TemplateMiniPreview';
import { TemplateGalleryModal } from './TemplateGalleryModal';
import { 
  Plus, 
  FileText, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  Database, 
  Search, 
  Lock, 
  Sparkles, 
  Clock, 
  ExternalLink,
  Eye,
  ShieldCheck,
  ShieldAlert,
  LayoutGrid
} from 'lucide-react';

const CATEGORY_TABS: { id: 'All Templates' | DashboardTemplateCategory; label: string }[] = [
  { id: 'All Templates', label: 'All Templates' },
  { id: 'ATS Standard', label: 'ATS Standard' },
  { id: 'Two-Column', label: 'Two-Column' },
  { id: 'Modern Executive', label: 'Modern Executive' },
  { id: 'Minimal', label: 'Minimal' },
];

export const DashboardView: React.FC = () => {
  const { 
    loadResume, 
    createNewResume, 
    duplicateResume, 
    deleteResume, 
    security, 
    lockWorkspace, 
    setShowUploadModal,
    setActiveTab 
  } = useResumeStore();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'All Templates' | DashboardTemplateCategory>('All Templates');
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(() => {
    try {
      return localStorage.getItem('novafolio_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Stealth Trigger 1: Triple-click on Novafolio Logo
  const logoClickCountRef = useRef(0);
  const logoTimerRef = useRef<any>(null);
  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      clearTimeout(logoTimerRef.current);
      setShowAdminAuthModal(true);
    } else {
      clearTimeout(logoTimerRef.current);
      logoTimerRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 1000);
    }
  };

  // Stealth Trigger 2: Global Shortcut (Ctrl + Shift + A) & URL Trigger (?admin=true or #admin)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setShowAdminAuthModal(true);
      }
    };

    const checkAdminUrl = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setShowAdminAuthModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    checkAdminUrl();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Dashboard view mode: Explore Templates (default) vs Saved Resumes
  const [dashboardView, setDashboardView] = useState<'templates' | 'my_resumes'>('templates');
  const [savedResumeSearch, setSavedResumeSearch] = useState('');
  const [savedResumeCategory, setSavedResumeCategory] = useState<string>('All');
  
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Live reactive query from Dexie IndexedDB
  const resumes = useLiveQuery(
    () => db.resumes.orderBy('updated_at').reverse().toArray(),
    []
  );

  const allResumes: ResumeRecord[] = (resumes || []).map((r) => ({
    ...r,
    category: r.category || 'Software & Tech',
  }));

  // Filter templates (combining built-in and custom templates from admin studio)
  const allTemplates = getAllTemplates();
  const filteredTemplates = allTemplates.filter((tpl) => {
    const matchesCategory = activeCategoryTab === 'All Templates' || tpl.categoryTag === activeCategoryTab;
    const matchesSearch = !templateSearchQuery.trim() || (
      tpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase().trim()) ||
      tpl.category.toLowerCase().includes(templateSearchQuery.toLowerCase().trim()) ||
      tpl.description.toLowerCase().includes(templateSearchQuery.toLowerCase().trim()) ||
      tpl.layoutTag.toLowerCase().includes(templateSearchQuery.toLowerCase().trim())
    );
    return matchesCategory && matchesSearch;
  });

  // Filter saved resumes
  const filteredSavedResumes = allResumes.filter((r) => {
    const matchesSearch = !savedResumeSearch.trim() || (
      r.title.toLowerCase().includes(savedResumeSearch.toLowerCase().trim()) ||
      r.content.personal.fullName?.toLowerCase().includes(savedResumeSearch.toLowerCase().trim()) ||
      r.content.personal.jobTitle?.toLowerCase().includes(savedResumeSearch.toLowerCase().trim())
    );
    const matchesCategory = savedResumeCategory === 'All' || r.category === savedResumeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = async (templateId?: TemplateId) => {
    await createNewResume(false, templateId);
  };

  const handlePreviewTemplate = (templateId: TemplateId) => {
    setPreviewTemplateId(templateId);
    setShowPreviewModal(true);
  };

  const handleDownloadPdf = async (resume: ResumeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingId(resume.id);
      await triggerPdfDownload(resume);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await duplicateResume(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteResume(id);
    }
  };

  const handleExportBackup = async () => {
    try {
      const json = await exportDatabaseBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ResumeBuilder_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to export backup');
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result as string;
      const res = await importDatabaseBackup(text);
      if (res.success) {
        alert(`Successfully imported ${res.count} resumes into local database!`);
        window.location.reload();
      } else {
        alert(`Backup import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
    if (backupInputRef.current) {
      backupInputRef.current.value = '';
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-zinc-800 selection:text-white">
      {/* Subtle Linear / Raycast Style Ambient Radial Canvas Sheen */}
      <AppleGradientBackground />

      {/* 1. NAVBAR (Linear / Vercel Design System) */}
      <header className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Logo Icon + "Novafolio" Semi-Bold (Triple-click logo opens Admin) */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Novafolio (Client-Side Privacy)"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center shadow-xs group-hover:border-zinc-700 transition-colors">
              <FileText className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-sm sm:text-base text-zinc-100 tracking-tight">
                Novafolio
              </span>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Local • Client-Side</span>
              </span>
            </div>
          </div>

          {/* Right: Clean Minimal Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {security.pinHash && (
              <button
                onClick={lockWorkspace}
                className="b2b-btn-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                title="Lock Workspace Now"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}

            <button
              onClick={() => setShowUploadModal(true)}
              className="b2b-btn-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              title="Scan and import PDF or DOCX resume"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Scan</span>
            </button>

            <input
              ref={backupInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <button
              onClick={() => backupInputRef.current?.click()}
              className="b2b-btn-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              title="Import JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="b2b-btn-secondary px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              title="Export complete IndexedDB backup as JSON"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            {/* Admin Console Pill - ONLY Visible in Verified Admin Session */}
            {isAdminSession && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-indigo-300 border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/60 hover:border-indigo-400 transition-all shadow-xs"
                title="Open Admin Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            {/* Primary CTA: High-Contrast + New Resume Button */}
            <button
              onClick={() => handleCreateNew()}
              className="b2b-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 relative z-10">
        {/* 2. PAGE HEADER / HERO (Organic, Zero Heavy Container Boxes) */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
                  {dashboardView === 'templates' ? 'Resume Templates' : 'My Local Resumes'}
                </h1>
                <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                  {dashboardView === 'templates' 
                    ? `${allTemplates.length} layouts available`
                    : `${allResumes.length} saved`}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
                {dashboardView === 'templates'
                  ? 'ATS-compliant vector templates engineered for high readability and instant export.'
                  : 'Manage and customize your client-side resumes stored privately in browser IndexedDB.'}
              </p>
            </div>

            {/* Dual Switcher: Templates vs My Resumes */}
            {allResumes.length > 0 && (
              <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl self-start md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setDashboardView('templates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    dashboardView === 'templates'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Templates</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardView('my_resumes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    dashboardView === 'my_resumes'
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Resumes</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-700 text-zinc-300">
                    {allResumes.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Segmented Pill Bar: Category Tabs */}
          {dashboardView === 'templates' ? (
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1 p-1 bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-x-auto no-scrollbar">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  const count = tab.id === 'All Templates' 
                    ? allTemplates.length 
                    : allTemplates.filter((t: TemplateConfig) => t.categoryTag === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Minimal Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  placeholder="Filter templates..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900/60 border border-zinc-800 text-zinc-200 rounded-lg focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500 transition-all"
                />
              </div>
            </div>
          ) : (
            /* Saved Resumes Filter Bar */
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1 p-1 bg-zinc-900/80 border border-zinc-800/80 rounded-xl overflow-x-auto no-scrollbar">
                {['All', 'Software & Tech', 'Business & Operations', 'Design & Creative', 'Executive & Leadership'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSavedResumeCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      savedResumeCategory === cat
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={savedResumeSearch}
                  onChange={(e) => setSavedResumeSearch(e.target.value)}
                  placeholder="Search saved resumes..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900/60 border border-zinc-800 text-zinc-200 rounded-lg focus:outline-none focus:border-zinc-600 placeholder:text-zinc-500 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. TEMPLATE GRID (4-Column Responsive Grid) */}
        {dashboardView === 'templates' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template: TemplateConfig) => (
              <div
                key={template.id}
                className="group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300"
              >
                {/* Framed Mockup Container with Standard A4 Aspect Ratio */}
                <div className="relative w-full aspect-[210/297] bg-zinc-950/80 overflow-hidden p-3 flex items-center justify-center">
                  {/* Resume Sheet Mockup with Subtle Hover Zoom Effect */}
                  <div className="w-full h-full rounded-md overflow-hidden bg-white shadow-md border border-zinc-300/40 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                    <TemplateMiniPreview templateId={template.id} />
                  </div>

                  {/* Slick Glassmorphism Backdrop Overlay on Hover */}
                  <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-5 z-20">
                    <button
                      type="button"
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Preview</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleCreateNew(template.id)}
                      className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Use Template</span>
                    </button>
                  </div>
                </div>

                {/* Footer Strip Below the Preview */}
                <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-zinc-100 text-sm truncate">
                      {template.name}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                      {template.layoutTag}
                    </p>
                  </div>

                  {/* ATS Rating Indicator */}
                  <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-full shrink-0">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{template.atsRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* SAVED RESUMES GRID (Linear Dark B2B Theme) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <div
              onClick={() => handleCreateNew()}
              className="group min-h-[220px] rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 flex items-center justify-center transition-all mb-3 group-hover:bg-zinc-700">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                Create New Resume
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Select an ATS template or import from an existing PDF or DOCX file.
              </p>
            </div>

            {/* Saved Resumes List */}
            {filteredSavedResumes.map((resume) => {
              const preset = COUNTRY_PRESETS[resume.country_preset] || COUNTRY_PRESETS.us_ca;
              const isDownloading = downloadingId === resume.id;

              return (
                <div
                  key={resume.id}
                  onClick={() => loadResume(resume.id)}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70 p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {preset.flag} {preset.paperSize.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        {formatRelativeTime(resume.updated_at)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                      {resume.content.personal.fullName || 'Unnamed'} • {resume.content.personal.jobTitle || 'Role'}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 capitalize">
                        {resume.template_id.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800/40 text-zinc-400 border border-zinc-800">
                        {resume.content.experience.length} exp
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-300 group-hover:text-white flex items-center gap-1">
                      Edit <ExternalLink className="w-3 h-3 text-zinc-400" />
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleDownloadPdf(resume, e)}
                        disabled={isDownloading}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                        title="Download Vector PDF"
                      >
                        <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce text-white' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleDuplicate(resume.id, e)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                        title="Duplicate Resume"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(resume.id, resume.title, e)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Template Preview / Gallery Modal */}
      <TemplateGalleryModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        initialTemplateId={previewTemplateId}
      />

      {/* Admin Unlock Modal */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onSuccess={() => {
          setShowAdminAuthModal(false);
          setIsAdminSession(true);
          try {
            localStorage.setItem('novafolio_admin_session', 'true');
          } catch {}
          setActiveTab('admin');
        }}
      />
    </div>
  );
};
