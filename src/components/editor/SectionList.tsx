import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { SectionMeta } from '../../types/resume';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Languages as LangIcon, 
  Plus, 
  Layers 
} from 'lucide-react';

import { PersonalDetailsForm } from './PersonalDetailsForm';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import { LanguagesSection } from './LanguagesSection';
import { CustomSectionEditor } from './CustomSection';

interface SectionCardProps {
  meta: SectionMeta;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleEnabled: () => void;
}

const getSectionIcon = (type: string) => {
  switch (type) {
    case 'personal': return <User className="w-4 h-4 text-lime-400" />;
    case 'summary': return <FileText className="w-4 h-4 text-lime-400" />;
    case 'experience': return <Briefcase className="w-4 h-4 text-lime-400" />;
    case 'education': return <GraduationCap className="w-4 h-4 text-lime-400" />;
    case 'skills': return <Wrench className="w-4 h-4 text-lime-400" />;
    case 'projects': return <FolderGit2 className="w-4 h-4 text-lime-400" />;
    case 'certifications': return <Award className="w-4 h-4 text-lime-400" />;
    case 'languages': return <LangIcon className="w-4 h-4 text-lime-400" />;
    default: return <Layers className="w-4 h-4 text-lime-400" />;
  }
};

const SortableSectionCard: React.FC<SectionCardProps> = ({ meta, isOpen, onToggleOpen, onToggleEnabled }) => {
  const { currentResume } = useResumeStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meta.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (!currentResume) return null;

  const getSectionSummary = () => {
    switch (meta.type) {
      case 'personal':
      case 'summary':
        return currentResume.content.personal.fullName 
          ? `${currentResume.content.personal.fullName} • ${currentResume.content.personal.jobTitle || 'Details'}`
          : 'Identity & Summary';
      case 'experience':
        return `${currentResume.content.experience.length} ${currentResume.content.experience.length === 1 ? 'position' : 'positions'}`;
      case 'education':
        return `${currentResume.content.education.length} ${currentResume.content.education.length === 1 ? 'school' : 'schools'}`;
      case 'skills':
        return `${currentResume.content.skills.length} skills`;
      case 'projects':
        return `${currentResume.content.projects.length} projects`;
      case 'certifications':
        return `${currentResume.content.certifications.length} credentials`;
      case 'languages':
        return `${currentResume.content.languages.length} languages`;
      case 'custom': {
        const sec = currentResume.content.customSections.find((s) => s.id === meta.id);
        return sec ? `${sec.items.length} entries` : '';
      }
      default:
        return '';
    }
  };

  const renderSectionContent = () => {
    switch (meta.type) {
      case 'personal':
      case 'summary':
        return <PersonalDetailsForm />;
      case 'experience':
        return <ExperienceSection />;
      case 'education':
        return <EducationSection />;
      case 'skills':
        return <SkillsSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'certifications':
        return <CertificationsSection />;
      case 'languages':
        return <LanguagesSection />;
      case 'custom': {
        const customSec = currentResume.content.customSections.find((s) => s.id === meta.id);
        return customSec ? <CustomSectionEditor section={customSec} /> : null;
      }
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-2xl transition-all duration-150 overflow-hidden ${
        isOpen
          ? 'bg-[#12161E] border-lime-500/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]'
          : meta.enabled 
            ? 'bg-[#12161E]/80 border-white/[0.08] hover:border-white/[0.16] hover:bg-[#12161E]' 
            : 'bg-[#090C10] border-white/[0.04] opacity-50'
      }`}
    >
      {/* Section Header Strip */}
      <div className="flex items-center justify-between p-3 select-none">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-300 rounded touch-none"
            title="Drag to reorder section"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0" onClick={onToggleOpen}>
            <div className={`w-8 h-8 rounded-xl bg-white/[0.05] backdrop-blur-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 transition-all ${
              isOpen 
                ? 'border-lime-500/40 text-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.2)]' 
                : 'border-white/[0.12] text-zinc-400'
            }`}>
              {getSectionIcon(meta.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-100">
                  {meta.title}
                </span>
                {!meta.enabled && (
                  <span className="text-[9px] uppercase font-mono font-bold text-zinc-500 bg-[#090B0E] px-1.5 py-0.5 rounded border border-white/[0.06]">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate">
                {getSectionSummary()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button
            type="button"
            onClick={onToggleEnabled}
            className={`w-7 h-7 rounded-lg bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-xs transition-colors ${
              meta.enabled ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-lime-400'
            }`}
            title={meta.enabled ? 'Hide section from resume' : 'Show section'}
          >
            {meta.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onToggleOpen}
            className={`w-7 h-7 rounded-lg bg-white/[0.04] backdrop-blur-sm border flex items-center justify-center transition-colors ${
              isOpen ? 'text-lime-400 border-lime-500/40 bg-lime-950/30' : 'text-zinc-400 border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Section Form */}
      {isOpen && (
        <div className="p-4 pt-3 border-t border-white/[0.08] bg-[#0E1218]/50 animate-in fade-in duration-100">
          {renderSectionContent()}
        </div>
      )}
    </div>
  );
};

export const SectionList: React.FC = () => {
  const { currentResume, updateSectionOrder, addCustomSection } = useResumeStore();
  // By default, open only the personal details section so user isn't overwhelmed!
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'sec-personal': true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentResume) return null;
  const sections = currentResume.content.sectionOrder;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      updateSectionOrder(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleEnabled = (id: string) => {
    const newOrder = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    updateSectionOrder(newOrder);
  };

  const handleAddCustom = (presetTitle?: string) => {
    const newId = addCustomSection(presetTitle || 'Custom Section');
    if (newId) {
      setOpenSections((prev) => ({ ...prev, [newId]: true }));
    }
  };

  return (
    <div className="space-y-3 pb-16">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {sections.map((meta) => {
              if (meta.type === 'summary') return null; // combined seamlessly inside personal details
              return (
                <SortableSectionCard
                  key={meta.id}
                  meta={meta}
                  isOpen={openSections[meta.id] ?? false}
                  onToggleOpen={() => toggleSection(meta.id)}
                  onToggleEnabled={() => toggleEnabled(meta.id)}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-2 space-y-2">
        <button
          type="button"
          onClick={() => handleAddCustom()}
          className="w-full py-2.5 border border-dashed border-white/[0.15] hover:border-lime-500/50 hover:bg-lime-950/20 rounded-2xl text-xs font-mono font-bold text-zinc-300 hover:text-lime-400 flex items-center justify-center gap-1.5 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Custom Section</span>
        </button>

        {/* Quick Section Preset Chips */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] text-zinc-500 font-mono">Quick Add:</span>
          {['Publications', 'Volunteering', 'Awards & Honors'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleAddCustom(chip)}
              className="text-[10px] font-mono px-2 py-0.5 bg-[#12161E] hover:bg-[#1A202C] hover:text-lime-400 text-zinc-400 rounded-lg border border-white/[0.08] transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
