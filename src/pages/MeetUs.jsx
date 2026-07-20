import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase.js';
import { showToast } from '../components/Toast.jsx';
import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

async function ensureAuth() {
  if (auth.currentUser) return;
  await signInAnonymously(auth);
}

export default function MeetUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await ensureAuth();
      await addDoc(collection(db, 'contact_messages'), {
        ...form,
        submitted_at: serverTimestamp(),
      });
      showToast('✅ ' + (lang === 'ar' ? 'تم إرسال رسالتك!' : 'Message sent! We\'ll get back to you soon.'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast('⚠️ ' + (lang === 'ar' ? 'فشل الإرسال. يرجى مراسلتنا مباشرة.' : 'Failed to send. Please email us directly.'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card">
        <h2 className="card-title">
          <T en="Meet Us" ar="تعرف علينا" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="Pharaohs' Fragments is brought to you by the IPhFL team, a group of dedicated physics enthusiasts committed to creating an exceptional educational experience."
              ar="شظايا الفراعنة تُقدَّم إليكم بواسطة فريق IPhFL، مجموعة من المتحمسين للفيزياء المُخلصين لإرساء تجربة تعليمية استثنائية تجمع بين العلم والتراث."
            />
          </p>
        </div>

        <div className="team-member-card">
          <img
            src="/img/dr-mohamed-ali.png"
            alt="Dr. Mohamed Ali"
            className="team-member-avatar"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="team-member-role">
            <T en="Academic Supervision" ar="إشراف أكاديمي" />
          </div>
          <div className="team-member-name">
            <T en="Dr. Mohamed Ali" ar="د. محمد علي" />
          </div>
          <div className="team-member-desc">
            <T en="Mechanical Engineering, AUC" ar="هندسة ميكانيكية، الجامعة الأمريكية بالقاهرة" />
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem', fontSize: '0.9rem' }}>
          <T
            en="The IPhFL Team — Organized by passionate students under expert supervision"
            ar="فريق IPhFL — منظم من قبل طلاب متحمسين تحت إشراف خبراء"
          />
        </p>
      </div>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="Contact Us" ar="اتصل بنا" />
        </h2>

        <div className="contact-info">
          <h3><T en="General Inquiries" ar="استفسارات عامة" /></h3>
          <p>
            Email:{' '}
            <a href="mailto:support@pharaohleague.org">support@pharaohleague.org</a>
          </p>
        </div>

        <ContactForm
          form={form}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export function ContactForm({ form, loading, onChange, onSubmit }) {
  const { lang } = useLang();
  const p = (en, ar) => lang === 'ar' ? ar : en;

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">{p('Your Name', 'اسمك')}</label>
        <input
          className="form-input"
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder={p('Full name', 'الاسم الكامل')}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">{p('Your Email', 'بريدك الإلكتروني')}</label>
        <input
          className="form-input"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">{p('Subject', 'الموضوع')}</label>
        <input
          className="form-input"
          type="text"
          name="subject"
          value={form.subject}
          onChange={onChange}
          placeholder={p('What is this about?', 'موضوع رسالتك')}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">{p('Message', 'الرسالة')}</label>
        <textarea
          className="form-textarea"
          name="message"
          value={form.message}
          onChange={onChange}
          rows={5}
          placeholder={p('Your message here...', 'اكتب رسالتك هنا...')}
          required
        />
      </div>
      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? p('Sending…', 'جاري الإرسال…') : p('Send Message', 'إرسال الرسالة')}
      </button>
    </form>
  );
}
