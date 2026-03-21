import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLang } from './context/LanguageContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackgroundEffects from './components/BackgroundEffects.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import MeetUs from './pages/MeetUs.jsx';
import Timeline from './pages/Timeline.jsx';
import PartnersAndPrizes from './pages/PartnersAndPrizes.jsx';
import Register from './pages/Register.jsx';
import FAQ from './pages/FAQ.jsx';
import Ambassador from './pages/Ambassador.jsx';

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/about"         element={<About />} />
            <Route path="/meet-us"       element={<MeetUs />} />
            <Route path="/timeline"      element={<Timeline />} />
            <Route path="/partners"      element={<PartnersAndPrizes />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/faq"           element={<FAQ />} />
            <Route path="/ambassador"    element={<Ambassador />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
