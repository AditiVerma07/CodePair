import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../utils/languageMap';

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="hidden md:inline text-xs font-mono text-slate-400 uppercase tracking-wider">
        Language:
      </label>
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="px-2 md:px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs md:text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors duration-200 cursor-pointer max-w-28 md:max-w-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-200">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}