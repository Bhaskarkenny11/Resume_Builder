import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ExperienceItem } from '../../types/resume';
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
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Briefcase,
  MapPin, 
  Calendar 
} from 'lucide-react';
import { ActionVerbSelector } from './ActionVerbSelector';

interface SortableExperienceItemProps {
  item: ExperienceItem;
  onUpdate: (patch: Partial<ExperienceItem>) => void;
  onRemove: () => void;
}

const SortableExperienceCard: React.FC<SortableExperienceItemProps> = ({ item, onUpdate, onRemove }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showVerbPicker, setShowVerbPicker] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleInsertVerb = (verb: string) => {
    const lines = item.description ? item.description.split('\n') : [];
    if (lines.length === 0 || !lines[lines.length - 1].trim()) {
      lines.push(`• ${verb} `);
    } else {
      lines.push(`• ${verb} `);
    }
    onUpdate({ description: lines.join('\n') });
    setShowVerbPicker(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 bg-[#0E1218] border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-300 rounded touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 min-w-0 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                {item.role || 'New Role'}
              </span>
              <span className="text-xs text-zinc-600 font-mono">•</span>
              <span className="text-xs font-mono text-zinc-400 truncate">
                {item.company || 'Company'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2 mt-0.5">
              <span>{item.startDate || 'Date'} — {item.current ? 'Present' : (item.endDate || 'Date')}</span>
              {item.location && <span>• {item.location}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Delete position"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Form Content */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-[#0E1218]/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Job Title */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                Job Title / Role
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => onUpdate({ role: e.target.value })}
                  placeholder="e.g. Lead Software Engineer"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                Company / Organization
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => onUpdate({ company: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                Location
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => onUpdate({ location: e.target.value })}
                  placeholder="e.g. New York, NY (or Remote)"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Start Date
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    placeholder="e.g. Jan 2021"
                    className="w-full px-2 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  End Date
                </label>
                {item.current ? (
                  <div className="h-9 flex items-center justify-center px-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs font-mono font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                    Present
                  </div>
                ) : (
                  <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={item.endDate || ''}
                      onChange={(e) => onUpdate({ endDate: e.target.value })}
                      placeholder="e.g. May 2023"
                      className="w-full px-2 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Job Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id={`curr-${item.id}`}
              checked={item.current}
              onChange={(e) => onUpdate({ current: e.target.checked, endDate: e.target.checked ? '' : item.endDate })}
              className="w-4 h-4 rounded bg-[#090C10] border-white/[0.15] text-lime-400 focus:ring-lime-500/40 accent-lime-400 cursor-pointer"
            />
            <label htmlFor={`curr-${item.id}`} className="text-xs font-mono text-zinc-400 select-none cursor-pointer hover:text-zinc-200">
              I currently work here
            </label>
          </div>

          {/* Bullet Points with Action Verb Auto-Formatter */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono font-medium text-zinc-300">
                Key Accomplishments & Responsibilities
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowVerbPicker(!showVerbPicker)}
                  className="px-2.5 py-1 text-xs font-mono font-medium text-lime-400 bg-white/[0.05] hover:bg-white/[0.1] border border-lime-500/30 rounded-lg flex items-center gap-1.5 transition-colors shadow-[0_0_10px_rgba(163,230,53,0.15)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  <span>Action Verbs</span>
                </button>

                {showVerbPicker && (
                  <div className="absolute right-0 bottom-full mb-2 z-50">
                    <ActionVerbSelector
                      onSelectVerb={handleInsertVerb}
                      onClose={() => setShowVerbPicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            <textarea
              rows={4}
              value={item.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="• Spearheaded the migration of core services, reducing latency by 45%&#10;• Orchestrated a cross-functional team of 8 engineers delivering features on schedule"
              className="w-full p-3 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus:ring-1 focus:ring-lime-500/30 rounded-xl text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all focus:outline-none leading-relaxed font-sans"
            />
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              Tip: Start each line with a bullet point (•) and a high-impact metric.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const { currentResume, addExperienceItem, updateExperienceItem, removeExperienceItem, reorderExperienceItems } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentResume) return null;
  const items = currentResume.content.experience;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      reorderExperienceItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold text-white">Employment History</h3>
          <p className="text-xs font-mono text-zinc-400">Quantifiable achievements in reverse chronological order</p>
        </div>
        <button
          type="button"
          onClick={addExperienceItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Position</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableExperienceCard
                key={item.id}
                item={item}
                onUpdate={(patch) => updateExperienceItem(item.id, patch)}
                onRemove={() => removeExperienceItem(item.id)}
              />
            ))}
            {items.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-white/[0.1] rounded-2xl bg-[#090C10] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
                <p className="text-xs font-mono text-zinc-400">No work experience entries added yet.</p>
                <button
                  type="button"
                  onClick={addExperienceItem}
                  className="mt-2 text-xs font-mono font-bold text-lime-400 hover:underline"
                >
                  + Add your first position
                </button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
