import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { COUNTRY_PRESETS } from '../../lib/constants';
import { 
  User, 
  Briefcase,
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
  const { currentResume, updatePersonalDetails, updateStyle, updateSummary } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentResume) return null;

  const { personal, summary, style } = currentResume.content;
  const presetConfig = COUNTRY_PRESETS[currentResume.country_preset] || COUNTRY_PRESETS.us_ca;
  const features = presetConfig.features;

  const isPhotoVisible = Boolean(personal.photoUrl && personal.showPhoto !== false);
  const photoShape = personal.photoShape || (style?.photoShapeType as any) || 'circle';

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
    updateStyle({ photoShapeType: shape });
  };

  return (
    <div className="space-y-4">
      {/* Universal Headshot / Photo Option (Available for all resumes) */}
      <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl p-4 shadow-[inset_0_2px_5px_rgba(0,0,0,0.7)] transition-all">
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
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.12] text-zinc-300 flex items-center justify-center shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <Camera className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-white">
                  Profile Photo (Optional)
                </h4>
                <p className="text-[11px] font-mono text-zinc-400">
                  Add a professional headshot to include on this resume.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.1] hover:border-lime-500/40 text-zinc-200 hover:text-white rounded-xl text-xs font-mono font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <div className="w-5 h-5 rounded-md bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center">
                <Camera className="w-3 h-3 text-lime-400" />
              </div>
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
                className={`relative group w-14 h-14 overflow-hidden border-2 bg-[#090C10] shrink-0 cursor-pointer shadow-lg transition-all ${
                  !isPhotoVisible ? 'opacity-40 grayscale border-zinc-700' : 'border-lime-400/80 shadow-[0_0_12px_rgba(163,230,53,0.2)]'
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-4 h-4 text-lime-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-mono font-bold text-white">Profile Photo</h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isPhotoVisible 
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {isPhotoVisible ? 'Visible on Resume' : 'Hidden on Resume'}
                  </span>
                </div>

                {/* Photo Shape Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-mono text-zinc-400">Shape:</span>
                  {(['circle', 'rounded', 'square'] as const).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setPhotoShape(shape)}
                      className={`px-2.5 py-0.5 text-[10px] font-mono font-semibold rounded-lg capitalize transition-all border ${
                        photoShape === shape
                          ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                          : 'bg-[#12161E] border-white/[0.08] text-zinc-400 hover:text-white hover:bg-[#161B24]'
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all border ${
                  isPhotoVisible
                    ? 'bg-[#12161E] border-white/[0.08] hover:bg-[#181D26] text-zinc-300'
                    : 'bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                }`}
                title={isPhotoVisible ? 'Hide photo on this resume' : 'Show photo on this resume'}
              >
                <div className="w-4 h-4 rounded bg-white/[0.08] backdrop-blur-sm flex items-center justify-center">
                  {isPhotoVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-black" />}
                </div>
                <span>{isPhotoVisible ? 'Hide' : 'Show Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-[#12161E] hover:bg-[#181D26] border border-white/[0.08] hover:border-white/[0.18] text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-medium transition-colors"
                title="Change Photo"
              >
                Change
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors border border-transparent hover:border-rose-900/40"
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
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Full Name</span>
            <span className="text-lime-400 text-xs">*</span>
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <User className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
              placeholder="e.g. Alex Vance"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Professional Job Title</span>
            <span className="text-lime-400 text-xs">*</span>
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.jobTitle}
              onChange={(e) => updatePersonalDetails({ jobTitle: e.target.value })}
              placeholder="e.g. Lead Solutions Architect"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Email Address</span>
            <span className="text-lime-400 text-xs">*</span>
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <input
              type="email"
              value={personal.email}
              onChange={(e) => updatePersonalDetails({ email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
            <span>Phone Number</span>
            <span className="text-lime-400 text-xs">*</span>
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
            Location
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.location}
              onChange={(e) => updatePersonalDetails({ location: e.target.value })}
              placeholder="San Francisco, CA"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
            Portfolio / Website
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.website || ''}
              onChange={(e) => updatePersonalDetails({ website: e.target.value })}
              placeholder="alexvance.dev"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
            LinkedIn Profile
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Linkedin className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonalDetails({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/alexvance-cloud"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
            GitHub Profile
          </label>
          <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
            <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
              <Github className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={personal.github || ''}
              onChange={(e) => updatePersonalDetails({ github: e.target.value })}
              placeholder="github.com/alexvance"
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Dynamic International Fields (only visible if country preset requires it) */}
      {(features.birthDate || features.birthPlace || features.nationality || features.visaStatus || features.drivingLicense) && (
        <div className="pt-3 border-t border-white/[0.08]">
          <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
            {presetConfig.name} Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.birthDate && (
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Date of Birth
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="date"
                    value={personal.birthDate || ''}
                    onChange={(e) => updatePersonalDetails({ birthDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {features.birthPlace && (
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Place of Birth
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={personal.birthPlace || ''}
                    onChange={(e) => updatePersonalDetails({ birthPlace: e.target.value })}
                    placeholder="e.g. Munich, Germany"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {features.nationality && (
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Nationality
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <Flag className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={personal.nationality || ''}
                    onChange={(e) => updatePersonalDetails({ nationality: e.target.value })}
                    placeholder="e.g. Indian, American, German"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {features.visaStatus && (
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Visa / Residency Status
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={personal.visaStatus || ''}
                    onChange={(e) => updatePersonalDetails({ visaStatus: e.target.value })}
                    placeholder="e.g. Employment Visa / Permanent Resident"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}

            {features.drivingLicense && (
              <div>
                <label className="block text-[11px] font-mono font-medium text-zinc-300 mb-1.5">
                  Driving License
                </label>
                <div className="group relative flex items-center bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus-within:border-lime-500/50 focus-within:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus-within:ring-1 focus-within:ring-lime-500/30 rounded-xl transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] p-1">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] backdrop-blur-md border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-zinc-400 group-focus-within:text-lime-400 group-focus-within:border-lime-500/40 transition-all shrink-0 ml-0.5">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={personal.drivingLicense || ''}
                    onChange={(e) => updatePersonalDetails({ drivingLicense: e.target.value })}
                    placeholder="e.g. Valid Driver's License"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      <div className="pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-mono font-medium text-zinc-300">
            Professional Summary
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {summary.length} characters • ~{summary.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Brief 2-4 sentence pitch highlighting your key skills, years of experience, and highest impact achievements..."
          className="w-full p-3 text-xs sm:text-sm bg-[#090C10] border border-white/[0.09] hover:border-white/[0.18] focus:border-lime-500/50 focus:shadow-[0_0_12px_rgba(163,230,53,0.18)] focus:ring-1 focus:ring-lime-500/30 rounded-xl text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] transition-all focus:outline-none leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
