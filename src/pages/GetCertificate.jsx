import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

export default function GetCertificate() {
  return (
    <section className="page get-certificate-page">
      <h1 className="page-title">
        <T en="Get Your Certificate" ar="استخرج شهادتك" />
      </h1>
      <p className="page-subtitle">
        <T
          en="Select your team and verify with your email to download your Quarter-Finals, Semi-Final, or Final Round certificate."
          ar="اختار فريقك وتحقق ببريدك الإلكتروني عشان تنزّل شهادتك لربع النهائي أو نصف النهائي أو النهائي."
        />
      </p>

      <div className="certificate-frame-wrap">
        <iframe
          src="/certificate.html"
          title="Get Your Certificate"
          className="certificate-frame"
          loading="lazy"
        />
      </div>
    </section>
  );
}
