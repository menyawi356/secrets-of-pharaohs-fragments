import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

const NAV_ITEMS = [
  { to: '/',            en: 'Home' },
  { to: '/about',       en: 'About' },
  { to: '/meet-us',     en: 'Meet Us' },
  { to: '/timeline',    en: 'Timeline' },
  { to: '/partners',    en: 'Partners & Prizes' },
  { to: '/ambassador',  en: '🏛️ Ambassadors' },
  { to: '/register',    en: 'Register' },
  { to: '/faq',         en: 'FAQ' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.nav-container') && !e.target.closest('.nav-links')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="nav-container">

        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="pyramid-nav-logo">
            <div className="pyramid-main" />
            <div className="pyramid-small-left" />
            <div className="pyramid-small-right" />
          </div>
          <span className="logo-text">Pharaohs' Fragments</span>
        </Link>

        {/* Desktop nav links — hidden on mobile via CSS */}
        <ul className="nav-links nav-links-desktop" role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.to}>
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to={item.to}
                end={item.to === '/'}
              >
                {item.en}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Groups lang-toggle + hamburger on the right */}
        <div className="nav-controls">
          <div className="lang-toggle">
            <button
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
            >EN</button>
            <button
              className={`lang-btn${lang === 'ar' ? ' active' : ''}`}
              onClick={() => setLang('ar')}
              aria-pressed={lang === 'ar'}
            >عربي</button>
          </div>

          <button
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>
      </div>

      {/* Mobile nav — full screen overlay, outside nav-container */}
      <ul
        id="nav-links-mobile"
        className={`nav-links nav-links-mobile${menuOpen ? ' open' : ''}`}
        role="list"
      >
        {NAV_ITEMS.map(item => (
          <li key={item.to}>
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {item.en}
            </NavLink>
          </li>
        ))}
      </ul>

      {menuOpen && (
        <div
          className="nav-backdrop"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
