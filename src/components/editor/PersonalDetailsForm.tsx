import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Camera, 
  Trash2, 
  Calendar, 
  ShieldCheck, 
  Car, 
  Flag,
  Eye,
  EyeOff
} from 'lucide-react';

export const PersonalDetailsForm: React.FC = () => {
  const { currentResume, updatePersonalDetails, updateSummary } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentResume) return null;

  const { personal, summary } = currentResume.content;
  const presetConfig = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const features = presetConfig.features;

  const isPhotoVisible = Boolean(personal.photoUrl && personal.showPhoto !== false);
  const photoShape = personal.photoShape || 'circle';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Image must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updatePersonalDetails({ 
          photoUrl: reader.result as string,
          showPhoto: true,
          photoShape: personal.photoShape || 'circle'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalDetails({ photoUrl: '', showPhoto: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleShowPhoto = () => {
    updatePersonalDetails({ showPhoto: !isPhotoVisible });
  };

  const setPhotoShape = (shape: 'circle' | 'rounded' | 'square') => {
    updatePersonalDetails({ photoShape: shape });
  };

  return (
    <div className="space-y-4">
      {/* Universal Headshot / Photo Option (Available for all resumes) */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {!personal.photoUrl ? (
          /* Empty State: Call to Action to Add Photo */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Profile Photo (Optional)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Add a professional headshot to include on this resume.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Photo</span>
            </button>
          </div>
        ) : (
          /* Uploaded State: Photo Preview + Visibility Toggle + Shape Selector */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Photo Thumbnail */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group w-14 h-14 overflow-hidden border-2 bg-slate-200 shrink-0 cursor-pointer shadow-sm transition-all ${
                  !isPhotoVisible ? 'opacity-40 grayscale border-slate-300' : 'border-blue-500'
                } ${
                  photoShape === 'circle' ? 'rounded-full' : photoShape === 'square' ? 'rounded-none' : 'rounded-xl'
                }`}
                title="Click to replace photo"
              >
                <img
                  src={personal.photoUrl}
                  alt="Headshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Profile Photo</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPhotoVisible 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isPhotoVisible ? 'Visible on Resume' : 'Hidden on Resume'}
                  </span>
                </div>

                {/* Photo Shape Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-medium text-slate-500">Shape:</span>
                  {(['circle', 'rounded', 'square'] as const).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setPhotoShape(shape)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-md capitalize transition-all ${
                        photoShape === shape
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Toggle Visibility & Delete */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={toggleShowPhoto}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isPhotoVisible
                    ? 'bg-slate-200/80 hover:bg-slate-300 text-slate-800'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                }`}
                title={isPhotoVisible ? 'Hide photo on this resume' : 'Show photo on this resume'}
              >
                {isPhotoVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isPhotoVisible ? 'Hide' : 'Show Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors shadow-2xs"
                title="Change Photo"
              >
                Change
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Remove Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Core Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
              placeholder="e.g. Bhaskar Yerrolla"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Professional Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => updatePersonalDetails({ jobTitle: e.target.value })}
            placeholder="e.g. Full Stack Developer"
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={personal.email}
              onChange={(e) => updatePersonalDetails({ email: e.target.value })}
              placeholder="name@example.com"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.location}
              onChange={(e) => updatePersonalDetails({ location: e.target.value })}
              placeholder="City, State / Country"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Portfolio / Website
          </label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.website || ''}
              onChange={(e) => updatePersonalDetails({ website: e.target.value })}
              placeholder="yourportfolio.vercel.app"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonalDetails({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            GitHub Profile
          </label>
          <div className="relative">
            <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={personal.github || ''}
              onChange={(e) => updatePersonalDetails({ github: e.target.value })}
              placeholder="github.com/username"
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Dynamic International Fields (only visible if country preset requires it) */}
      {(features.birthDate || features.birthPlace || features.nationality || features.visaStatus || features.drivingLicense) && (
        <div className="pt-3 border-t border-slate-100">
          <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5">
            {presetConfig.name} Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.birthDate && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={personal.birthDate || ''}
                    onChange={(e) => updatePersonalDetails({ birthDate: e.target.value })}
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {features.birthPlace && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Place of Birth
                </label>
                <input
                  type="text"
                  value={personal.birthPlace || ''}
                  onChange={(e) => updatePersonalDetails({ birthPlace: e.target.value })}
                  placeholder="e.g. Munich, Germany"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            )}

            {features.nationality && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nationality
                </label>
                <div className="relative">
                  <Flag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={personal.nationality || ''}
                    onChange={(e) => updatePersonalDetails({ nationality: e.target.value })}
                    placeholder="e.g. Indian, American, German"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {features.visaStatus && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Visa / Residency Status
                </label>
                <div className="relative">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={personal.visaStatus || ''}
                    onChange={(e) => updatePersonalDetails({ visaStatus: e.target.value })}
                    placeholder="e.g. Employment Visa / Golden Visa"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {features.drivingLicense && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Driving License
                </label>
                <div className="relative">
                  <Car className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={personal.drivingLicense || ''}
                    onChange={(e) => updatePersonalDetails({ drivingLicense: e.target.value })}
                    placeholder="e.g. Valid Driver's License"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Professional Summary
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {summary.length} characters • ~{summary.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Brief 2-4 sentence pitch highlighting your key skills, years of experience, and highest impact achievements..."
          className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
