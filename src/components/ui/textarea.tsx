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
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-[var(--input-bg)] border ${error ? 'border-[var(--status-error-border)]' : 'border-[var(--border-base)]'} rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ${error ? 'focus:ring-[var(--status-error-bg)] focus:border-[var(--status-error-text)]' : 'focus:ring-violet-500/20 focus:border-violet-500'} transition-all resize-vertical min-h-[120px] ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--status-error-text)]">{error}</p>}
      {helpText && !error && <p className="text-xs text-[var(--text-muted)]">{helpText}</p>}
    </div>
  );
}

