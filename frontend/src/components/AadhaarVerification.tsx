import React, { useState, useRef } from 'react';
import { Language, translations } from '../../translations';

interface AadhaarVerificationProps {
  // Updated: We only send the file now, no share code
  onUpload: (file: File) => Promise<void>; 
  language: Language;
}

const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({ onUpload, language }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Access translations safely
  const t = translations[language]?.verification || {
    title: "XML Verification",
    subtitle: "Upload extracted Aadhaar Data File",
    dragDrop: "Drag & Drop .xml file",
    verifying: "Verifying...",
    verifyBtn: "Verify Data",
    errorFile: "Please select an XML file.",
    errorType: "Please upload a valid .xml file."
  };

  // --- Handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile: File) => {
    setError(null);
    // STRICT CHECK: XML ONLY
    if (!uploadedFile.name.endsWith('.xml') && uploadedFile.type !== 'text/xml') {
      setError(language === 'hi' ? "कृपया मान्य .xml फ़ाइल अपलोड करें।" : "Please upload a valid .xml file.");
      return;
    }
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(language === 'hi' ? "कृपया एक फ़ाइल चुनें।" : "Please select an XML file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the parent function with ONLY the file
      await onUpload(file);
    } catch (err) {
      console.error(err);
      setError(language === 'hi' ? "सत्यापन विफल रहा।" : "Verification failed. Please check your XML file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 bg-white old-money-border text-center shadow-2xl relative">
      {/* Decorative Corner Borders */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-regal-900"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-regal-900"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-regal-900"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-regal-900"></div>

      <div className="mb-10">
        <h2 className="text-3xl font-serif text-regal-900 uppercase tracking-widest mb-3">
          {language === 'hi' ? "एक्सएमएल सत्यापन" : "XML Verification"}
        </h2>
        <p className="text-regal-600 font-serif italic text-sm">
          {language === 'hi' ? "निकाली गई आधार डेटा फ़ाइल अपलोड करें" : "Upload extracted Aadhaar Data File"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- File Upload Zone --- */}
        <div 
          className={`
            border-2 border-dashed transition-all duration-300 p-8 cursor-pointer
            ${isDragging ? 'border-regal-900 bg-regal-50' : 'border-regal-300 hover:border-regal-500'}
            ${file ? 'bg-regal-50 border-solid border-regal-900' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept=".xml" 
            className="hidden" 
          />
          
          {file ? (
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <div className="w-10 h-10 border-2 border-regal-900 rounded-full flex items-center justify-center bg-white">
                {/* XML Icon */}
                <svg className="w-5 h-5 text-regal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-regal-900 font-serif">{file.name}</p>
                <p className="text-xs text-regal-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <svg className="w-10 h-10 text-regal-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-regal-500 font-serif uppercase tracking-wider text-xs">
                {language === 'hi' ? ".xml फ़ाइल यहाँ खींचें" : "Drag & Drop .xml file"}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-700 text-xs font-serif italic bg-red-50 p-2 border border-red-200">
            {error}
          </p>
        )}

        {/* --- Submit Button --- */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-regal-900 text-regal-100 py-5 font-serif text-xl tracking-[0.2em] uppercase hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {language === 'hi' ? "सत्यापन हो रहा है..." : "Verifying..."}
            </>
          ) : (
            <>
              {language === 'hi' ? "सत्यापित करें" : "Verify Data"}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default AadhaarVerification;