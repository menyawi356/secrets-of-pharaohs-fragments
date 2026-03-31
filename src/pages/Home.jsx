import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext.jsx';

function T({ en, ar }) {
  const { lang } = useLang();
  return lang === 'ar' ? ar : en;
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-pyramids">
          <div className="hero-pyramid-main"></div>
          <div className="hero-pyramid-left"></div>
          <div className="hero-pyramid-right"></div>
          <div className="pyramid-clock">
            <div className="clock-markers">
              <div className="clock-marker" style={{ transform: 'rotate(0deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(30deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(60deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(90deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(120deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(150deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(180deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(210deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(240deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(270deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(300deg)' }}></div>
              <div className="clock-marker" style={{ transform: 'rotate(330deg)' }}></div>
            </div>
            <div className="clock-hands">
              <div className="clock-hour"></div>
              <div className="clock-minute"></div>
              <div className="clock-second"></div>
            </div>
            <div className="clock-center"></div>
          </div>
        </div>

        <h1 className="hero-title">
          <T
            en="International Pharaohs' Fragments League"
            ar="الدوري الدولي لشظايا الفراعنة"
          />
        </h1>
        <p className="hero-subtitle">
          <T en="An International Science League" ar="دوري علوم دولي" />
        </p>
        <p className="hero-description">
          <T
            en="An international science League organized by students in Egypt, under the supervision of Dr. Mohamed Ali, combining Egyptian adventure narrative with STEM education. Open to middle schoolers, high schoolers, and bachelor's students worldwide: participants solve story-driven challenges in physics in teams of up to three."
            ar="دوري علوم دولي ينظمه طلاب في مصر، تحت إشراف الدكتور محمد علي، يجمع بين السرد المصري القديم وتعليم العلوم. مفتوح لطلاب المرحلة الإعدادية والثانوية والبكالوريوس من جميع أنحاء العالم."
          />
        </p>
        <Link to="/register" className="cta-button">
          <T en="Register Now" ar="سجل الآن" />
        </Link>
      </section>

      <div className="glass-card">
        <h2 className="card-title">
          <T en="About the League" ar="عن الدوري" />
        </h2>
        <div className="card-content">
          <p>
            <T
              en="Pharaohs' Fragments is a unique international science League that blends ancient Egyptian mythology with modern STEM challenges in physics. Open to middle school students, high school students, and bachelor's students from any country, teams will embark on a virtual journey through Egypt, solving story-driven science puzzles to collect the ancient fragments and unlock their power."
              ar="شظايا الفراعنة هو دوري علوم دولي فريد يمزج بين الأساطير المصرية القديمة وتحديات العلوم الحديثة في الفيزياء. مفتوح لطلاب المرحلة الإعدادية والثانوية والبكالوريوس من أي دولة."
            />
          </p>
        </div>
      </div>

      <div className="features">
        {[
          {
            en_title: 'Ancient Fragments',
            ar_title: 'الشظايا القديمة',
            en_desc: 'Collect six ancient Egyptian fragments by solving science challenges across physics to unlock their mysterious power.',
            ar_desc: 'اجمع ست شظايا مصرية قديمة من خلال حل تحديات علمية في الفيزياء.',
          },
          {
            en_title: 'Egyptian Adventure',
            ar_title: 'مغامرة مصرية',
            en_desc: 'Embark on a virtual journey through ancient Egypt, solving puzzles in iconic locations.',
            ar_desc: 'انطلق في رحلة افتراضية عبر مصر القديمة، وحل الألغاز في مواقع أيقونية.',
          },
          {
            en_title: 'International Competition',
            ar_title: 'مسابقة دولية',
            en_desc: "Open to all international students: middle school, high school, and bachelor's: from any country worldwide.",
            ar_desc: 'مفتوح لجميع الطلاب الدوليين من المرحلة الإعدادية والثانوية والبكالوريوس من أي دولة في العالم.',
          },
        ].map((f, i) => (
          <div className="feature-card" key={i}>
            <h3 className="feature-title">
              <T en={f.en_title} ar={f.ar_title} />
            </h3>
            <p className="feature-description">
              <T en={f.en_desc} ar={f.ar_desc} />
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
