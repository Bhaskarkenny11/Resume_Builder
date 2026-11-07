import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Plus, Trash2, Award, Calendar } from 'lucide-react';

export const CertificationsSection: React.FC = () => {
  const { currentResume, addCertification, updateCertification, removeCertification } = useResumeStore();

  if (!currentResume) return null;
  const certs = currentResume.content.certifications;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Certifications & Credentials</h3>
          <p className="text-xs text-slate-500">Verified credentials like AWS, PMP, CKA, or CPA</p>
        </div>
        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      <div className="space-y-3">
        {certs.map((c) => (
          <div key={c.id} className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Certification Name
                  </label>
                  <div className="relative">
                    <Award className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                      placeholder="e.g. AWS Solutions Architect Professional"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="month"
                      value={c.issueDate}
                      onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Credential ID / URL
                  </label>
                  <input
                    type="text"
                    value={c.credentialId || ''}
                    onChange={(e) => updateCertification(c.id, { credentialId: e.target.value })}
                    placeholder="e.g. ID: AWS-PSA-12345"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeCertification(c.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg mt-5"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
