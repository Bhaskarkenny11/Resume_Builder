import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COLOR_PALETTES, FONT_OPTIONS } from '../../lib/constants';
import { DEFAULT_AVATAR_URL } from '../../lib/utils';
import { getAllAvailableFonts } from '../../lib/customAssetsManager';
import { 
  FontFamily, 
  TemplateId, 
  HeaderAlignment, 
  HeaderDetailsLayout, 
  HeaderSeparator, 
  HeaderIconStyle,
  SectionHeadingStyle,
  SectionCapitalization,
  SectionIconStyle,
  PhotoPosition,
  PhotoSize,
  PhotoShapeType,
  ColorThemePlacement,
  ColorPaletteMode,
  AccentColorTargets,
  EntryStructure,
  DateLocationPosition,
  SubtitlePlacement,
  LocationPlacement,
  FontStyleVariant,
  EntryListStyle,
  DateLocationOrder,
  TitleSubtitleOrder,
  SectionItemLayout,
  SectionGridColumns,
  InlineSeparator,
} from '../../types/resume';
import { 
  Palette, 
  Type, 
  Sliders, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Smile, 
  Link as LinkIcon, 
  Sparkles,
  LayoutTemplate,
  Info,
  Plus,
  Minus,
  Camera,
  Image as ImageIcon,
  Heading,
  Layers,
  FileText
} from 'lucide-react';

export const StyleControls: React.FC = () => {
  const { currentResume, updateStyle, setTemplate, updatePersonalDetails } = useResumeStore();
  const [showAdvancedHeader, setShowAdvancedHeader] = useState(false);
  const [showAdvancedEntryLayout, setShowAdvancedEntryLayout] = useState(false);
  const [showSectionCustomizations, setShowSectionCustomizations] = useState(true);

  if (!currentResume) return null;
  const style = currentResume.content.style;
  const personal = currentResume.content.personal;

  // Header settings
  const currentHeaderAlignment: HeaderAlignment = style.headerAlignment || 'left';
  const currentDetailsLayout: HeaderDetailsLayout = style.headerDetailsLayout || 'wrap';
  const currentSeparator: HeaderSeparator = style.headerSeparator || (style.showSectionIcons ? 'icon' : 'bullet');
  const currentIconStyle: HeaderIconStyle = style.headerIconStyle || 'plain';

  // Section Headings settings
  const currentSectionHeadingStyle: SectionHeadingStyle = style.sectionHeadingStyle || 'full_underline';
  const currentCapitalization: SectionCapitalization = style.sectionCapitalization || 'uppercase';
  const currentSectionIconStyle: SectionIconStyle = style.sectionIconStyle || 'none';

  // Photo settings
  const isPhotoShown = personal.showPhoto !== false;
  const photoPosition: PhotoPosition = style.photoPosition || 'left';
  const photoSize: PhotoSize = style.photoSize || 'm';
  const photoGrayscale = style.photoGrayscale || false;
  const photoShapeType: PhotoShapeType = style.photoShapeType || (personal.photoShape as any) || 'circle';

  const activatePhoto = () => {
    if (!personal.photoUrl) {
      updatePersonalDetails({ showPhoto: true, photoUrl: DEFAULT_AVATAR_URL });
    } else if (personal.showPhoto === false) {
      updatePersonalDetails({ showPhoto: true });
    }
  };

  // Color & Accent settings
  const colorThemePlacement: ColorThemePlacement = style.colorThemePlacement || 'full_page';
  const colorPaletteMode: ColorPaletteMode = style.colorPaletteMode || 'single';
  const accentTargets: AccentColorTargets = style.accentTargets || {
    name: true,
    jobTitle: true,
    headings: true,
    headingsLine: true,
    headerIcons: false,
    dotsBarsBubbles: false,
    dates: false,
    entryTitle: false,
    entrySubtitle: false,
    linkIcons: false,
  };

  const toggleAccentTarget = (key: keyof AccentColorTargets) => {
    updateStyle({
      accentTargets: {
        ...accentTargets,
        [key]: !accentTargets[key],
      },
    });
  };

  // Entry Layout settings
  const entryStructure: EntryStructure = style.entryStructure || 'full_width';
  const dateLocationPosition: DateLocationPosition = style.dateLocationPosition || 'right';
  const subtitlePlacement: SubtitlePlacement = style.subtitlePlacement || 'below_title';
  const locationPlacement: LocationPlacement = style.locationPlacement || 'same_line';
  const subtitleFontStyle: FontStyleVariant = style.subtitleFontStyle || 'italic';
  const dateFontStyle: FontStyleVariant = style.dateFontStyle || 'regular';
  const locationFontStyle: FontStyleVariant = style.locationFontStyle || 'regular';
  const indentBody = style.indentBody || false;
  const listStyle: EntryListStyle = style.listStyle || 'bullet';
  const dateLocationOrder: DateLocationOrder = style.dateLocationOrder || 'date_location';

  // Section Customizations settings
  const displaySummaryInHeader = style.displaySummaryInHeader || false;
  const showSummaryHeading = style.showSummaryHeading !== false;
  const workExperienceOrder: TitleSubtitleOrder = style.workExperienceOrder || 'title_subtitle';
  const groupPromotions = style.groupPromotions || false;
  const experienceLayout: SectionItemLayout = style.experienceLayout || 'rows';
  const experienceColumns: SectionGridColumns = style.experienceColumns || 1;
  const educationOrder: TitleSubtitleOrder = style.educationOrder || 'title_subtitle';
  const educationLayout: SectionItemLayout = style.educationLayout || 'rows';
  const educationColumns: SectionGridColumns = style.educationColumns || 1;
  const projectsLayout: SectionItemLayout = style.projectsLayout || 'rows';
  const projectsColumns: SectionGridColumns = style.projectsColumns || 1;
  const skillsLayout: SectionItemLayout = style.skillsLayout || 'bubble';
  const skillsColumns: SectionGridColumns = style.skillsColumns || 3;
  const certificatesLayout: SectionItemLayout = style.certificatesLayout || 'rows';
  const certificatesColumns: SectionGridColumns = style.certificatesColumns || 2;
  const languagesLayout: SectionItemLayout = style.languagesLayout || 'compact';
  const languagesColumns: SectionGridColumns = style.languagesColumns || 2;
  const customSectionsLayout: SectionItemLayout = style.customSectionsLayout || 'rows';
  const customSectionsColumns: SectionGridColumns = style.customSectionsColumns || 1;

  // Common avionics styles
  const cardClass = "bg-[#12161E] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl p-4 sm:p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_10px_25px_rgba(0,0,0,0.5)] space-y-4 transition-all";
  const labelClass = "block text-[11px] font-mono font-medium text-zinc-300 uppercase tracking-wider mb-2";
  const activeBtnClass = "bg-[#181D26] text-lime-400 border border-lime-500/50 shadow-[0_0_15px_rgba(163,230,53,0.18)] ring-1 ring-lime-500/30";
  const inactiveBtnClass = "bg-[#090C10] text-zinc-400 border border-white/[0.08] hover:border-white/[0.18] hover:text-white hover:bg-[#12161E] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]";

  return (
    <div className="space-y-4 pb-12">
      {/* ======================================================== */}
      {/* 1. HEADER CUSTOMIZATION                                 */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <LayoutTemplate className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Header
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Alignment, details arrangement & icon style</p>
            </div>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <label className={labelClass}>
            Text Alignment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Left Alignment */}
            <button
              type="button"
              onClick={() => updateStyle({ headerAlignment: 'left' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                currentHeaderAlignment === 'left' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect 
                  x="2" y="3" width="22" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'left' ? 'fill-lime-400' : 'fill-zinc-500'} 
                />
                <rect 
                  x="2" y="9" width="14" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'left' ? 'fill-lime-400' : 'fill-zinc-500'} 
                />
              </svg>
              <span className="text-xs font-mono font-bold">Left</span>
            </button>

            {/* Center Alignment */}
            <button
              type="button"
              onClick={() => updateStyle({ headerAlignment: 'center' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                currentHeaderAlignment === 'center' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect 
                  x="5" y="3" width="22" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'center' ? 'fill-lime-400' : 'fill-zinc-500'} 
                />
                <rect 
                  x="9" y="9" width="14" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'center' ? 'fill-lime-400' : 'fill-zinc-500'} 
                />
              </svg>
              <span className="text-xs font-mono font-bold">Center</span>
            </button>
          </div>
        </div>

        {/* Details Arrangement */}
        <div>
          <label className={labelClass}>
            Details Arrangement
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            {/* Wrap Mode */}
            <button
              type="button"
              onClick={() => updateStyle({ headerDetailsLayout: 'wrap' })}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                currentDetailsLayout === 'wrap' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Flow / Wrap inline"
            >
              <svg className="w-8 h-4" viewBox="0 0 28 14" fill="none">
                <rect x="1" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="10" y="2" width="10" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="22" y="2" width="5" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="1" y="8" width="12" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="15" y="8" width="8" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
            </button>

            {/* Column Mode */}
            <button
              type="button"
              onClick={() => updateStyle({ headerDetailsLayout: 'columns' })}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                currentDetailsLayout === 'columns' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Multi-column grid"
            >
              <svg className="w-8 h-4" viewBox="0 0 28 14" fill="none">
                <rect x="1" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="10" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="19" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="1" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="10" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="19" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
            </button>
          </div>

          {/* Separator row: Icon / Bullet / Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'icon', showSectionIcons: true })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSeparator === 'icon' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Icon</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'bullet' })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSeparator === 'bullet' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <span className="font-bold">•</span>
              <span>Bullet</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'bar' })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSeparator === 'bar' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <span className="font-light">|</span>
              <span>Bar</span>
            </button>
          </div>
        </div>

        {/* Icon Style */}
        <div>
          <label className={labelClass}>
            Icon Style
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {[
              { id: 'plain', iconClass: 'text-lime-400', containerClass: 'bg-lime-950/40 border border-lime-500/30 rounded-md' },
              { id: 'circle_filled', iconClass: 'text-zinc-900', containerClass: 'rounded-full bg-zinc-400' },
              { id: 'square_filled', iconClass: 'text-zinc-900', containerClass: 'rounded-xs bg-zinc-400' },
              { id: 'dark_square', iconClass: 'text-zinc-100', containerClass: 'rounded-xs bg-[#090C10] border border-white/[0.15]' },
              { id: 'circle_outline', iconClass: 'text-zinc-300', containerClass: 'rounded-full border border-zinc-500' },
              { id: 'square_outline', iconClass: 'text-zinc-300', containerClass: 'rounded-xs border border-zinc-500' },
              { id: 'minimal_border', iconClass: 'text-zinc-300', containerClass: 'border border-zinc-500' },
            ].map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => updateStyle({ headerIconStyle: variant.id as HeaderIconStyle })}
                className={`h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  currentIconStyle === variant.id
                    ? activeBtnClass
                    : inactiveBtnClass
                }`}
                title={variant.id}
              >
                <div className={`w-5 h-5 flex items-center justify-center ${variant.containerClass}`}>
                  <LinkIcon className={`w-2.5 h-2.5 ${variant.iconClass}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PHOTO CUSTOMIZATION                                   */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Camera className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Photo
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Position, dimensions & shape configuration</p>
            </div>
          </div>
        </div>

        {/* Checkboxes: Show & Grayscale */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPhotoShown}
              onChange={(e) => {
                const checked = e.target.checked;
                updatePersonalDetails({ 
                  showPhoto: checked,
                  photoUrl: checked && !personal.photoUrl ? DEFAULT_AVATAR_URL : personal.photoUrl
                });
              }}
              className="w-4 h-4 rounded bg-[#090C10] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
            />
            <span className="text-xs font-mono font-bold text-zinc-200">Show Photo</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={photoGrayscale}
              onChange={(e) => {
                updateStyle({ photoGrayscale: e.target.checked });
                activatePhoto();
              }}
              className="w-4 h-4 rounded bg-[#090C10] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
            />
            <span className="text-xs font-mono font-bold text-zinc-200">Grayscale</span>
          </label>
        </div>

        {/* Photo Position (Left, Top, Right) */}
        <div>
          <label className={labelClass}>
            Photo Position
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Left */}
            <button
              type="button"
              onClick={() => {
                updateStyle({ photoPosition: 'left' });
                activatePhoto();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                photoPosition === 'left' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <circle cx="6" cy="10" r="4.5" className={photoPosition === 'left' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="14" y="5" width="18" height="2.5" rx="1" className={photoPosition === 'left' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="14" y="9.5" width="14" height="2" rx="1" className={photoPosition === 'left' ? 'fill-lime-400/70' : 'fill-zinc-600'} />
                <rect x="14" y="13.5" width="10" height="2" rx="1" className={photoPosition === 'left' ? 'fill-lime-400/70' : 'fill-zinc-600'} />
              </svg>
              <span className="text-xs font-mono font-bold">Left</span>
            </button>

            {/* Top */}
            <button
              type="button"
              onClick={() => {
                updateStyle({ photoPosition: 'top' });
                activatePhoto();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                photoPosition === 'top' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <circle cx="18" cy="5.5" r="4" className={photoPosition === 'top' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="9" y="12" width="18" height="2.5" rx="1" className={photoPosition === 'top' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="11" y="16" width="14" height="2" rx="1" className={photoPosition === 'top' ? 'fill-lime-400/70' : 'fill-zinc-600'} />
              </svg>
              <span className="text-xs font-mono font-bold">Top</span>
            </button>

            {/* Right */}
            <button
              type="button"
              onClick={() => {
                updateStyle({ photoPosition: 'right' });
                activatePhoto();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                photoPosition === 'right' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <rect x="4" y="5" width="18" height="2.5" rx="1" className={photoPosition === 'right' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="4" y="9.5" width="14" height="2" rx="1" className={photoPosition === 'right' ? 'fill-lime-400/70' : 'fill-zinc-600'} />
                <rect x="4" y="13.5" width="10" height="2" rx="1" className={photoPosition === 'right' ? 'fill-lime-400/70' : 'fill-zinc-600'} />
                <circle cx="30" cy="10" r="4.5" className={photoPosition === 'right' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
              <span className="text-xs font-mono font-bold">Right</span>
            </button>
          </div>
        </div>

        {/* Size (XS, S, M, L, XL) */}
        <div>
          <label className={labelClass}>
            Size
          </label>
          <div className="grid grid-cols-5 gap-1.5 bg-[#090C10] p-1.5 rounded-xl border border-white/[0.08] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]">
            {(['xs', 's', 'm', 'l', 'xl'] as PhotoSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  updateStyle({ photoSize: sz });
                  activatePhoto();
                }}
                className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  photoSize === sz
                    ? 'bg-[#181D26] text-lime-400 border border-lime-500/40 shadow-[0_0_12px_rgba(163,230,53,0.2)]'
                    : 'text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Shape (Circle, Square, Rounded Square, Portrait, Portrait Rounded) */}
        <div>
          <label className={labelClass}>
            Shape
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: 'circle', label: 'Circle', preview: 'w-6 h-6 rounded-full' },
              { id: 'square', label: 'Square', preview: 'w-6 h-6 rounded-none' },
              { id: 'rounded', label: 'Rounded', preview: 'w-6 h-6 rounded-md' },
              { id: 'portrait', label: 'Portrait', preview: 'w-5 h-7 rounded-none' },
              { id: 'portrait_rounded', label: 'Port. Rnd', preview: 'w-5 h-7 rounded-md' },
            ].map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => {
                  updateStyle({ photoShapeType: shape.id as PhotoShapeType });
                  updatePersonalDetails({ photoShape: shape.id as any });
                  activatePhoto();
                }}
                className={`py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  photoShapeType === shape.id ? activeBtnClass : inactiveBtnClass
                }`}
              >
                <div className={`border-2 ${photoShapeType === shape.id ? 'border-lime-400 bg-lime-950/40 shadow-[0_0_8px_rgba(163,230,53,0.3)]' : 'border-zinc-600 bg-zinc-800'} ${shape.preview}`} />
                <span className="text-[10px] font-mono font-semibold leading-none truncate max-w-full">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SECTION HEADINGS CUSTOMIZATION                       */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Heading className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Section Headings
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Divider lines, frames & typographical accents</p>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Heading Style
          </label>
          <div className="grid grid-cols-4 gap-2">
            {/* Style 1: Underline Accent */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'underline_accent' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'underline_accent' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Underline Accent"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'underline_accent' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke="#3f3f46" strokeWidth="1" />
                <line x1="3" y1="12" x2="14" y2="12" stroke={currentSectionHeadingStyle === 'underline_accent' ? '#a3e635' : '#71717a'} strokeWidth="2.5" />
              </svg>
            </button>

            {/* Style 2: Boxed */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'boxed' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'boxed' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Boxed Frame"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="26" height="12" rx="1.5" stroke={currentSectionHeadingStyle === 'boxed' ? '#a3e635' : '#52525b'} strokeWidth="1.5" />
                <rect x="7" y="8" width="18" height="2" rx="0.5" className={currentSectionHeadingStyle === 'boxed' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
            </button>

            {/* Style 3: Double Line */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'double_line' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'double_line' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Double Line"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <line x1="3" y1="4" x2="29" y2="4" stroke={currentSectionHeadingStyle === 'double_line' ? '#a3e635' : '#52525b'} strokeWidth="1" />
                <rect x="3" y="7.5" width="18" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'double_line' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <line x1="3" y1="13.5" x2="29" y2="13.5" stroke={currentSectionHeadingStyle === 'double_line' ? '#a3e635' : '#52525b'} strokeWidth="1" />
              </svg>
            </button>

            {/* Style 4: Overline Underline Centered */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'overline_underline' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'overline_underline' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Overline & Underline Centered"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <line x1="6" y1="4" x2="26" y2="4" stroke={currentSectionHeadingStyle === 'overline_underline' ? '#a3e635' : '#52525b'} strokeWidth="1" />
                <rect x="8" y="7.5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'overline_underline' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <line x1="6" y1="13.5" x2="26" y2="13.5" stroke={currentSectionHeadingStyle === 'overline_underline' ? '#a3e635' : '#52525b'} strokeWidth="1" />
              </svg>
            </button>

            {/* Style 5: Left Accent Bar */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'left_bar' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'left_bar' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Left vertical bar"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="3" height="12" rx="1" className={currentSectionHeadingStyle === 'left_bar' ? 'fill-lime-400' : 'fill-zinc-400'} />
                <rect x="9" y="7.5" width="18" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'left_bar' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
            </button>

            {/* Style 6: Shaded Banner */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'shaded_banner' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'shaded_banner' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Shaded background block"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="26" height="12" rx="2" className={currentSectionHeadingStyle === 'shaded_banner' ? 'fill-lime-950/60' : 'fill-white/[0.08]'} />
                <rect x="8" y="8" width="16" height="2" rx="0.5" className={currentSectionHeadingStyle === 'shaded_banner' ? 'fill-lime-400' : 'fill-zinc-400'} />
              </svg>
            </button>

            {/* Style 7: Full Underline */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'full_underline' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'full_underline' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Full-width underline"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'full_underline' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke={currentSectionHeadingStyle === 'full_underline' ? '#a3e635' : '#52525b'} strokeWidth="1.5" />
              </svg>
            </button>

            {/* Style 8: Dashed / Decorative */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'wavy_dashed' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] cursor-pointer ${
                currentSectionHeadingStyle === 'wavy_dashed' ? activeBtnClass : inactiveBtnClass
              }`}
              title="Dashed / dotted underline"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'wavy_dashed' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke={currentSectionHeadingStyle === 'wavy_dashed' ? '#a3e635' : '#52525b'} strokeWidth="1.5" strokeDasharray="2,2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Capitalization */}
        <div>
          <label className={labelClass}>
            Capitalization
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ sectionCapitalization: 'capitalize' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentCapitalization === 'capitalize' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Capitalize
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionCapitalization: 'uppercase' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentCapitalization === 'uppercase' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Uppercase
            </button>
          </div>
        </div>

        {/* Icons */}
        <div>
          <label className={labelClass}>
            Icons
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'none' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSectionIconStyle === 'none' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              None
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'outline' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSectionIconStyle === 'outline' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Outline
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'filled' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSectionIconStyle === 'filled' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Filled
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. COLORS & ACCENT TARGETS                               */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Palette className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Colors & Accents
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Color themes, swatch palette & target elements</p>
            </div>
          </div>
        </div>

        {/* Theme Placement (Full Page, Header, Border) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Full Page */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'full_page' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              colorThemePlacement === 'full_page' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-10 h-14 rounded-xs border border-lime-500/40 bg-lime-950/30 p-1 flex flex-col justify-start gap-1">
              <div className="w-full h-1 bg-lime-400/80 rounded-2xs mt-1" />
              <div className="w-3/4 h-1 bg-lime-400/50 rounded-2xs" />
              <div className="w-1/2 h-1 bg-lime-400/40 rounded-2xs" />
            </div>
            <span className="text-xs font-mono font-bold">Full Page</span>
          </button>

          {/* Header */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'header' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              colorThemePlacement === 'header' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-10 h-14 rounded-xs border border-white/[0.15] bg-[#090C10] overflow-hidden flex flex-col">
              <div className="w-full h-4 bg-lime-500/50" />
              <div className="p-1 flex flex-col gap-1">
                <div className="w-full h-1 bg-zinc-600 rounded-2xs" />
                <div className="w-2/3 h-1 bg-zinc-600 rounded-2xs" />
              </div>
            </div>
            <span className="text-xs font-mono font-bold">Header</span>
          </button>

          {/* Border */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'border' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              colorThemePlacement === 'border' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-10 h-14 rounded-xs border-2 border-lime-400/70 bg-[#090C10] p-1 flex flex-col gap-1">
              <div className="w-full h-1 bg-zinc-600 rounded-2xs" />
              <div className="w-3/4 h-1 bg-zinc-600 rounded-2xs" />
            </div>
            <span className="text-xs font-mono font-bold">Border</span>
          </button>
        </div>

        {/* Palette Mode (Single, Multi, Image) */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'single' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              colorPaletteMode === 'single' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-12 h-6 bg-[#090C10] rounded-md border border-white/[0.1] flex items-center justify-center text-lime-400">
              <Check className="w-3.5 h-3.5 text-lime-400" />
            </div>
            <span className="text-xs font-mono font-bold">Single</span>
          </button>

          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'multi' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              colorPaletteMode === 'multi' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-12 h-6 border border-white/[0.1] rounded-md flex items-center justify-center gap-1 bg-[#090C10]">
              <span className="text-xs font-bold font-serif text-lime-400">T</span>
              <div className="w-3 h-3 bg-lime-500/50 rounded-xs" />
            </div>
            <span className="text-xs font-mono font-bold">Multi</span>
          </button>

          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'image' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              colorPaletteMode === 'image' ? activeBtnClass : inactiveBtnClass
            }`}
          >
            <div className="w-12 h-6 rounded-md overflow-hidden bg-gradient-to-tr from-teal-700 via-emerald-600 to-lime-400 flex items-center justify-center opacity-85">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-mono font-bold">Image</span>
          </button>
        </div>

        {/* Color Swatch Strip */}
        <div>
          <label className={labelClass}>
            Color Palette
          </label>
          <div className="grid grid-cols-8 gap-2 bg-[#090C10] p-2.5 rounded-xl border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
            {COLOR_PALETTES.map((color) => {
              const isSelected = style.accentColor === color.hex;
              if (color.isNone) {
                return (
                  <button
                    key="none"
                    type="button"
                    onClick={() => updateStyle({ accentColor: '#475569' })}
                    className={`w-7 h-7 rounded-full border border-white/[0.2] bg-zinc-800 relative flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-[#0E1218] scale-110 shadow-[0_0_12px_rgba(163,230,53,0.35)]' : 'hover:scale-105'
                    }`}
                    title="None / Neutral"
                  >
                    <div className="w-full h-0.5 bg-rose-500 rotate-45 transform origin-center" />
                  </button>
                );
              }

              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => updateStyle({ accentColor: color.hex })}
                  style={{ backgroundColor: color.hex }}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                    isSelected ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-[#0E1218] scale-110 shadow-[0_0_12px_rgba(163,230,53,0.35)]' : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  title={color.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
                </button>
              );
            })}

            {/* Custom Rainbow Color Picker */}
            <label 
              className="w-7 h-7 rounded-full cursor-pointer relative flex items-center justify-center transition-all hover:scale-105 overflow-hidden shadow-2xs border border-white/20"
              style={{
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              }}
              title="Custom Color"
            >
              <input
                type="color"
                value={style.accentColor.startsWith('#') ? style.accentColor : '#84cc16'}
                onChange={(e) => updateStyle({ accentColor: e.target.value })}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>

        {/* Apply Accent Color */}
        <div>
          <label className={labelClass}>
            Apply Accent Color
          </label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 bg-[#090C10] p-3 rounded-xl border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
            {[
              { key: 'name' as const, label: 'Name' },
              { key: 'dotsBarsBubbles' as const, label: 'Dots/bars/bubbles' },
              { key: 'jobTitle' as const, label: 'Job title' },
              { key: 'dates' as const, label: 'Dates' },
              { key: 'headings' as const, label: 'Headings' },
              { key: 'entryTitle' as const, label: 'Entry title' },
              { key: 'headingsLine' as const, label: 'Headings line' },
              { key: 'entrySubtitle' as const, label: 'Entry subtitle' },
              { key: 'headerIcons' as const, label: 'Header icons' },
              { key: 'linkIcons' as const, label: 'Link icons' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(accentTargets[key])}
                  onChange={() => toggleAccentTarget(key)}
                  className="w-4 h-4 rounded bg-[#12161E] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
                />
                <span className="text-xs font-mono font-medium text-zinc-300">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. ENTRY LAYOUT                                         */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Layers className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Entry Layout
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Structure, dates, titles & typography hierarchy</p>
            </div>
          </div>
        </div>

        {/* Structure: Full Width vs Columns */}
        <div>
          <label className={labelClass}>
            Structure
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ entryStructure: 'full_width' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                entryStructure === 'full_width' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect x="2" y="2" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="2" y="6" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="2" y="10" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="2" y="14" width="20" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
              <span className="text-xs font-mono font-bold">Full Width</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ entryStructure: 'columns' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                entryStructure === 'columns' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect x="2" y="2" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="18" y="2" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="2" y="6" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="18" y="6" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="2" y="10" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
                <rect x="18" y="10" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-lime-400' : 'fill-zinc-500'} />
              </svg>
              <span className="text-xs font-mono font-bold">Columns</span>
            </button>
          </div>
        </div>

        {/* Date & Location Position */}
        <div>
          <label className={labelClass}>
            Date & Location Position
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ dateLocationPosition: 'right' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                dateLocationPosition === 'right' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Right
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ dateLocationPosition: 'below_title' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                dateLocationPosition === 'below_title' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Below Title
            </button>
          </div>
        </div>

        {/* Entry Header Split */}
        <div>
          <label className={labelClass}>
            Entry Header Split
          </label>
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            <button
              type="button"
              onClick={() => updateStyle({ splitPercent: undefined })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                !style.splitPercent ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Auto
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ splitPercent: 55 })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                Boolean(style.splitPercent) ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Manual
            </button>
          </div>

          {Boolean(style.splitPercent) && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="border border-white/[0.08] rounded-xl p-2.5 flex items-center justify-between bg-[#090C10] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono">Title & Subtitle</div>
                  <div className="text-xs font-mono font-bold text-lime-400">{style.splitPercent || 55}%</div>
                </div>
                <button 
                  type="button"
                  onClick={() => updateStyle({ splitPercent: Math.min(80, (style.splitPercent || 55) + 5) })}
                  className="w-6 h-6 rounded-md bg-[#181D26] border border-white/[0.1] flex items-center justify-center hover:bg-[#222834] text-zinc-300 hover:text-white cursor-pointer"
                  title="Increase Title width"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="border border-white/[0.08] rounded-xl p-2.5 flex items-center justify-between bg-[#090C10] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
                <div>
                  <div className="text-[10px] text-zinc-400 font-mono">Date & Location</div>
                  <div className="text-xs font-mono font-bold text-lime-400">{100 - (style.splitPercent || 55)}%</div>
                </div>
                <button 
                  type="button"
                  onClick={() => updateStyle({ splitPercent: Math.max(20, (style.splitPercent || 55) - 5) })}
                  className="w-6 h-6 rounded-md bg-[#181D26] border border-white/[0.1] flex items-center justify-center hover:bg-[#222834] text-zinc-300 hover:text-white cursor-pointer"
                  title="Decrease Title width"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle Placement */}
        <div>
          <label className={labelClass}>
            Subtitle Placement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ subtitlePlacement: 'same_line' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                subtitlePlacement === 'same_line' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Try Same Line
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ subtitlePlacement: 'below_title' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                subtitlePlacement === 'below_title' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Below Title
            </button>
          </div>
        </div>

        {/* Location Placement */}
        <div>
          <label className={`flex items-center gap-1.5 ${labelClass}`}>
            <span>Location Placement</span>
            <Info className="w-3.5 h-3.5 text-zinc-500" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ locationPlacement: 'same_line' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                locationPlacement === 'same_line' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Try Same Line
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ locationPlacement: 'below_date' })}
              className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                locationPlacement === 'below_date' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              Below Date
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Settings */}
        <div className="pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={() => setShowAdvancedEntryLayout(!showAdvancedEntryLayout)}
            className="w-full flex items-center justify-between text-xs font-mono font-bold text-zinc-300 py-1.5 hover:text-lime-400 transition-colors cursor-pointer"
          >
            <span>ADVANCED ENTRY SETTINGS</span>
            {showAdvancedEntryLayout ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>

          {showAdvancedEntryLayout && (
            <div className="space-y-4 pt-3 bg-[#090C10] p-3.5 rounded-xl border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] mt-2">
              {/* Subtitle Font Style */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Subtitle Style</label>
                <div className="flex gap-2">
                  {[
                    { id: 'regular' as const, label: 'Aa', fontClass: 'font-normal' },
                    { id: 'bold' as const, label: 'Aa', fontClass: 'font-bold' },
                    { id: 'italic' as const, label: 'Aa', fontClass: 'italic' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => updateStyle({ subtitleFontStyle: btn.id })}
                      className={`w-10 h-8 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${
                        subtitleFontStyle === btn.id ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Font Style */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Date Style</label>
                <div className="flex gap-2">
                  {[
                    { id: 'regular' as const, label: 'Aa', fontClass: 'font-normal' },
                    { id: 'bold' as const, label: 'Aa', fontClass: 'font-bold' },
                    { id: 'italic' as const, label: 'Aa', fontClass: 'italic' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => updateStyle({ dateFontStyle: btn.id })}
                      className={`w-10 h-8 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${
                        dateFontStyle === btn.id ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Font Style */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Location Style</label>
                <div className="flex gap-2">
                  {[
                    { id: 'regular' as const, label: 'Aa', fontClass: 'font-normal' },
                    { id: 'bold' as const, label: 'Aa', fontClass: 'font-bold' },
                    { id: 'italic' as const, label: 'Aa', fontClass: 'italic' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => updateStyle({ locationFontStyle: btn.id })}
                      className={`w-10 h-8 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${
                        locationFontStyle === btn.id ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Indentation */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Description Indentation</label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={indentBody}
                    onChange={(e) => updateStyle({ indentBody: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#12161E] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
                  />
                  <span className="text-xs font-mono text-zinc-300">Indent body description</span>
                </label>
              </div>

              {/* List Style: Bullet vs Hyphen */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">List Style</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ listStyle: 'bullet' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      listStyle === 'bullet' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    <span>• Bullet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ listStyle: 'hyphen' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      listStyle === 'hyphen' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    <span>– Hyphen</span>
                  </button>
                </div>
              </div>

              {/* Date & Location Order */}
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Date & Location Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ dateLocationOrder: 'date_location' })}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      dateLocationOrder === 'date_location' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    Date – Location
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ dateLocationOrder: 'location_date' })}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      dateLocationOrder === 'location_date' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    Location – Date
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. SECTION CUSTOMIZATIONS                                */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <button
          type="button"
          onClick={() => setShowSectionCustomizations(!showSectionCustomizations)}
          className="w-full flex items-center justify-between text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Sliders className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-left">
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Section Customizations
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Section-specific layouts, columns & formatting</p>
            </div>
          </div>
          {showSectionCustomizations ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {showSectionCustomizations && (
          <div className="space-y-4 pt-3 border-t border-white/[0.08]">
            {/* Summary Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Summary</h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={displaySummaryInHeader}
                    onChange={(e) => updateStyle({ displaySummaryInHeader: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#12161E] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
                  />
                  <span className="text-xs font-mono text-zinc-300">Display summary as part of header</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showSummaryHeading}
                    onChange={(e) => updateStyle({ showSummaryHeading: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#12161E] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
                  />
                  <span className="text-xs font-mono text-zinc-300">Show summary heading</span>
                </label>
              </div>
            </div>

            {/* Work Experience Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Work Experience</h3>
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Title/Subtitle Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ workExperienceOrder: 'title_subtitle' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      workExperienceOrder === 'title_subtitle' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    Job Title – Employer
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ workExperienceOrder: 'subtitle_title' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      workExperienceOrder === 'subtitle_title' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    Employer – Job Title
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ experienceLayout: fmt })}
                      className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                        experienceLayout === fmt ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {experienceLayout === 'grid' && (
                <div>
                  <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ experienceColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          experienceColumns === cols ? activeBtnClass : inactiveBtnClass
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${experienceColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={groupPromotions}
                    onChange={(e) => updateStyle({ groupPromotions: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#12161E] border-white/[0.15] text-lime-400 focus:ring-lime-500/30 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-lime-400"
                  />
                  <span className="text-xs font-mono text-zinc-300">Group promotions within same employer</span>
                </label>
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Education</h3>
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Title & Subtitle Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ educationOrder: 'title_subtitle' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      educationOrder === 'title_subtitle' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    Degree, School
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ educationOrder: 'subtitle_title' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      educationOrder === 'subtitle_title' ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    School, Degree
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ educationLayout: fmt })}
                      className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                        educationLayout === fmt ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {educationLayout === 'grid' && (
                <div>
                  <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ educationColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          educationColumns === cols ? activeBtnClass : inactiveBtnClass
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${educationColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Projects</h3>
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Format</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['rows', 'grid', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ projectsLayout: fmt })}
                      className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                        projectsLayout === fmt ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {projectsLayout === 'grid' && (
                <div>
                  <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ projectsColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          projectsColumns === cols ? activeBtnClass : inactiveBtnClass
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${projectsColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skills Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Skills</h3>
              <div className="grid grid-cols-5 gap-1">
                {(['grid', 'rows', 'compact', 'bubble', 'level'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ skillsLayout: fmt })}
                    className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                      skillsLayout === fmt ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => updateStyle({ skillsColumns: cols as SectionGridColumns })}
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      skillsColumns === cols ? activeBtnClass : inactiveBtnClass
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${skillsColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificates Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Certificates</h3>
              <div className="grid grid-cols-4 gap-1">
                {(['grid', 'rows', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ certificatesLayout: fmt })}
                    className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                      certificatesLayout === fmt ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => updateStyle({ certificatesColumns: cols as SectionGridColumns })}
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      certificatesColumns === cols ? activeBtnClass : inactiveBtnClass
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${certificatesColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Languages</h3>
              <div className="grid grid-cols-4 gap-1">
                {(['grid', 'rows', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ languagesLayout: fmt })}
                    className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                      languagesLayout === fmt ? activeBtnClass : inactiveBtnClass
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => updateStyle({ languagesColumns: cols as SectionGridColumns })}
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      languagesColumns === cols ? activeBtnClass : inactiveBtnClass
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${languagesColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Sections Card */}
            <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3.5 space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Custom Sections</h3>
              <div>
                <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ customSectionsLayout: fmt })}
                      className={`py-1.5 text-[10px] font-mono font-bold capitalize rounded-lg border transition-all cursor-pointer ${
                        customSectionsLayout === fmt ? activeBtnClass : inactiveBtnClass
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {customSectionsLayout === 'grid' && (
                <div>
                  <label className="block text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ customSectionsColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          customSectionsColumns === cols ? activeBtnClass : inactiveBtnClass
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${customSectionsColumns === cols ? 'bg-lime-400' : 'bg-zinc-600'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 7. TYPOGRAPHY & FONT FAMILY                              */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Type className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Font Family
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Curated typeface system & custom fonts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {getAllAvailableFonts().map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateStyle({ fontFamily: f.id as any })}
              className={`px-3 py-2.5 text-xs text-left rounded-xl border transition-all cursor-pointer ${
                style.fontFamily === f.id
                  ? 'bg-[#181D26] border-lime-500/50 text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.18)] ring-1 ring-lime-500/30'
                  : 'bg-[#090C10] border-white/[0.08] text-zinc-300 hover:border-white/[0.18] hover:bg-[#141822]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold truncate">{f.name}</span>
                {f.isCustom && (
                  <span className="text-[9px] font-mono uppercase bg-lime-950/60 text-lime-400 border border-lime-500/30 px-1.5 py-0.5 rounded shrink-0">
                    Custom
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{f.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 8. SPACING & GEOMETRY                                    */}
      {/* ======================================================== */}
      <div className={cardClass}>
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 text-lime-400">
              <Sliders className="w-4 h-4 text-lime-400" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
                Spacing & Geometry
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">Font size scale, leading & document padding</p>
            </div>
          </div>
        </div>

        {/* Font Size & Line Height */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Base Font</span>
              <span className="text-[11px] font-mono font-bold text-lime-400 bg-lime-950/40 px-2 py-0.5 rounded border border-lime-500/30">{style.fontSize}pt</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="11.5"
              step="0.5"
              value={style.fontSize}
              onChange={(e) => updateStyle({ fontSize: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#181D26] rounded-lg cursor-pointer accent-lime-400 border border-white/[0.08]"
            />
          </div>

          <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Line Height</span>
              <span className="text-[11px] font-mono font-bold text-lime-400 bg-lime-950/40 px-2 py-0.5 rounded border border-lime-500/30">{style.lineHeight}</span>
            </div>
            <input
              type="range"
              min="1.25"
              max="1.6"
              step="0.05"
              value={style.lineHeight}
              onChange={(e) => updateStyle({ lineHeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-[#181D26] rounded-lg cursor-pointer accent-lime-400 border border-white/[0.08]"
            />
          </div>
        </div>

        {/* Page Margins */}
        <div className="bg-[#090C10] border border-white/[0.08] rounded-xl p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Page Margins</span>
            <span className="text-[11px] font-mono font-bold text-lime-400 bg-lime-950/40 px-2 py-0.5 rounded border border-lime-500/30">{style.marginMm}mm</span>
          </div>
          <input
            type="range"
            min="8"
            max="24"
            step="1"
            value={style.marginMm}
            onChange={(e) => updateStyle({ marginMm: parseInt(e.target.value, 10) })}
            className="w-full h-1.5 bg-[#181D26] rounded-lg cursor-pointer accent-lime-400 border border-white/[0.08]"
          />
        </div>
      </div>
    </div>
  );
};
