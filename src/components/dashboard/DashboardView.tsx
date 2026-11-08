import React, { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, exportDatabaseBackup, importDatabaseBackup } from '../../db';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeRecord, TemplateId } from '../../types/resume';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { triggerPdfDownload } from '../templates/PdfDocument';
import { TemplateConfig, DashboardTemplateCategory } from '../../lib/templatesConfig';
import { getAllTemplates } from '../../lib/customAssetsManager';
import { AdminAuthModal } from '../admin/AdminAuthModal';
import { AvionicsTemplateCard } from './AvionicsTemplateCard';
import { AvionicsDocumentModal } from './AvionicsDocumentModal';
import { DotMatrixBadge } from './DotMatrixBadge';
import { LuminousLimeSlider } from './LuminousLimeSlider';
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
  ShieldCheck, 
  ShieldAlert, 
  LayoutGrid,
  Plane,
  Radar,
  Radio,
  Sliders,
  CheckCircle2,
  Terminal
} from 'lucide-react';

const CATEGORY_TABS: { id: 'All Templates' | DashboardTemplateCategory; label: string; code: string }[] = [
  { id: 'All Templates', label: 'All Formats', code: 'ALL' },
  { id: 'ATS Standard', label: 'ATS Standard', code: 'ATS' },
  { id: 'Two-Column', label: 'Two-Column', code: 'TWO' },
  { id: 'Modern Executive', label: 'Modern Executive', code: 'EXE' },
  { id: 'Minimal', label: 'Minimal Monochrome', code: 'MIN' },
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
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<TemplateId | null>(null);
  const [showAvionicsModal, setShowAvionicsModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(() => {
    try {
      return localStorage.getItem('novafolio_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Stealth Trigger 1: Triple-click on Avionics Logo
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

  const handlePreviewTemplate = (templateId: string) => {
    setSelectedTemplateForPreview(templateId as TemplateId);
    setShowAvionicsModal(true);
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
      a.download = `ResumeBuilder_Avionics_Backup_${new Date().toISOString().slice(0, 10)}.json`;
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
    <div className="min-h-screen bg-[#0A0D12] text-zinc-100 flex flex-col relative overflow-x-hidden selection:bg-lime-400 selection:text-black">
      {/* Background Tactile Perforation & Cockpit Radar Grid Sheen */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(132, 204, 22, 0.08) 0%, transparent 60%), radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 16px 16px',
        }}
      />

      {/* 1. TOP AVIONICS APP HEADER WITH CLIENT-SIDE STATUS INDICATOR */}
      <header className="sticky top-0 z-30 bg-[#0E1218]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3 shadow-[0_4px_25px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Tactical Hardware Logo & Client-side status indicator */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="ProFile Avionics Console (Triple-click for Admin)"
          >
            {/* Beveled avionics logo container */}
            <div 
              className="w-9 h-9 rounded-xl bg-[#090B0E] border border-white/[0.1] text-lime-400 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)] group-hover:border-lime-500/50 transition-colors"
            >
              <Plane className="w-4 h-4 fill-lime-400 text-lime-400 transform -rotate-45" />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-black text-sm sm:text-base text-white tracking-wider font-mono">
                PROFILE<span className="text-lime-400">.</span>ATS
              </span>

              {/* Glowing Client-Side Status Indicator */}
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% CLIENT-SIDE • LOCAL ENCRYPTED</span>
              </span>
            </div>
          </div>

          {/* Right: Tactical Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {security.pinHash && (
              <button
                onClick={lockWorkspace}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#12161E] hover:bg-[#181D26] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                title="Lock Workspace Now"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#12161E] hover:bg-[#181D26] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
              title="Scan and import PDF or DOCX resume"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#12161E] hover:bg-[#181D26] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
              title="Import JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Import</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#12161E] hover:bg-[#181D26] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
              title="Export complete IndexedDB backup as JSON"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            {/* Admin Console Pill - Verified Admin Session */}
            {isAdminSession && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 text-indigo-300 border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900/60 transition-all shadow-xs"
                title="Open Admin Console"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Admin Console</span>
              </button>
            )}

            {/* Primary CTA: Luminous Lime Button */}
            <button
              onClick={() => handleCreateNew()}
              className="relative h-8 px-4 rounded-full flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 group shadow-md cursor-pointer ml-1"
              style={{
                background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                boxShadow: '0 0 18px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
              <span>New Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN COCKPIT DASHBOARD BODY */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 relative z-10">
        {/* HERO TITLE & DUAL VIEW SWITCHER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {dashboardView === 'templates' ? 'AVIONICS TEMPLATES' : 'LOCAL FLIGHT ARCHIVES'}
                </h1>
                <span className="text-xs font-mono font-bold text-lime-400 bg-lime-950/50 border border-lime-800/60 px-2.5 py-1 rounded-full">
                  {dashboardView === 'templates' 
                    ? `${allTemplates.length} READY`
                    : `${allResumes.length} ARCHIVED`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-xl font-mono leading-relaxed">
                {dashboardView === 'templates'
                  ? 'Tactile avionics hardware widgets engineered for high-conversion ATS academic & executive resumes.'
                  : 'Client-side resumes secured within local browser IndexedDB storage.'}
              </p>
            </div>

            {/* Recessed Dual Switcher: Flight Templates vs My Resumes */}
            {allResumes.length > 0 && (
              <div 
                className="flex items-center gap-1 p-1 bg-[#090C10] border border-white/[0.08] rounded-2xl self-start md:self-auto shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
              >
                <button
                  type="button"
                  onClick={() => setDashboardView('templates')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    dashboardView === 'templates'
                      ? 'bg-[#181D26] text-lime-400 border border-white/[0.1] shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Radar className="w-3.5 h-3.5" />
                  <span>Templates</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardView('my_resumes')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    dashboardView === 'my_resumes'
                      ? 'bg-[#181D26] text-lime-400 border border-white/[0.1] shadow-xs'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>My Resumes ({allResumes.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* FILTER CONTROLS & RECESSED SEARCH BAR */}
          {dashboardView === 'templates' ? (
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Segmented Hardware Switcher */}
              <div 
                className="flex items-center gap-1.5 p-1.5 bg-[#090C10] border border-white/[0.08] rounded-2xl overflow-x-auto no-scrollbar shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  const count = tab.id === 'All Templates' 
                    ? allTemplates.length 
                    : allTemplates.filter((t: TemplateConfig) => t.categoryTag === tab.id).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'bg-[#181D26] text-lime-400 border border-lime-500/30 shadow-[0_0_12px_rgba(163,230,53,0.2)]'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#12161E] border border-transparent'
                      }`}
                    >
                      <span className="text-[10px] opacity-60">[{tab.code}]</span>
                      <span>{tab.label}</span>
                      <span className="text-[10px] font-mono text-zinc-500">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Recessed Hardware Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  placeholder="FILTER FLIGHT CODES..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#090C10] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_15px_rgba(163,230,53,0.2)] placeholder:text-zinc-600 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          ) : (
            /* Saved Resumes Filter Bar */
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div 
                className="flex items-center gap-1.5 p-1.5 bg-[#090C10] border border-white/[0.08] rounded-2xl overflow-x-auto no-scrollbar shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
              >
                {['All', 'Software & Tech', 'Business & Operations', 'Design & Creative', 'Executive & Leadership'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSavedResumeCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                      savedResumeCategory === cat
                        ? 'bg-[#181D26] text-lime-400 border border-lime-500/30'
                        : 'text-zinc-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  value={savedResumeSearch}
                  onChange={(e) => setSavedResumeSearch(e.target.value)}
                  placeholder="SEARCH ARCHIVES..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#090C10] border border-white/[0.08] text-white rounded-xl focus:outline-none focus:border-lime-500/50 placeholder:text-zinc-600 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. MULTI-ROW RESPONSIVE GRID LAYOUT (grid-cols-1 md:grid-cols-2 xl:grid-cols-3) */}
        {dashboardView === 'templates' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredTemplates.map((template: TemplateConfig) => (
              <AvionicsTemplateCard
                key={template.id}
                template={template}
                onPreview={handlePreviewTemplate}
                onUseTemplate={(id) => handleCreateNew(id as TemplateId)}
              />
            ))}
          </div>
        ) : (
          /* SAVED RESUMES AVIONICS ARCHIVE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Create New Flight Card */}
            <div
              onClick={() => handleCreateNew()}
              className="group min-h-[300px] rounded-[32px] border border-dashed border-white/[0.15] bg-[#0E1218]/40 hover:bg-[#12161E]/80 hover:border-lime-500/40 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#090B0E] border border-white/[0.1] text-lime-400 flex items-center justify-center transition-all mb-4 group-hover:scale-110 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono group-hover:text-lime-400 transition-colors">
                Create New Resume
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-xs font-mono leading-relaxed">
                Configure ATS-compliant resume or scan existing document.
              </p>
            </div>

            {/* Saved Resumes List styled as Avionics Flight Records */}
            {filteredSavedResumes.map((resume) => {
              const preset = COUNTRY_PRESETS[resume.country_preset] || COUNTRY_PRESETS.us_ca;
              const isDownloading = downloadingId === resume.id;
              const codePrefix = resume.template_id.slice(0, 3).toUpperCase();

              return (
                <div
                  key={resume.id}
                  className="group relative flex flex-col justify-between rounded-[32px] overflow-hidden border border-white/[0.08] transition-all duration-300 hover:border-lime-500/30 hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(180deg, #12151B 0%, #161A22 100%)',
                    boxShadow:
                      'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.75)',
                  }}
                >
                  {/* Top flight info */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 bg-[#090B0E] px-2.5 py-1 rounded-xl border border-white/[0.06]">
                        <DotMatrixBadge code={codePrefix} size="sm" glow={true} />
                        <span className="text-amber-500 font-bold text-xs">→</span>
                        <DotMatrixBadge code="REC" size="sm" glow={true} />
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-[#0B0D12] px-2.5 py-1 rounded-xl border border-white/[0.05]">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{formatRelativeTime(resume.updated_at)}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white truncate font-mono">
                      {resume.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 truncate">
                      {resume.content.personal.fullName || 'Alex Vance'} • {resume.content.personal.jobTitle || 'Role'}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-[#090B0E] border border-white/[0.06] text-zinc-300">
                        {preset.flag} {preset.paperSize.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#090B0E] border border-white/[0.06] text-zinc-400">
                        {resume.content.experience.length} EXP
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#090B0E] border border-white/[0.06] text-emerald-400">
                        100% ATS
                      </span>
                    </div>
                  </div>

                  {/* Actions & Luminous slider to launch */}
                  <div className="px-5 pb-5 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDownloadPdf(resume, e)}
                          disabled={isDownloading}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-xl border border-white/[0.06] transition-colors"
                          title="Download Vector PDF"
                        >
                          <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce text-lime-400' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(resume.id, e)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-xl border border-white/[0.06] transition-colors"
                          title="Duplicate Resume"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(resume.id, resume.title, e)}
                          className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-white/[0.06] transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => loadResume(resume.id)}
                        className="text-xs font-mono font-bold text-lime-400 hover:text-lime-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>OPEN BUILDER</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <LuminousLimeSlider
                      onActivate={() => loadResume(resume.id)}
                      labelRight="LOAD RESUME"
                      buttonLabel="RESUME"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. FULL-SCREEN PRINT-READY A4 DOCUMENT PREVIEW MODAL */}
      <AvionicsDocumentModal
        isOpen={showAvionicsModal}
        onClose={() => setShowAvionicsModal(false)}
        templateId={selectedTemplateForPreview}
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
