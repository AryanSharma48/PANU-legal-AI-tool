
import React, { useState, useRef, useEffect } from 'react';
import { Language, translations } from '../../translations';
import { User } from '../../types';
import logo from '../images/logo.png';


interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNavigate: (page: any) => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ language, setLanguage, onNavigate, user, onLogout }) => {
  const t = translations[language].navbar;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownNavigate = (page: string) => {
    setDropdownOpen(false);
    onNavigate(page);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-heritage-paper/80 backdrop-blur-md border-b border-regal-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 group">
          <img src={logo} alt="Logo" style={{ width: 'auto', height: '60px', objectFit: 'contain' }} />
          <span className="text-2xl font-serif font-bold tracking-widest text-regal-900 uppercase">Panu</span>
        </button>
        <div className="hidden md:flex items-center gap-8 font-serif text-lg text-regal-800 tracking-wide">
          {/* <button onClick={() => onNavigate('ethos')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.ethos}</button>
          <button onClick={() => onNavigate('jurisprudence')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.jurisprudence}</button>
          <button onClick={() => onNavigate('resources')} className="hover:text-regal-500 transition-colors uppercase text-xs font-bold tracking-[0.15em]">{t.resources}</button> */}



          {user ? (
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('verify')}
                className="hover:text-regal-900 transition-colors uppercase text-xs font-bold tracking-[0.15em] hidden lg:block"
              >
                {t.verifyDraft}
              </button>
              <button
                onClick={() => onNavigate('drafting')}
                className="px-6 py-2 border border-regal-700 bg-regal-900 text-white hover:bg-black transition-all duration-300 uppercase text-xs font-bold tracking-[0.15em] shadow-md mr-4"
              >
                {t.createDraft}
              </button>

              <div className="relative border-l border-regal-200 pl-6 animate-fade-in" ref={dropdownRef}>
                {/* Avatar button — click to toggle dropdown */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="text-xs font-bold text-regal-900 tracking-wider uppercase leading-none hidden lg:block">{user.name}</span>
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-full border border-regal-300 shadow-sm hover:ring-2 hover:ring-regal-400 transition-all" />
                  ) : (
                    <div className="w-9 h-9 bg-regal-100 rounded-full flex items-center justify-center text-regal-600 font-bold text-sm hover:ring-2 hover:ring-regal-400 transition-all">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <svg className={`w-3 h-3 text-regal-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-regal-200 shadow-2xl z-[100] animate-fade-in overflow-hidden">
                    {/* Profile */}
                    <button
                      onClick={() => handleDropdownNavigate('myprofile')}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-regal-50 transition-colors border-b border-regal-100 group"
                    >
                      <svg className="w-4 h-4 text-regal-400 group-hover:text-regal-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-regal-700 group-hover:text-regal-900">
                        {language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}
                      </span>
                    </button>

                    {/* My Drafts */}
                    <button
                      onClick={() => handleDropdownNavigate('mydrafts')}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-regal-50 transition-colors border-b border-regal-100 group"
                    >
                      <svg className="w-4 h-4 text-regal-400 group-hover:text-regal-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-regal-700 group-hover:text-regal-900">
                        {language === 'hi' ? 'मेरे मसौदे' : 'My Drafts'}
                      </span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-red-50 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-regal-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-widest text-regal-700 group-hover:text-red-600">
                        {t.logout}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <button
                onClick={() => onNavigate('login')}
                className="hover:text-regal-900 transition-colors uppercase text-xs font-bold tracking-[0.15em] border-r border-regal-200 pr-4"
              >
                {t.login}
              </button>
              <button
                onClick={() => onNavigate('drafting')}
                className="px-6 py-2 border border-regal-700 hover:bg-regal-700 hover:text-white transition-all duration-300 uppercase text-xs font-bold tracking-[0.15em]"
              >
                {t.securePortal}
              </button>
            </div>
          )}

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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
