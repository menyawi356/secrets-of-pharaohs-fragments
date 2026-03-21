import { useState, useEffect } from 'react';

// ─── Simple event-bus toast ───────────────────────────────────────────────────
const _listeners = [];

export function showToast(message, type = 'success') {
  _listeners.forEach(fn => fn({ message, type }));
}

// ─── Toast renderer (mount once in App) ──────────────────────────────────────
export default function Toast() {
  const [toast, setToast] = useState(null);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const handler = ({ message, type }) => {
      setHiding(false);
      setToast({ message, type });
      const delay = type === 'error' ? 5500 : 3500;
      const total = type === 'error' ? 6000 : 4000;
      setTimeout(() => setHiding(true), delay);
      setTimeout(() => setToast(null), total);
    };
    _listeners.push(handler);
    return () => {
      const idx = _listeners.indexOf(handler);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  }, []);

  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}${hiding ? ' hiding' : ''}`}>
      {toast.message}
    </div>
  );
}
