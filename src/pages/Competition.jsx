import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useLang, t } from '../context/LanguageContext';
import { useExamAuth } from '../context/ExamAuthContext';
import StoryQuiz from '../components/StoryQuiz';
import storyData from '../data/storyData.json';
import {
  subscribeExamConfig,
  setExamStartTime,
  getExamWindowStatus,
  subscribeAllProgress,
  EXAM_DURATION_MINUTES
} from '../examAuth';

const QUESTION_IDS = storyData.filter(x => x.type === 'question').map(x => x.id);

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_CODE = '20202062055'; // legacy keypress code, kept for the registrations view
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

// ─── EXAM TIMER CONTROL (admin) ───────────────────────────────────────────────
function ExamTimerControl({ startTime }) {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (startTime) {
      const d = new Date(startTime);
      setDateInput(d.toISOString().slice(0, 10));
      setTimeInput(d.toTimeString().slice(0, 5));
    }
  }, [startTime]);

  const handleSave = async () => {
    if (!dateInput || !timeInput) return;
    setSaving(true);
    const combined = new Date(`${dateInput}T${timeInput}:00`);
    await setExamStartTime(combined);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    setSaving(true);
    await setExamStartTime(null);
    setSaving(false);
  };

  const status = getExamWindowStatus(startTime);
  const end = startTime ? new Date(startTime.getTime() + EXAM_DURATION_MINUTES * 60 * 1000) : null;

  return (
    <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', padding: '1.2rem', margin: '0 auto 1.5rem', maxWidth: '1100px' }}>
      <div style={{ color: 'var(--gold)', fontWeight: 'bold', marginBottom: '0.8rem' }}>⏱ Exam Login Window ({EXAM_DURATION_MINUTES} min)</div>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
        <input type="time" value={timeInput} onChange={e => setTimeInput(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.4)', color: '#fff' }} />
        <button onClick={handleSave} disabled={saving} className="dash-btn">{saving ? 'Saving…' : saved ? '✓ Saved' : 'Set Start Time'}</button>
        {startTime && <button onClick={handleClear} disabled={saving} className="dash-btn close">Clear</button>}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Status: <strong style={{ color: status === 'open' ? '#2ecc71' : status === 'closed' ? '#e74c3c' : 'var(--gold)' }}>{status.replace('_', ' ')}</strong>
        {startTime && <> — opens {new Date(startTime).toLocaleString()}, closes {end.toLocaleString()}</>}
        {!startTime && <> — no start time set yet, login page will show "not started" to everyone except the master code.</>}
      </div>
    </div>
  );
}

// ─── PROGRESS TABLE (admin) ───────────────────────────────────────────────────
function ProgressTable({ progress }) {
  const [filter, setFilter] = useState('');
  const teamKeys = Object.keys(progress).sort();
  const filtered = filter
    ? teamKeys.filter(k => k.toLowerCase().includes(filter.toLowerCase()))
    : teamKeys;

  return (
    <div style={{ margin: '0 auto', maxWidth: '1100px' }}>
      <div className="dash-search" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search team..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', border: '1px dashed rgba(255,215,0,0.15)', borderRadius: '10px' }}>
          No teams have started answering yet.
        </div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Team</th>
                <th>Answered</th>
                <th>Correct</th>
                <th>Unanswered Question IDs</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(teamKey => {
                const answers = progress[teamKey]?.answers || {};
                const answeredIds = Object.keys(answers).map(Number);
                const correctCount = Object.values(answers).filter(a => a.status === 'correct').length;
                const unanswered = QUESTION_IDS.filter(id => !answeredIds.includes(id));
                return (
                  <tr key={teamKey}>
                    <td className="team-name-cell">{esc(decodeURIComponent(teamKey))}</td>
                    <td><span className="member-badge">{answeredIds.length}/{QUESTION_IDS.length}</span></td>
                    <td style={{ color: '#2ecc71' }}>{correctCount}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {unanswered.length === 0 ? '— all answered —' : unanswered.join(', ')}
                    </td>
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

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ onClose }) {
  const [tab, setTab] = useState('registrations'); // 'registrations' | 'progress' | 'timer'
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [startTime, setStartTime] = useState(null);

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
  useEffect(() => {
    const unsub = subscribeAllProgress(setProgress);
    return unsub;
  }, []);
  useEffect(() => {
    const unsub = subscribeExamConfig(({ startTime }) => setStartTime(startTime));
    return unsub;
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
          <button className={`dash-btn${tab === 'registrations' ? ' active' : ''}`} onClick={() => setTab('registrations')}>Registrations</button>
          <button className={`dash-btn${tab === 'progress' ? ' active' : ''}`} onClick={() => setTab('progress')}>Progress</button>
          <button className={`dash-btn${tab === 'timer' ? ' active' : ''}`} onClick={() => setTab('timer')}>Exam Timer</button>
          <button className="dash-btn" onClick={loadTeams}>↻ Refresh</button>
          <button className="dash-btn close" onClick={onClose}>✕ Close</button>
        </div>
      </div>

      {tab === 'timer' && <ExamTimerControl startTime={startTime} />}

      {tab === 'progress' && <ProgressTable progress={progress} />}

      {tab === 'registrations' && (
        <>
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
        </>
      )}
    </div>
  );
}

// ─── EXAM COUNTDOWN BANNER (participants) ─────────────────────────────────────
function ExamCountdownBanner({ onTimeUp }) {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(new Date());
  const [firedTimeUp, setFiredTimeUp] = useState(false);

  useEffect(() => {
    const unsub = subscribeExamConfig(({ startTime }) => setStartTime(startTime));
    return unsub;
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const end = startTime ? new Date(startTime.getTime() + EXAM_DURATION_MINUTES * 60 * 1000) : null;
  const remaining = end ? end - now : null;

  useEffect(() => {
    if (remaining !== null && remaining <= 0 && !firedTimeUp) {
      setFiredTimeUp(true);
      onTimeUp?.();
    }
  }, [remaining, firedTimeUp, onTimeUp]);

  if (!end) return null;

  const low = remaining < 5 * 60 * 1000;

  return (
    <div style={{
      position: 'fixed', top: 'calc(var(--nav-h) + 20px)', right: '20px', zIndex: 990,
      background: low ? 'rgba(231,76,60,0.15)' : 'rgba(8, 12, 30, 0.8)',
      border: `1px solid ${low ? '#e74c3c' : 'var(--glass-border)'}`,
      padding: '1rem 2rem', borderRadius: 'var(--radius)', backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{ color: low ? '#e74c3c' : 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '600' }}>
        Time Remaining
      </div>
      <div style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 'bold', fontFamily: "'Cinzel', serif", lineHeight: '1' }}>
        {formatCountdown(remaining)}
      </div>
    </div>
  );
}

// ─── COMPETITION PAGE ─────────────────────────────────────────────────────────
export default function Competition() {
  const { lang } = useLang();
  const { session, endSession } = useExamAuth();
  const navigate = useNavigate();

  // Admin secret handling (legacy keypress code -> registrations view)
  const [adminSeq, setAdminSeq] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

  // Score State
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (adminSeq === ADMIN_CODE) {
      setAdminSeq('');
      setAdminOpen(true);
    }
  }, [adminSeq]);

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

  // When the 75-minute window ends, kick non-admin teams back to login.
  const handleTimeUp = () => {
    if (session && !session.isAdmin) {
      endSession();
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}

      {session && !session.isAdmin && <ExamCountdownBanner onTimeUp={handleTimeUp} />}

      <div className="scoreboard-widget" style={{ position: 'fixed', top: 'calc(var(--nav-h) + 20px)', left: '20px', zIndex: 990, background: 'rgba(8, 12, 30, 0.8)', border: '1px solid var(--glass-border)', padding: '1rem 2rem', borderRadius: 'var(--radius)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.3s ease' }}>
          <div style={{ color: 'var(--gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: '600' }}>{t('Score', 'النتيجة', lang)}</div>
          <div style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 'bold', fontFamily: "'Cinzel', serif", lineHeight: '1', textShadow: '0 0 15px rgba(255,215,0,0.5)' }}>{score}</div>
      </div>

      <div className="competition-hero" style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
          <div className="pyramid-nav-logo" style={{ margin: '0 auto 1.5rem', transform: 'scale(2.5)' }}>
              <div className="pyramid-main" />
              <div className="pyramid-small-left" />
              <div className="pyramid-small-right" />
          </div>
          <h1 className="hero-title">{t("The Arena Awaits", "الساحة في انتظارك", lang)}</h1>
          <p className="hero-subtitle" style={{ letterSpacing: '4px' }}>
              {t('Prove Your Worth', 'أثبت جدارتك', lang)}
          </p>
          {session?.team_name && (
            <p style={{ color: 'var(--gold)', marginTop: '0.5rem', fontWeight: 'bold' }}>
              {t('Team', 'الفريق', lang)}: {session.team_name}
            </p>
          )}
      </div>

      <div className="glass-card">
          <h2 className="card-title">{t('Competition Overview', 'نظرة عامة على المسابقة', lang)}</h2>
          <div className="card-content">
              <p>
                  {t("The Pharaohs' Fragments League is an elite competition testing the brightest minds in physics. Only those who possess profound knowledge and strategic thinking will emerge victorious.", 'دوري شظايا الفراعنة هو مسابقة لنخبة العقول اللامعة في الفيزياء. فقط من يمتلكون المعرفة العميقة والتفكير الاستراتيجي سيخرجون منتصرين.', lang)}
              </p>
              <p>
                  {t('Participants will face challenges inspired by ancient Egyptian mysteries, applying modern scientific principles to decipher the enigmatic fragments of the past.', 'سيواجه المشاركون تحديات مستوحاة من أسرار مصر القديمة، وتطبيق المبادئ العلمية الحديثة لفك رموز الشظايا الغامضة من الماضي.', lang)}
              </p>
          </div>
      </div>

      <div className="glass-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <StoryQuiz onScoreChange={setScore} />
      </div>
    </>
  );
}
