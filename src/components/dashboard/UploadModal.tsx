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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Client-Side Resume Scanner</h3>
              <p className="text-xs text-slate-500">Extracts structure & keywords locally without server uploads</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60'
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              {file ? file.name : 'Drag & drop your resume (.PDF or .DOCX)'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Parsed 100% in-browser via <code className="font-mono text-indigo-600">pdfjs-dist</code> and <code className="font-mono text-indigo-600">mammoth</code>
            </p>
          </div>

          {/* Extracted Preview */}
          {parsedData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully Parsed Schema</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Candidate Name</span>
                  <span className="font-medium text-slate-800">{parsedData.personal.fullName || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Detected Location</span>
                  <span className="font-medium text-slate-800">{parsedData.personal.location || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Detected Email</span>
                  <span className="font-medium text-slate-800">{parsedData.personal.email || 'Not detected'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Experience & Education</span>
                  <span className="font-medium text-slate-800">{parsedData.experience.length} roles • {parsedData.education.length} degrees</span>
                </div>
              </div>

              {parsedData.summary && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Summary Preview</span>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            No document leaves your device • 100% Client-Side
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={handleClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            {currentResume && (
              <button
                onClick={handleUpdateCurrentResume}
                disabled={!parsedData || isProcessing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                title="Populate current open resume with parsed data"
              >
                <span>Update Current Resume</span>
              </button>
            )}
            <button
              onClick={handleImportToEditor}
              disabled={!parsedData || isProcessing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{currentResume ? 'Import as New Resume' : 'Import to Editor'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
