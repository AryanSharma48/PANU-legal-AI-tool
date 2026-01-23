import React, { useState, useRef } from 'react';
import { Language, translations } from '../../translations';

interface AadhaarUploadProps {
  // This function will receive the file and code to send to your backend
  onUpload: (file: File, shareCode: string) => Promise<void>; 
  language: Language;
}

const AadhaarUpload: React.FC<AadhaarUploadProps> = ({ onUpload, language }) => {
  const [file, setFile] = useState<File | null>(null);
  const [shareCode, setShareCode] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].verification; // Assuming you add relevant keys here

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
    // basic check for zip extension or MIME type
    if (!uploadedFile.name.endsWith('.zip') && uploadedFile.type !== 'application/zip') {
      setError("Please upload a valid .zip file from UIDAI.");
      return;
    }
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || shareCode.length !== 4) {
      setError("Please provide both the ZIP file and the 4-digit Share Code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onUpload(file, shareCode);
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your file and code.");
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
          Offline KYC
        </h2>
        <p className="text-regal-600 font-serif italic text-sm">
          Secure Identity Verification via UIDAI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- 1. File Upload Zone --- */}
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
            accept=".zip" 
            className="hidden" 
          />
          
          {file ? (
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <svg className="w-8 h-8 text-regal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
                Drag & Drop KYC Zip or Click to Upload
              </p>
            </div>
          )}
        </div>

        {/* --- 2. Share Code Input --- */}
        <div className="relative group">
          <label className="block text-xs uppercase tracking-widest text-regal-700 mb-2 font-bold text-left ml-1">
            4-Digit Share Code
          </label>
          <input
            type="text"
            maxLength={4}
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value.replace(/\D/g, ''))} // Numbers only
            placeholder="XXXX"
            className="w-full bg-transparent border-b-2 border-regal-200 focus:border-regal-900 py-3 text-center text-3xl font-serif tracking-[0.5em] outline-none transition-all placeholder:text-regal-200"
          />
          <div className="absolute right-0 top-8 group-hover:opacity-100 opacity-0 transition-opacity">
            <div className="bg-regal-900 text-white text-[10px] px-2 py-1 rounded">
              The code you set when downloading
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-700 text-xs font-serif italic bg-red-50 p-2 border border-red-200">
            {error}
          </p>
        )}

        {/* --- 3. Submit Button --- */}
        <button
          type="submit"
          disabled={loading || !file || shareCode.length !== 4}
          className="w-full bg-regal-900 text-regal-100 py-5 font-serif text-xl tracking-[0.2em] uppercase hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Verifying...
            </>
          ) : (
            <>
              Verify Identity
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default AadhaarUpload;