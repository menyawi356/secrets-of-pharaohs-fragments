import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang, t } from '../context/LanguageContext';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

export default function FinishSignIn() {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLang();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailForConfirm, setEmailForConfirm] = useState('');
  const [needsEmail, setNeedsEmail] = useState(false);

  useEffect(() => {
    // We only want to run this once.
    let isMounted = true;

    const performSignIn = async () => {
       // First check if email is in local storage
       const storedEmail = window.localStorage.getItem('emailForSignIn');
       if (!storedEmail) {
           if (isMounted) {
               setNeedsEmail(true);
               setLoading(false);
           }
           return;
       }

       // We have the email, proceed with login
       try {
           const result = await completeLogin(window.location.href);
           if (isMounted) {
               if (result.success) {
                   // Redirect to competition or home
                   navigate('/competition', { replace: true });
               } else {
                   setError(result.error || t('Invalid or expired link.', 'رابط غير صالح أو منتهي الصلاحية.', lang));
                   setLoading(false);
               }
           }
       } catch (err) {
           if (isMounted) {
               setError(err.message);
               setLoading(false);
           }
       }
    };

    performSignIn();

    return () => { isMounted = false; };
  }, [completeLogin, navigate, lang]);

  const handleConfirmEmail = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      
      // temporarily store it so completeLogin can find it
      window.localStorage.setItem('emailForSignIn', emailForConfirm);
      
      const result = await completeLogin(window.location.href);
      if (result.success) {
           navigate('/competition', { replace: true });
      } else {
           setError(result.error || t('Invalid or expired link.', 'رابط غير صالح أو منتهي الصلاحية.', lang));
           window.localStorage.removeItem('emailForSignIn');
           setLoading(false);
      }
  };

  if (loading) {
    return (
        <div className="auth-page">
            <div className="glass-card auth-card" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', borderWidth: '4px' }}></div>
                <h2 className="card-title">{t('Authenticating...', 'جاري المصادقة...', lang)}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{t('Please wait while we securely sign you in.', 'يرجى الانتظار بينما نقوم بتسجيل دخولك بأمان.', lang)}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
         <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
             {t('Complete Sign In', 'إكمال تسجيل الدخول', lang)}
         </h2>
         
         {error ? (
             <div style={{ textAlign: 'center' }}>
                 <div className="inline-error" style={{ justifyContent: 'center' }}>
                    <span>⚠️</span> {error}
                 </div>
                 <button onClick={() => navigate('/login')} className="submit-btn" style={{ marginTop: '1rem' }}>
                     {t('Back to Login', 'العودة لتسجيل الدخول', lang)}
                 </button>
             </div>
         ) : needsEmail ? (
             <form onSubmit={handleConfirmEmail}>
                 <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                     {t('It looks like you opened this link on a different device or browser. Please confirm your email address to continue.', 'يبدو أنك فتحت هذا الرابط على جهاز أو متصفح مختلف. يرجى تأكيد بريدك الإلكتروني للمتابعة.', lang)}
                 </p>
                 <AuthInput
                    id="confirm-email"
                    label={t('Confirm Email Address', 'تأكيد البريد الإلكتروني', lang)}
                    type="email"
                    value={emailForConfirm}
                    onChange={(e) => setEmailForConfirm(e.target.value)}
                    required
                 />
                 <AuthButton type="submit" style={{ marginTop: '1.5rem' }}>
                    {t('Sign In', 'تسجيل الدخول', lang)}
                 </AuthButton>
             </form>
         ) : null}
      </div>
    </div>
  );
}
