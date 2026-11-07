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
  Image as ImageIcon
} from 'lucide-react';

export const StyleControls: React.FC = () => {
  const { currentResume, updateStyle, setTemplate, updatePersonalDetails } = useResumeStore();
  const [showAdvancedHeader, setShowAdvancedHeader] = useState(false);
  const [showAdvancedEntryLayout, setShowAdvancedEntryLayout] = useState(false);
  const [showSectionCustomizations, setShowSectionCustomizations] = useState(true);
  const [splitPercent, setSplitPercent] = useState(55);

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

  // Photo settings (Image 4)
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

  // Color & Accent settings (Image 3)
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

  // Entry Layout settings (Image 1)
  const entryStructure: EntryStructure = style.entryStructure || 'full_width';
  const dateLocationPosition: DateLocationPosition = style.dateLocationPosition || 'right';
  const [headerSplitMode, setHeaderSplitMode] = useState<'auto' | 'manual'>('auto');
  const subtitlePlacement: SubtitlePlacement = style.subtitlePlacement || 'below_title';
  const locationPlacement: LocationPlacement = style.locationPlacement || 'same_line';
  const subtitleFontStyle: FontStyleVariant = style.subtitleFontStyle || 'italic';
  const dateFontStyle: FontStyleVariant = style.dateFontStyle || 'regular';
  const locationFontStyle: FontStyleVariant = style.locationFontStyle || 'regular';
  const indentBody = style.indentBody || false;
  const listStyle: EntryListStyle = style.listStyle || 'bullet';
  const dateLocationOrder: DateLocationOrder = style.dateLocationOrder || 'date_location';

  // Section Customizations settings (Images 2 & 5)
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
  const languagesSeparator: InlineSeparator = style.languagesSeparator || 'bullet';
  const customSectionsLayout: SectionItemLayout = style.customSectionsLayout || 'rows';
  const customSectionsColumns: SectionGridColumns = style.customSectionsColumns || 1;

  const headingStylesList: { id: SectionHeadingStyle; label: string }[] = [
    { id: 'underline_accent', label: 'Underline Accent' },
    { id: 'boxed', label: 'Boxed Frame' },
    { id: 'double_line', label: 'Double Line' },
    { id: 'overline_underline', label: 'Overline & Underline' },
    { id: 'left_bar', label: 'Left Accent Bar' },
    { id: 'shaded_banner', label: 'Shaded Banner' },
    { id: 'full_underline', label: 'Full Underline' },
    { id: 'wavy_dashed', label: 'Dashed Underline' },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* ======================================================== */}
      {/* 1. FLOWCV HEADER CUSTOMIZATION                           */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Header
        </h2>

        {/* Text Alignment */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Text Alignment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Left Alignment */}
            <button
              type="button"
              onClick={() => updateStyle({ headerAlignment: 'left' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                currentHeaderAlignment === 'left'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect 
                  x="2" y="3" width="22" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'left' ? 'fill-indigo-600' : 'fill-slate-400'} 
                />
                <rect 
                  x="2" y="9" width="14" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'left' ? 'fill-indigo-600' : 'fill-slate-400'} 
                />
              </svg>
              <span className="text-xs font-semibold">Left</span>
            </button>

            {/* Center Alignment */}
            <button
              type="button"
              onClick={() => updateStyle({ headerAlignment: 'center' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                currentHeaderAlignment === 'center'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect 
                  x="5" y="3" width="22" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'center' ? 'fill-indigo-600' : 'fill-slate-400'} 
                />
                <rect 
                  x="9" y="9" width="14" height="3" rx="1.5" 
                  className={currentHeaderAlignment === 'center' ? 'fill-indigo-600' : 'fill-slate-400'} 
                />
              </svg>
              <span className="text-xs font-semibold">Center</span>
            </button>
          </div>
        </div>

        {/* Details Arrangement */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Details Arrangement
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            {/* Wrap Mode */}
            <button
              type="button"
              onClick={() => updateStyle({ headerDetailsLayout: 'wrap' })}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center transition-all ${
                currentDetailsLayout === 'wrap'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Flow / Wrap inline"
            >
              <svg className="w-8 h-4" viewBox="0 0 28 14" fill="none">
                <rect x="1" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="10" y="2" width="10" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="22" y="2" width="5" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="1" y="8" width="12" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="15" y="8" width="8" height="3" rx="1" className={currentDetailsLayout === 'wrap' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
            </button>

            {/* Column Mode */}
            <button
              type="button"
              onClick={() => updateStyle({ headerDetailsLayout: 'columns' })}
              className={`py-3 px-4 rounded-xl border flex items-center justify-center transition-all ${
                currentDetailsLayout === 'columns'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Multi-column grid"
            >
              <svg className="w-8 h-4" viewBox="0 0 28 14" fill="none">
                <rect x="1" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="10" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="19" y="2" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="1" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="10" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="19" y="8" width="7" height="3" rx="1" className={currentDetailsLayout === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
            </button>
          </div>

          {/* Separator row: Icon / Bullet / Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'icon', showSectionIcons: true })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                currentSeparator === 'icon'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Icon</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'bullet' })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                currentSeparator === 'bullet'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-slate-400 font-bold">•</span>
              <span>Bullet</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ headerSeparator: 'bar' })}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                currentSeparator === 'bar'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className="text-slate-400 font-light">|</span>
              <span>Bar</span>
            </button>
          </div>
        </div>

        {/* Icon Style */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Icon Style
          </label>
          <div className="grid grid-cols-7 gap-1.5">
            {[
              { id: 'plain', iconClass: 'text-indigo-600', containerClass: 'bg-indigo-50 border-indigo-500' },
              { id: 'circle_filled', iconClass: 'text-white', containerClass: 'rounded-full bg-slate-400' },
              { id: 'square_filled', iconClass: 'text-white', containerClass: 'rounded-xs bg-slate-400' },
              { id: 'dark_square', iconClass: 'text-white', containerClass: 'rounded-xs bg-slate-600' },
              { id: 'circle_outline', iconClass: 'text-slate-500', containerClass: 'rounded-full border border-slate-300' },
              { id: 'square_outline', iconClass: 'text-slate-500', containerClass: 'rounded-xs border border-slate-300' },
              { id: 'minimal_border', iconClass: 'text-slate-500', containerClass: 'border border-slate-400' },
            ].map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => updateStyle({ headerIconStyle: variant.id as HeaderIconStyle })}
                className={`h-9 rounded-xl border flex items-center justify-center transition-all ${
                  currentIconStyle === variant.id
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/60 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
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
      {/* 2. FLOWCV PHOTO CUSTOMIZATION (Image 4)                  */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-600" />
            Photo
          </h2>
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
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800">Show</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={photoGrayscale}
              onChange={(e) => {
                updateStyle({ photoGrayscale: e.target.checked });
                activatePhoto();
              }}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800">Grayscale</span>
          </label>
        </div>

        {/* Photo Position (Left, Top, Right) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
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
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                photoPosition === 'left'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <circle cx="6" cy="10" r="4.5" className={photoPosition === 'left' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="14" y="5" width="18" height="2.5" rx="1" className={photoPosition === 'left' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="14" y="9.5" width="14" height="2" rx="1" className={photoPosition === 'left' ? 'fill-indigo-400' : 'fill-slate-300'} />
                <rect x="14" y="13.5" width="10" height="2" rx="1" className={photoPosition === 'left' ? 'fill-indigo-400' : 'fill-slate-300'} />
              </svg>
              <span className="text-xs font-semibold">Left</span>
            </button>

            {/* Top */}
            <button
              type="button"
              onClick={() => {
                updateStyle({ photoPosition: 'top' });
                activatePhoto();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                photoPosition === 'top'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <circle cx="18" cy="5.5" r="4" className={photoPosition === 'top' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="9" y="12" width="18" height="2.5" rx="1" className={photoPosition === 'top' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="11" y="16" width="14" height="2" rx="1" className={photoPosition === 'top' ? 'fill-indigo-400' : 'fill-slate-300'} />
              </svg>
              <span className="text-xs font-semibold">Top</span>
            </button>

            {/* Right */}
            <button
              type="button"
              onClick={() => {
                updateStyle({ photoPosition: 'right' });
                activatePhoto();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                photoPosition === 'right'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <svg className="w-12 h-7" viewBox="0 0 36 20" fill="none">
                <rect x="4" y="5" width="18" height="2.5" rx="1" className={photoPosition === 'right' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="4" y="9.5" width="14" height="2" rx="1" className={photoPosition === 'right' ? 'fill-indigo-400' : 'fill-slate-300'} />
                <rect x="4" y="13.5" width="10" height="2" rx="1" className={photoPosition === 'right' ? 'fill-indigo-400' : 'fill-slate-300'} />
                <circle cx="30" cy="10" r="4.5" className={photoPosition === 'right' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
              <span className="text-xs font-semibold">Right</span>
            </button>
          </div>
        </div>

        {/* Size (XS, S, M, L, XL) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Size
          </label>
          <div className="grid grid-cols-5 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            {(['xs', 's', 'm', 'l', 'xl'] as PhotoSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  updateStyle({ photoSize: sz });
                  activatePhoto();
                }}
                className={`py-1.5 text-xs font-bold uppercase rounded-lg transition-all ${
                  photoSize === sz
                    ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Shape (Circle, Square, Rounded Square, Portrait, Portrait Rounded) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
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
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  photoShapeType === shape.id
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`border-2 ${photoShapeType === shape.id ? 'border-indigo-600 bg-indigo-200/60' : 'border-slate-400 bg-slate-100'} ${shape.preview}`} />
                <span className="text-[10px] font-medium leading-none truncate max-w-full">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FLOWCV SECTION HEADINGS CUSTOMIZATION                 */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Section Headings
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Heading Style
          </label>
          <div className="grid grid-cols-4 gap-2">
            {/* Style 1: Underline Accent */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'underline_accent' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'underline_accent'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Underline Accent"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'underline_accent' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="3" y1="12" x2="14" y2="12" stroke={currentSectionHeadingStyle === 'underline_accent' ? '#4f46e5' : '#64748b'} strokeWidth="2.5" />
              </svg>
            </button>

            {/* Style 2: Boxed */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'boxed' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'boxed'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Boxed Frame"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="26" height="12" rx="1.5" stroke={currentSectionHeadingStyle === 'boxed' ? '#4f46e5' : '#94a3b8'} strokeWidth="1.5" />
                <rect x="7" y="8" width="18" height="2" rx="0.5" className={currentSectionHeadingStyle === 'boxed' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
            </button>

            {/* Style 3: Double Line */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'double_line' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'double_line'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Double Line"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <line x1="3" y1="4" x2="29" y2="4" stroke={currentSectionHeadingStyle === 'double_line' ? '#4f46e5' : '#94a3b8'} strokeWidth="1" />
                <rect x="3" y="7.5" width="18" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'double_line' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <line x1="3" y1="13.5" x2="29" y2="13.5" stroke={currentSectionHeadingStyle === 'double_line' ? '#4f46e5' : '#94a3b8'} strokeWidth="1" />
              </svg>
            </button>

            {/* Style 4: Overline Underline Centered */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'overline_underline' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'overline_underline'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Overline & Underline Centered"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <line x1="6" y1="4" x2="26" y2="4" stroke={currentSectionHeadingStyle === 'overline_underline' ? '#4f46e5' : '#94a3b8'} strokeWidth="1" />
                <rect x="8" y="7.5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'overline_underline' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <line x1="6" y1="13.5" x2="26" y2="13.5" stroke={currentSectionHeadingStyle === 'overline_underline' ? '#4f46e5' : '#94a3b8'} strokeWidth="1" />
              </svg>
            </button>

            {/* Style 5: Left Accent Bar */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'left_bar' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'left_bar'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Left vertical bar"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="3" height="12" rx="1" className={currentSectionHeadingStyle === 'left_bar' ? 'fill-indigo-600' : 'fill-slate-500'} />
                <rect x="9" y="7.5" width="18" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'left_bar' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
            </button>

            {/* Style 6: Shaded Banner */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'shaded_banner' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'shaded_banner'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Shaded background block"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="3" width="26" height="12" rx="2" className={currentSectionHeadingStyle === 'shaded_banner' ? 'fill-indigo-100' : 'fill-slate-200'} />
                <rect x="8" y="8" width="16" height="2" rx="0.5" className={currentSectionHeadingStyle === 'shaded_banner' ? 'fill-indigo-600' : 'fill-slate-500'} />
              </svg>
            </button>

            {/* Style 7: Full Underline */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'full_underline' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'full_underline'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Full-width underline"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'full_underline' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke={currentSectionHeadingStyle === 'full_underline' ? '#4f46e5' : '#94a3b8'} strokeWidth="1.5" />
              </svg>
            </button>

            {/* Style 8: Dashed / Decorative */}
            <button
              type="button"
              onClick={() => updateStyle({ sectionHeadingStyle: 'wavy_dashed' })}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all aspect-[4/3] ${
                currentSectionHeadingStyle === 'wavy_dashed'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              title="Dashed / dotted underline"
            >
              <svg className="w-10 h-6" viewBox="0 0 32 18" fill="none">
                <rect x="3" y="5" width="16" height="2.5" rx="0.5" className={currentSectionHeadingStyle === 'wavy_dashed' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <line x1="3" y1="12" x2="29" y2="12" stroke={currentSectionHeadingStyle === 'wavy_dashed' ? '#4f46e5' : '#94a3b8'} strokeWidth="1.5" strokeDasharray="2,2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Capitalization */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Capitalization
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ sectionCapitalization: 'capitalize' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                currentCapitalization === 'capitalize'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Capitalize
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionCapitalization: 'uppercase' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                currentCapitalization === 'uppercase'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Uppercase
            </button>
          </div>
        </div>

        {/* Icons */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Icons
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'none' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                currentSectionIconStyle === 'none'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              None
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'outline' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                currentSectionIconStyle === 'outline'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Outline
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ sectionIconStyle: 'filled' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                currentSectionIconStyle === 'filled'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Filled
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FLOWCV COLORS & ACCENT TARGETS (Image 3)              */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          Colors
        </h2>

        {/* Theme Placement (Full Page, Header, Border) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Full Page */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'full_page' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
              colorThemePlacement === 'full_page'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-14 rounded-xs border border-indigo-400 bg-indigo-100/60 p-1 flex flex-col justify-start gap-1">
              <div className="w-full h-1.5 bg-indigo-400 rounded-2xs" />
              <div className="w-3/4 h-1 bg-indigo-300 rounded-2xs" />
            </div>
            <span className="text-xs font-semibold">Full Page</span>
          </button>

          {/* Header */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'header' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
              colorThemePlacement === 'header'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-14 rounded-xs border border-slate-300 bg-white overflow-hidden flex flex-col">
              <div className="w-full h-4 bg-slate-400" />
              <div className="p-1 flex flex-col gap-1">
                <div className="w-full h-1 bg-slate-200 rounded-2xs" />
                <div className="w-2/3 h-1 bg-slate-200 rounded-2xs" />
              </div>
            </div>
            <span className="text-xs font-semibold">Header</span>
          </button>

          {/* Border */}
          <button
            type="button"
            onClick={() => updateStyle({ colorThemePlacement: 'border' })}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
              colorThemePlacement === 'border'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-14 rounded-xs border-[3px] border-slate-400 bg-white p-1 flex flex-col gap-1">
              <div className="w-full h-1 bg-slate-200 rounded-2xs" />
              <div className="w-3/4 h-1 bg-slate-200 rounded-2xs" />
            </div>
            <span className="text-xs font-semibold">Border</span>
          </button>
        </div>

        {/* Palette Mode (Single, Multi, Image) */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'single' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              colorPaletteMode === 'single'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold">Single</span>
          </button>

          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'multi' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              colorPaletteMode === 'multi'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-6 border border-slate-300 rounded-md flex items-center justify-center gap-1 bg-white">
              <span className="text-xs font-bold font-serif text-slate-800">T</span>
              <div className="w-3 h-3 bg-slate-400 rounded-xs" />
            </div>
            <span className="text-xs font-semibold">Multi</span>
          </button>

          <button
            type="button"
            onClick={() => updateStyle({ colorPaletteMode: 'image' })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              colorPaletteMode === 'image'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-6 rounded-md overflow-hidden bg-gradient-to-tr from-teal-700 via-emerald-600 to-sky-400 flex items-center justify-center opacity-85">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold">Image</span>
          </button>
        </div>

        {/* Color Swatch Strip (FlowCV Grid with Diagonal Slash and Native Color Wheel) */}
        <div>
          <div className="grid grid-cols-8 gap-2">
            {COLOR_PALETTES.map((color) => {
              const isSelected = style.accentColor === color.hex;
              if (color.isNone) {
                return (
                  <button
                    key="none"
                    type="button"
                    onClick={() => updateStyle({ accentColor: '#475569' })}
                    className={`w-7 h-7 rounded-full border-2 border-slate-300 bg-white relative flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                    title="None / Neutral"
                  >
                    <div className="w-full h-0.5 bg-red-500 rotate-45 transform origin-center" />
                  </button>
                );
              }

              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => updateStyle({ accentColor: color.hex })}
                  style={{ backgroundColor: color.hex }}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 scale-110 shadow-xs' : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  title={color.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}

            {/* Custom Rainbow Color Picker */}
            <label 
              className="w-7 h-7 rounded-full cursor-pointer relative flex items-center justify-center transition-all hover:scale-105 overflow-hidden shadow-2xs border border-slate-200"
              style={{
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              }}
              title="Custom Color"
            >
              <input
                type="color"
                value={style.accentColor.startsWith('#') ? style.accentColor : '#1e40af'}
                onChange={(e) => updateStyle({ accentColor: e.target.value })}
                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>

        {/* Apply Accent Color (2 columns of FlowCV checkboxes) */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-3">
            Apply Accent Color
          </label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
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
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(accentTargets[key])}
                  onChange={() => toggleAccentTarget(key)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. FLOWCV ENTRY LAYOUT (Image 1)                         */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          Entry Layout
        </h2>

        {/* Structure: Full Width vs Columns */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Structure
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ entryStructure: 'full_width' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                entryStructure === 'full_width'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect x="2" y="2" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="2" y="6" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="2" y="10" width="28" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="2" y="14" width="20" height="2" rx="1" className={entryStructure === 'full_width' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
              <span className="text-xs font-semibold">Full Width</span>
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ entryStructure: 'columns' })}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                entryStructure === 'columns'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <svg className="w-10 h-6" viewBox="0 0 32 16" fill="none">
                <rect x="2" y="2" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="18" y="2" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="2" y="6" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="18" y="6" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="2" y="10" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
                <rect x="18" y="10" width="12" height="2" rx="1" className={entryStructure === 'columns' ? 'fill-indigo-600' : 'fill-slate-400'} />
              </svg>
              <span className="text-xs font-semibold">Columns</span>
            </button>
          </div>
        </div>

        {/* Date & Location Position */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Date & Location Position
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ dateLocationPosition: 'right' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                dateLocationPosition === 'right'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Right
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ dateLocationPosition: 'below_title' })}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                dateLocationPosition === 'below_title'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Below Title
            </button>
          </div>
        </div>

        {/* Entry Header Split */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Entry Header Split
          </label>
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            <button
              type="button"
              onClick={() => updateStyle({ splitPercent: undefined })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                !style.splitPercent
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Auto
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ splitPercent: 55 })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                Boolean(style.splitPercent)
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Manual
            </button>
          </div>

          {Boolean(style.splitPercent) && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="border border-slate-200 rounded-xl p-2.5 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Title & Subtitle</div>
                  <div className="text-xs font-bold text-slate-800">{style.splitPercent || 55}%</div>
                </div>
                <button 
                  type="button"
                  onClick={() => updateStyle({ splitPercent: Math.min(80, (style.splitPercent || 55) + 5) })}
                  className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  title="Increase Title width"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-2.5 flex items-center justify-between bg-slate-50">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Date & Location</div>
                  <div className="text-xs font-bold text-slate-800">{100 - (style.splitPercent || 55)}%</div>
                </div>
                <button 
                  type="button"
                  onClick={() => updateStyle({ splitPercent: Math.max(20, (style.splitPercent || 55) - 5) })}
                  className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                  title="Decrease Title width"
                >
                  <Minus className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Subtitle Placement */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Subtitle Placement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ subtitlePlacement: 'same_line' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                subtitlePlacement === 'same_line'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Try Same Line
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ subtitlePlacement: 'below_title' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                subtitlePlacement === 'below_title'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Below Title
            </button>
          </div>
        </div>

        {/* Location Placement */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
            <span>Location Placement</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateStyle({ locationPlacement: 'same_line' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                locationPlacement === 'same_line'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Try Same Line
            </button>

            <button
              type="button"
              onClick={() => updateStyle({ locationPlacement: 'below_date' })}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                locationPlacement === 'below_date'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              Below Date
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Settings */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvancedEntryLayout(!showAdvancedEntryLayout)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 py-1.5 hover:text-indigo-600 transition-colors"
          >
            <span>Advanced settings</span>
            {showAdvancedEntryLayout ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAdvancedEntryLayout && (
            <div className="space-y-4 pt-3">
              {/* Subtitle Font Style */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Subtitle</label>
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
                      className={`w-9 h-8 rounded-lg border text-xs flex items-center justify-center transition-all ${
                        subtitleFontStyle === btn.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Font Style */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Date</label>
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
                      className={`w-9 h-8 rounded-lg border text-xs flex items-center justify-center transition-all ${
                        dateFontStyle === btn.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Font Style */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Location</label>
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
                      className={`w-9 h-8 rounded-lg border text-xs flex items-center justify-center transition-all ${
                        locationFontStyle === btn.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={btn.fontClass}>{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Indentation */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Description Indentation</label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={indentBody}
                    onChange={(e) => updateStyle({ indentBody: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800">Indent body</span>
                </label>
              </div>

              {/* List Style: Bullet vs Hyphen */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">List Style</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ listStyle: 'bullet' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      listStyle === 'bullet'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>• Bullet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ listStyle: 'hyphen' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      listStyle === 'hyphen'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>– Hyphen</span>
                  </button>
                </div>
              </div>

              {/* Date & Location Order */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Date & Location Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ dateLocationOrder: 'date_location' })}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold transition-all ${
                      dateLocationOrder === 'date_location'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Date – Location
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ dateLocationOrder: 'location_date' })}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold transition-all ${
                      dateLocationOrder === 'location_date'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
      {/* 6. FLOWCV SECTION CUSTOMIZATIONS (Images 2 & 5)           */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowSectionCustomizations(!showSectionCustomizations)}
          className="w-full flex items-center justify-between text-base font-extrabold text-slate-900 tracking-tight"
        >
          <span>Section Customizations</span>
          {showSectionCustomizations ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showSectionCustomizations && (
          <div className="space-y-4 pt-1">
            {/* Summary Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900">Summary</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={displaySummaryInHeader}
                    onChange={(e) => updateStyle({ displaySummaryInHeader: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700">Display summary as part of header</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showSummaryHeading}
                    onChange={(e) => updateStyle({ showSummaryHeading: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700">Show summary heading</span>
                </label>
              </div>
            </div>

            {/* Work Experience Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Work Experience</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Title/Subtitle Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ workExperienceOrder: 'title_subtitle' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all ${
                      workExperienceOrder === 'title_subtitle'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Job Title – Employer
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ workExperienceOrder: 'subtitle_title' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all ${
                      workExperienceOrder === 'subtitle_title'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Employer – Job Title
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ experienceLayout: fmt })}
                      className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                        experienceLayout === fmt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {experienceLayout === 'grid' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ experienceColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          experienceColumns === cols
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${experienceColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Employment History</label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={groupPromotions}
                    onChange={(e) => updateStyle({ groupPromotions: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700">Group promotions</span>
                </label>
              </div>
            </div>

            {/* Education Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Education</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Title & Subtitle Order</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateStyle({ educationOrder: 'title_subtitle' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all ${
                      educationOrder === 'title_subtitle'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Degree, School
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStyle({ educationOrder: 'subtitle_title' })}
                    className={`py-2 px-2 rounded-lg border text-[11px] font-semibold transition-all ${
                      educationOrder === 'subtitle_title'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    School, Degree
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ educationLayout: fmt })}
                      className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                        educationLayout === fmt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {educationLayout === 'grid' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ educationColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          educationColumns === cols
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${educationColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Projects</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Format</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['rows', 'grid', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ projectsLayout: fmt })}
                      className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                        projectsLayout === fmt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {projectsLayout === 'grid' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ projectsColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          projectsColumns === cols
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${projectsColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                          />
                        ))}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skills Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Skills</h3>
              {/* Formats: Grid, Rows, Compact, Bubble, Level */}
              <div className="grid grid-cols-5 gap-1">
                {(['grid', 'rows', 'compact', 'bubble', 'level'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ skillsLayout: fmt })}
                    className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                      skillsLayout === fmt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              {/* Columns: 1, 2, 3, 4 bars */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => updateStyle({ skillsColumns: cols as SectionGridColumns })}
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      skillsColumns === cols
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${skillsColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificates Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Certificates</h3>
              <div className="grid grid-cols-4 gap-1">
                {(['grid', 'rows', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ certificatesLayout: fmt })}
                    className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                      certificatesLayout === fmt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      certificatesColumns === cols
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${certificatesColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Languages</h3>
              <div className="grid grid-cols-4 gap-1">
                {(['grid', 'rows', 'compact', 'bubble'] as SectionItemLayout[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => updateStyle({ languagesLayout: fmt })}
                    className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                      languagesLayout === fmt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
                    className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                      languagesColumns === cols
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    title={`${cols} column${cols > 1 ? 's' : ''}`}
                  >
                    {Array.from({ length: cols }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-3.5 rounded-xs ${languagesColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Sections Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Custom Sections</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Format</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['rows', 'grid', 'compact'] as SectionItemLayout[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => updateStyle({ customSectionsLayout: fmt })}
                      className={`py-1.5 text-[10px] font-bold capitalize rounded-lg border transition-all ${
                        customSectionsLayout === fmt
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {customSectionsLayout === 'grid' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">Columns</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyle({ customSectionsColumns: cols as SectionGridColumns })}
                        className={`py-2 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                          customSectionsColumns === cols
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={`${cols} column${cols > 1 ? 's' : ''}`}
                      >
                        {Array.from({ length: cols }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-3.5 rounded-xs ${customSectionsColumns === cols ? 'bg-indigo-600' : 'bg-slate-400'}`} 
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-600" />
          Font Family
        </label>
        <div className="grid grid-cols-2 gap-2">
          {getAllAvailableFonts().map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => updateStyle({ fontFamily: f.id as any })}
              className={`px-3 py-2 text-xs text-left rounded-lg border transition-all ${
                style.fontFamily === f.id
                  ? 'bg-indigo-50/70 border-indigo-500 text-indigo-700 font-semibold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{f.name}</span>
                {f.isCustom && (
                  <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded shrink-0">
                    Custom
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400">{f.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 8. SPACING & GEOMETRY                                    */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Spacing & Geometry</span>
        </div>

        {/* Font Size & Line Height */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-medium text-slate-600">Base Font</span>
              <span className="text-[11px] font-bold text-slate-800 font-mono">{style.fontSize}pt</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="11.5"
              step="0.5"
              value={style.fontSize}
              onChange={(e) => updateStyle({ fontSize: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-medium text-slate-600">Line Height</span>
              <span className="text-[11px] font-bold text-slate-800 font-mono">{style.lineHeight}</span>
            </div>
            <input
              type="range"
              min="1.25"
              max="1.6"
              step="0.05"
              value={style.lineHeight}
              onChange={(e) => updateStyle({ lineHeight: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Page Margins */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-medium text-slate-600">Page Margins</span>
            <span className="text-[11px] font-bold text-slate-800 font-mono">{style.marginMm}mm</span>
          </div>
          <input
            type="range"
            min="8"
            max="24"
            step="1"
            value={style.marginMm}
            onChange={(e) => updateStyle({ marginMm: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
