import React, { useState, useEffect } from 'react';
import { 
  authenticateAdminPin, 
  setAdminPin, 
  checkBruteForceLockout,
  resetAdminPinToDefault 
} from '../../lib/security';
import { ShieldCheck, Lock, ArrowRight, X, KeyRound, AlertTriangle, RefreshCw } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState(0);

  // Poll lockout timer if active
  useEffect(() => {
    if (!isOpen) return;

    const checkLock = () => {
      const lockState = checkBruteForceLockout();
      if (lockState.isLocked) {
        setLockoutSecs(lockState.remainingSeconds);
      } else {
        setLockoutSecs(0);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetLockout = () => {
    resetAdminPinToDefault();
    setLockoutSecs(0);
    setPin('1234');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    const result = await authenticateAdminPin(pin);
    if (result.success) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError(result.message);
      setPin('');
      const lockState = checkBruteForceLockout();
      if (lockState.isLocked) {
        setLockoutSecs(lockState.remainingSeconds);
      }
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setError('New PIN must be at least 4 digits.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setError('PIN confirmations do not match.');
      return;
    }

    await setAdminPin(newPin.trim());
    setShowChangePin(false);
    setNewPin('');
    setConfirmNewPin('');
    setError('');
    alert('Admin PIN updated with salted cryptographic hash.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span className="text-zinc-100">Admin Console Access</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {lockoutSecs > 0 ? (
          <div className="p-4 bg-rose-950/40 border border-rose-900/60 rounded-xl space-y-3 text-center text-xs">
            <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto animate-bounce" />
            <div className="font-bold text-rose-300 text-sm">Security Lockout Active</div>
            <p className="text-zinc-400">
              Maximum failed verification attempts exceeded. Brute force defense has temporarily halted verification.
            </p>
            <div className="text-lg font-mono font-bold text-rose-400 pt-1">
              {lockoutSecs}s remaining
            </div>
            <button
              type="button"
              onClick={handleResetLockout}
              className="mt-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
            >
              Reset Lockout to Default (1234)
            </button>
          </div>
        ) : !showChangePin ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="text-zinc-400 leading-relaxed">
              Enter your Admin Passcode to view site traffic telemetry, custom fonts, and template management.
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-semibold text-zinc-300">
                  Admin Passcode
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Default: 1234</span>
              </div>
              <input
                type="password"
                autoFocus
                maxLength={12}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="••••"
                className="w-full tracking-widest text-center text-lg py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {error && (
              <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900/50 rounded-lg p-2.5 text-center">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowChangePin(true);
                  setError('');
                }}
                className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change PIN</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <span>Authorize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleUpdatePin} className="space-y-4 text-xs">
            <div className="text-zinc-400 leading-relaxed">
              Set a new Admin Passcode. It will be protected using browser-native salted SHA-256 key hashing.
            </div>

            <div className="space-y-2">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  New Passcode (min 4 chars)
                </label>
                <input
                  type="password"
                  autoFocus
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="New Passcode"
                  className="w-full text-center text-base py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Confirm Passcode"
                  className="w-full text-center text-base py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900/50 rounded-lg p-2 text-center">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowChangePin(false);
                  setError('');
                }}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95"
              >
                Save New Passcode
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
