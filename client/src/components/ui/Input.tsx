import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-navy mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`retro-input w-full rounded text-navy placeholder-gray-400 ${
            error ? 'border-danger' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-navy mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`retro-input w-full rounded text-navy placeholder-gray-400 resize-y min-h-[200px] ${
            error ? 'border-danger' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';