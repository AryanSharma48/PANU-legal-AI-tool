import React from 'react';
import { Language, translations } from '../../translations';
import { SavedDraft } from '../../types';

interface DraftsListProps {
  drafts: SavedDraft[];
  onViewDraft: (draft: SavedDraft) => void;
  language: Language;
  loading: boolean;
}

const DraftsList: React.FC<DraftsListProps> = ({ drafts, onViewDraft, language, loading }) => {
  const t = translations[language].mydrafts;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Criminal: 'bg-red-100 text-red-800 border-red-200',
      Civil: 'bg-blue-100 text-blue-800 border-blue-200',
      Writ: 'bg-purple-100 text-purple-800 border-purple-200',
      Consumer: 'bg-amber-100 text-amber-800 border-amber-200',
      Family: 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[type] || 'bg-regal-100 text-regal-800 border-regal-200';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div className="w-16 h-16 border-4 border-regal-200 border-t-regal-900 rounded-full animate-spin mx-auto"></div>
        <p className="mt-6 text-regal-500 font-serif italic">Loading drafts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fade-in">
      <h2 className="text-4xl font-serif text-regal-900 mb-2 tracking-tight">{t.title}</h2>
      <div className="w-16 h-1 bg-regal-900 mb-10"></div>

      {drafts.length === 0 ? (
        <div className="bg-white p-16 old-money-border text-center space-y-6">
          <svg className="w-16 h-16 text-regal-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-serif text-regal-500 italic max-w-md mx-auto">{t.noDrafts}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white old-money-border p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onViewDraft(draft)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${getTypeColor(draft.petition_type)}`}>
                      {draft.petition_type}
                    </span>
                    <span className="text-xs text-regal-400 font-serif">
                      {formatDate(draft.created_at)}
                    </span>
                  </div>

                  {/* Preview: first 200 chars of draft content */}
                  <p className="text-sm text-regal-600 font-serif leading-relaxed line-clamp-2">
                    {draft.draft_content
                      .replace(/[#*_>\-]/g, '')
                      .replace(/\n+/g, ' ')
                      .slice(0, 200)}
                    ...
                  </p>

                  {/* Show petitioner vs respondent if available */}
                  {draft.form_data?.petitioner?.name && (
                    <p className="mt-2 text-xs text-regal-400 font-serif italic">
                      {draft.form_data.petitioner.name} vs {draft.form_data.respondent?.name || '—'}
                    </p>
                  )}
                </div>

                <button className="shrink-0 px-4 py-2 border border-regal-300 text-xs font-bold uppercase tracking-widest text-regal-700 hover:bg-regal-900 hover:text-white hover:border-regal-900 transition-all opacity-0 group-hover:opacity-100">
                  {t.viewDraft}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftsList;
