import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

function PrizeItem({ name, desc, value }) {
  return (
    <div className="prize-item">
      <div className="prize-item-text">
        <div className="prize-item-name">{name}</div>
        <div className="prize-item-desc">{desc}</div>
      </div>
      <div className="prize-item-value">{value}</div>
    </div>
  );
}

const PARTNERS = [
  {
    name: 'Wolfram|Alpha',
    logo: '/img/wolfram-corporate-logo-stacked-med.png',
    description: 'Computational intelligence engine powering STEM education worldwide.',
    description_ar: 'محرك الذكاء الحسابي الرائد الذي يُعزز تعليم العلوم والتكنولوجيا والهندسة والرياضيات حول العالم.',
    tier: 'platinum',
  },
  {
    name: 'Brilliant',
    logo: '/img/brilliant-logo.png.jpeg',
    description: 'Interactive learning platform for math, science, and computer science.',
    description_ar: 'منصة تعلّم تفاعلية متميزة في الرياضيات والعلوم وعلوم الحاسب.',
    tier: 'gold',
  },
  {
    name: 'The Physics Classroom',
    logo: '/img/physicsclassroom.png',
    description: 'Trusted physics learning resource used by students and teachers globally.',
    description_ar: 'مرجع تعليمي موثوق في الفيزياء يستخدمه الطلاب والمعلمون من جميع أنحاء العالم.',
    tier: 'gold',
  },
  {
    name: 'Art of Problem Solving',
    logo: '/img/AoPS_Main_Logo (1).png',
    description: 'Premier mathematics curriculum and community for advanced learners.',
    description_ar: 'منهج رياضيات متقدم ومجتمع علمي رائد يخدم المتعلمين الموهوبين على المستوى الدولي.',
    tier: 'silver',
  },
];

function PartnerCard({ partner, lang }) {
  return (
    <div className="partner-card">
      <div className="partner-logo-wrap">
        <img src={partner.logo} alt={`${partner.name} logo`} className="partner-logo" />
      </div>
      <div className="partner-info">
        <div className="partner-name">{partner.name}</div>
        <div className="partner-desc">{lang === 'ar' ? partner.description_ar : partner.description}</div>
      </div>
    </div>
  );
}

export default function PartnersAndPrizes() {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;
  return (
    <>
      {/* ── PARTNERS SECTION ── */}
      <div className="glass-card">
        <h2 className="card-title">
          <T en="Our Partners" ar="شركاؤنا" />
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
          <T
            en="Pharaohs' Fragments League is proud to partner with world-class educational platforms to bring exceptional prizes and resources to our participants."
            ar="يفخر دوري شظايا الفراعنة بالشراكة مع منصات تعليمية عالمية المستوى لتقديم جوائز موارد استثنائية لمشاركينا من جميع أنحاء العالم."
          />
        </p>

        <div className="partners-grid">
          {PARTNERS.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} lang={lang} />
          ))}
        </div>
      </div>

      {/* ── PRIZES SECTION ── */}
      <div className="glass-card">
        <h2 className="card-title">
          <T en="Partners & Prizes" ar="الشركاء والجوائز" />
        </h2>

        {/* Prize pool banner */}
        <div className="prize-pool-banner">
          <div className="prize-pool-amount">$550,000+</div>
          <div className="prize-pool-label">
            <T en="Total Prize Pool" ar="إجمالي قيمة الجوائز" />
          </div>
        </div>

        {/* ALL PARTICIPANTS */}
        <div className="section-label">
          <T en="All Registered Participants" ar="جميع المشاركين المسجلين" />
        </div>
        <div className="prize-tier blue-tier">
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              <T en="All Participants" ar="جميع المشاركين" />
            </span>
          </div>
          <PrizeItem
            name={p('Wolfram|Alpha Premium: 3-Month Subscription', 'اشتراك Wolfram|Alpha Premium: 3 أشهر')}
            desc={p(
              "Every registered participant receives a 3-month Wolfram|Alpha Premium subscription upon completing Round 1. Access the world's most powerful computational engine.",
              'يحصل كل مشارك مسجل على اشتراك مدته ثلاثة أشهر في Wolfram|Alpha Premium عند إتمام الجولة الأولى. استمتع بالوصول إلى أقوى محرك حسابي في العالم.'
            )}
            value="$415 value"
          />
        </div>

        {/* ROUND 2 QUALIFIERS */}
        <div className="section-label">
          <T en="Round 2 Qualifiers: Physics Tracks" ar="متأهلو الجولة الثانية: مسارات الفيزياء" />
        </div>
        <div className="prize-tier green-tier">
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              <T en="First 50% of Round 2 Qualifiers" ar="أوائل 50% من متأهلي الجولة الثانية" />{' '}
              <span className="prize-badge badge-r2">Round 2</span>
            </span>
          </div>
          <PrizeItem
            name={p('The Physics Classroom: 1.5-Year Subscription', 'اشتراك The Physics Classroom: سنة ونصف')}
            desc={p(
              "Awarded to the top 50% of teams advancing through Round 2. Unlock premium access to The Physics Classroom's full library — physics, mathematics, and chemistry — for 18 months.",
              'تُمنح هذه الجائزة لأفضل 50% من الفرق المتأهلة في الجولة الثانية. احصل على وصول متميز للمكتبة الكاملة لـ The Physics Classroom — الفيزياء والرياضيات والكيمياء — لمدة 18 شهراً.'
            )}
            value="1.5 Years"
          />
        </div>

        {/* SEMI-FINALISTS */}
        <div className="section-label">
          <T en="Semi-Final Teams (Round 3)" ar="فرق نصف النهائي (الجولة الثالثة)" />
        </div>
        <div className="prize-tier silver-tier">
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              <T en="All Semi-Final Teams" ar="جميع فرق نصف النهائي" />{' '}
              <span className="prize-badge badge-semi">Semi-Final</span>
            </span>
          </div>
          <PrizeItem
            name={p('The Physics Classroom: 3-Year Subscription', 'اشتراك The Physics Classroom: 3 سنوات')}
            desc={p(
              'All teams reaching the Semi-Finals earn a 3-year subscription to The Physics Classroom — with full access to physics, mathematics, and chemistry courses.',
              'تحصل جميع الفرق التي تبلغ نصف النهائي على اشتراك لمدة 3 سنوات في The Physics Classroom، مع وصول كامل إلى مسارات الفيزياء والرياضيات والكيمياء.'
            )}
            value="3 Years"
          />
        </div>

        {/* 3 FINALISTS */}
        <div className="section-label">
          <T en="The 3 Finalist Teams (Final Round)" ar="الفرق الثلاث الفائزة (الجولة النهائية)" />
        </div>
        <div className="prize-tier gold-tier">
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              <T en="All 3 Finalist Teams" ar="الفرق الثلاث الفائزة" />{' '}
              <span className="prize-badge badge-final">Final Round</span>
            </span>
          </div>
          <PrizeItem
            name={p('Wolfram|Alpha: 1-Year Premium Subscription', 'اشتراك Wolfram|Alpha Premium: سنة كاملة')}
            desc={p(
              'Each of the three finalist teams (up to 9 subscriptions total: one per team member) receives a full 1-year Wolfram|Alpha Premium subscription.',
              'تحصل كل فريق من الفرق الثلاث الفائزة (ما يصل إلى 9 اشتراكات إجمالاً، اشتراك واحد لكل عضو) على اشتراك كامل لمدة سنة في Wolfram|Alpha Premium.'
            )}
            value="$1,660 value"
          />
          <PrizeItem
            name={p('Brilliant.org: 1-Year Premium Subscription', 'اشتراك Brilliant.org Premium: سنة كاملة')}
            desc={p(
              'All three finalist teams (up to 9 subscriptions total) receive a 1-year Brilliant Premium subscription — interactive, world-class courses in math, science, and CS.',
              'تحصل الفرق الثلاث الفائزة (ما يصل إلى 9 اشتراكات إجمالاً) على اشتراك لمدة سنة في Brilliant Premium — دورات تفاعلية عالمية المستوى في الرياضيات والعلوم وعلوم الحاسب.'
            )}
            value={p('Up to 9 subs', 'حتى 9 اشتراكات')}
          />
          <PrizeItem
            name={p('The Physics Classroom: Lifetime Subscription', 'اشتراك The Physics Classroom: مدى الحياة')}
            desc={p(
              'Every member of the three finalist teams earns lifetime access to The Physics Classroom across all physics, mathematics, and chemistry courses.',
              'يحصل كل عضو في الفرق الثلاث الفائزة على وصول مدى الحياة إلى The Physics Classroom يشمل جميع مسارات الفيزياء والرياضيات والكيمياء.'
            )}
            value="Lifetime ♾️"
          />
        </div>

        {/* 1ST PLACE */}
        <div className="section-label">
          <T en="1st Place Team: Grand Champion Exclusives" ar="الفريق الأول: حصريات البطل الكبير" />
        </div>
        <div className="prize-tier gold-tier" style={{ borderColor: 'rgba(255,215,0,0.85)', boxShadow: '0 0 45px rgba(255,215,0,0.28)' }}>
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              🥇 <T en="Grand Champions: 1st Place Only" ar="الأبطال الكبار: المركز الأول حصراً" />
            </span>
          </div>
          <PrizeItem
            name={p('3 × $25 Gift Coupons', '3 قسائم هدايا بقيمة 25$ لكل منها')}
            desc={p(
              "The first-place team receives three exclusive $25 gift coupons — celebrate your historic victory as champions of the Pharaohs' Fragments League.",
              "يحصل الفريق الفائز بالمركز الأول على ثلاث قسائم هدايا حصرية بقيمة 25$ لكل منها — احتفل بانتصارك التاريخي بوصفك بطلاً لدوري شظايا الفراعنة."
            )}
            value="$75 total"
          />
        </div>

        {/* SUMMARY TABLE */}
        <div className="section-label">
          <T en="Prize Summary" ar="ملخص الجوائز" />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="prize-table">
            <thead>
              <tr>
                <th><T en="Level" ar="المستوى" /></th>
                <th><T en="Prize" ar="الجائزة" /></th>
                <th style={{ textAlign: 'right' }}><T en="Value" ar="القيمة" /></th>
              </tr>
            </thead>
            <tbody>
              {[
                { level_en: 'All Participants',     level_ar: 'جميع المشاركين',        prize: 'Wolfram|Alpha Premium',          val: '3 Months ($415)' },
                { level_en: 'Top 50% Round 2',      level_ar: 'أوائل 50% الجولة 2',    prize: 'Physics Classroom',              val: '1.5 Years' },
                { level_en: 'Semi-Finalists',       level_ar: 'متأهلو نصف النهائي',    prize: 'Physics Classroom',              val: '3 Years' },
                { level_en: '3 Final Teams',        level_ar: 'الفرق الثلاث الفائزة',  prize: 'Wolfram|Alpha Premium (×9)',     val: '1 Year ($1,660)' },
                { level_en: '3 Final Teams',        level_ar: 'الفرق الثلاث الفائزة',  prize: 'Brilliant Premium (×9)',         val: '1 Year' },
                { level_en: '3 Final Teams',        level_ar: 'الفرق الثلاث الفائزة',  prize: 'Physics Classroom (×9)',         val: 'Lifetime ♾️' },
                { level_en: '🥇 1st Place',         level_ar: '🥇 المركز الأول',       prize: '3 × $25 Gift Coupons',           val: '$75' },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{lang === 'ar' ? row.level_ar : row.level_en}</td>
                  <td>{row.prize}</td>
                  <td style={{ textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>{row.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
