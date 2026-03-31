import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

const TIMELINE = [
  {
    date: 'March 11 – May 31',
    en: 'Registration Period: Teams of 1–3 participants can register for the competition. Registration is completely free and open to students worldwide.',
    ar: 'فترة التسجيل: يمكن للفرق المؤلفة من 1 إلى 3 مشاركين التسجيل في المسابقة. التسجيل مجاني تمامًا ومتاح للطلاب من جميع دول العالم.',
  },
  {
    date: 'June 15',
    en: 'Trial Round: Familiarise yourself with the competition platform and test your technical setup before the official rounds begin.',
    ar: 'الجولة التجريبية: تعرّف على منصة المسابقة واختبر إعداداتك التقنية قبل انطلاق الجولات الرسمية.',
  },
  { date: 'June 20', en: 'First Round — see details below.', ar: 'الجولة الأولى — راجع التفاصيل أدناه.' },
  { date: 'June 22', en: 'Second Round — see details below.', ar: 'الجولة الثانية — راجع التفاصيل أدناه.' },
  { date: 'June 24', en: 'Third Round (Semi-Final) — see details below.', ar: 'الجولة الثالثة (نصف النهائي) — راجع التفاصيل أدناه.' },
  { date: 'June 27', en: 'Fourth Round (Final) — see details below.', ar: 'الجولة الرابعة (النهائي الكبير) — راجع التفاصيل أدناه.' },
];

const ROUNDS = [
  {
    badge: 'Round 1',
    en_title: 'First Round',
    ar_title: 'الجولة الأولى',
    date: 'June 20',
    en_desc: 'The opening round covers the fundamental laws of physics: mechanics, waves, thermodynamics, electricity, magnetism, optics, and modern physics. Questions are straightforward and formula-based — think F = ma level, where direct substitution is all you need.',
    ar_desc: 'تغطي الجولة الافتتاحية القوانين الأساسية في الفيزياء: الميكانيكا والموجات والديناميكا الحرارية والكهرباء والمغناطيسية والبصريات والفيزياء الحديثة. الأسئلة مباشرة وتعتمد على التعويض في القوانين — على غرار مستوى F = ma، حيث يكفي التعويض المباشر.',
    level: { icon: '⚡', en: 'F = ma level — direct substitution', ar: 'مستوى F = ma — تعويض مباشر في القانون' },
  },
  {
    badge: 'Round 2',
    en_title: 'Second Round',
    ar_title: 'الجولة الثانية',
    date: 'June 22',
    en_desc: 'The same curriculum as Round 1 — mechanics, waves, thermodynamics, electricity, magnetism, optics, and modern physics — but problems demand a deeper conceptual understanding and slightly higher difficulty. Expect more multi-step reasoning.',
    ar_desc: 'نفس منهج الجولة الأولى — الميكانيكا والموجات والديناميكا الحرارية والكهرباء والمغناطيسية والبصريات والفيزياء الحديثة — غير أن المسائل تتطلب فهماً مفاهيمياً أعمق وتكتسب صعوبة أعلى تدريجياً. توقع مسائل متعددة الخطوات تستلزم استدلالاً منطقياً أوسع.',
    level: { icon: '🔬', en: 'Higher level — multi-step reasoning', ar: 'مستوى أعلى — استدلال منطقي متعدد الخطوات' },
  },
  {
    badge: 'Round 3',
    en_title: 'Semi-Final',
    ar_title: 'نصف النهائي',
    date: 'June 24',
    en_desc: 'The difficulty climbs further. Problems in this round begin to rely on calculus — derivatives and integrals are part of the solution process. Strong analytical skills and mathematical fluency are essential.',
    ar_desc: 'ترتفع درجة الصعوبة إلى مستوى جديد. تبدأ مسائل هذه الجولة بالاعتماد على حساب التفاضل والتكامل، إذ تُعدّ المشتقات والتكاملات جزءاً أساسياً من عملية الحل. تُعدّ القدرات التحليلية القوية والطلاقة الرياضية متطلباً لا غنى عنه.',
    level: { icon: '📐', en: 'Calc-Based — derivatives & integrals required', ar: 'مستوى حساب التفاضل والتكامل — المشتقات والتكاملات مطلوبة' },
  },
  {
    badge: 'Round 4',
    en_title: 'Grand Final',
    ar_title: 'النهائي الكبير',
    date: 'June 27',
    en_desc: 'The ultimate challenge. The level in the Final Round reaches olympiad territory — expect problems that require deep physical intuition, creative problem-solving, and advanced mathematical tools.',
    ar_desc: 'التحدي الأقصى. يرتقي مستوى الجولة النهائية إلى عالم الأولمبياد العلمي — توقع مسائل تستدعي حدسًا فيزيائيًا عميقًا وأسلوباً إبداعياً في حل المشكلات وأدوات رياضية متقدمة.',
    level: { icon: '🏆', en: 'Olympiad Level — highest difficulty', ar: 'مستوى الأولمبياد — أعلى درجات الصعوبة' },
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
