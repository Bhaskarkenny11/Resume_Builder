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
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900 relative">
      {/* Top Header */}
      <EditorHeader onDownloadPdf={handleDownloadPdf} isGeneratingPdf={isGeneratingPdf} />

      {/* Main Two-Column Layout (FlowCV Pattern with responsive mobile/tablet tab switching) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Form Inputs or Design Controls */}
        <section
          aria-label="Resume Editor Panel"
          className={`w-full lg:w-[46%] xl:w-[44%] h-full overflow-y-auto border-r border-slate-200 bg-slate-50/60 p-4 sm:p-6 flex-col ${
            mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="max-w-xl mx-auto w-full flex-1 flex flex-col space-y-4 pb-20 lg:pb-0">
            {/* Clean Segmented Tab Switcher (FlowCV Pattern) */}
            <div className="bg-slate-200/70 p-1 rounded-xl flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  editorTab === 'content'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Content</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('design')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  editorTab === 'design'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Design & Style</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1">
              {editorTab === 'content' ? (
                <SectionList />
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                  <StyleControls />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column: Live Scaled Canvas Preview */}
        <section
          aria-label="Live Canvas Preview"
          className={`w-full lg:w-[54%] xl:w-[56%] h-full flex-col bg-slate-200/50 relative overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ResumePreviewContainer onOpenDesignTab={handleOpenDesignTab} />
        </section>

        {/* Floating Mobile/Tablet Mode Switcher (Apple Acrylic Glass Capsule) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950/85 backdrop-blur-2xl border border-white/20 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'editor'
                ? 'apple-primary-btn text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              mobileTab === 'preview'
                ? 'apple-primary-btn text-white shadow-md'
                : 'text-slate-300 hover:text-white'
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
