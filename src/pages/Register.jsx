import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase.js';
import { showToast } from '../components/Toast.jsx';
import { useLang } from '../context/LanguageContext.jsx';
import { trackReferral } from './Ambassador.jsx';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const RECAPTCHA_SITE_KEY  = '6LeCwYwsAAAAABCeRRqfvzAAk5tba3yWoepWuTeO';
const EMAILJS_SERVICE_ID  = 'service_9sbdti2';
const EMAILJS_TEMPLATE_ID = 'template_9qjq5m5';
const EMAILJS_PUBLIC_KEY  = '0wulNcNqCcnTDMG3o';
const ADMIN_CODE          = '20202062055';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function ensureAuth() {
  if (auth.currentUser) return;
  await signInAnonymously(auth);
}

async function getRecaptchaToken() {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) { reject(new Error('reCAPTCHA not loaded')); return; }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' }).then(resolve).catch(reject);
    });
  });
}

let emailjsReady = false;
async function loadEmailJS() {
  if (emailjsReady) return;
  if (window.emailjs) { emailjsReady = true; return; }
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      emailjsReady = true;
      resolve();
    };
    s.onerror = () => reject(new Error('EmailJS failed to load'));
    document.head.appendChild(s);
  });
}

const AMBASSADOR_PROGRAM_URL = 'https://pharaohleague.org/ambassador';

const CONNECT_WITH_US = {
  instagram:         'https://www.instagram.com/pharaohsfragments.info/',
  whatsapp:          'https://chat.whatsapp.com/FYimIj9xEpACzNtM4D1OqK?mode=gi_t',
  whatsapp_channel:  'https://whatsapp.com/channel/0029Vb7t9OV9sBI3isU0lU2m',
  telegram_channel:  'https://t.me/+xQJzhdMvO282MDc0',
  telegram_chat:     'https://t.me/IPHFLChat',
  linkedin:          'https://www.linkedin.com/in/pharaohs-fragments-b097253b6',
  twitter:           'https://x.com/PharaohsF57933',
  website:           'https://pharaohleague.org/',
  support_email:     'support@pharaohleague.org',
};

async function sendConfirmationEmail(toEmail, toName, teamName, country = '') {
  try {
    await loadEmailJS();
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:              toEmail,
      to_name:               toName,
      team_name:             teamName,
      country:               country,
      ambassador_link:       AMBASSADOR_PROGRAM_URL,
      reply_to:              CONNECT_WITH_US.support_email,
      connect_instagram:     CONNECT_WITH_US.instagram,
      connect_whatsapp:      CONNECT_WITH_US.whatsapp,
      connect_whatsapp_ch:   CONNECT_WITH_US.whatsapp_channel,
      connect_telegram_ch:   CONNECT_WITH_US.telegram_channel,
      connect_telegram_chat: CONNECT_WITH_US.telegram_chat,
      connect_linkedin:      CONNECT_WITH_US.linkedin,
      connect_twitter:       CONNECT_WITH_US.twitter,
      connect_website:       CONNECT_WITH_US.website,
      connect_email:         CONNECT_WITH_US.support_email,
    });
  } catch (err) {
    console.warn('Could not send confirmation email to', toEmail, err);
  }
}

async function isEmailRegistered(email) {
  for (const field of ['leader_email', 'member2_email', 'member3_email']) {
    const snap = await getDocs(query(collection(db, 'registrations'), where(field, '==', email)));
    if (!snap.empty) return true;
  }
  return false;
}

// ─── EMAIL DELIVERABILITY CHECK ───────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','10minutemail.com',
  'throwaway.email','yopmail.com','trashmail.com','fakeinbox.com',
  'sharklasers.com','guerrillamailblock.com','grr.la','guerrillamail.info',
  'spam4.me','maildrop.cc','dispostable.com','spamgourmet.com',
  'trashmail.me','getairmail.com','discard.email','spamevader.com',
]);

async function checkEmailDeliverable(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return { ok: false, reason: 'Invalid email format.' };
  }
  const domain = email.split('@')[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, reason: `Disposable email addresses are not allowed (${domain}).` };
  }
  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0) {
        return { ok: true };
      }
      return { ok: false, reason: `The domain "${domain}" does not appear to accept emails. Please use a valid working email address.` };
    }
  } catch {
    console.warn('DNS check failed for', domain, '— proceeding anyway');
    return { ok: true };
  }
  return { ok: false, reason: `Could not verify the email domain "${domain}". Please use a working email address.` };
}

async function isTeamNameTaken(teamName) {
  const snap = await getDocs(
    query(collection(db, 'registrations'), where('team_name_lower', '==', teamName.toLowerCase()))
  );
  return !snap.empty;
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── MEMBER SECTION ───────────────────────────────────────────────────────────
function MemberSection({ id, label, fields, onToggle, open, onChange }) {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <button
        type="button"
        className={`member-toggle-btn${open ? ' active' : ''}`}
        onClick={onToggle}
      >
        <span className="toggle-icon">{open ? '－' : '＋'}</span>
        {label}
      </button>
      {open && (
        <div className="member-fields">
          <div className="member-section-title">{label}</div>
          <div className="form-group">
            <label className="form-label">{p('Full Name', 'الاسم الكامل')} *</label>
            <input className="form-input" type="text" value={fields.name} onChange={e => onChange('name', e.target.value)} placeholder={p('Full name', 'الاسم الكامل')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{p('Email', 'البريد الإلكتروني')}</label>
              <input className="form-input" type="email" value={fields.email} onChange={e => onChange('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">{p('School / University', 'المدرسة / الجامعة')} *</label>
              <input className="form-input" type="text" value={fields.school} onChange={e => onChange('school', e.target.value)} placeholder={p('Institution name', 'اسم المؤسسة')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{p('Country', 'الدولة')} *</label>
            <input className="form-input" type="text" value={fields.country} onChange={e => onChange('country', e.target.value)} placeholder={p('Country', 'الدولة')} required />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTeams() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'registrations'), orderBy('submitted_at', 'desc')));
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTeams(); }, []);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const filtered = filter
    ? teams.filter(t =>
        [t.team_name, t.leader_name, t.leader_school, t.leader_country, t.leader_email]
          .some(v => (v || '').toLowerCase().includes(filter.toLowerCase()))
      )
    : teams;

  const totalMembers = teams.reduce((acc, t) => acc + 1 + (t.member2_name ? 1 : 0) + (t.member3_name ? 1 : 0), 0);
  const countries = new Set(teams.map(t => (t.leader_country || '').trim().toLowerCase()).filter(Boolean));

  return (
    <div className="admin-overlay">
      <div className="dash-header">
        <div className="dash-title">🏛️ Admin Dashboard</div>
        <div className="dash-actions">
          <button className="dash-btn" onClick={loadTeams}>↻ Refresh</button>
          <button className="dash-btn close" onClick={onClose}>✕ Close</button>
        </div>
      </div>

      <div className="dash-stats">
        {[
          { num: teams.length, label: 'Teams' },
          { num: totalMembers, label: 'Participants' },
          { num: countries.size, label: 'Countries' },
          { num: teams.filter(t => !t.member2_name && !t.member3_name).length, label: 'Solo' },
          { num: teams.filter(t => t.member2_name && !t.member3_name).length, label: 'Duo' },
          { num: teams.filter(t => t.member2_name && t.member3_name).length, label: 'Trio' },
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-number">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-search">
        <input
          type="text"
          placeholder="Search teams, leaders, countries..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,215,0,0.15)', borderRadius: '10px', margin: '0 auto', maxWidth: '1100px' }}>
          {teams.length === 0 ? 'No registrations yet.' : 'No results match your search.'}
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team Name</th>
                <th>Size</th>
                <th>Members</th>
                <th>Leader Email</th>
                <th>School</th>
                <th>Country</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const memberCount = 1 + (t.member2_name ? 1 : 0) + (t.member3_name ? 1 : 0);
                let dateStr = '—';
                if (t.submitted_at?.toDate) {
                  const d = t.submitted_at.toDate();
                  dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                }
                return (
                  <tr key={t.id}>
                    <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>{i + 1}</td>
                    <td className="team-name-cell">{esc(t.team_name || '—')}</td>
                    <td><span className="member-badge">{memberCount}</span></td>
                    <td>
                      <div className="members-detail">
                        <strong style={{ color: 'var(--text)' }}>{esc(t.leader_name || '—')}</strong>{' '}
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>(Leader)</span>
                        {t.member2_name && <><br />{esc(t.member2_name)}</>}
                        {t.member3_name && <><br />{esc(t.member3_name)}</>}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{esc(t.leader_email || '—')}</td>
                    <td>{esc(t.leader_school || '—')}</td>
                    <td>{esc(t.leader_country || '—')}</td>
                    <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{dateStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN REGISTER PAGE ───────────────────────────────────────────────────────
const EMPTY_MEMBER = { name: '', email: '', school: '', country: '' };

export default function Register() {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;

  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [teamName, setTeamName] = useState('');
  const [leader, setLeader] = useState({ name: '', email: '', school: '', country: '' });
  const [m2Open, setM2Open] = useState(false);
  const [m3Open, setM3Open] = useState(false);
  const [m2, setM2] = useState({ ...EMPTY_MEMBER });
  const [m3, setM3] = useState({ ...EMPTY_MEMBER });
  const [inlineError, setInlineError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | registering | sending | failed
  const [registrationFailed, setRegistrationFailed] = useState(false);
  const leaderNameRef = useRef(null);
  const [adminOpen, setAdminOpen] = useState(false);

  // Secret code trigger
  useEffect(() => {
    if (leader.name === ADMIN_CODE) {
      setLeader(l => ({ ...l, name: '' }));
      setAdminOpen(true);
    }
  }, [leader.name]);

  const handleLeaderChange = (field, value) => setLeader(l => ({ ...l, [field]: value }));
  const handleM2Change = (field, value) => setM2(m => ({ ...m, [field]: value }));
  const handleM3Change = (field, value) => setM3(m => ({ ...m, [field]: value }));

  const toggleM2 = () => {
    setM2Open(v => !v);
    if (m2Open) setM2({ ...EMPTY_MEMBER });
  };
  const toggleM3 = () => {
    setM3Open(v => !v);
    if (m3Open) setM3({ ...EMPTY_MEMBER });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setInlineError('');
    setRegistrationFailed(false);

    const leaderEmail   = leader.email.trim().toLowerCase();
    const m2Email       = m2Open && m2.email ? m2.email.trim().toLowerCase() : null;
    const m3Email       = m3Open && m3.email ? m3.email.trim().toLowerCase() : null;

    try {
      // reCAPTCHA
      setStatus('checking');
      try {
        const token = await getRecaptchaToken();
        window._rcToken = token;
      } catch { /* fail open */ }

      // Auth
      await ensureAuth();

      // Duplicate team name
      if (await isTeamNameTaken(teamName.trim())) {
        setInlineError(`The team name "${teamName}" is already registered. Please choose a different name.`);
        setStatus('idle'); return;
      }

      // Email deliverability checks
      setStatus('checking');
      const emailsToCheck = [
        { email: leaderEmail, label: 'Leader email' },
        ...(m2Email ? [{ email: m2Email, label: 'Member 2 email' }] : []),
        ...(m3Email ? [{ email: m3Email, label: 'Member 3 email' }] : []),
      ];

      for (const { email, label } of emailsToCheck) {
        const check = await checkEmailDeliverable(email);
        if (!check.ok) {
          setInlineError(`${label} (${email}) failed verification: ${check.reason}`);
          setRegistrationFailed(true);
          setStatus('idle'); return;
        }
      }

      // Duplicate emails (already-registered check)
      for (const email of [leaderEmail, m2Email, m3Email].filter(Boolean)) {
        if (await isEmailRegistered(email)) {
          setInlineError(`The email ${email} has already been used. Each participant may only register once.`);
          setStatus('idle'); return;
        }
      }

      // Save to Firestore
      setStatus('registering');
      await addDoc(collection(db, 'registrations'), {
        team_name:        teamName.trim(),
        team_name_lower:  teamName.trim().toLowerCase(),
        leader_name:      leader.name.trim(),
        leader_email:     leaderEmail,
        leader_school:    leader.school.trim(),
        leader_country:   leader.country.trim(),
        member2_name:     m2Open ? m2.name.trim() : null,
        member2_email:    m2Email,
        member2_school:   m2Open ? m2.school.trim() : null,
        member2_country:  m2Open ? m2.country.trim() : null,
        member3_name:     m3Open ? m3.name.trim() : null,
        member3_email:    m3Email,
        member3_school:   m3Open ? m3.school.trim() : null,
        member3_country:  m3Open ? m3.country.trim() : null,
        recaptcha_token:  window._rcToken || null,
        referred_by:      refCode ? refCode.toUpperCase() : null,
        submitted_at:     serverTimestamp(),
      });

      // Track ambassador referral
      if (refCode) await trackReferral(refCode);

      // Send confirmation emails
      setStatus('sending');
      const jobs = [sendConfirmationEmail(leaderEmail, leader.name.trim(), teamName.trim(), leader.country.trim())];
      if (m2Email) jobs.push(sendConfirmationEmail(m2Email, m2.name.trim(), teamName.trim(), m2.country.trim()));
      if (m3Email) jobs.push(sendConfirmationEmail(m3Email, m3.name.trim(), teamName.trim(), m3.country.trim()));
      await Promise.allSettled(jobs);

      showToast(`✅ Team "${teamName.trim()}" registered! Confirmation emails sent.`);
      // Reset
      setTeamName(''); setLeader({ name:'', email:'', school:'', country:'' });
      setM2({ ...EMPTY_MEMBER }); setM3({ ...EMPTY_MEMBER });
      setM2Open(false); setM3Open(false);
      setRegistrationFailed(false);

    } catch (err) {
      console.error(err);
      setRegistrationFailed(true);
      setInlineError('Registration failed due to a technical error. Please check your connection and try again.');
      showToast('⚠️ Registration failed. Please check your connection and try again.', 'error');
    } finally {
      setStatus('idle');
    }
  };

  const btnLabel = {
    idle:        p('Submit Registration', 'إرسال التسجيل'),
    checking:    p('Verifying emails…', 'جاري التحقق من البريد…'),
    registering: p('Registering…', 'جاري التسجيل…'),
    sending:     p('Sending confirmation…', 'إرسال التأكيد…'),
  }[status];

  return (
    <>
      {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}

      <div className="glass-card">
        <h2 className="card-title">
          {p("Register Your Team", "سجّل فريقك")}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
          {p(
            "Registration is free and open until May 31, 2026. Teams of 1–3 participants are welcome. All rounds are held online.",
            "التسجيل مجاني ومفتوح حتى 31 مايو 2026. الفرق من 1-3 مشاركين مرحب بهم. جميع الجولات عبر الإنترنت."
          )}
        </p>

        {refCode && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,212,255,0.04))',
            border: '1.5px solid rgba(0,212,255,0.35)',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            color: 'var(--cyan)',
            fontWeight: 500,
          }}>
            🔗 {p(`You were invited by ambassador code: ${refCode.toUpperCase()}`, `دُعيت عبر رمز السفير: ${refCode.toUpperCase()}`)}
          </div>
        )}

        {registrationFailed && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.15), rgba(220,38,38,0.05))',
            border: '2px solid rgba(220,38,38,0.6)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1rem', color: '#f87171' }}>
              <span style={{ fontSize: '1.3rem' }}>❌</span>
              <span>{p('Registration Failed', 'فشل التسجيل')}</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#fca5a5', lineHeight: 1.5 }}>
              {inlineError || p(
                'Your registration could not be completed. Please fix the issue above and try again.',
                'تعذّر إتمام تسجيلك. يرجى تصحيح المشكلة أعلاه والمحاولة مجدداً.'
              )}
            </div>
          </div>
        )}

        {!registrationFailed && inlineError && (
          <div className="inline-error">
            <span>⚠️</span>
            <span>{inlineError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Team Name */}
          <div className="form-group">
            <label className="form-label">{p('Team Name', 'اسم الفريق')} *</label>
            <input
              className="form-input"
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder={p('Enter your unique team name', 'اسم فريقك المميز')}
              required
            />
          </div>

          {/* Leader */}
          <div style={{
            background: 'rgba(255,215,0,0.035)',
            border: '1px solid rgba(255,215,0,0.18)',
            borderRadius: '10px',
            padding: '1.25rem',
            marginBottom: '0.75rem',
          }}>
            <div className="member-section-title">
              👑 {p('Team Leader (required)', 'قائد الفريق (مطلوب)')}
            </div>
            <div className="form-group">
              <label className="form-label">{p('Full Name', 'الاسم الكامل')} *</label>
              <input
                className="form-input"
                type="text"
                ref={leaderNameRef}
                value={leader.name}
                onChange={e => handleLeaderChange('name', e.target.value)}
                placeholder={p('Full name', 'الاسم الكامل')}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{p('Email', 'البريد الإلكتروني')} *</label>
                <input
                  className="form-input"
                  type="email"
                  value={leader.email}
                  onChange={e => handleLeaderChange('email', e.target.value)}
                  placeholder="leader@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">{p('School / University', 'المدرسة / الجامعة')} *</label>
                <input
                  className="form-input"
                  type="text"
                  value={leader.school}
                  onChange={e => handleLeaderChange('school', e.target.value)}
                  placeholder={p('Institution name', 'اسم المؤسسة')}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{p('Country', 'الدولة')} *</label>
              <input
                className="form-input"
                type="text"
                value={leader.country}
                onChange={e => handleLeaderChange('country', e.target.value)}
                placeholder={p('Your country', 'دولتك')}
                required
              />
            </div>
          </div>

          {/* Member 2 */}
          <MemberSection
            id="m2"
            label={`＋ ${p('Add Team Member 2', 'إضافة عضو الفريق الثاني')}`}
            open={m2Open}
            onToggle={toggleM2}
            fields={m2}
            onChange={handleM2Change}
          />

          {/* Member 3 */}
          <MemberSection
            id="m3"
            label={`＋ ${p('Add Team Member 3', 'إضافة عضو الفريق الثالث')}`}
            open={m3Open}
            onToggle={toggleM3}
            fields={m3}
            onChange={handleM3Change}
          />

          <button
            className="submit-btn"
            type="submit"
            disabled={status !== 'idle'}
            style={{
              marginTop: '1.25rem',
              ...(registrationFailed ? {
                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                boxShadow: '0 0 20px rgba(220,38,38,0.4)',
              } : {}),
            }}
            onClick={() => { if (registrationFailed) { setRegistrationFailed(false); setInlineError(''); } }}
          >
            {registrationFailed ? p('❌ Try Again', '❌ حاول مجدداً') : btnLabel}
          </button>
        </form>
      </div>
    </>
  );
}
