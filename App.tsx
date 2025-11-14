import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Marquee from './components/Marquee';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ToolsPage from './pages/ToolsPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import { PrivacyPolicyPage, LegalNoticePage, TermsOfUsePage } from './pages/LegalPages';
import DashboardRoutes from './routes/DashboardRoutes';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleCookieConsent = () => {
    setShowCookieBanner(false);
  };

  const LocationHandler = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
      <div className="bg-[#121926] text-white font-sans-fallback min-h-screen flex flex-col">
        {!isDashboard && <Marquee />}
        {!isDashboard && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/outils" element={<ToolsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/compte" element={<AccountPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicyPage />} />
            <Route path="/mentions-legales" element={<LegalNoticePage />} />
            <Route path="/conditions-generales-d-utilisation" element={<TermsOfUsePage />} />
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Routes>
        </main>
        {!isDashboard && <Footer />}
        {!isDashboard && showCookieBanner && <CookieBanner onAccept={handleCookieConsent} />}
      </div>
    );
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <LocationHandler />
    </HashRouter>
  );
}