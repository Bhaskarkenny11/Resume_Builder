import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { EducationItem } from '../../types/resume';
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
  GraduationCap, 
  Building2,
  ChevronDown, 
  ChevronUp, 
  Calendar,
  MapPin,
  Award,
  BookOpen
} from 'lucide-react';

interface SortableEducationItemProps {
  item: EducationItem;
  onUpdate: (patch: Partial<EducationItem>) => void;
  onRemove: () => void;
}

const SortableEducationCard: React.FC<SortableEducationItemProps> = ({ item, onUpdate, onRemove }) => {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between p-3.5 bg-[#0E1218] border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-zinc-300 rounded touch-none"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div onClick={() => setIsOpen(!isOpen)} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-white truncate">
                {item.degree || 'Degree / Major'}
              </span>
              <span className="text-xs text-zinc-600 font-mono">•</span>
              <span className="text-xs font-mono text-zinc-400 truncate">
                {item.institution || 'University'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2 mt-0.5">
              <span>{item.startDate || 'Date'} — {item.current ? 'Present' : (item.endDate || 'Date')}</span>
              {item.grade && <span>• {item.grade}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
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

      {isOpen && (
        <div className="p-4 space-y-3.5 bg-[#0E1218]/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Degree */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                Degree & Specialization
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) => onUpdate({ degree: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                School / Institution
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.institution}
                  onChange={(e) => onUpdate({ institution: e.target.value })}
                  placeholder="e.g. Stanford University"
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
                  placeholder="e.g. Stanford, CA"
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
                    placeholder="e.g. 2018"
                    className="w-full px-2 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  End Date / Expected
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={item.endDate || ''}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    placeholder="e.g. 2022"
                    className="w-full px-2 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                GPA, Honors or Distinctions
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.grade || ''}
                  onChange={(e) => onUpdate({ grade: e.target.value })}
                  placeholder="e.g. 3.9 GPA, Magna Cum Laude"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            {/* Coursework */}
            <div>
              <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                Coursework or Activities (Optional)
              </label>
              <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="e.g. Distributed Systems, ML Algorithms"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const EducationSection: React.FC = () => {
  const { currentResume, addEducationItem, updateEducationItem, removeEducationItem, reorderEducationItems } = useResumeStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentResume) return null;
  const items = currentResume.content.education;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      reorderEducationItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold text-white">Education</h3>
          <p className="text-xs font-mono text-zinc-400">College degrees, diplomas, or accredited training</p>
        </div>
        <button
          type="button"
          onClick={addEducationItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Education</span>
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableEducationCard
                key={item.id}
                item={item}
                onUpdate={(patch) => updateEducationItem(item.id, patch)}
                onRemove={() => removeEducationItem(item.id)}
              />
            ))}
            {items.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-white/[0.1] rounded-2xl bg-[#090C10] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
                <p className="text-xs font-mono text-zinc-400">No education entries added yet.</p>
                <button
                  type="button"
                  onClick={addEducationItem}
                  className="mt-2 text-xs font-mono font-bold text-lime-400 hover:underline"
                >
                  + Add your first degree
                </button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
