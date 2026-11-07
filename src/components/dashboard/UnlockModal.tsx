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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-200">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {security.workspaceName || 'Local Workspace Locked'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Enter your 4-digit security PIN to access your resumes.
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-center gap-1.5 animate-shake">
            <ShieldAlert className="w-4 h-4" />
            <span>Incorrect PIN. Please try again.</span>
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
            className="w-40 mx-auto text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block"
          />

          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Unlock Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
