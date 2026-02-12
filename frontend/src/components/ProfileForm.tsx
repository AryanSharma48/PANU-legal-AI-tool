import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Language } from '../../translations';

interface ProfileFormProps {
  initialProfile: Partial<UserProfile>;
  onSave: (profile: UserProfile) => void;
  language: Language;
  isEditMode?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSave, language, isEditMode = false }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    id: initialProfile.id || '',
    email: initialProfile.email || '',
    full_name: initialProfile.full_name || '',
    address: initialProfile.address || '',
    phone: initialProfile.phone || '',
    age: initialProfile.age || 0,
    jurisdiction: initialProfile.jurisdiction || '',
    avatar_url: initialProfile.avatar_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as UserProfile);
  };

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isHindi = language === 'hi';

  return (
    <div className="max-w-2xl mx-auto py-16 animate-fade-in">
      <div className="bg-white p-12 old-money-border shadow-2xl relative">
        {/* Decorative Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-regal-900"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-regal-900"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-regal-900"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-regal-900"></div>

        {/* Header */}
        <div className="text-center mb-10">
          {/* Avatar */}
          {initialProfile.avatar_url ? (
            <img
              src={initialProfile.avatar_url}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-regal-900 mx-auto mb-4 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 border-2 border-regal-900 rounded-full flex items-center justify-center mx-auto mb-4 bg-regal-50">
              <svg className="w-8 h-8 text-regal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          <h2 className="text-3xl font-serif text-regal-900 uppercase tracking-widest">
            {isEditMode
              ? (isHindi ? 'आपकी प्रोफ़ाइल' : 'My Profile')
              : (isHindi ? 'आपकी जानकारी' : 'Complete Your Profile')
            }
          </h2>
          <p className="text-regal-500 italic text-sm mt-2 font-serif">
            {isEditMode
              ? (isHindi ? 'अपनी जानकारी देखें और संपादित करें' : 'View and edit your information')
              : (isHindi ? 'याचिका मसौदे के लिए आवश्यक विवरण' : 'Required details for petition drafting')
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                {isHindi ? 'पूरा नाम' : 'Full Name'} *
              </label>
              <input
                type="text"
                value={formData.full_name || ''}
                onChange={(e) => update('full_name', e.target.value)}
                className="w-full bg-regal-50 border-b-2 border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 transition-colors"
                placeholder={isHindi ? 'पूरा कानूनी नाम' : 'Full Legal Name'}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                {isHindi ? 'ईमेल' : 'Email'}
                <span className="ml-2 text-[9px] normal-case tracking-normal text-regal-400 italic">(Google)</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                className="w-full bg-regal-100 border-b-2 border-regal-200 p-3 font-serif italic outline-none text-regal-500 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Age & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                {isHindi ? 'आयु' : 'Age'}
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => update('age', parseInt(e.target.value) || 0)}
                className="w-full bg-regal-50 border-b-2 border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 transition-colors"
                placeholder={isHindi ? 'आयु' : 'Your Age'}
                min={1}
                max={150}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                {isHindi ? 'फ़ोन नंबर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-regal-50 border-b-2 border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
              {isHindi ? 'स्थायी पता' : 'Permanent Address'}
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => update('address', e.target.value)}
              className="w-full bg-regal-50 border-b-2 border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 transition-colors h-24"
              placeholder={isHindi ? 'पूरा पता' : 'Full residential address'}
            />
          </div>

          {/* Jurisdiction */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
              {isHindi ? 'क्षेत्राधिकार' : 'Default Jurisdiction'}
            </label>
            <input
              type="text"
              value={formData.jurisdiction || ''}
              onChange={(e) => update('jurisdiction', e.target.value)}
              className="w-full bg-regal-50 border-b-2 border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 transition-colors"
              placeholder={isHindi ? 'जैसे: जिला न्यायालय, जयपुर' : 'e.g. District Court, Jaipur'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-8 bg-regal-900 text-regal-100 py-5 font-serif text-xl tracking-[0.2em] uppercase hover:bg-black transition-all shadow-xl group"
          >
            {isEditMode
              ? (isHindi ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile')
              : (isHindi ? 'प्रोफ़ाइल सहेजें और आगे बढ़ें' : 'Save Profile & Continue')
            }
            <span className="inline-block ml-3 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
