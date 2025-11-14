
import React, { useState } from 'react';

interface CookieBannerProps {
  onAccept: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  const [show, setShow] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    performance: true,
    functional: true,
    marketing: true,
  });

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ essential: true, ...preferences }));
    onAccept();
    setShow(false);
  };
  
  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ essential: true, ...preferences }));
    onAccept();
    setShow(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ essential: true, performance: false, functional: false, marketing: false }));
    onAccept();
    setShow(false);
    setShowPreferences(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed bottom-5 left-5 max-w-sm w-full bg-[#1C2430] text-white p-6 rounded-xl shadow-2xl border border-white/10 z-50 transform transition-transform duration-500 ease-out translate-y-0">
        <h3 className="text-[#FF570A] font-bold text-lg mb-2">Nous utilisons des cookies</h3>
        <p className="text-sm text-[#E5E7EB] mb-4">
          Pour garantir une expérience fluide et agréable, ce site utilise des cookies pour analyser le trafic, personnaliser le contenu et améliorer nos services. Vous pouvez accepter tous les cookies ou choisir vos préférences.
        </p>
        <div className="flex gap-4">
          <button onClick={handleAcceptAll} className="flex-1 bg-[#FF570A] text-white py-2 px-4 rounded-lg hover:bg-[#FF6F2C] transition-colors text-sm font-semibold">
            Accepter tous les cookies
          </button>
          <button onClick={() => setShowPreferences(true)} className="flex-1 bg-transparent border border-[#FF570A] text-[#FF570A] py-2 px-4 rounded-lg hover:bg-orange-500/10 transition-colors text-sm font-semibold">
            Gérer mes préférences
          </button>
        </div>
        <a href="#/politique-de-confidentialite" className="text-[#FF8550] hover:text-[#FFB899] text-xs mt-3 inline-block">Politique de confidentialité</a>
      </div>

      {showPreferences && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1E2735] text-[#E5E7EB] rounded-2xl p-8 max-w-lg w-full shadow-lg border border-white/10">
            <h2 className="text-xl font-bold text-[#FF570A] mb-4">Gérer mes préférences</h2>
            <p className="text-sm mb-6">Choisissez les types de cookies que vous souhaitez autoriser. Vous pouvez modifier vos préférences à tout moment via le lien disponible en bas du site.</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <h4 className="font-semibold">Cookies essentiels</h4>
                  <p className="text-xs text-gray-400">Indispensables au bon fonctionnement du site.</p>
                </div>
                <input type="checkbox" checked disabled className="accent-[#FF570A] h-5 w-5 opacity-50 cursor-not-allowed" />
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <h4 className="font-semibold">Cookies de performance / analytique</h4>
                  <p className="text-xs text-gray-400">Permettent d’analyser la fréquentation et d’améliorer les performances.</p>
                </div>
                <input type="checkbox" checked={preferences.performance} onChange={(e) => setPreferences(p => ({...p, performance: e.target.checked}))} className="accent-[#FF570A] h-5 w-5 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <h4 className="font-semibold">Cookies de préférences / fonctionnels</h4>
                  <p className="text-xs text-gray-400">Retiennent vos choix et optimisent votre confort de navigation.</p>
                </div>
                <input type="checkbox" checked={preferences.functional} onChange={(e) => setPreferences(p => ({...p, functional: e.target.checked}))} className="accent-[#FF570A] h-5 w-5 cursor-pointer" />
              </div>
              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <h4 className="font-semibold">Cookies de marketing / publicité</h4>
                  <p className="text-xs text-gray-400">Servent à afficher du contenu personnalisé.</p>
                </div>
                <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences(p => ({...p, marketing: e.target.checked}))} className="accent-[#FF570A] h-5 w-5 cursor-pointer" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-semibold">
              <button onClick={handleSavePreferences} className="w-full bg-[#FF570A] text-white py-2.5 px-4 rounded-lg hover:bg-[#FF6F2C] transition-colors">Enregistrer</button>
              <button onClick={handleRejectAll} className="w-full bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-500 transition-colors">Tout refuser</button>
              <button onClick={() => setShowPreferences(false)} className="w-full bg-transparent border border-white/50 text-white py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
