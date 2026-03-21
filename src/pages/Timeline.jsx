import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

const TIMELINE = [
  {
    date: 'March 11 – May 31',
    en: 'Registration Period: Teams of 1–3 participants can register for the competition. Registration is completely free and open to students worldwide.',
    ar: 'فترة التسجيل: يمكن للفرق المكونة من 1–3 مشاركين التسجيل في المسابقة. التسجيل مجاني تمامًا.',
  },
  {
    date: 'June 15',
    en: 'Trial Round: Familiarise yourself with the competition platform and test your technical setup before the official rounds begin.',
    ar: 'الجولة التجريبية: تعرف على منصة المسابقة واختبر إعداداتك التقنية.',
  },
  { date: 'June 20', en: 'First Round — see details below.', ar: 'الجولة الأولى — انظر التفاصيل أدناه.' },
  { date: 'June 22', en: 'Second Round — see details below.', ar: 'الجولة الثانية — انظر التفاصيل أدناه.' },
  { date: 'June 24', en: 'Third Round (Semi-Final) — see details below.', ar: 'الجولة الثالثة (نصف النهائي) — انظر التفاصيل أدناه.' },
  { date: 'June 27', en: 'Fourth Round (Final) — see details below.', ar: 'الجولة الرابعة (النهائي) — انظر التفاصيل أدناه.' },
];

const ROUNDS = [
  {
    badge: 'Round 1',
    en_title: 'First Round',
    ar_title: 'الجولة الأولى',
    date: 'June 20',
    en_desc: 'The opening round covers the fundamental laws of physics: mechanics, waves, thermodynamics, electricity, magnetism, optics, and modern physics. Questions are straightforward and formula-based — think F = ma level, where direct substitution is all you need.',
    ar_desc: 'تغطي الجولة الافتتاحية القوانين الأساسية في الفيزياء. الأسئلة مباشرة وتعتمد على التعويض في القوانين.',
    level: { icon: '⚡', en: 'F = ma level — direct substitution', ar: 'مستوى F = ma — تعويض مباشر' },
  },
  {
    badge: 'Round 2',
    en_title: 'Second Round',
    ar_title: 'الجولة الثانية',
    date: 'June 22',
    en_desc: 'The same curriculum as Round 1 — mechanics, waves, thermodynamics, electricity, magnetism, optics, and modern physics — but problems demand a deeper conceptual understanding and slightly higher difficulty. Expect more multi-step reasoning.',
    ar_desc: 'نفس منهج الجولة الأولى لكن المسائل تتطلب فهمًا مفاهيميًا أعمق وصعوبة أعلى قليلًا.',
    level: { icon: '🔬', en: 'Higher level — multi-step reasoning', ar: 'مستوى أعلى — استدلال متعدد الخطوات' },
  },
  {
    badge: 'Round 3',
    en_title: 'Semi-Final',
    ar_title: 'نصف النهائي',
    date: 'June 24',
    en_desc: 'The difficulty climbs further. Problems in this round begin to rely on calculus — derivatives and integrals are part of the solution process. Strong analytical skills and mathematical fluency are essential.',
    ar_desc: 'ترتفع الصعوبة أكثر. تبدأ مسائل هذه الجولة بالاعتماد على حساب التفاضل والتكامل.',
    level: { icon: '📐', en: 'Calc-Based — derivatives & integrals required', ar: 'مستوى Calculus — التفاضل والتكامل مطلوب' },
  },
  {
    badge: 'Round 4',
    en_title: 'Grand Final',
    ar_title: 'النهائي الكبير',
    date: 'June 27',
    en_desc: 'The ultimate challenge. The level in the Final Round reaches olympiad territory — expect problems that require deep physical intuition, creative problem-solving, and advanced mathematical tools.',
    ar_desc: 'التحدي الأقصى. يصل مستوى الجولة النهائية إلى مستوى الأولمبياد العلمي.',
    level: { icon: '🏆', en: 'Olympiad Level — highest difficulty', ar: 'مستوى الأولمبياد — أعلى صعوبة' },
  },
];

const TOPICS = ['Mechanics', 'Waves', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'];
const TOPICS_AR = ['الميكانيكا', 'الموجات', 'الديناميكا الحرارية', 'الكهرباء', 'المغناطيسية', 'البصريات', 'الفيزياء الحديثة'];

export default function Timeline() {
  const { lang } = useLang();
  return (
    <>
      <div className="glass-card">
        <h2 className="card-title">
          <T en="Competition Timeline" ar="الجدول الزمني للمسابقة" />
        </h2>
        <div className="card-content">
          <div className="timeline-list">
            {TIMELINE.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-date">{item.date}</div>
                <p>{lang === 'ar' ? item.ar : item.en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="Round Details" ar="تفاصيل الجولات" />
        </h2>
        <div className="card-content">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            <T
              en="All four rounds are built around physics only — covering the same core topics with increasing depth and complexity as you advance."
              ar="تعتمد الجولات الأربع على الفيزياء حصريًا — تغطي نفس المواضيع الأساسية مع زيادة العمق والتعقيد كلما تقدمت."
            />
          </p>
          {ROUNDS.map((r, i) => (
            <div className="round-card" key={i}>
              <div className="round-header">
                <span className="round-badge">{r.badge}</span>
                <span className="round-title">{lang === 'ar' ? r.ar_title : r.en_title}</span>
                <span className="round-date">{r.date}</span>
              </div>
              <p className="round-desc">{lang === 'ar' ? r.ar_desc : r.en_desc}</p>
              <div className="topics-list">
                {(lang === 'ar' ? TOPICS_AR : TOPICS).map(t => (
                  <span className="topic-tag" key={t}>{t}</span>
                ))}
              </div>
              <div className="round-level">
                {r.level.icon} {lang === 'ar' ? r.level.ar : r.level.en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
