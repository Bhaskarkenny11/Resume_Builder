import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { verifyPin } from '../../db';
import { Lock, KeyRound, ShieldAlert } from 'lucide-react';

export const UnlockModal: React.FC = () => {
  const { showUnlockModal, security, unlockWorkspace } = useResumeStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!showUnlockModal || !security.pinHash) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    const isValid = await verifyPin(pin, security.pinHash!);
    if (isValid) {
      setError(false);
      setPin('');
      unlockWorkspace();
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="bg-[#12161E] rounded-[32px] shadow-2xl max-w-sm w-full p-6 text-center border border-white/[0.08]"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        }}
      >
        <div className="w-14 h-14 bg-[#090B0E] border border-white/[0.08] text-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85),0_0_15px_rgba(163,230,53,0.2)]">
          <Lock className="w-7 h-7 text-lime-400" />
        </div>

        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          {security.workspaceName || 'Local Workspace Locked'}
        </h3>
        <p className="text-xs text-zinc-400 font-mono mt-1 mb-5">
          Enter 4-digit security PIN to unlock workspace.
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-mono flex items-center justify-center gap-1.5 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Incorrect PIN. Please retry ({attempts} failed).</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            maxLength={4}
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className="w-44 mx-auto text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-[#090C10] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] block"
          />

          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full h-11 rounded-full flex items-center justify-center gap-2 font-mono font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
              boxShadow: '0 0 20px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
            }}
          >
            <KeyRound className="w-4 h-4 text-black stroke-[2.5]" />
            Unlock Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
