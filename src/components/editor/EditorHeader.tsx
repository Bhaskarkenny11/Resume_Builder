import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { CountryPresetId } from '../../types/resume';
import { AvionicsDocumentModal } from '../dashboard/AvionicsDocumentModal';
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
      <header className="sticky top-0 z-40 bg-[#0E1218]/95 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-6 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Back, Title, & Auto-save */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-white/[0.08] hover:border-lime-500/30 bg-[#12161E] hover:bg-[#181D26] text-zinc-300 hover:text-white text-xs font-mono font-medium transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] flex items-center gap-1.5 shrink-0 active:scale-95"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div className="h-4 w-px bg-white/[0.1] shrink-0" />

            {/* Title input */}
            <div className="min-w-0 max-w-[120px] xs:max-w-[160px] sm:max-w-xs md:max-w-sm">
              <input
                type="text"
                value={currentResume.title}
                onChange={(e) => setResumeTitle(e.target.value)}
                placeholder="Resume Title"
                className="font-mono font-bold text-xs sm:text-sm text-white bg-[#090C10] px-2.5 py-1 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.2)] focus:outline-none transition-all truncate w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* Auto-save status */}
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono shrink-0">
              {isSaving ? (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-full">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-0.5 rounded-full" title="Saved locally in browser IndexedDB">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Saved Local
                </span>
              )}
            </div>
          </div>

          {/* Right: Templates Gallery, Country, Import, and Download */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Template Picker Button (opens Avionics document modal) */}
            <button
              onClick={() => setShowGallery(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-lime-500/30 rounded-xl text-xs font-mono font-bold text-lime-400 flex items-center gap-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_0_12px_rgba(163,230,53,0.15)] active:scale-95"
              title="Inspect & change template"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-lime-400" />
              <span className="capitalize hidden md:inline">{currentResume.template_id.replace('_', ' ')}</span>
              <span className="capitalize md:hidden">Template</span>
            </button>

            {/* Country / Paper Format */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#090C10] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
              <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <select
                value={currentResume.country_preset}
                onChange={handleCountryChange}
                className="bg-transparent font-medium text-zinc-300 text-xs focus:outline-none cursor-pointer"
              >
                {Object.values(COUNTRY_PRESETS).map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#12161E] text-white">
                    {p.name} ({p.paperSize.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Scan Resume */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-[#12161E] border border-white/[0.08] hover:border-white/[0.15] text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] active:scale-95"
              title="Import & Scan Resume (.pdf / .docx)"
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Import</span>
            </button>

            {/* Admin Console Quick Button - ONLY Visible in Verified Admin Session */}
            {isAdminSession && (
              <button
                onClick={() => setActiveTab('admin')}
                className="p-1.5 sm:px-3 sm:py-1.5 bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 text-indigo-300 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                title="Open Admin Console & Site Traffic"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Download PDF button (Luminous lime button) */}
            <button
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="relative h-8 px-3.5 sm:px-4 rounded-full flex items-center gap-1.5 font-black text-xs font-mono uppercase tracking-wider text-black select-none transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                boxShadow: '0 0 18px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
              }}
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span><span className="hidden sm:inline">Download </span>PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Avionics Hardware Template Selector Modal */}
      <AvionicsDocumentModal
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
