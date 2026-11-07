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
  ChevronDown, 
  ChevronUp, 
  Calendar,
  MapPin
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
      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all overflow-hidden"
    >
      <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded touch-none"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div onClick={() => setIsOpen(!isOpen)} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {item.degree || 'Degree / Major'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 truncate">
                {item.institution || 'University'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{item.startDate || 'Date'} — {item.current ? 'Present' : (item.endDate || 'Date')}</span>
              {item.grade && <span>• {item.grade}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Degree & Specialization
              </label>
              <div className="relative">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) => onUpdate({ degree: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                School / Institution
              </label>
              <input
                type="text"
                value={item.institution}
                onChange={(e) => onUpdate({ institution: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => onUpdate({ location: e.target.value })}
                  placeholder="e.g. Stanford, CA (or Remote)"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    placeholder="e.g. 2018-09 or 2018"
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Date / Expected
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={item.endDate || ''}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    placeholder="e.g. 2022-05 or 2022"
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                GPA, Honors or Distinctions
              </label>
              <input
                type="text"
                value={item.grade || ''}
                onChange={(e) => onUpdate({ grade: e.target.value })}
                placeholder="e.g. 3.9 GPA, Magna Cum Laude"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Coursework or Activities (Optional)
            </label>
            <input
              type="text"
              value={item.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="e.g. Algorithms, Distributed Systems, Capstone Lead"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
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
          <h3 className="text-sm font-semibold text-slate-800">Education</h3>
          <p className="text-xs text-slate-500">Add college degrees, diplomas, or relevant academic training</p>
        </div>
        <button
          type="button"
          onClick={addEducationItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
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
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
