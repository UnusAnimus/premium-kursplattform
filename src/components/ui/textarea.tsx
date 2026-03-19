import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Textarea({ label, error, helpText, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-[#13131a] border ${error ? 'border-red-500' : 'border-[#1e1e2e]'} rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-vertical min-h-[120px] ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helpText && !error && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );
}
