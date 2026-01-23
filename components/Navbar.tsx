
import React from 'react';
import { Language, translations } from '../translations';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNavigate: (page: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ language, setLanguage, onNavigate }) => {
  const t = translations[language].navbar;

  return (
    <nav className="fixed top-0 w-full z-50 bg-heritage-paper/80 backdrop-blur-md border-b border-regal-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-regal-900 rounded-full flex items-center justify-center text-regal-300 font-serif text-2xl font-bold shadow-lg transition-transform group-hover:scale-110">P</div>
          <span className="text-2xl font-serif font-bold tracking-widest text-regal-900 uppercase">Panu</span>
        </button>
        <div className="hidden md:flex items-center gap-8 font-serif text-lg text-regal-800 tracking-wide">
          <button onClick={() => onNavigate('ethos')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.ethos}</button>
          <button onClick={() => onNavigate('jurisprudence')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.jurisprudence}</button>
          <button onClick={() => onNavigate('resources')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.resources}</button>
          
          <div className="flex items-center border border-regal-300 rounded-full p-1 bg-regal-50">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-regal-900 text-white' : 'text-regal-400 hover:text-regal-900'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'hi' ? 'bg-regal-900 text-white' : 'text-regal-400 hover:text-regal-900'}`}
            >
              हिन्दी
            </button>
          </div>

          <button 
            onClick={() => onNavigate('login')}
            className="hover:text-regal-900 transition-colors uppercase text-xs font-bold tracking-[0.15em] border-r border-regal-200 pr-4"
          >
            {t.login}
          </button>

          <button 
            onClick={() => onNavigate('verifying')}
            className="px-6 py-2 border border-regal-700 hover:bg-regal-700 hover:text-white transition-all duration-300 uppercase text-xs font-bold tracking-[0.15em]"
          >
            {t.securePortal}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
