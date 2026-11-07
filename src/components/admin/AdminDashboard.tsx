import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { 
  getAnalyticsSummary, 
  recordAction, 
  clearAnalyticsData,
  injectExternalAnalytics 
} from '../../lib/analyticsTracker';
import { 
  getCustomFonts, 
  addCustomFont, 
  removeCustomFont, 
  getCustomTemplates, 
  addCustomTemplate, 
  removeCustomTemplate 
} from '../../lib/customAssetsManager';
import { 
  traceResumeFile, 
  TracedTemplateResult 
} from '../../lib/layoutTracer';
import { AnalyticsSummary, CustomFontConfig, CustomTemplateConfig } from '../../types/resume';
import { 
  BarChart3, 
  Type, 
  LayoutTemplate, 
  Settings, 
  ArrowLeft, 
  Users, 
  Eye, 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  Globe, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Key,
  Sparkles,
  Search,
  Filter,
  Sliders,
  UploadCloud,
  FileUp,
  Layers,
  Wand2,
  Loader2,
  X,
  LogOut
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab } = useResumeStore();
  const [currentSection, setCurrentSection] = useState<'analytics' | 'fonts' | 'templates' | 'settings'>('analytics');
  const [summary, setSummary] = useState<AnalyticsSummary>(getAnalyticsSummary());
  const [customFonts, setCustomFonts] = useState<CustomFontConfig[]>(getCustomFonts());
  const [customTemplates, setCustomTemplates] = useState<CustomTemplateConfig[]>(getCustomTemplates());

  // Add Font Form State
  const [showAddFontModal, setShowAddFontModal] = useState(false);
  const [fontName, setFontName] = useState('');
  const [fontFamily, setFontFamily] = useState('');
  const [fontCategory, setFontCategory] = useState<CustomFontConfig['category']>('Modern Sans');
  const [fontUrl, setFontUrl] = useState('');
  const [fontPreviewText, setFontPreviewText] = useState('Transform your career with high-impact resume layouts.');

  // Add Template Form State
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [tplName, setTplName] = useState('');
  const [tplHeadline, setTplHeadline] = useState('');
  const [tplCategoryTag, setTplCategoryTag] = useState<'ATS Standard' | 'Two-Column' | 'Modern Executive' | 'Minimal'>('ATS Standard');
  const [tplLayoutTag, setTplLayoutTag] = useState('Executive Linear');
  const [tplAccentColor, setTplAccentColor] = useState('#2563eb');
  const [tplFontFamily, setTplFontFamily] = useState('inter');
  const [tplBaseEngine, setTplBaseEngine] = useState('modern_clean');
  const [tplDescription, setTplDescription] = useState('');
  const [tplFeature1, setTplFeature1] = useState('High ATS Conversion Ratio');
  const [tplFeature2, setTplFeature2] = useState('Vector Scalable Typography');

  // Drag and Drop Resume Auto-Tracer State
  const [isDragging, setIsDragging] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [traceProgress, setTraceProgress] = useState('');
  const [tracedResult, setTracedResult] = useState<TracedTemplateResult | null>(null);
  const [tracedFileName, setTracedFileName] = useState('');
  const [tracedNotice, setTracedNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Integrations State
  const [gaId, setGaId] = useState(() => localStorage.getItem('novafolio_ga_id') || '');
  const [customScript, setCustomScript] = useState(() => localStorage.getItem('novafolio_custom_script') || '');
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const refreshStats = () => {
    setSummary(getAnalyticsSummary());
    setCustomFonts(getCustomFonts());
    setCustomTemplates(getCustomTemplates());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleSaveAnalyticsSettings = () => {
    localStorage.setItem('novafolio_ga_id', gaId.trim());
    localStorage.setItem('novafolio_custom_script', customScript.trim());
    injectExternalAnalytics({
      googleAnalyticsId: gaId.trim(),
      customScriptUrl: customScript.trim(),
      trackLocally: true,
      enableLiveSimulation: false,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const handleCreateFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fontName.trim() || !fontFamily.trim()) return;

    addCustomFont({
      name: fontName.trim(),
      family: fontFamily.trim(),
      category: fontCategory,
      url: fontUrl.trim() || undefined,
    });

    setFontName('');
    setFontFamily('');
    setFontUrl('');
    setShowAddFontModal(false);
    setCustomFonts(getCustomFonts());
  };

  const handleDeleteFont = (id: string) => {
    if (confirm('Are you sure you want to remove this font?')) {
      removeCustomFont(id);
      setCustomFonts(getCustomFonts());
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim()) return;

    addCustomTemplate({
      name: tplName.trim(),
      headline: tplHeadline.trim() || 'Engineered for high readability',
      category: `${tplCategoryTag} • Custom Layout`,
      categoryTag: tplCategoryTag,
      layoutTag: tplLayoutTag.trim() || 'Modern Clean',
      atsRating: '98% ATS',
      accentColor: tplAccentColor,
      fontFamily: tplFontFamily,
      baseTemplateId: tplBaseEngine,
      description: tplDescription.trim() || 'Custom designer template tailored for corporate and technical candidates.',
      features: [tplFeature1.trim() || 'High ATS Parsing Compatibility', tplFeature2.trim() || 'Balanced Spacing Matrix'],
    });

    setTplName('');
    setTplHeadline('');
    setTplDescription('');
    setShowAddTemplateModal(false);
    setTracedResult(null);
    setCustomTemplates(getCustomTemplates());
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to remove this custom template?')) {
      removeCustomTemplate(id);
      setCustomTemplates(getCustomTemplates());
    }
  };

  // Resume Auto-Tracing Handler
  const handleResumeFileTrace = async (file: File) => {
    setIsTracing(true);
    setTraceProgress('Reading file content...');
    try {
      setTraceProgress('Analyzing column architecture & layout geometry...');
      const result = await traceResumeFile(file);
      setTracedResult(result);
      setTracedFileName(file.name);

      // Auto populate template state
      setTplName(`${result.name} Template`);
      setTplHeadline(result.headline);
      setTplCategoryTag(result.categoryTag);
      setTplLayoutTag(result.layoutTag);
      setTplAccentColor(result.accentColor);
      setTplFontFamily(result.fontFamily);
      setTplBaseEngine(result.baseTemplateId);
      setTplDescription(result.description);
      setTplFeature1(result.features[0] || 'Auto-traced column structure');
      setTplFeature2(result.features[1] || 'Verified ATS compatibility');

      setTracedNotice(`✨ Auto-Traced "${file.name}": Detected ${result.detectedColumns} layout with ${result.detectedStyle}.`);
    } catch (err: any) {
      console.error('Trace error:', err);
      alert('Failed to trace resume file: ' + (err.message || 'Please upload a valid PDF, DOCX, or text file.'));
    } finally {
      setIsTracing(false);
      setTraceProgress('');
    }
  };

  const handleDropResume = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleResumeFileTrace(e.dataTransfer.files[0]);
    }
  };

  const handleInstantPublishTracedTemplate = () => {
    if (!tplName.trim()) return;
    addCustomTemplate({
      name: tplName.trim(),
      headline: tplHeadline.trim() || 'Engineered for high readability',
      category: `${tplCategoryTag} • Auto-Traced Layout`,
      categoryTag: tplCategoryTag,
      layoutTag: tplLayoutTag.trim() || 'Traced Format',
      atsRating: tracedResult?.atsRating || '99% ATS',
      accentColor: tplAccentColor,
      fontFamily: tplFontFamily,
      baseTemplateId: tplBaseEngine,
      description: tplDescription.trim() || 'Auto-traced custom template with high ATS compliance.',
      features: [tplFeature1.trim() || 'Traced Layout Structure', tplFeature2.trim() || 'Vector Scalable'],
    });
    setTracedNotice(`✨ Template "${tplName}" has been published to the gallery!`);
    setTracedResult(null);
    setCustomTemplates(getCustomTemplates());
  };

  // Generate SVG points for traffic area chart
  const maxVisits = Math.max(...summary.dailyVisits.map((d) => d.visits), 10);
  const chartHeight = 160;
  const chartWidth = 720;
  const points = summary.dailyVisits.map((d, idx) => {
    const x = (idx / (summary.dailyVisits.length - 1)) * chartWidth;
    const y = chartHeight - (d.visits / maxVisits) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,${chartHeight} ${polylinePoints} ${chartWidth},${chartHeight}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. TOP ADMIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 transition-all flex items-center gap-1.5 text-xs font-medium"
              title="Return to Resume Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Console</span>
            </button>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold tracking-tight text-zinc-100">
                    ProFile Admin Console
                  </h1>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Telemetry, Custom Typography & Template Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshStats}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-lg border border-zinc-800/60 transition-all text-xs flex items-center gap-1"
              title="Refresh Telemetry Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <div className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PIN Authorized</span>
            </div>

            <button
              onClick={() => {
                try {
                  localStorage.removeItem('novafolio_admin_session');
                } catch {}
                setActiveTab('dashboard');
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg border border-zinc-800 transition-all text-xs flex items-center gap-1 font-medium"
              title="Sign out and hide Admin Console access"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ADMIN MAIN CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 px-3 py-1 font-semibold">
            Admin Modules
          </div>

          <button
            onClick={() => setCurrentSection('analytics')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              currentSection === 'analytics'
                ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Traffic & Analytics</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded">
              {summary.totalVisits}
            </span>
          </button>

          <button
            onClick={() => setCurrentSection('fonts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              currentSection === 'fonts'
                ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Type className="w-4 h-4 text-emerald-400" />
              <span>Custom Fonts</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded">
              {customFonts.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentSection('templates')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              currentSection === 'templates'
                ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutTemplate className="w-4 h-4 text-amber-400" />
              <span>Custom Templates</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded">
              {customTemplates.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentSection('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              currentSection === 'settings'
                ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-sky-400" />
              <span>Settings & Integrations</span>
            </div>
          </button>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 min-w-0">
          {/* ======================================================== */}
          {/* TAB 1: TRAFFIC & ANALYTICS                               */}
          {/* ======================================================== */}
          {currentSection === 'analytics' && (
            <div className="space-y-6">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Pageviews */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Total Site Visits</span>
                    <Eye className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100 font-mono">
                    {summary.totalVisits.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span>↑ +18.4%</span>
                    <span className="text-zinc-500">vs last period</span>
                  </div>
                </div>

                {/* Unique Visitors */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Unique Visitors</span>
                    <Users className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100 font-mono">
                    {summary.uniqueVisitors.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Client-side hashed identifier
                  </div>
                </div>

                {/* Resumes Created */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Resumes Created</span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100 font-mono">
                    {summary.totalResumesCreated.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Conversion: <span className="font-mono text-zinc-200">{Math.round((summary.totalResumesCreated / Math.max(summary.totalVisits, 1)) * 100)}%</span>
                  </div>
                </div>

                {/* PDF Exports */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-medium">Vector Exports</span>
                    <Download className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold text-zinc-100 font-mono">
                    {summary.totalExports.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    100% Client Vector PDF
                  </div>
                </div>
              </div>

              {/* 14-Day Traffic Area Line Chart */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      Visitor Traffic & Daily Pageviews (Last 14 Days)
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Real client-side session telemetry tracked via localStorage & IndexedDB.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                      Page Visits
                    </span>
                  </div>
                </div>

                {/* SVG Area Line Chart */}
                <div className="w-full h-44 overflow-hidden relative">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Background Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={chartHeight * pct}
                        x2={chartWidth}
                        y2={chartHeight * pct}
                        stroke="#27272a"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Gradient Area */}
                    <polygon points={areaPoints} fill="url(#chartGradient)" />

                    {/* Glowing Stroke Line */}
                    <polyline
                      points={polylinePoints}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Interactive Data Dots */}
                    {points.map((p, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          className="fill-indigo-500 stroke-zinc-950 stroke-2 group-hover:r-6 transition-all"
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Day Labels */}
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/80">
                  {summary.dailyVisits.map((d, i) => (
                    <span key={i} className="truncate">
                      {d.date.split('-').slice(1).join('/')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Referrers, Devices, and Browsers Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Traffic Channels / Referrers */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    Top Acquisition Channels
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.referrers).map(([source, count]) => {
                      const pct = Math.round((count / summary.totalVisits) * 100);
                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex justify-between text-xs text-zinc-300">
                            <span className="truncate">{source}</span>
                            <span className="font-mono text-zinc-400">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                    Device Distribution
                  </h3>
                  <div className="space-y-2.5 text-xs text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-zinc-400" /> Desktop / Mac
                      </span>
                      <span className="font-mono text-zinc-400">
                        {summary.devices.desktop} ({Math.round((summary.devices.desktop / summary.totalVisits) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" /> Mobile Phones
                      </span>
                      <span className="font-mono text-zinc-400">
                        {summary.devices.mobile} ({Math.round((summary.devices.mobile / summary.totalVisits) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Tablet className="w-3.5 h-3.5 text-zinc-400" /> Tablets / iPads
                      </span>
                      <span className="font-mono text-zinc-400">
                        {summary.devices.tablet} ({Math.round((summary.devices.tablet / summary.totalVisits) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Browsers */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Top Browsers
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(summary.browsers).map(([br, count]) => {
                      const pct = Math.round((count / summary.totalVisits) * 100);
                      return (
                        <div key={br} className="space-y-1">
                          <div className="flex justify-between text-xs text-zinc-300">
                            <span>{br}</span>
                            <span className="font-mono text-zinc-400">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Live Activity Stream */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-200">
                  Recent Visitor Sessions (Live Stream)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="text-[11px] font-mono uppercase text-zinc-500 border-b border-zinc-800 pb-2">
                      <tr>
                        <th className="py-2">Time</th>
                        <th className="py-2">Action / Event</th>
                        <th className="py-2">Page</th>
                        <th className="py-2">Referrer</th>
                        <th className="py-2">Device & Browser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                      {summary.recentSessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="py-2.5 text-zinc-400">
                            {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              sess.action === 'export_pdf'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                                : sess.action === 'create_resume'
                                ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50'
                                : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {sess.action.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 text-zinc-300">{sess.page}</td>
                          <td className="py-2.5 text-zinc-400 truncate max-w-[120px]">{sess.referrer}</td>
                          <td className="py-2.5 text-zinc-400">{sess.device} • {sess.browser}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CUSTOM FONTS MANAGER                              */}
          {/* ======================================================== */}
          {currentSection === 'fonts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">
                    Custom Fonts Manager
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Add Google Fonts or custom web fonts. Newly added fonts instantly appear in the Resume Editor's font selector.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddFontModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Font</span>
                </button>
              </div>

              {/* Active Fonts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customFonts.map((f) => (
                  <div 
                    key={f.id} 
                    className="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-4 space-y-3 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-zinc-100 block">
                          {f.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {f.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteFont(f.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Remove Font"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Font Preview Sandbox */}
                    <div 
                      className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1.5 text-zinc-200"
                      style={{ fontFamily: `'${f.family}', sans-serif` }}
                    >
                      <div className="text-sm font-bold">
                        Lead Software Architect
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        Spearheaded microservices migration, reducing latency by 45%.
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-zinc-500 truncate">
                      Family: {f.family}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CUSTOM TEMPLATES BUILDER + RESUME AUTO-TRACER     */}
          {/* ======================================================== */}
          {currentSection === 'templates' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                <div>
                  <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-amber-400" />
                    <span>Custom Template Studio</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Design custom resume templates manually, or drag and drop any existing resume to auto-trace the format.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manual Template Builder</span>
                </button>
              </div>

              {/* Status Notice Pill */}
              {tracedNotice && (
                <div className="flex items-center justify-between p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{tracedNotice}</span>
                  </div>
                  <button onClick={() => setTracedNotice('')} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* PROMINENT DRAG & DROP RESUME AUTO-TRACER ZONE */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDropResume}
                className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-950/30 shadow-lg shadow-indigo-950/50 scale-[1.005]'
                    : 'border-zinc-800 hover:border-indigo-500/50 bg-zinc-900/20 hover:bg-zinc-900/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleResumeFileTrace(e.target.files[0]);
                    }
                  }}
                />

                {isTracing ? (
                  <div className="py-6 space-y-3 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-zinc-100">
                        Scanning Resume Structure & Tracing Layout...
                      </h3>
                      <p className="text-xs font-mono text-indigo-400">
                        {traceProgress || 'Analyzing columns and styling...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-lg">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                      <Wand2 className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-zinc-100 flex items-center justify-center gap-1.5">
                        <span>Drag & Drop a Resume to Auto-Trace Format</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          AI Tracer
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Drop any existing PDF, DOCX, or text resume here. The engine will automatically trace column count, typography stack, accent colors, and ATS headers to generate a new template in 1 click.
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700/60">
                        .PDF
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700/60">
                        .DOCX
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[10px] font-mono font-medium text-zinc-300 border border-zinc-700/60">
                        .TXT
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* TRACED TEMPLATE RESULT ACTION CARD */}
              {tracedResult && (
                <div className="p-5 bg-zinc-900/70 border border-indigo-500/40 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          Traced Layout Ready
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          Source: {tracedFileName}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-100 mt-1">
                        {tplName}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {tplHeadline}
                      </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTemplateModal(true)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition-all"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={handleInstantPublishTracedTemplate}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Publish Template Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Detected Tokens Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 block">Layout Engine</span>
                      <span className="font-semibold text-zinc-200 capitalize">{tracedResult.detectedColumns} ({tracedResult.baseTemplateId})</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 block">Category</span>
                      <span className="font-semibold text-indigo-400">{tracedResult.categoryTag}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 block">Font Stack</span>
                      <span className="font-semibold text-zinc-200 uppercase font-mono">{tracedResult.fontFamily}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-500 block">ATS Rating</span>
                      <span className="font-semibold text-emerald-400">{tracedResult.atsRating}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Published Custom Templates Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-200 flex items-center justify-between">
                  <span>Published Custom Templates</span>
                  <span className="text-xs font-mono text-zinc-500">{customTemplates.length} custom layouts</span>
                </h3>

                {customTemplates.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                      <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-200">No Custom Templates Yet</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Drag & drop a resume above, or click below to build a bespoke template from scratch.
                    </p>
                    <button
                      onClick={() => setShowAddTemplateModal(true)}
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg"
                    >
                      + Create First Template
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customTemplates.map((t) => (
                      <div 
                        key={t.id} 
                        className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-sm text-zinc-100 block">{t.name}</span>
                              <span className="text-[11px] font-mono text-indigo-400">{t.categoryTag}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteTemplate(t.id)}
                              className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Delete template"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {t.description}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0" 
                              style={{ backgroundColor: t.accentColor }} 
                            />
                            <span className="text-[11px] font-mono text-zinc-400">
                              Font: {t.fontFamily}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                          <span>{t.atsRating}</span>
                          <span className="text-emerald-400">Published to Gallery</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SETTINGS & EXTERNAL ANALYTICS                      */}
          {/* ======================================================== */}
          {currentSection === 'settings' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">
                    Third-Party Analytics Integration
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Connect Google Analytics 4, Umami, Plausible, or Cloudflare Web Analytics to monitor real production traffic alongside ProFile's local telemetry.
                  </p>
                </div>

                <div className="space-y-4 max-w-xl">
                  {/* Google Analytics 4 */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Google Analytics 4 Measurement ID
                    </label>
                    <input
                      type="text"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[11px] text-zinc-500 block mt-1">
                      Found in your GA4 Admin &gt; Data Streams &gt; Measurement ID.
                    </span>
                  </div>

                  {/* Custom Script */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Custom Script URL (Umami, Plausible, Cloudflare)
                    </label>
                    <input
                      type="text"
                      value={customScript}
                      onChange={(e) => setCustomScript(e.target.value)}
                      placeholder="https://analytics.example.com/script.js"
                      className="w-full px-3.5 py-2 text-xs bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveAnalyticsSettings}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Activate Integrations</span>
                    </button>
                    {savedSettingsSuccess && (
                      <span className="text-xs text-emerald-400 font-medium animate-in fade-in">
                        Saved successfully!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Data Reset & Maintenance
                </h3>
                <p className="text-xs text-zinc-400">
                  Reset local telemetry logs or seed simulated visitor sessions.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      if (confirm('Clear telemetry traffic data?')) {
                        clearAnalyticsData();
                        refreshStats();
                      }
                    }}
                    className="px-3.5 py-2 bg-zinc-950 border border-rose-900/40 text-rose-400 hover:bg-rose-950/20 text-xs font-medium rounded-xl transition-all"
                  >
                    Reset Analytics Counter
                  </button>
                  <button
                    onClick={() => {
                      recordAction('create_resume');
                      refreshStats();
                    }}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-all"
                  >
                    + Simulate Live Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD CUSTOM FONT                                   */}
      {/* ======================================================== */}
      {showAddFontModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                Add Google Font or Web Font
              </h3>
              <button 
                onClick={() => setShowAddFontModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFont} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Font Name *
                </label>
                <input
                  type="text"
                  required
                  value={fontName}
                  onChange={(e) => {
                    setFontName(e.target.value);
                    if (!fontFamily) setFontFamily(e.target.value);
                  }}
                  placeholder="e.g. Poppins, Space Grotesk, Cinzel"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  CSS Font Family String *
                </label>
                <input
                  type="text"
                  required
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  placeholder="e.g. 'Poppins', sans-serif"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Category Style
                </label>
                <select
                  value={fontCategory}
                  onChange={(e) => setFontCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Modern Sans">Modern Sans</option>
                  <option value="Crisp Tech">Crisp Tech</option>
                  <option value="Clean Geometric">Clean Geometric</option>
                  <option value="Classic Editorial">Classic Editorial</option>
                  <option value="Tech Monospace">Tech Monospace</option>
                  <option value="Display Serif">Display Serif</option>
                  <option value="Script">Script</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Google Fonts Stylesheet URL (Optional)
                </label>
                <input
                  type="url"
                  value={fontUrl}
                  onChange={(e) => setFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Poppins..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Leave blank to auto-generate standard Google Fonts CDN link.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFontModal(false)}
                  className="px-3.5 py-1.5 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
                >
                  Save Font
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT CUSTOM TEMPLATE                        */}
      {/* ======================================================== */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-amber-400" />
                <span>Build Custom Template</span>
              </h3>
              <button 
                onClick={() => setShowAddTemplateModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            </div>

            {/* Quick Auto-Fill Drag Zone in Modal */}
            <div 
              onClick={() => modalFileInputRef.current?.click()}
              className="p-3 bg-zinc-950/60 border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl text-center cursor-pointer transition-colors"
            >
              <input
                ref={modalFileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleResumeFileTrace(e.target.files[0]);
                  }
                }}
              />
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Auto-Fill: Click or Drop a Resume File Here</span>
              </div>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={tplName}
                    onChange={(e) => setTplName(e.target.value)}
                    placeholder="e.g. Nordic Minimalist"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={tplCategoryTag}
                    onChange={(e) => setTplCategoryTag(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="ATS Standard">ATS Standard</option>
                    <option value="Two-Column">Two-Column</option>
                    <option value="Modern Executive">Modern Executive</option>
                    <option value="Minimal">Minimal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Headline Tagline
                </label>
                <input
                  type="text"
                  value={tplHeadline}
                  onChange={(e) => setTplHeadline(e.target.value)}
                  placeholder="e.g. Engineered for High-Conversion Tech Roles"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tplAccentColor}
                      onChange={(e) => setTplAccentColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={tplAccentColor}
                      onChange={(e) => setTplAccentColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">
                    Base Layout Engine
                  </label>
                  <select
                    value={tplBaseEngine}
                    onChange={(e) => setTplBaseEngine(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="modern_clean">Modern Clean (FlowCV)</option>
                    <option value="traditional">Traditional Editorial</option>
                    <option value="professional">Professional Two-Column</option>
                    <option value="momentum_ats">Momentum ATS (Gold Rule)</option>
                    <option value="executive">Executive Minimalist</option>
                    <option value="classic_ats">Classic ATS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Font Family
                </label>
                <select
                  value={tplFontFamily}
                  onChange={(e) => setTplFontFamily(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="inter">Inter (Modern Sans)</option>
                  <option value="jakarta">Plus Jakarta (Crisp Tech)</option>
                  <option value="outfit">Outfit (Clean Geometric)</option>
                  <option value="merriweather">Merriweather (Classic Editorial)</option>
                  <option value="roboto">Roboto (Standard Clean)</option>
                  <option value="mono">JetBrains Mono (Monospace)</option>
                  {customFonts.map((cf) => (
                    <option key={cf.id} value={cf.family}>{cf.name} (Custom)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={tplDescription}
                  onChange={(e) => setTplDescription(e.target.value)}
                  placeholder="Describe the typography and layout strengths of this template..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTemplateModal(false)}
                  className="px-3.5 py-1.5 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl"
                >
                  Publish Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
