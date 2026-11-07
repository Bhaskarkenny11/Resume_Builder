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
    // If description has bullet points, append or prepend verb
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
      className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 min-w-0 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {item.role || 'New Role'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 truncate">
                {item.company || 'Company'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{item.startDate || 'Date'} — {item.current ? 'Present' : (item.endDate || 'Date')}</span>
              {item.location && <span>• {item.location}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete position"
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

      {/* Expanded Form Content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Job Title / Role
              </label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => onUpdate({ role: e.target.value })}
                placeholder="e.g. Lead Software Engineer"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company / Organization
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => onUpdate({ company: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
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
                  placeholder="e.g. New York, NY (or Remote)"
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
                    placeholder="e.g. 2021-01 or Jan 2021"
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Date
                </label>
                {item.current ? (
                  <div className="h-8 flex items-center px-3 bg-indigo-50/70 border border-indigo-200/50 rounded-lg text-xs font-medium text-indigo-700">
                    Present
                  </div>
                ) : (
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={item.endDate || ''}
                      onChange={(e) => onUpdate({ endDate: e.target.value })}
                      placeholder="e.g. 2023-05 or Present"
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`curr-${item.id}`}
              checked={item.current}
              onChange={(e) => onUpdate({ current: e.target.checked, endDate: e.target.checked ? '' : item.endDate })}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`curr-${item.id}`} className="text-xs text-slate-600 select-none cursor-pointer">
              I currently work here
            </label>
          </div>

          {/* Bullet Points with Action Verb Auto-Formatter */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Key Accomplishments & Responsibilities
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowVerbPicker(!showVerbPicker)}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Action Verbs
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
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed font-sans"
            />
            <p className="text-[11px] text-slate-400 mt-1">
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
          <h3 className="text-sm font-semibold text-slate-800">Employment History</h3>
          <p className="text-xs text-slate-500">Highlight quantifiable achievements in reverse chronological order</p>
        </div>
        <button
          type="button"
          onClick={addExperienceItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
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
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500">No work experience entries added yet.</p>
                <button
                  type="button"
                  onClick={addExperienceItem}
                  className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                >
                  Add your first position
                </button>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
