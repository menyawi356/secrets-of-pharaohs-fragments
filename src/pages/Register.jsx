import { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase.js';
import { useLang } from '../context/LanguageContext.jsx';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_CODE = '20202062055';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function ensureAuth() {
  if (auth.currentUser) return;
  await signInAnonymously(auth);
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTeams() {
    setLoading(true);
    try {
      await ensureAuth();
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

// ─── CLOSED REGISTRATION NOTICE ──────────────────────────────────────────────
function ClosedNotice() {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1.25rem', lineHeight: 1 }}>🏛️</div>

      <h2 className="card-title" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
        {p('Registration is Now Closed', 'انتهى التسجيل')}
      </h2>

      <div style={{
        width: '60px', height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        margin: '0 auto 1.5rem',
      }} />

      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 0.75rem' }}>
        {p(
          "The registration period for the International Pharaohs' Fragments League has officially ended on May 31, 2026.",
          'انتهت فترة التسجيل في دوري شظايا الفراعنة الدولي رسمياً في 31 مايو 2026.'
        )}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 2rem' }}>
        {p(
          'The competition rounds are now underway. We thank all registered teams for joining — may the best team win!',
          'جولات المسابقة جارية الآن. نشكر جميع الفرق المسجلة على مشاركتهم — ولتفز أفضل فريق!'
        )}
      </p>

      <p style={{ color: 'rgba(240,236,224,0.4)', fontSize: '0.84rem' }}>
        {p('Questions? Reach us at ', 'للاستفسار: ')}
        <a href="mailto:support@pharaohleague.org" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
          support@pharaohleague.org
        </a>
      </p>
    </div>
  );
}

// ─── MAIN REGISTER PAGE ───────────────────────────────────────────────────────
export default function Register() {
  // Admin secret: type the code into the hidden input
  const [adminSeq, setAdminSeq] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if (adminSeq === ADMIN_CODE) {
      setAdminSeq('');
      setAdminOpen(true);
    }
  }, [adminSeq]);

  // Keyboard listener: typing the code anywhere on the page opens the dashboard
  useEffect(() => {
    const handler = (e) => {
      if (adminOpen) return;
      setAdminSeq(prev => {
        const next = (prev + e.key).slice(-ADMIN_CODE.length);
        return next;
      });
    };
    window.addEventListener('keypress', handler);
    return () => window.removeEventListener('keypress', handler);
  }, [adminOpen]);

  return (
    <>
      {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}
      <ClosedNotice />
    </>
  );
}