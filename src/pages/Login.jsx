import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang, t } from '../context/LanguageContext';
import { useExamAuth } from '../context/ExamAuthContext';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import { sanitizeInput, loginRateLimiter } from '../security';
import {
  teamLogin,
  subscribeExamConfig,
  getExamWindowStatus,
  EXAM_DURATION_MINUTES
} from '../examAuth';

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

export default function Login() {
  const { startSession } = useExamAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(new Date());
  const [configLoaded, setConfigLoaded] = useState(false);

  // Live-subscribe to exam config so this updates instantly if the admin
  // sets/changes the start time while someone is on this page.
  useEffect(() => {
    const unsub = subscribeExamConfig(({ startTime }) => {
      setStartTime(startTime);
      setConfigLoaded(true);
    });
    return unsub;
  }, []);

  // Tick every second for the countdown display.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const windowStatus = configLoaded ? getExamWindowStatus(startTime) : 'loading';
  const examEnd = startTime ? new Date(startTime.getTime() + EXAM_DURATION_MINUTES * 60 * 1000) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const sanitizedTeam = sanitizeInput(teamName);
    const sanitizedEmail = sanitizeInput(email);

    if (!sanitizedTeam) {
      setError(t('Please enter your team name.', 'يرجى إدخال اسم الفريق.', lang));
      return;
    }

    if (loginRateLimiter.isRateLimited('exam_login_attempt')) {
      setError(t('Too many attempts. Please try again later.', 'محاولات كثيرة جداً. يرجى المحاولة مرة أخرى لاحقاً.', lang));
      return;
    }

    setLoading(true);
    const result = await teamLogin(sanitizedTeam, sanitizedEmail);
    setLoading(false);

    if (result.success) {
      startSession(result.team, result.isAdmin);
      const dest = location.state?.from?.pathname || '/competition';
      navigate(dest, { replace: true });
    } else {
      setError(result.error || t('Login failed. Please try again.', 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.', lang));
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="pyramid-nav-logo" style={{ margin: '0 auto 1rem', transform: 'scale(1.5)' }}>
            <div className="pyramid-main" />
            <div className="pyramid-small-left" />
            <div className="pyramid-small-right" />
          </div>
          <h2 className="card-title" style={{ marginBottom: '0.5rem' }}>
            {t('Team Sign In', 'تسجيل دخول الفريق', lang)}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {t('Enter your team name and your registered email to begin.', 'أدخل اسم فريقك وبريدك الإلكتروني المسجل للبدء.', lang)}
          </p>
        </div>

        {/* Exam window status banner */}
        {configLoaded && windowStatus === 'not_started' && (
          <div className="inline-error" style={{ background: 'rgba(255,215,0,0.08)', borderColor: 'rgba(255,215,0,0.3)', color: 'var(--gold)', marginBottom: '1.5rem', textAlign: 'center', flexDirection: 'column', gap: '0.4rem' }}>
            <div>⏳ {t('The exam has not started yet.', 'لم تبدأ المسابقة بعد.', lang)}</div>
            {startTime && (
              <div style={{ fontSize: '0.85rem' }}>
                {t('Opens in', 'تبدأ خلال', lang)}: <strong>{formatCountdown(startTime - now)}</strong>
              </div>
            )}
          </div>
        )}
        {configLoaded && windowStatus === 'open' && examEnd && (
          <div className="inline-error" style={{ background: 'rgba(46,204,113,0.08)', borderColor: 'rgba(46,204,113,0.3)', color: '#2ecc71', marginBottom: '1.5rem', textAlign: 'center', flexDirection: 'column', gap: '0.4rem' }}>
            <div>✅ {t('Login is open.', 'تسجيل الدخول مفتوح.', lang)}</div>
            <div style={{ fontSize: '0.85rem' }}>
              {t('Closes in', 'يُغلق خلال', lang)}: <strong>{formatCountdown(examEnd - now)}</strong>
            </div>
          </div>
        )}
        {configLoaded && windowStatus === 'closed' && (
          <div className="inline-error" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <span>⛔</span> {t('The exam login window has closed.', 'انتهت فترة تسجيل الدخول للمسابقة.', lang)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AuthInput
            id="teamName"
            label={t('Team Name', 'اسم الفريق', lang)}
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder={t('Your registered team name', 'اسم فريقك المسجل', lang)}
            required
          />
          <AuthInput
            id="email"
            label={t('Email Address', 'البريد الإلكتروني', lang)}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@school.edu"
            error={error}
          />

          <AuthButton type="submit" loading={loading} style={{ marginTop: '1.5rem' }}>
            {t('Enter the Arena', 'دخول الساحة', lang)}
          </AuthButton>
        </form>
      </div>
    </div>
  );
}
