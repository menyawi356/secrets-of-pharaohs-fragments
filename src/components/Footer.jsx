import { useLang } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="footer">
      <p>
        {lang === 'ar'
          ? 'شظايا الفراعنة © 2026 | دوري علوم دولي'
          : "Pharaohs' Fragments © 2026 | An International Science League"}
      </p>
      <p>
        {lang === 'ar'
          ? 'ينظمه طلاب في مصر، تحت إشراف الدكتور محمد علي'
          : 'Organized by Students in Egypt, under the supervision of Dr. Mohamed Ali'}
      </p>
    </footer>
  );
}
