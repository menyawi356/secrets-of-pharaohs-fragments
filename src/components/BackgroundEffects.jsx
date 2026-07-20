import { useEffect, useRef } from 'react';

export default function BackgroundEffects() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const count = 15;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        animation-delay:${Math.random() * 20}s;
        animation-duration:${20 + Math.random() * 12}s;
        opacity:0;
      `;
      container.appendChild(p);
    }
    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <>
      <div className="physics-bg" />
      <div ref={containerRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:-1 }} />
    </>
  );
}
