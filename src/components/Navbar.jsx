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

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <div className="pyramid-nav-logo">
            <div className="pyramid-main" />
            <div className="pyramid-small-left" />
            <div className="pyramid-small-right" />
          </div>
          <span className="logo-text">Pharaohs' Fragments</span>
        </Link>

        <div className="lang-toggle">
          <button
            className={`lang-btn${lang === 'en' ? ' active' : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            className={`lang-btn${lang === 'ar' ? ' active' : ''}`}
            onClick={() => setLang('ar')}
          >عربي</button>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
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
      </div>
    </nav>
  );
}
