
import React, { useState } from 'react';
import { Language, translations } from '../translations';

interface AadhaarVerificationProps {
  onVerified: (aadhaar: string) => void;
  language: Language;
}

const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ onVerified, language }) => {
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language].verification;

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length !== 12) return alert("Please enter a valid 12-digit Aadhaar number");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerified(aadhaar);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-12 bg-white old-money-border text-center">
      <div className="mb-8">
        <div className="w-16 h-16 border-2 border-regal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-regal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-semibold text-regal-900 mb-2">{t.title}</h2>
        <p className="text-regal-600 font-light italic">{t.subtitle}</p>
      </div>

      {step === 'input' ? (
        <form onSubmit={handleAadhaarSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs uppercase tracking-widest text-regal-700 mb-2 font-semibold">{t.aadhaarLabel}</label>
            <input
              type="text"
              maxLength={12}
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
              placeholder={t.placeholder}
              className="w-full bg-regal-50 border-b-2 border-regal-200 focus:border-regal-600 px-4 py-3 text-lg tracking-[0.2em] outline-none transition-all placeholder:text-regal-300 font-serif"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-regal-900 text-regal-100 py-4 font-serif text-xl tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? t.loading : t.verifyBtn}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs uppercase tracking-widest text-regal-700 mb-2 font-semibold">{t.otpLabel}</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full bg-regal-50 border-b-2 border-regal-200 focus:border-regal-600 px-4 py-3 text-center text-3xl tracking-[0.5em] outline-none transition-all font-serif"
              required
            />
            <p className="mt-3 text-xs text-regal-500 italic">{t.otpHint}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-regal-900 text-regal-100 py-4 font-serif text-xl tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? t.confirming : t.confirmBtn}
          </button>
        </form>
      )}
    </div>
  );
};

export default AadhaarVerification;
