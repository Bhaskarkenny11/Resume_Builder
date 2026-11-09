import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { EditorHeader } from './EditorHeader';
import { SectionList } from './SectionList';
import { StyleControls } from '../preview/StyleControls';
import { ResumePreviewContainer } from '../preview/ResumePreviewContainer';
import { triggerPdfDownload } from '../templates/PdfDocument';
import { recordAction } from '../../lib/analyticsTracker';
import { FileText, Sliders, Eye, Edit3 } from 'lucide-react';

export const TwoColumnEditor: React.FC = () => {
  const { currentResume } = useResumeStore();
  const [editorTab, setEditorTab] = useState<'content' | 'design'>('content');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!currentResume) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await triggerPdfDownload(currentResume);
      recordAction('export_pdf');
    } catch (err: any) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF: ' + (err?.message || 'Check browser console.'));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenDesignTab = () => {
    setEditorTab('design');
    setMobileTab('editor');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0D12] text-zinc-100 relative selection:bg-lime-400 selection:text-black">
      {/* Top Header */}
      <EditorHeader onDownloadPdf={handleDownloadPdf} isGeneratingPdf={isGeneratingPdf} />

      {/* Main Two-Column Layout (Tactile Avionics Workspace) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Form Inputs or Design Controls */}
        <section
          aria-label="Resume Editor Panel"
          className={`w-full lg:w-[46%] xl:w-[43%] h-full overflow-y-auto border-r border-white/[0.08] bg-[#0E1218] p-4 sm:p-6 flex-col ${
            mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-4 pb-20 lg:pb-0">
            {/* Recessed Avionics Segmented Tab Switcher */}
            <div className="bg-[#090C10] p-1.5 rounded-2xl border border-white/[0.08] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)] flex items-center shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  editorTab === 'content'
                    ? 'bg-[#181D26] text-lime-400 border border-lime-500/30 shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                    : 'text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>CONTENT SPEC</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('design')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  editorTab === 'design'
                    ? 'bg-[#181D26] text-lime-400 border border-lime-500/30 shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                    : 'text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>DESIGN & STYLE</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1">
              {editorTab === 'content' ? (
                <SectionList />
              ) : (
                <StyleControls />
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Live Scaled Canvas Preview */}
        <section
          aria-label="Live Canvas Preview"
          className={`w-full lg:w-[54%] xl:w-[57%] h-full flex-col bg-[#07090D] relative overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ResumePreviewContainer onOpenDesignTab={handleOpenDesignTab} />
        </section>

        {/* Floating Mobile/Tablet Mode Switcher */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0E1218]/90 backdrop-blur-2xl border border-white/20 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'editor'
                ? 'bg-lime-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'preview'
                ? 'bg-lime-400 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
