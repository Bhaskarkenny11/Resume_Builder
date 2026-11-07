import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { CountryPresetId } from '../../types/resume';
import { TemplateGalleryModal } from '../dashboard/TemplateGalleryModal';
import { AdminAuthModal } from '../admin/AdminAuthModal';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download, 
  UploadCloud, 
  Check, 
  Globe, 
  LayoutTemplate,
  ShieldAlert 
} from 'lucide-react';

interface EditorHeaderProps {
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ onDownloadPdf, isGeneratingPdf }) => {
  const { 
    currentResume, 
    setResumeTitle, 
    setCountryPreset, 
    isSaving, 
    setActiveTab,
    setShowUploadModal
  } = useResumeStore();

  const [showGallery, setShowGallery] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [isAdminSession, setIsAdminSession] = useState(() => {
    try {
      return localStorage.getItem('novafolio_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  // Global Stealth Keypress Trigger: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setShowAdminAuthModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentResume) return null;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryPreset(e.target.value as CountryPresetId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Back, Title, & Auto-save */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 shrink-0 active:scale-95"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0" />

            {/* Title input */}
            <div className="min-w-0 max-w-[120px] xs:max-w-[160px] sm:max-w-xs md:max-w-sm">
              <input
                type="text"
                value={currentResume.title}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Resume Title"
                className="font-bold text-xs sm:text-sm text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white px-1.5 sm:px-2 py-1 rounded-md border border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none transition-all truncate w-full"
              />
            </div>

            {/* Auto-save status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0">
              {isSaving ? (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-medium" title="Saved locally in browser IndexedDB">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Saved
                </span>
              )}
            </div>
          </div>

          {/* Right: Templates Gallery, Country, Import, and Download */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Template Picker Button (opens Resume.io carousel modal) */}
            <button
              onClick={() => setShowGallery(true)}
              className="px-2 sm:px-3 py-1.5 bg-gradient-to-b from-blue-50 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 rounded-xl text-xs font-semibold text-blue-700 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
              title="Browse all Resume.io templates"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
              <span className="capitalize hidden md:inline">{currentResume.template_id.replace('_', ' ')}</span>
              <span className="capitalize md:hidden">Template</span>
            </button>

            {/* Country / Paper Format */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={currentResume.country_preset}
                onChange={handleCountryChange}
                className="bg-transparent font-medium text-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                {Object.values(COUNTRY_PRESETS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.paperSize.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Scan Resume */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Import & Scan Resume (.pdf / .docx)"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Import</span>
            </button>

            {/* Admin Console Quick Button - ONLY Visible in Verified Admin Session */}
            {isAdminSession && (
              <button
                onClick={() => setActiveTab('admin')}
                className="p-1.5 sm:px-3 sm:py-1.5 bg-indigo-50/80 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                title="Open Admin Console & Site Traffic"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Download PDF button (Apple primary glossy button) */}
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="apple-primary-btn px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 shrink-0 shadow-sm"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span><span className="hidden sm:inline">Download </span>PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Resume.io Template Selector Carousel */}
      <TemplateGalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
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
    </>
  );
};
