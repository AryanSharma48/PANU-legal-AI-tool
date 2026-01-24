import React, { useState } from 'react';
import { LegalDraftRequest } from '../../types';
import { Language, translations } from '../../translations';

interface DraftingFormProps {
  onSubmit: (data: LegalDraftRequest) => void;
  initialAadhaar: string;
  language: Language;
}

// --- UPDATED INFO TOOLTIP (Larger & Centered) ---
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-2 align-middle">
    {/* Larger 'i' icon */}
    <div className="w-5 h-5 rounded-full border border-regal-400 flex items-center justify-center text-xs font-serif italic text-regal-500 cursor-help group-hover:bg-regal-900 group-hover:text-white group-hover:border-regal-900 transition-all duration-300">
      i
    </div>
    
    {/* Larger Tooltip Box - Positioned precisely on top */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-64 p-4 bg-regal-900 text-regal-50 text-xs font-serif leading-relaxed shadow-2xl z-[100] normal-case tracking-normal text-center rounded-sm animate-in fade-in zoom-in duration-200">
      <p className="relative z-10">{text}</p>
      
      {/* Centered Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-regal-900"></div>
    </div>
  </div>
);

const DraftingForm: React.FC<DraftingFormProps> = ({ onSubmit, initialAadhaar, language }) => {
  const [step, setStep] = useState(1);
  const t = translations[language].drafting;
  
  const [formData, setFormData] = useState<Partial<LegalDraftRequest>>({
    petitioner: { name: '', address: '', age: 0, aadhaarNumber: initialAadhaar },
    respondent: { name: '', address: '' },
    jurisdiction: { territorial: '', pecuniary: '' },
    causeOfAction: '',
    petitionType: 'Civil'
  });

  const updatePetitioner = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, petitioner: { ...prev.petitioner!, [field]: value } }));
  };

  const updateRespondent = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, respondent: { ...prev.respondent!, [field]: value } }));
  };

  const updateJurisdiction = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, jurisdiction: { ...prev.jurisdiction!, [field]: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      onSubmit(formData as LegalDraftRequest);
    }
  };

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-12 max-w-2xl mx-auto">
      {[1, 2, 3, 4].map(s => (
        <div key={s} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-serif text-lg mb-2 transition-all duration-500 ${step >= s ? 'bg-regal-900 border-regal-900 text-white' : 'border-regal-300 text-regal-400'}`}>
            {s}
          </div>
          <span className={`text-[10px] uppercase tracking-[0.2em] font-semibold ${step >= s ? 'text-regal-900' : 'text-regal-400'}`}>
            {s === 1 ? t.step1 : s === 2 ? t.step2 : s === 3 ? t.step3 : t.step4}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-12 bg-white old-money-border relative" style={{ overflow: 'visible' }}>
      <StepIndicator />
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {step === 1 && (
          <div className="animate-fade-in space-y-8">
            <h3 className="text-3xl font-serif text-regal-900 border-b border-regal-200 pb-4">
              {t.petitionerHeader}
              <InfoTooltip text="This section captures the legal identity of the person filing the case. Ensure names match official government records." />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-regal-500">{t.petitionerSub}</p>
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updatePetitioner('name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updatePetitioner('age', parseInt(e.target.value))}
                  required
                />
                <textarea
                  placeholder="Permanent Residential Address"
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 h-24"
                  onChange={(e) => updatePetitioner('address', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-regal-500">
                  {t.respondentSub}
                  <InfoTooltip text="The Respondent is the party against whom you are seeking relief. Accurate address details are crucial for serving court summons." />
                </p>
                <input
                  type="text"
                  placeholder="Name of Accused/Respondent"
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updateRespondent('name', e.target.value)}
                  required
                />
                <textarea
                  placeholder="Known Address of Respondent"
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900 h-24"
                  onChange={(e) => updateRespondent('address', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-8">
            <h3 className="text-3xl font-serif text-regal-900 border-b border-regal-200 pb-4">{t.jurisdictionHeader}</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                  Type of Petition
                  <InfoTooltip text="Civil: Private disputes. Criminal: State-prosecuted offenses. Writ: Constitutional remedies against authorities. Consumer: Service/product grievances." />
                </label>
                <div className="flex flex-wrap gap-4 mt-3">
                  {['Civil', 'Criminal', 'Writ', 'Consumer'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, petitionType: type as any }))}
                      className={`px-8 py-3 font-serif transition-all ${formData.petitionType === type ? 'bg-regal-900 text-white' : 'bg-regal-100 text-regal-700 hover:bg-regal-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                    Territorial Jurisdiction
                    <InfoTooltip text="Specify the city or district court where the incident occurred. This determines if the court has the power to hear your specific case." />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. District Court, New Delhi"
                    className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                    onChange={(e) => updateJurisdiction('territorial', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                    Pecuniary Jurisdiction
                    <InfoTooltip text="The monetary value of your claim. Different courts handle different financial brackets (e.g., District Court vs. High Court)." />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 5,00,000"
                    className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                    onChange={(e) => updateJurisdiction('pecuniary', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in space-y-8">
            <h3 className="text-3xl font-serif text-regal-900 border-b border-regal-200 pb-4">{t.causeHeader}</h3>
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                {t.causeOfAction}
                <InfoTooltip text="This is the heart of your petition. Describe the specific event, the date it happened, and how your legal rights were violated. Be detailed." />
              </label>
              <textarea
                placeholder="..."
                className="w-full bg-regal-50 border-2 border-regal-100 p-6 font-serif italic outline-none focus:border-regal-900 min-h-[300px] text-lg leading-relaxed shadow-inner"
                onChange={(e) => setFormData(prev => ({ ...prev, causeOfAction: e.target.value }))}
                required
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in text-center space-y-10 py-10">
            <div className="w-24 h-24 border-2 border-regal-900 rounded-full flex items-center justify-center mx-auto bg-regal-50">
               <svg className="w-12 h-12 text-regal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-serif text-regal-900">
                {t.reviewHeader}
                <InfoTooltip text="Finalizing draft. Please ensure all names and dates are correct. The AI will generate a formal petition based on these inputs." />
              </h3>
              <p className="text-regal-600 max-w-md mx-auto italic font-light">{t.reviewSub}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-10 border-t border-regal-100">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-10 py-3 font-serif text-regal-700 hover:text-regal-900 transition-colors uppercase tracking-widest text-sm"
            >
              {t.backBtn}
            </button>
          )}
          <div className="flex-1"></div>
          <button
            type="submit"
            className="px-16 py-4 bg-regal-900 text-white font-serif text-xl tracking-widest uppercase hover:bg-black transition-all shadow-xl"
          >
            {step === 4 ? t.generateBtn : t.continueBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftingForm;