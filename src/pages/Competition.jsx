import { useLang } from '../context/LanguageContext.jsx';
import { useRef } from 'react';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

export default function GetCertificate() {
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe) {
        // حاول تجيب ارتفاع المحتوى جوة الـ iframe
        const height = iframe.contentWindow.document.body.scrollHeight;
        iframe.style.height = height + 'px';
      }
    } catch (e) {
      // لو في مشكلة CORS، استخدم ارتفاع ثابت
      iframeRef.current.style.height = '950px';
    }
  };

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
          ref={iframeRef}
          src="/certificate.html"
          title="Get Your Certificate"
          className="certificate-frame"
          loading="lazy"
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '950px',
            border: 'none',
            display: 'block',
            minHeight: '800px'
          }}
        />
      </div>
    </section>
  );
}
