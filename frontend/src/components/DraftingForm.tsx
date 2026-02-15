import React, { useState } from 'react';
import { LegalDraftRequest, UserProfile } from '../../types';
import { Language, translations } from '../../translations';

const SAMPLE_DATASETS: Partial<LegalDraftRequest>[] = [
  // --- 1. CRIMINAL: Bail Application (Cheating & Fraud) ---
  {
    petitioner: {
      name: 'Rajesh Kumar Sharma',
      parentOrSpouseName: 'Late Sh. Mohan Lal Sharma',
      address: 'H.No. 45, Sector 12, Dwarka, New Delhi - 110075',
      age: 35,
    },
    respondent: {
      name: 'The State (through SHO, P.S. Dwarka Sector 12)',
      parentOrSpouseName: '',
      address: 'Police Station Dwarka Sector 12, New Delhi',
    },
    jurisdiction: {
      territorial: 'Court of Sessions, Dwarka, New Delhi',
      pecuniary: 'N/A (Criminal Matter)',
    },
    petitionType: 'Criminal',
    firNumber: 'FIR No. 234/2025',
    policeStation: 'P.S. Dwarka Sector 12, New Delhi',
    custodyStatus: 'judicial_custody',
    causeOfAction: 'The petitioner Rajesh Kumar Sharma has been falsely implicated in FIR No. 234/2025 registered under Sections 420 and 406 of the Indian Penal Code at P.S. Dwarka Sector 12. The complainant Suresh Gupta alleges that the petitioner cheated him of Rs. 8,50,000 in a partnership deal. However, the petitioner submits that the amount was a legitimate business loan which has been partially repaid. The petitioner has been in judicial custody since 10th January 2025. The investigation is complete, the chargesheet has been filed, and the petitioner is no longer required for interrogation. The petitioner has deep roots in the community and is not a flight risk.',
  },
  // --- 2. CRIMINAL: Anticipatory Bail (Domestic Violence) ---
  {
    petitioner: {
      name: 'Amit Verma',
      parentOrSpouseName: 'Sh. Prem Chand Verma',
      address: '12/B, Nehru Nagar, Lucknow, Uttar Pradesh - 226001',
      age: 42,
    },
    respondent: {
      name: 'The State of Uttar Pradesh',
      parentOrSpouseName: '',
      address: 'Through P.P., District Court, Lucknow',
    },
    jurisdiction: {
      territorial: 'Court of Sessions, Lucknow',
      pecuniary: 'N/A (Criminal Matter)',
    },
    petitionType: 'Criminal',
    firNumber: 'FIR No. 89/2025',
    policeStation: 'P.S. Hazratganj, Lucknow',
    custodyStatus: 'anticipatory_bail',
    causeOfAction: 'The petitioner apprehends arrest in connection with FIR No. 89/2025 registered at P.S. Hazratganj under Sections 498A and 323 IPC on the complaint of his estranged wife Smt. Priya Verma. The petitioner submits that the FIR has been lodged as a counter-blast to the divorce petition filed by him. The allegations are vague, without specific dates or incidents. The petitioner is a government school teacher with an unblemished record and is willing to cooperate with the investigation. He seeks anticipatory bail to prevent misuse of the criminal process.',
  },
  // --- 3. CIVIL: Money Recovery Suit ---
  {
    petitioner: {
      name: 'Anita Devi',
      parentOrSpouseName: 'W/o Sh. Ramesh Prasad',
      address: 'Village Bhogpur, Tehsil Jalandhar, Punjab - 144001',
      age: 48,
    },
    respondent: {
      name: 'Vikram Singh',
      parentOrSpouseName: 'Sh. Baldev Singh',
      address: 'Near Old Bus Stand, Phagwara, Punjab - 144401',
    },
    jurisdiction: {
      territorial: 'Civil Court, Jalandhar, Punjab',
      pecuniary: '₹ 12,00,000',
    },
    petitionType: 'Civil',
    dateOfCauseOfAction: '2023-11-20',
    causeOfAction: 'The defendant Vikram Singh borrowed a sum of Rs. 12,00,000 (Twelve Lakhs) from the plaintiff on 20th November 2023 via NEFT transfer for purchasing agricultural equipment. A promissory note was executed on the same date promising repayment within 6 months with 12% interest per annum. Despite the expiry of the agreed period and multiple oral and written demands dated 25th May 2024, 10th August 2024, and 15th October 2024 (sent via registered post), the defendant has failed and neglected to repay the principal amount or any interest thereof. The cause of action arose on 20th May 2024 when the repayment period expired.',
  },
  // --- 4. FAMILY: Divorce Petition ---
  {
    petitioner: {
      name: 'Sunita Rani',
      parentOrSpouseName: 'W/o Sh. Manoj Kumar',
      address: 'Flat No. 302, Sunshine Apartments, Sector 44, Gurgaon, Haryana - 122003',
      age: 32,
    },
    respondent: {
      name: 'Manoj Kumar',
      parentOrSpouseName: 'Sh. Hari Om',
      address: '56, Model Town, Hisar, Haryana - 125001',
    },
    jurisdiction: {
      territorial: 'Family Court, Gurgaon, Haryana',
      pecuniary: 'N/A (Matrimonial)',
    },
    petitionType: 'Family',
    dateOfMarriage: '2018-02-14',
    causeOfAction: 'The petitioner Sunita Rani was married to the respondent Manoj Kumar on 14th February 2018 at Hisar as per Hindu rites and ceremonies. After marriage the petitioner resided at the matrimonial home in Hisar. From August 2019, the respondent started subjecting the petitioner to mental and physical cruelty including verbal abuse, restricting contact with her parents, and demanding additional dowry of Rs. 5,00,000. In March 2022, the respondent abandoned the petitioner and started living separately with another woman. The petitioner was forced to return to her parental home. Despite mediation attempts through family elders in June 2022 and October 2022, the respondent has refused reconciliation. The marriage has irretrievably broken down.',
  },
  // --- 5. WRIT: Against Government Authority ---
  {
    petitioner: {
      name: 'Naveen Joshi',
      parentOrSpouseName: 'Sh. Trilok Chand Joshi',
      address: '89, Civil Lines, Dehradun, Uttarakhand - 248001',
      age: 29,
    },
    respondent: {
      name: 'The State of Uttarakhand through Chief Secretary',
      parentOrSpouseName: '',
      address: 'Secretariat, Dehradun, Uttarakhand',
    },
    jurisdiction: {
      territorial: "Hon'ble High Court of Uttarakhand at Nainital",
      pecuniary: 'N/A (Writ Jurisdiction)',
    },
    petitionType: 'Writ',
    causeOfAction: 'The petitioner Naveen Joshi qualified the Uttarakhand Public Service Commission (UKPSC) examination for the post of Sub-Inspector (Civil Police) in 2023, securing Rank 45 in the General category. The final result was declared on 1st March 2024. Despite the petitioner completing all stages including physical test, medical examination, and document verification, his appointment letter has not been issued while candidates ranked below him have already been appointed. An RTI reply dated 15th September 2024 reveals no adverse remarks against the petitioner. The inaction of the respondent authorities is arbitrary, violative of Articles 14 and 16 of the Constitution of India, and the petitioner seeks a writ of mandamus directing the respondents to issue his appointment order forthwith.',
  },
  // --- 6. CONSUMER: Defective Product Complaint ---
  {
    petitioner: {
      name: 'Pooja Mehta',
      parentOrSpouseName: 'D/o Sh. Ashok Mehta',
      address: '23, MG Road, Camp Area, Pune, Maharashtra - 411001',
      age: 27,
    },
    respondent: {
      name: 'ElectroBazaar Pvt. Ltd.',
      parentOrSpouseName: 'Through its Managing Director',
      address: 'Corporate Office, BKC, Mumbai, Maharashtra - 400051',
    },
    jurisdiction: {
      territorial: 'District Consumer Disputes Redressal Forum, Pune',
      pecuniary: '₹ 1,85,000',
    },
    petitionType: 'Consumer',
    causeOfAction: 'The complainant purchased a Samsung Galaxy S24 Ultra mobile phone (IMEI: 3567XXXXXXX) from the opposite party ElectroBazaar Pvt. Ltd. on 5th January 2025 for Rs. 1,34,999 via their website, Order ID #EB20250105789. Within 15 days of purchase, the phone developed a severe display flickering issue and the battery started draining within 2 hours. The complainant visited the authorized service center on 22nd January 2025 and was informed the motherboard was defective. Despite filing a replacement request on 25th January 2025 (Ticket #SR-4521), the opposite party has neither replaced the product nor refunded the amount. The complainant seeks replacement with a new unit or full refund of Rs. 1,34,999 along with Rs. 50,000 as compensation for mental agony and deficiency in service.',
  },
];

interface DraftingFormProps {
  onSubmit: (data: LegalDraftRequest) => void;
  language: Language;
  userProfile?: UserProfile | null;
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

const DraftingForm: React.FC<DraftingFormProps> = ({ onSubmit, language, userProfile }) => {
  const [step, setStep] = useState(1);
  const t = translations[language].drafting;

  // Auto-fill petitioner info from userProfile
  const [formData, setFormData] = useState<Partial<LegalDraftRequest>>({
    petitioner: {
      name: userProfile?.full_name || '',
      parentOrSpouseName: '',
      address: userProfile?.address || '',
      age: userProfile?.age || 0,
    },
    respondent: { name: '', parentOrSpouseName: '', address: '' },
    jurisdiction: {
      territorial: userProfile?.jurisdiction || '',
      pecuniary: '',
    },
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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      onSubmit(formData as LegalDraftRequest);
    }
  };

  const petitionTypes = ['Civil', 'Criminal', 'Writ', 'Consumer', 'Family'] as const;

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

  // --- Conditional fields based on petition type ---
  const renderCaseSpecificFields = () => {
    const currentType = formData.petitionType;

    if (currentType === 'Criminal') {
      return (
        <div className="mt-8 p-6 bg-regal-50 border border-regal-200 space-y-6 animate-fade-in">
          <h4 className="text-sm font-bold uppercase tracking-widest text-regal-700 border-b border-regal-200 pb-2">
            {t.caseSpecificHeader}
            <InfoTooltip text="These details are crucial for Criminal petitions. The FIR number helps identify your case in police records." />
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">{t.firNumber}</label>
              <input
                type="text"
                placeholder="e.g. FIR No. 123/2025"
                value={formData.firNumber || ''}
                className="w-full bg-white border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                onChange={(e) => updateField('firNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-regal-500">{t.policeStation}</label>
              <input
                type="text"
                placeholder="e.g. P.S. Connaught Place, New Delhi"
                value={formData.policeStation || ''}
                className="w-full bg-white border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                onChange={(e) => updateField('policeStation', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
              {t.custodyStatus}
              <InfoTooltip text="Select whether the accused is currently in jail (Judicial Custody) or is seeking bail before arrest (Anticipatory Bail)." />
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="custodyStatus"
                  value="judicial_custody"
                  checked={formData.custodyStatus === 'judicial_custody'}
                  onChange={() => updateField('custodyStatus', 'judicial_custody')}
                  className="w-4 h-4 accent-regal-900"
                />
                <span className="font-serif text-regal-700 group-hover:text-regal-900 transition-colors">{t.judicialCustody}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="custodyStatus"
                  value="anticipatory_bail"
                  checked={formData.custodyStatus === 'anticipatory_bail'}
                  onChange={() => updateField('custodyStatus', 'anticipatory_bail')}
                  className="w-4 h-4 accent-regal-900"
                />
                <span className="font-serif text-regal-700 group-hover:text-regal-900 transition-colors">{t.anticipatoryBail}</span>
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (currentType === 'Civil') {
      return (
        <div className="mt-8 p-6 bg-regal-50 border border-regal-200 space-y-6 animate-fade-in">
          <h4 className="text-sm font-bold uppercase tracking-widest text-regal-700 border-b border-regal-200 pb-2">
            {t.caseSpecificHeader}
          </h4>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
              {t.dateOfCauseOfAction}
              <InfoTooltip text="The exact date the dispute started (e.g., when a contract was breached or a loan was defaulted). This is crucial for the Limitation Period." />
            </label>
            <input
              type="date"
              value={formData.dateOfCauseOfAction || ''}
              className="w-full bg-white border-b border-regal-300 p-3 font-serif outline-none focus:border-regal-900 max-w-xs"
              onChange={(e) => updateField('dateOfCauseOfAction', e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (currentType === 'Family') {
      return (
        <div className="mt-8 p-6 bg-regal-50 border border-regal-200 space-y-6 animate-fade-in">
          <h4 className="text-sm font-bold uppercase tracking-widest text-regal-700 border-b border-regal-200 pb-2">
            {t.caseSpecificHeader}
          </h4>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
              {t.dateOfMarriage}
              <InfoTooltip text="The date of marriage as per official records. This is essential for Divorce, Maintenance and other Matrimonial petitions." />
            </label>
            <input
              type="date"
              value={formData.dateOfMarriage || ''}
              className="w-full bg-white border-b border-regal-300 p-3 font-serif outline-none focus:border-regal-900 max-w-xs"
              onChange={(e) => updateField('dateOfMarriage', e.target.value)}
            />
          </div>
        </div>
      );
    }

    return null; // Writ & Consumer don't have extra fields
  };

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
                  value={formData.petitioner?.name || ''}
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updatePetitioner('name', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder={t.parentOrSpouseName}
                  value={formData.petitioner?.parentOrSpouseName || ''}
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updatePetitioner('parentOrSpouseName', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.petitioner?.age || ''}
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updatePetitioner('age', parseInt(e.target.value))}
                  required
                />
                <textarea
                  placeholder="Permanent Residential Address"
                  value={formData.petitioner?.address || ''}
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
                <input
                  type="text"
                  placeholder={t.parentOrSpouseName}
                  value={formData.respondent?.parentOrSpouseName || ''}
                  className="w-full bg-regal-50 border-b border-regal-300 p-3 font-serif italic outline-none focus:border-regal-900"
                  onChange={(e) => updateRespondent('parentOrSpouseName', e.target.value)}
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
                  <InfoTooltip text="Civil: Private disputes. Criminal: State-prosecuted offenses. Writ: Constitutional remedies against authorities. Consumer: Service/product grievances. Family: Matrimonial/Divorce cases." />
                </label>
                <div className="flex flex-wrap gap-4 mt-3">
                  {petitionTypes.map(type => (
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

              {/* Case-specific conditional fields */}
              {renderCaseSpecificFields()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-regal-500">
                    Territorial Jurisdiction
                    <InfoTooltip text="Specify the city or district court where the incident occurred. This determines if the court has the power to hear your specific case." />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. District Court, New Delhi"
                    value={formData.jurisdiction?.territorial || ''}
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