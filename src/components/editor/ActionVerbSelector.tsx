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
    <div 
      className="bg-[#12161E] rounded-2xl shadow-2xl border border-white/[0.1] p-4 w-96 max-w-full z-50 animate-in fade-in zoom-in-95 duration-150"
      style={{
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 20px 40px -10px rgba(0, 0, 0, 0.8)',
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] text-lime-400 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-white">Action Verb Power Library</h4>
            <p className="text-[10px] font-mono text-zinc-400">High-impact ATS keywords</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="mt-3 group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          placeholder="Search strong action verbs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2.5 py-1 text-xs bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
        />
      </div>

      {/* Category Pills (only if not searching) */}
      {!searchQuery && (
        <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar border-b border-white/[0.08]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-mono px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-lime-400 text-black font-bold border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                  : 'bg-[#0E1218] text-zinc-400 hover:text-white border-white/[0.08]'
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
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium text-left transition-all border ${
                isCopied
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                  : 'bg-[#090C10] text-zinc-300 hover:text-lime-400 hover:border-lime-500/40 border-white/[0.06]'
              }`}
            >
              <span>{verb}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
              ) : (
                <span className="text-[10px] text-zinc-500 group-hover:text-lime-400">+</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] font-mono text-zinc-500 text-center">
        Click to insert verb at cursor or start of bullet
      </div>
    </div>
  );
};
