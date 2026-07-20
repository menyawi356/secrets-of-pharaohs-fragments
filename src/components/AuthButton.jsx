import React from 'react';

export default function AuthButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`submit-btn ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
           <span className="spinner"></span>
           Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
