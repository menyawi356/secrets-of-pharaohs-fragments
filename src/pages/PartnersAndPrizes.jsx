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

export default function PartnersAndPrizes() {
  return (
    <>
      <div className="glass-card">
        <h2 className="card-title">
          <T en="Partners & Prizes" ar="الشركاء والجوائز" />
        </h2>

        {/* Prize pool banner */}
        <div className="prize-pool-banner">
          <div className="prize-pool-amount">$3,000+</div>
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
            name="Wolfram|Alpha Premium: 3-Month Subscription"
            desc="Every registered participant receives a 3-month Wolfram|Alpha Premium subscription upon completing Round 1. Access the world's most powerful computational engine."
            value="$415 value"
          />
        </div>

        {/* ROUND 2 QUALIFIERS */}
        <div className="section-label">
          <T en="Round 2 Qualifiers: Physics Tracks" ar="متأهلو الجولة الثانية" />
        </div>
        <div className="prize-tier green-tier">
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              <T en="First 50% of Round 2 Qualifiers" ar="أوائل 50% من متأهلي الجولة الثانية" />{' '}
              <span className="prize-badge badge-r2">Round 2</span>
            </span>
          </div>
          <PrizeItem
            name="The Physics Classroom: 1.5-Year Subscription"
            desc="Awarded to the top 50% of teams advancing through Round 2. Unlock premium access to The Physics Classroom's full library — physics, mathematics, and chemistry — for 18 months."
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
            name="The Physics Classroom: 3-Year Subscription"
            desc="All teams reaching the Semi-Finals earn a 3-year subscription to The Physics Classroom — with full access to physics, mathematics, and chemistry courses."
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
            name="Wolfram|Alpha: 1-Year Premium Subscription"
            desc="Each of the three finalist teams (up to 9 subscriptions total: one per team member) receives a full 1-year Wolfram|Alpha Premium subscription."
            value="$1,660 value"
          />
          <PrizeItem
            name="Brilliant.org: 1-Year Premium Subscription"
            desc="All three finalist teams (up to 9 subscriptions total) receive a 1-year Brilliant Premium subscription — interactive, world-class courses in math, science, and CS."
            value="Up to 9 subs"
          />
          <PrizeItem
            name="The Physics Classroom: Lifetime Subscription"
            desc="Every member of the three finalist teams earns lifetime access to The Physics Classroom across all physics, mathematics, and chemistry courses."
            value="Lifetime ♾️"
          />
        </div>

        {/* 1ST PLACE */}
        <div className="section-label">
          <T en="1st Place Team: Grand Champion Exclusives" ar="الفريق الأول: حصريات البطل" />
        </div>
        <div className="prize-tier gold-tier" style={{ borderColor: 'rgba(255,215,0,0.85)', boxShadow: '0 0 45px rgba(255,215,0,0.28)' }}>
          <div className="prize-tier-header">
            <span className="prize-tier-title">
              🥇 <T en="Grand Champions: 1st Place Only" ar="الأبطال الكبار: المركز الأول فقط" />
            </span>
          </div>
          <PrizeItem
            name="3 × $25 Gift Coupons"
            desc="The first-place team receives three exclusive $25 gift coupons — celebrate your historic victory as champions of the Pharaohs' Fragments League."
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
                { level: 'All Participants', prize: 'Wolfram|Alpha Premium', val: '3 Months ($415)' },
                { level: 'Top 50% Round 2', prize: 'Physics Classroom', val: '1.5 Years' },
                { level: 'Semi-Finalists', prize: 'Physics Classroom', val: '3 Years' },
                { level: '3 Final Teams', prize: 'Wolfram|Alpha Premium (×9)', val: '1 Year ($1,660)' },
                { level: '3 Final Teams', prize: 'Brilliant Premium (×9)', val: '1 Year' },
                { level: '3 Final Teams', prize: 'Physics Classroom (×9)', val: 'Lifetime ♾️' },
                { level: '🥇 1st Place', prize: '3 × $25 Gift Coupons', val: '$75' },
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row.level}</td>
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
