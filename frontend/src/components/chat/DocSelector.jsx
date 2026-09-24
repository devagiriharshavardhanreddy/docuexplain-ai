import React from 'react';
import { Files, ChevronDown, Check } from 'lucide-react';

export const DocSelector = ({ documents = [], selectedDocIds = [], onSelectionChange }) => {
  const isAllSelected = selectedDocIds.length === 0;

  const handleToggleDoc = (docId) => {
    if (selectedDocIds.includes(docId)) {
      const updated = selectedDocIds.filter(id => id !== docId);
      onSelectionChange(updated);
    } else {
      onSelectionChange([...selectedDocIds, docId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <button
        onClick={handleSelectAll}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border shrink-0 ${
          isAllSelected
            ? 'bg-primary-600 text-white border-primary-500 shadow-sm'
            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
        }`}
      >
        <Files className="w-3.5 h-3.5" />
        All Documents ({documents.length})
      </button>

      {documents.map((doc) => {
        const isSelected = selectedDocIds.includes(doc.id);
        return (
          <button
            key={doc.id}
            onClick={() => handleToggleDoc(doc.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border shrink-0 max-w-[200px] truncate ${
              isSelected
                ? 'bg-primary-600/30 text-primary-200 border-primary-500'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-400" />}
            <span className="truncate">{doc.original_filename}</span>
          </button>
        );
      })}
    </div>
  );
};
