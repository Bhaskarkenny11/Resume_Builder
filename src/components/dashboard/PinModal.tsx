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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={() => setShowPinSetupModal(false)}
            className="absolute right-4 top-4 text-white/70 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FolderKey className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold">Protect & Organize Your Resumes Locally</h3>
          <p className="text-xs text-indigo-100 mt-1 max-w-xs mx-auto">
            Organize multi-resume profiles privately on this device with optional cryptographic PIN protection.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Local Workspace Profile Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Bhaskar's Career Vault"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <label className="text-xs font-semibold text-slate-700">
                Optional 4-Digit Local Lock PIN
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Secures your resumes on shared family or work computers. We hash this with native <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">window.crypto.subtle (SHA-256)</code> directly inside your browser.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="4-digit PIN"
                  className="w-full text-center tracking-widest text-lg font-mono py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Confirm PIN"
                  className="w-full text-center tracking-widest text-lg font-mono py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setShowPinSetupModal(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Save & Create Resume #2
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
