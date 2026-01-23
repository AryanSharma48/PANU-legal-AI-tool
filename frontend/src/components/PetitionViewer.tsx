
import React from 'react';
import { Language, translations } from '../../translations';

interface PetitionViewerProps {
  draft: string;
  onReset: () => void;
  language: Language;
}

const PetitionViewer: React.FC<PetitionViewerProps> = ({ draft, onReset, language }) => {
  const t = translations[language].viewing;
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <div className="bg-white p-12 md:p-20 old-money-border shadow-2xl parchment min-h-[1000px] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-7xl md:text-9xl font-serif font-bold uppercase -rotate-45 tracking-[2rem]">{t.watermark}</span>
        </div>
        
        <div className="relative z-10 whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800 text-justify">
          {draft}
        </div>
        
        <div className="mt-20 pt-10 border-t border-dashed border-regal-300 flex justify-between items-end italic text-regal-600">
          <div>
            <p>{t.footerText}</p>
            <p className="text-sm">Date: {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
          </div>
          <div className="text-right">
            <div className="w-32 h-1 border-b border-regal-800 mb-2"></div>
            <p className="text-sm font-bold uppercase tracking-widest">Digital Verification Seal</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center no-print">
        <button
          onClick={handlePrint}
          className="px-12 py-5 bg-regal-900 text-white font-serif text-xl tracking-widest uppercase hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
        >
          {t.printBtn}
        </button>
        <button
          onClick={onReset}
          className="px-12 py-5 border-2 border-regal-900 text-regal-900 font-serif text-xl tracking-widest uppercase hover:bg-regal-50 transition-all"
        >
          {t.resetBtn}
        </button>
      </div>
    </div>
  );
};

export default PetitionViewer;
