import React, { useState } from 'react';
import { ACTION_VERBS_BY_CATEGORY } from '../../lib/constants';
import { Sparkles, Check, Search, X } from 'lucide-react';

interface ActionVerbSelectorProps {
  onSelectVerb: (verb: string) => void;
  onClose?: () => void;
}

export const ActionVerbSelector: React.FC<ActionVerbSelectorProps> = ({ onSelectVerb, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Leadership & Management');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  const categories = Object.keys(ACTION_VERBS_BY_CATEGORY);

  const handleVerbClick = (verb: string) => {
    onSelectVerb(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1500);
  };

  const filteredVerbs = searchQuery.trim()
    ? Object.values(ACTION_VERBS_BY_CATEGORY)
        .flat()
        .filter((v) => v.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    : ACTION_VERBS_BY_CATEGORY[selectedCategory] || [];

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-96 max-w-full z-50 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Action Verb Power Library</h4>
            <p className="text-xs text-slate-500">Insert high-impact ATS keywords</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mt-3 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        <input
          type="text"
          placeholder="Search strong action verbs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Category Pills (only if not searching) */}
      {!searchQuery && (
        <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Verbs Grid */}
      <div className="mt-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-1.5 p-1">
        {filteredVerbs.map((verb) => {
          const isCopied = copiedVerb === verb;
          return (
            <button
              key={verb}
              onClick={() => handleVerbClick(verb)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
                isCopied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent'
              }`}
            >
              <span>{verb}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" />
              ) : (
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-500">+</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        Click to insert verb at cursor or start of bullet
      </div>
    </div>
  );
};
