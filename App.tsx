
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AadhaarVerification from './components/AadhaarVerification';
import DraftingForm from './components/DraftingForm';
import PetitionViewer from './components/PetitionViewer';
import { generateLegalDraft } from './services/geminiService';
import { LegalDraftRequest } from './types';
import { Language, translations } from './translations';

type AppState = 'landing' | 'verifying' | 'drafting' | 'loading' | 'viewing' | 'ethos' | 'jurisprudence' | 'resources' | 'login';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [aadhaar, setAadhaar] = useState('');
  const [draft, setDraft] = useState('');

  const t = translations[language];

  const handleVerified = (verifiedAadhaar: string) => {
    setAadhaar(verifiedAadhaar);
    setAppState('drafting');
  };

  const handleFormSubmit = async (data: LegalDraftRequest) => {
    setAppState('loading');
    try {
      const result = await generateLegalDraft(data, language);
      setDraft(result);
      setAppState('viewing');
    } catch (error) {
      alert(language === 'hi' ? "कानूनी प्रतिलेखन के दौरान कुछ गलत हो गया। कृपया पुन: प्रयास करें।" : "Something went wrong during the legal transcription. Please try again.");
      setAppState('drafting');
    }
  };

  const renderInfoPage = (key: 'ethos' | 'jurisprudence' | 'resources') => {
    const pageData = t.pages[key];
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 animate-fade-in text-center">
        <h2 className="text-5xl font-serif text-regal-900 mb-12 border-b-2 border-regal-100 pb-8 tracking-widest uppercase">{pageData.title}</h2>
        <div className="bg-white p-16 old-money-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-regal-900"></div>
          <p className="text-2xl font-serif text-regal-800 leading-relaxed italic opacity-90">
            "{pageData.content}"
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <div className="w-8 h-1 bg-regal-300"></div>
            <div className="w-2 h-1 bg-regal-900"></div>
            <div className="w-8 h-1 bg-regal-300"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => {
    const l = t.pages.login;
    return (
      <div className="max-w-md mx-auto py-20 animate-fade-in">
        <div className="bg-white p-12 old-money-border shadow-2xl text-center space-y-8">
          <div className="w-20 h-20 border-2 border-regal-900 rounded-full flex items-center justify-center mx-auto bg-regal-50">
            <svg className="w-10 h-10 text-regal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-serif text-regal-900 uppercase tracking-widest">{l.title}</h2>
            <p className="text-regal-500 italic text-sm">{l.subtitle}</p>
          </div>
          <div className="space-y-4 text-left">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-regal-400">{l.username}</label>
              <input type="text" className="w-full border-b border-regal-300 py-3 bg-regal-50 px-4 font-serif outline-none focus:border-regal-900 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-regal-400">{l.password}</label>
              <input type="password" className="w-full border-b border-regal-300 py-3 bg-regal-50 px-4 font-serif outline-none focus:border-regal-900 transition-colors" />
            </div>
          </div>
          <button className="w-full bg-regal-900 text-white py-4 font-serif uppercase tracking-[0.2em] hover:bg-black transition-colors shadow-lg">
            {l.submit}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${language === 'hi' ? 'font-serif' : 'font-sans'}`}>
      <Navbar language={language} setLanguage={setLanguage} onNavigate={setAppState} />

      <main className="pt-32 px-6">
        {appState === 'landing' && (
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 py-10 md:py-24 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-serif text-regal-900 tracking-tight leading-tight">
              {t.landing.title} <br />
              <span className="italic font-light text-regal-700">{t.landing.subtitle}</span>
            </h1>
            <p className="max-w-3xl text-xl font-serif italic text-regal-600 leading-relaxed">
              {t.landing.description}
            </p>
            <button
              onClick={() => setAppState('verifying')}
              className="px-16 py-6 bg-regal-900 text-regal-100 font-serif text-2xl tracking-[0.2em] uppercase hover:bg-black transition-all duration-500 shadow-2xl group"
            >
              {t.landing.beginBtn}
              <span className="inline-block ml-4 group-hover:translate-x-2 transition-transform">→</span>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 border-t border-regal-200 w-full">
               <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-regal-500">{t.landing.feature1Title}</h4>
                 <p className="font-serif text-lg text-regal-800">{t.landing.feature1Text}</p>
               </div>
               <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-regal-500">{t.landing.feature2Title}</h4>
                 <p className="font-serif text-lg text-regal-800">{t.landing.feature2Text}</p>
               </div>
               <div className="space-y-4">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-regal-500">{t.landing.feature3Title}</h4>
                 <p className="font-serif text-lg text-regal-800">{t.landing.feature3Text}</p>
               </div>
            </div>
          </div>
        )}

        {appState === 'verifying' && (
          <div className="py-20 animate-fade-in">
            <AadhaarVerification onVerified={handleVerified} language={language} />
          </div>
        )}

        {appState === 'drafting' && (
          <div className="py-10 animate-fade-in">
            <DraftingForm onSubmit={handleFormSubmit} initialAadhaar={aadhaar} language={language} />
          </div>
        )}

        {appState === 'ethos' && renderInfoPage('ethos')}
        {appState === 'jurisprudence' && renderInfoPage('jurisprudence')}
        {appState === 'resources' && renderInfoPage('resources')}
        {appState === 'login' && renderLogin()}

        {appState === 'loading' && (
          <div className="fixed inset-0 bg-heritage-paper/95 z-[60] flex flex-col items-center justify-center space-y-8">
            <div className="w-24 h-24 border-4 border-regal-200 border-t-regal-900 rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-3xl font-serif text-regal-900 mb-2">{t.loading.title}</h2>
              <p className="text-regal-500 italic font-serif">{t.loading.subtitle}</p>
            </div>
            <div className="max-w-xs w-full h-1 bg-regal-100 overflow-hidden mt-8">
               <div className="w-full h-full bg-regal-900 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        )}

        {appState === 'viewing' && (
          <div className="py-10 animate-fade-in">
            <PetitionViewer draft={draft} onReset={() => setAppState('landing')} language={language} />
          </div>
        )}
      </main>

      <footer className="mt-24 border-t border-regal-200 py-12 px-6 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-serif text-xl font-bold text-regal-900">PANU LEGIS</p>
            <p className="text-sm text-regal-500 uppercase tracking-widest mt-1">Justice Unbound</p>
          </div>
          <div className="flex gap-8 text-xs uppercase tracking-[0.2em] font-bold text-regal-400">
            <button onClick={() => setAppState('ethos')} className="hover:text-regal-700">Legal Ethics</button>
            <button onClick={() => setAppState('resources')} className="hover:text-regal-700">Registry</button>
            <a href="#" className="hover:text-regal-700">Data Sovereignty</a>
          </div>
          <p className="text-xs text-regal-400 italic font-serif">
            &copy; 1924-2025 Panu Sovereign Systems. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .parchment { background: white !important; box-shadow: none !important; border: none !important; }
          main { padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
