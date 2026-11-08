import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, Award, Calendar, Building2, Link as LinkIcon } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const { currentResume, addCertification, updateCertification, removeCertification } = useResumeStore();

  if (!currentResume) return null;
  const certs = currentResume.content.certifications;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-mono font-bold text-white">Certifications & Credentials</h3>
          <p className="text-xs font-mono text-zinc-400">Verified credentials like AWS, PMP, CKA, or CPA</p>
        </div>
        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-lime-400 rounded-xl text-xs font-mono font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-lime-400" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c.id} className="p-4 bg-[#0B0E14] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04),0_6px_20px_rgba(0,0,0,0.4)] space-y-3 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
                {/* Cert Name */}
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                    Certification Name
                  </label>
                  <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                      placeholder="e.g. AWS Solutions Architect Professional"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Issuer */}
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                    Issuing Organization
                  </label>
                  <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Issue Date */}
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                    Issue Date
                  </label>
                  <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="month"
                      value={c.issueDate}
                      onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Credential ID / Link */}
                <div>
                  <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                    Credential ID / URL
                  </label>
                  <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={c.credentialId || ''}
                      onChange={(e) => updateCertification(c.id, { credentialId: e.target.value })}
                      placeholder="e.g. ID: AWS-PSA-12345"
                      className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeCertification(c.id)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl mt-5 transition-colors"
                title="Remove certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {certs.length === 0 && (
          <div className="p-8 text-center border-2 border-dashed border-white/[0.1] rounded-2xl bg-[#090C10] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]">
            <p className="text-xs font-mono text-zinc-400">No certifications added yet.</p>
            <button
              type="button"
              onClick={addCertification}
              className="mt-2 text-xs font-mono font-bold text-lime-400 hover:underline"
            >
              + Add your first credential
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
