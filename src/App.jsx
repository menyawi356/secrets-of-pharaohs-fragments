import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLang } from './context/LanguageContext.jsx';
import { ExamAuthProvider } from './context/ExamAuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackgroundEffects from './components/BackgroundEffects.jsx';
import Toast from './components/Toast.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import MeetUs from './pages/MeetUs.jsx';
import Timeline from './pages/Timeline.jsx';
import PartnersAndPrizes from './pages/PartnersAndPrizes.jsx';
import FAQ from './pages/FAQ.jsx';
import Ambassador from './pages/Ambassador.jsx';
import Competition from './pages/Competition.jsx';
import Login from './pages/Login.jsx';
import FinishSignIn from './pages/FinishSignIn.jsx';
import GetCertificate from './pages/GetCertificate.jsx';

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <ExamAuthProvider>
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
            <Route path="/competition"   element={<ProtectedRoute><Competition /></ProtectedRoute>} />
            <Route path="/faq"           element={<FAQ />} />
            <Route path="/ambassador"    element={<Ambassador />} />
            <Route path="/certificate"   element={<GetCertificate />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/finishSignIn"  element={<FinishSignIn />} />
            {/* Redirect old register link to competition */}
            <Route path="/register"      element={<ProtectedRoute><Competition /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Toast />
    </ExamAuthProvider>
  );
}
