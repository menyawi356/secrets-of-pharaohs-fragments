import { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, query, where,
  orderBy, serverTimestamp, doc, updateDoc, increment,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase.js';
import { showToast } from '../components/Toast.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const RECAPTCHA_SITE_KEY = '6LeCwYwsAAAAABCeRRqfvzAAk5tba3yWoepWuTeO';
const LS_KEY = 'iphfl_ambassador';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function ensureAuth() {
  if (auth.currentUser) return;
  await signInAnonymously(auth);
}

async function getRecaptchaToken(action = 'ambassador') {
  return new Promise((resolve) => {
    if (!window.grecaptcha) { resolve(null); return; }
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve).catch(() => resolve(null));
    });
  });
}

function generateCode(name) {
  const prefix = name.trim().replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${suffix}`;
}

function getReferralUrl(code) {
  return `${window.location.origin}/register?ref=${code}`;
}

// Save/load from localStorage so dashboard persists on refresh
function saveToStorage(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ code: data.code, name: data.name, email: data.email })); } catch {}
}
function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
}
function clearStorage() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

// ─── LEADERBOARD ROW ─────────────────────────────────────────────────────────
function LeaderRow({ rank, name, country, school, count }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const gold = rank === 1;
  const silver = rank === 2;
  const bronze = rank === 3;
  const accent = gold ? 'var(--gold)' : silver ? '#c0c8d8' : bronze ? '#cd7f32' : 'var(--cyan)';
  const border = gold ? 'rgba(212,175,55,0.5)' : silver ? 'rgba(192,200,216,0.22)' : bronze ? 'rgba(205,127,50,0.22)' : 'rgba(255,255,255,0.07)';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '0.9rem 1.1rem', borderRadius: '10px', marginBottom: '0.5rem',
      background: gold ? 'linear-gradient(135deg,rgba(212,175,55,0.16),rgba(255,215,0,0.05))' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${border}`,
      boxShadow: gold ? '0 0 18px rgba(255,215,0,0.1)' : 'none',
    }}>
      <span style={{ fontSize: '1.4rem', minWidth: '2rem', textAlign: 'center' }}>
        {medals[rank] || `#${rank}`}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: gold ? 'var(--gold)' : 'var(--text)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.12rem' }}>
          {school}{country ? ` · ${country}` : ''}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: accent, fontFamily: 'Cinzel,serif', lineHeight: 1 }}>{count}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>referrals</div>
      </div>
    </div>
  );
}

// ─── MY LINK PANEL ───────────────────────────────────────────────────────────
function MyLinkPanel({ ambassador, onLogout }) {
  const [copied, setCopied] = useState(false);
  const url = getReferralUrl(ambassador.code);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { showToast('Could not copy — please copy manually.', 'error'); }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(255,215,0,0.04))',
      border: '1.5px solid rgba(212,175,55,0.45)',
      borderRadius: '14px', padding: '1.6rem', marginBottom: '0.5rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
        <div style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold)', fontSize: '1.05rem' }}>
          🏛️ Welcome back, {ambassador.name}!
        </div>
        <button onClick={onLogout} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.15)',
          color: 'var(--text-muted)', borderRadius: '6px', padding: '0.25rem 0.65rem',
          fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          fontFamily: 'Outfit,sans-serif',
        }}>
          Not you?
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.3rem' }}>
        You have <strong style={{ color: 'var(--gold)' }}>{ambassador.ref_count || 0}</strong>{' '}
        referral{(ambassador.ref_count || 0) !== 1 ? 's' : ''} so far. Keep sharing!
      </p>

      {/* Link row */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
          Your Referral Link
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <input
            readOnly value={url} onClick={e => e.target.select()}
            style={{
              flex: 1, minWidth: 0,
              background: 'rgba(255,255,255,0.05)',
              border: '1.5px solid rgba(255,215,0,0.22)',
              borderRadius: '8px', padding: '0.6rem 0.9rem',
              color: 'var(--text)', fontSize: '0.82rem',
              fontFamily: 'monospace', outline: 'none',
            }}
          />
          <button onClick={copy} style={{
            padding: '0.6rem 1.2rem',
            background: copied ? 'linear-gradient(135deg,#2d7a2d,#3aaa3a)' : 'linear-gradient(135deg,#d4af37,#FFD700)',
            color: '#0a0e27', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
            fontFamily: 'Cinzel,serif', whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { label: '𝕏 Tweet',      color: '#1da1f2', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me at the International Pharaohs' Fragments Physics League! Free: ${url}`)}` },
          { label: '💬 WhatsApp',  color: '#25d366', href: `https://wa.me/?text=${encodeURIComponent(`Join the Pharaohs' Fragments Physics League! Free: ${url}`)}` },
          { label: '✈️ Telegram', color: '#0088cc', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent("Join the Pharaohs' Fragments Physics League!")}` },
        ].map(({ label, color, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" style={{
            display: 'inline-block', padding: '0.4rem 0.9rem',
            background: `${color}22`, border: `1px solid ${color}66`,
            borderRadius: '20px', color, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
          }}>{label}</a>
        ))}
      </div>
    </div>
  );
}

// ─── RETRIEVE LINK FORM (for returning ambassadors) ──────────────────────────
function RetrieveForm({ onFound }) {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await ensureAuth();
      const snap = await getDocs(
        query(collection(db, 'ambassadors'), where('email', '==', email.trim().toLowerCase()))
      );
      if (snap.empty) {
        setError(p('No ambassador found with that email. Did you sign up yet?', 'لم يتم العثور على سفير بهذا البريد. هل سجّلت من قبل؟'));
      } else {
        const data = { id: snap.docs[0].id, ...snap.docs[0].data() };
        saveToStorage(data);
        onFound(data);
        showToast(`Welcome back, ${data.name}!`);
      }
    } catch (err) {
      console.error(err);
      setError(p('Something went wrong. Please try again.', 'حدث خطأ. يرجى المحاولة مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        {error && (
          <div style={{ color: '#ff8888', fontSize: '0.82rem', marginBottom: '0.4rem' }}>⚠️ {error}</div>
        )}
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={p('Enter your ambassador email…', 'أدخل بريدك الإلكتروني…')}
          required
          style={{ marginBottom: 0 }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.68rem 1.2rem',
          background: 'rgba(255,215,0,0.1)',
          border: '1.5px solid rgba(255,215,0,0.35)',
          color: 'var(--gold)', borderRadius: '8px',
          fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
          fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}
      >
        {loading ? p('Looking up…', 'جاري البحث…') : p('Retrieve My Link', 'استرداد رابطي')}
      </button>
    </form>
  );
}

// ─── FULL SIGNUP FORM (new ambassadors) ──────────────────────────────────────
function SignupForm({ onSuccess }) {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;
  const [form, setForm] = useState({ name: '', email: '', school: '', country: '', instagram: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await getRecaptchaToken('ambassador');
      if (!token) {
        setError(p('reCAPTCHA failed. Please refresh the page and try again.', 'فشل التحقق. يرجى تحديث الصفحة.'));
        setLoading(false);
        return;
      }

      await ensureAuth();
      const emailLower = form.email.trim().toLowerCase();

      // Email already exists → retrieve instead of creating
      const existing = await getDocs(
        query(collection(db, 'ambassadors'), where('email', '==', emailLower))
      );
      if (!existing.empty) {
        const data = { id: existing.docs[0].id, ...existing.docs[0].data() };
        saveToStorage(data);
        onSuccess(data);
        showToast(`Welcome back, ${data.name}! Here's your existing link.`);
        return;
      }

      // Generate unique code
      let code = generateCode(form.name);
      for (let i = 0; i < 5; i++) {
        const snap = await getDocs(query(collection(db, 'ambassadors'), where('code', '==', code)));
        if (snap.empty) break;
        code = generateCode(form.name);
      }

      const payload = {
        name:       form.name.trim(),
        email:      emailLower,
        school:     form.school.trim(),
        country:    form.country.trim(),
        instagram:  form.instagram.trim(),
        code,
        ref_count:  0,
        recaptcha:  token,
        created_at: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'ambassadors'), payload);
      const fullData = { id: docRef.id, ...payload, ref_count: 0 };
      saveToStorage(fullData);
      onSuccess(fullData);
      showToast("✅ You're an IPhFL Ambassador! Your unique link is ready.");

    } catch (err) {
      console.error(err);
      const code = err?.code || '';
      if (code === 'permission-denied') {
        setError(p('Permission denied — please update your Firestore security rules.', 'تم رفض الإذن — يرجى تحديث قواعد Firestore.'));
      } else {
        setError(p(`Error: ${code || 'unknown'}. Check browser console for details.`, `خطأ: ${code || 'unknown'}.`));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {error && (
        <div className="inline-error" style={{ marginBottom: '1rem' }}>
          <span style={{ flexShrink: 0 }}>⚠️</span><span>{error}</span>
        </div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{p('Full Name', 'الاسم الكامل')} *</label>
          <input className="form-input" type="text" name="name" value={form.name} onChange={handle} placeholder={p('Your name', 'اسمك')} required />
        </div>
        <div className="form-group">
          <label className="form-label">{p('Email', 'البريد الإلكتروني')} *</label>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">{p('School / University', 'المدرسة / الجامعة')} *</label>
          <input className="form-input" type="text" name="school" value={form.school} onChange={handle} placeholder={p('Your institution', 'مؤسستك')} required />
        </div>
        <div className="form-group">
          <label className="form-label">{p('Country', 'الدولة')} *</label>
          <input className="form-input" type="text" name="country" value={form.country} onChange={handle} placeholder={p('Your country', 'دولتك')} required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">
          {p('Instagram / Social Handle', 'حساب إنستغرام')}{' '}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({p('optional', 'اختياري')})</span>
        </label>
        <input className="form-input" type="text" name="instagram" value={form.instagram} onChange={handle} placeholder="@yourhandle" />
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        🔒 {p('Protected by reCAPTCHA · One account per email', 'محمي بـ reCAPTCHA · حساب واحد لكل بريد إلكتروني')}
      </p>
      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? p('Setting up your link…', 'جاري إعداد رابطك…') : p('Become an Ambassador 🏛️', 'كن سفيراً 🏛️')}
      </button>
    </form>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Ambassador() {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;
  const [myAmbassador, setMyAmbassador] = useState(null);
  const [leaderboard, setLeaderboard]   = useState([]);
  const [lbLoading, setLbLoading]       = useState(true);
  const [showRetrieve, setShowRetrieve] = useState(false);

  // On mount: check localStorage — if they signed up before, restore their dashboard
  useEffect(() => {
    const saved = loadFromStorage();
    if (!saved) return;

    // Re-fetch from Firestore to get the latest ref_count
    (async () => {
      try {
        await ensureAuth();
        const snap = await getDocs(
          query(collection(db, 'ambassadors'), where('code', '==', saved.code))
        );
        if (!snap.empty) {
          setMyAmbassador({ id: snap.docs[0].id, ...snap.docs[0].data() });
        } else {
          clearStorage(); // stale record, clear it
        }
      } catch {
        // Offline or error — still show from localStorage with last known count
        setMyAmbassador(saved);
      }
    })();
  }, []);

  const loadLeaderboard = async () => {
    setLbLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'ambassadors'), orderBy('ref_count', 'desc')));
      setLeaderboard(snap.docs.map(d => ({ id: d.id, ...d.data() })).slice(0, 20));
    } catch (err) { console.error(err); }
    finally { setLbLoading(false); }
  };

  useEffect(() => { loadLeaderboard(); }, [myAmbassador]);

  const handleSuccess = (data) => {
    setMyAmbassador(data);
    setShowRetrieve(false);
  };

  const handleLogout = () => {
    clearStorage();
    setMyAmbassador(null);
    setShowRetrieve(false);
  };

  return (
    <>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏛️⚡🌍</div>
        <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: 'var(--gold)', marginBottom: '0.6rem', textShadow: '0 0 30px rgba(255,215,0,0.3)' }}>
          {p('Ambassador Program', 'برنامج السفراء')}
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', fontSize: '0.97rem' }}>
          {p("Spread the word about Pharaohs' Fragments. Every team you refer earns you a point. The top ambassador wins an exclusive prize.", "انشر خبر دوري شظايا الفراعنة. كل فريق تدعوه يمنحك نقطة. يفوز أفضل سفير بجائزة حصرية.")}
        </p>
      </div>

      {/* How it works */}
      <div className="features" style={{ marginBottom: '1.75rem' }}>
        {[
          { icon: '📋', en_t: 'Sign Up',         ar_t: 'سجّل',          en_d: 'Fill the form to become an official IPhFL Ambassador and get your unique link.',    ar_d: 'أكمل النموذج لتصبح سفيراً رسمياً.' },
          { icon: '🔗', en_t: 'Share Your Link', ar_t: 'شارك رابطك',    en_d: 'Send your referral link to friends, classmates, and physics lovers worldwide.',    ar_d: 'أرسل رابطك لأصدقائك وزملائك.' },
          { icon: '🏆', en_t: 'Win Prizes',      ar_t: 'اربح جوائز',    en_d: 'Every registration through your link counts. Top ambassador wins an exclusive prize.', ar_d: 'كل تسجيل يُحتسب. يفوز أفضل سفير.' },
        ].map((c, i) => (
          <div className="feature-card" key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{c.icon}</div>
            <h3 className="feature-title">{p(c.en_t, c.ar_t)}</h3>
            <p className="feature-description">{p(c.en_d, c.ar_d)}</p>
          </div>
        ))}
      </div>

      {/* Prize banner */}
      <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.13),rgba(255,215,0,0.04))', border: '1.5px solid rgba(212,175,55,0.4)', borderRadius: '14px', padding: '1.4rem 1.6rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '2.5rem' }}>🥇</div>
        <div>
          <div style={{ fontFamily: 'Cinzel,serif', color: 'var(--gold)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.3rem' }}>
            {p('Top Ambassador Prize', 'جائزة أفضل سفير')}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            {p('The ambassador with the most referrals at registration close (May 31) wins an exclusive IPhFL prize and gets featured on the website.', 'يفوز السفير الأكثر إحالات في نهاية التسجيل (31 مايو) بجائزة حصرية ويظهر اسمه على الموقع.')}
          </p>
        </div>
      </div>

      {/* Main card: dashboard OR signup */}
      <div className="glass-card">
        <h2 className="card-title">
          {myAmbassador ? p('Your Ambassador Dashboard', 'لوحة تحكم السفير') : p('Become an Ambassador', 'كن سفيراً')}
        </h2>

        {myAmbassador ? (
          <MyLinkPanel ambassador={myAmbassador} onLogout={handleLogout} />
        ) : (
          <>
            <SignupForm onSuccess={handleSuccess} />

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0 1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,215,0,0.12)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                {p('Already an ambassador?', 'سبق وسجّلت؟')}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,215,0,0.12)' }} />
            </div>

            {/* Retrieve link section */}
            {showRetrieve ? (
              <RetrieveForm onFound={handleSuccess} />
            ) : (
              <button
                onClick={() => setShowRetrieve(true)}
                style={{
                  width: '100%', padding: '0.75rem',
                  background: 'rgba(255,215,0,0.06)',
                  border: '1.5px dashed rgba(255,215,0,0.28)',
                  borderRadius: '8px', color: 'var(--text-muted)',
                  fontSize: '0.9rem', cursor: 'pointer',
                  fontFamily: 'Outfit,sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,215,0,0.55)'; e.target.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,215,0,0.28)'; e.target.style.color = 'var(--text-muted)'; }}
              >
                🔗 {p('Retrieve my existing link', 'استرداد رابطي الحالي')}
              </button>
            )}
          </>
        )}
      </div>

      {/* Leaderboard */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>
            🏆 {p('Ambassador Leaderboard', 'لوحة صدارة السفراء')}
          </h2>
          <button onClick={loadLeaderboard} style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', color: 'var(--gold)', borderRadius: '8px', padding: '0.35rem 0.85rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit,sans-serif' }}>
            ↻ {p('Refresh', 'تحديث')}
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: '1.25rem' }}>
          {p('Live rankings — updated as referrals come in. Closes May 31, 2026.', 'تصنيفات مباشرة. يغلق التسجيل في 31 مايو 2026.')}
        </p>

        {lbLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading…</div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,215,0,0.15)', borderRadius: '10px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
            <p>{p('No ambassadors yet — be the first!', 'لا يوجد سفراء بعد — كن الأول!')}</p>
          </div>
        ) : (
          leaderboard.map((amb, i) => (
            <LeaderRow key={amb.id} rank={i + 1} name={amb.name} country={amb.country} school={amb.school} count={amb.ref_count || 0} />
          ))
        )}
      </div>
    </>
  );
}

// ─── Exported helper used by Register.jsx ────────────────────────────────────
export async function trackReferral(code) {
  if (!code) return;
  try {
    const snap = await getDocs(
      query(collection(db, 'ambassadors'), where('code', '==', code.toUpperCase()))
    );
    if (snap.empty) return;
    await updateDoc(doc(db, 'ambassadors', snap.docs[0].id), {
      ref_count: increment(1),
    });
  } catch (err) {
    console.warn('Referral tracking failed:', err);
  }
}
