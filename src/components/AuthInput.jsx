import React from 'react';

export default function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label} {required && <span style={{ color: 'var(--gold)' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="inline-error" style={{ marginTop: '0.5rem', marginBottom: 0, padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>
          <span>⚠️</span> {error}
        </div>
      )}
    </div>
  );
}
