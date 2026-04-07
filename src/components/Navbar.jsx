import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

const NAV_ITEMS = [
  { to: '/',            en: 'Home',              ar: 'الرئيسية' },
  { to: '/about',       en: 'About',             ar: 'عن الدوري' },
  { to: '/meet-us',     en: 'Meet Us',           ar: 'تعرف علينا' },
  { to: '/timeline',    en: 'Timeline',          ar: 'الجدول الزمني' },
  { to: '/partners',    en: 'Partners & Prizes', ar: 'الشركاء والجوائز' },
  { to: '/ambassador',  en: 'Ambassadors',   ar: 'السفراء' },
  { to: '/register',    en: 'Register',          ar: 'التسجيل' },
  { to: '/faq',         en: 'FAQ',               ar: 'الأسئلة الشائعة' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLang();

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
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-container">

        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="pyramid-nav-logo">
            <div className="pyramid-main" />
            <div className="pyramid-small-left" />
            <div className="pyramid-small-right" />
          </div>
          <span className="logo-text">Pharaohs' Fragments</span>
        </Link>

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
            aria-controls="nav-links"
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>
        </div>

        <ul
          id="nav-links"
          className={`nav-links${menuOpen ? ' open' : ''}`}
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
                {lang === 'ar' ? item.ar : item.en}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

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
