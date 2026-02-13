
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Language, translations } from '../../translations';

interface PetitionViewerProps {
  draft: string;
  onReset: () => void;
  language: Language;
}

const PetitionViewer: React.FC<PetitionViewerProps> = ({ draft, onReset, language }) => {
  const t = translations[language].viewing;
  const petitionRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const element = petitionRef.current;
    if (!element) return;

    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: [0.75, 0.75, 0.75, 0.75] as [number, number, number, number],
      filename: `PANU_Legal_Petition_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* =============================================================================
          VISIBLE FANCY VERSION (Screen Only)
          ============================================================================= */}
      <div className="bg-white p-12 md:p-20 old-money-border shadow-2xl parchment min-h-[1000px] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-7xl md:text-9xl font-serif font-bold uppercase -rotate-45 tracking-[2rem]">{t.watermark}</span>
        </div>

        <div className="relative z-10 font-serif text-lg leading-relaxed text-slate-800 petition-markdown">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-center uppercase tracking-widest text-regal-900 mb-6 mt-8 border-b-2 border-regal-200 pb-3">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-center uppercase tracking-wider text-regal-900 mb-4 mt-6">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-bold text-regal-800 mb-3 mt-5 uppercase tracking-wide">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-base font-bold text-regal-800 mb-2 mt-4">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-justify leading-8">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-regal-900">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-regal-700">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-7">{children}</li>
              ),
              hr: () => (
                <hr className="my-8 border-t border-regal-300" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-regal-400 pl-4 my-4 italic text-regal-700">{children}</blockquote>
              ),
            }}
          >
            {draft}
          </ReactMarkdown>
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

      {/* =============================================================================
          HIDDEN CLEAN VERSION (For PDF Generation Only)
          - No parchment, no shadows, no watermarks
          - Pure black & white, standard fonts
          ============================================================================= */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div
          ref={petitionRef}
          className="bg-white p-12 text-black font-serif text-[12pt] leading-relaxed max-w-[800px]"
        >
          {/* Plain Markdown Rendering for Court Submission */}
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-center uppercase mb-6 mt-6 pb-2 border-b border-black">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold text-center uppercase mb-4 mt-6">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold mb-3 mt-4 uppercase underline">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-base font-bold mb-2 mt-4">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-justify leading-7">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-6">{children}</li>
              ),
              hr: () => (
                <hr className="my-6 border-t border-black" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-black pl-4 my-4 italic">{children}</blockquote>
              ),
            }}
          >
            {draft}
          </ReactMarkdown>

          <div className="mt-16 pt-8 border-t border-black flex justify-between items-end">
            <div>
              <p>Generated by PANU Legal Intelligence</p>
              <p className="text-sm">Date: {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</p>
            </div>
            {/* No fancy seal for court copy, just a place for signature */}
            <div className="text-right">
              <div className="w-48 h-8 border-b border-black mb-2"></div>
              <p className="text-sm font-bold uppercase">Advocate / Petitioner Signature</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center no-print">
        <button
          onClick={handleDownloadPDF}
          className="px-12 py-5 bg-regal-900 text-white font-serif text-xl tracking-widest uppercase hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {t.downloadBtn}
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

