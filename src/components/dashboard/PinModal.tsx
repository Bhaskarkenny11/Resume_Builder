import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { hashPin } from '../../db';
import { ShieldCheck, Lock, FolderKey, X } from 'lucide-react';

export const PinModal: React.FC = () => {
  const { showPinSetupModal, setShowPinSetupModal, configureLocalProfile } = useResumeStore();
  const [workspaceName, setWorkspaceName] = useState('My Local Workspace');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!showPinSetupModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!workspaceName.trim()) {
      setError('Please provide a name for your local profile workspace.');
      return;
    }

    if (pin.trim()) {
      if (!/^\d{4}$/.test(pin.trim())) {
        setError('PIN must be exactly 4 numeric digits.');
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      let hashedPin: string | undefined = undefined;
      if (pin.trim()) {
        hashedPin = await hashPin(pin.trim());
      }
      await configureLocalProfile(workspaceName.trim(), hashedPin);
    } catch (err: any) {
      setError('Failed to setup security profile: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-150">
      <div 
        className="bg-[#12161E] rounded-[32px] shadow-2xl max-w-md w-full border border-white/[0.08] overflow-hidden"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 5px rgba(0, 0, 0, 0.8), 0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Header Banner */}
        <div className="bg-[#0E1218] p-6 text-white text-center border-b border-white/[0.08] relative">
          <button
            type="button"
            onClick={() => setShowPinSetupModal(false)}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-[#090B0E] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)] text-lime-400">
            <FolderKey className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-mono text-white tracking-tight">Protect Local Workspace</h3>
          <p className="text-xs text-zinc-400 font-mono mt-1 max-w-xs mx-auto">
            Client-side cryptographic PIN lock for local multi-resume profiles.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-300 mb-1">
              Local Workspace Profile Name <span className="text-lime-400">*</span>
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Bhaskar's Career Vault"
              className="w-full px-3.5 py-2 text-sm bg-[#090C10] border border-white/[0.1] rounded-xl text-white font-mono focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.2)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)]"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08]">
            <div className="flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5 text-lime-400" />
              <label className="text-xs font-mono font-semibold text-zinc-300">
                Optional 4-Digit Local Lock PIN
              </label>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mb-3 leading-relaxed">
              Secures your resumes on shared devices. Hashed locally with native <code className="font-mono bg-[#090C10] border border-white/[0.08] px-1 py-0.5 rounded text-lime-400">crypto.subtle (SHA-256)</code>.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="4-digit PIN"
                  className="w-full text-center tracking-widest text-lg font-mono py-2 bg-[#090C10] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.2)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)]"
                />
              </div>

              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Confirm PIN"
                  className="w-full text-center tracking-widest text-lg font-mono py-2 bg-[#090C10] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.2)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowPinSetupModal(false)}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="relative px-5 py-2.5 rounded-full flex items-center gap-2 font-mono font-black text-xs uppercase tracking-wider text-black select-none transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #c4f934 0%, #84cc16 100%)',
                boxShadow: '0 0 18px rgba(163, 230, 53, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.4)',
              }}
            >
              <ShieldCheck className="w-4 h-4 text-black stroke-[2.5]" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
