import React, { useState, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { extractTextFromPdf } from '../../lib/parser/pdfParser';
import { extractTextFromDocx } from '../../lib/parser/docxParser';
import { parseResumeText } from '../../lib/parser/heuristicParser';
import { ResumeRecord, ResumeContent } from '../../types/resume';
import { db } from '../../db';
import { validateResumeFile } from '../../lib/security';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  X, 
  ArrowRight 
} from 'lucide-react';

export const UploadModal: React.FC = () => {
  const { showUploadModal, setShowUploadModal, loadResume, currentResume } = useResumeStore();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showUploadModal) return null;

  const handleFileProcess = async (selectedFile: File) => {
    // 1. Bank-Grade File Security & Magic Byte Inspection
    const validation = await validateResumeFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || 'Invalid or unauthorized file format.');
      return;
    }

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Please upload a valid .pdf or .docx file.');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    setParsedData(null);

    try {
      let rawText = '';
      if (ext === 'pdf') {
        rawText = await extractTextFromPdf(selectedFile);
      } else {
        rawText = await extractTextFromDocx(selectedFile);
      }

      if (!rawText.trim()) {
        throw new Error('No readable text could be extracted from this document.');
      }

      const extracted = parseResumeText(rawText);
      setParsedData(extracted);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to extract text from document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileProcess(droppedFile);
    }
  };

  const handleImportToEditor = async () => {
    if (!parsedData) return;
    try {
      const newId = `resume-import-${Date.now()}`;
      const title = `${parsedData.personal.fullName || 'Imported'} Resume`;
      const record: ResumeRecord = {
        id: newId,
        title,
        template_id: 'modern_clean',
        country_preset: 'us_ca',
        content: parsedData,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      await db.resumes.add(record);
      await loadResume(newId);
      setShowUploadModal(false);
    } catch (err: any) {
      setError('Failed to save imported resume: ' + err?.message);
    }
  };

  const handleUpdateCurrentResume = async () => {
    if (!parsedData || !currentResume) return;
    try {
      const updatedRecord: ResumeRecord = {
        ...currentResume,
        title: `${parsedData.personal.fullName || 'Updated'} Resume`,
        content: {
          ...parsedData,
          style: currentResume.content?.style || parsedData.style,
        },
        updated_at: Date.now(),
      };

      await db.resumes.put(updatedRecord);
      await loadResume(currentResume.id);
      setShowUploadModal(false);
    } catch (err: any) {
      setError('Failed to update resume: ' + err?.message);
    }
  };

  const handleClose = () => {
    setShowUploadModal(false);
    setFile(null);
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="bg-[#12161E] rounded-[32px] shadow-2xl max-w-xl w-full border border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0E1218] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#090B0E] border border-white/[0.08] text-lime-400 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
              <Sparkles className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono tracking-tight">Client-Side Resume Scanner</h3>
              <p className="text-xs text-zinc-400 font-mono">100% In-Browser AST Parser // Zero Network Telemetry</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] ${
              isDragging
                ? 'border-lime-500 bg-lime-950/20 scale-[0.99]'
                : 'border-white/[0.12] bg-[#090C10] hover:border-lime-500/50 hover:bg-[#0E1218]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileProcess(f);
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-[#12161E] border border-white/[0.08] text-lime-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-lime-400" />
              ) : (
                <UploadCloud className="w-6 h-6 text-lime-400" />
              )}
            </div>
            <h4 className="text-sm font-bold text-white font-mono">
              {file ? file.name : 'DRAG & DROP RESUME (.PDF OR .DOCX)'}
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Engineered via <code className="text-lime-400 font-mono">pdfjs-dist</code> & <code className="text-lime-400 font-mono">mammoth</code>
            </p>
          </div>

          {/* Extracted Preview */}
          {parsedData && (
            <div className="bg-[#090C10] border border-white/[0.08] rounded-2xl p-4 space-y-3 animate-in fade-in duration-200 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PARSED SCHEMA VERIFIED // READY FOR FLIGHT</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Candidate Name</span>
                  <span className="font-semibold text-white">{parsedData.personal.fullName || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Detected Location</span>
                  <span className="font-semibold text-white">{parsedData.personal.location || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Detected Email</span>
                  <span className="font-semibold text-white">{parsedData.personal.email || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Experience & Education</span>
                  <span className="font-semibold text-white">{parsedData.experience.length} roles • {parsedData.education.length} degrees</span>
                </div>
              </div>

              {parsedData.summary && (
                <div className="pt-2 border-t border-white/[0.08]">
                  <span className="text-zinc-500 block text-[10px] font-mono uppercase font-bold mb-0.5">Summary Preview</span>
                  <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0E1218] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-500">
            100% Client-Side • Zero Cloud Uploads
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleClose}
              className="px-3.5 py-2 text-xs font-mono text-zinc-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            {currentResume && (
              <button
                onClick={handleUpdateCurrentResume}
                disabled={!parsedData || isProcessing}
                className="px-4 py-2 bg-[#181D26] hover:bg-[#202734] disabled:opacity-40 text-zinc-200 text-xs font-mono font-semibold rounded-xl border border-white/[0.08] transition-all flex items-center gap-1.5"
                title="Populate current open resume with parsed data"
              >
                <span>Update Current</span>
              </button>
            )}
            <button
              onClick={handleImportToEditor}
              disabled={!parsedData || isProcessing}
              className="relative h-9 px-5 rounded-full flex items-center gap-2 font-mono font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 disabled:opacity-40 shadow-md cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                boxShadow: '0 0 18px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span>{currentResume ? 'Import As New' : 'Import To Editor'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
