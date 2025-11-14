import React, { useState, useLayoutEffect } from 'react';

const steps = [
  {
    target: null,
    title: '👋 Bienvenue sur votre tableau de bord !',
    content: 'Suivez ce guide rapide pour découvrir les fonctionnalités clés et commencer à organiser vos projets efficacement.',
    placement: 'center',
  },
  {
    target: '[data-tour-id="profile-section"]',
    title: '1. Votre Profil',
    content: 'Ici, vous pouvez voir vos informations. Accédez à la page "Mon Profil" pour modifier votre nom, avatar ou mot de passe.',
    placement: 'right',
  },
  {
    target: '[data-tour-id="sidebar-nav"]',
    title: '2. Navigation Principale',
    content: 'Utilisez ce menu pour accéder à toutes les sections : vos tâches, vos notes, les outils pratiques et bien plus encore.',
    placement: 'right',
  },
  {
    target: '[data-tour-id="link-tasks"]',
    title: '3. Organisation',
    content: 'Les sections "Tâches" et "Notes" sont les outils principaux pour créer, organiser et suivre vos projets et idées.',
    placement: 'right',
  },
  {
    target: '[data-tour-id="link-tools"]',
    title: '4. Outils Pratiques',
    content: "Découvrez ici des outils utiles comme l'extracteur d'e-mails ou l'analyseur de rentabilité pour vous aider au quotidien.",
    placement: 'right',
  },
  {
    target: '[data-tour-id="main-content"]',
    title: '5. Espace de Travail',
    content: "C'est ici que le contenu de chaque section s'affichera. Votre espace de travail principal se trouve là.",
    placement: 'top',
  },
  {
    target: '[data-tour-id="refresh-button"]',
    title: '6. Actualiser les Données',
    content: "Cliquez sur ce bouton à tout moment pour rafraîchir les informations affichées à l'écran.",
    placement: 'bottom',
  },
  {
    target: '[data-tour-id="notifications-bell"]',
    title: '7. Centre de Notifications',
    content: 'Gardez un œil sur cette cloche. Elle vous alertera des activités importantes sur votre compte, comme les nouvelles connexions.',
    placement: 'left',
  },
  {
    target: '[data-tour-id="sidebar-toggle"]',
    title: '8. Optimiser l\'Espace',
    content: "Vous pouvez réduire ou agrandir ce menu latéral pour avoir plus d'espace de travail.",
    placement: 'top',
  },
  {
    target: '[data-tour-id="logout-button"]',
    title: '9. Déconnexion Sécurisée',
    content: 'Lorsque vous avez terminé, vous pouvez vous déconnecter en toute sécurité en utilisant ce bouton.',
    placement: 'top',
  },
  {
    target: null,
    title: '🎉 Vous êtes prêt !',
    content: "C'est tout pour le moment. Explorez la plateforme et n'hésitez pas à utiliser tous les outils à votre disposition. Ce guide ne s'affichera plus.",
    placement: 'center',
  },
];

const DashboardTour: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [modalStyle, setModalStyle] = useState({});

  useLayoutEffect(() => {
    const step = steps[currentStep];
    const element = step.target ? document.querySelector(step.target) : null;

    const timer = setTimeout(() => {
      if (element) {
        element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        
        const scrollTimer = setTimeout(() => {
            const rect = element.getBoundingClientRect();
            const padding = 10;
            
            setSpotlightStyle({
              top: `${rect.top - padding}px`,
              left: `${rect.left - padding}px`,
              width: `${rect.width + padding * 2}px`,
              height: `${rect.height + padding * 2}px`,
              boxShadow: '0 0 0 9999px rgba(18, 25, 38, 0.8)',
              borderRadius: '8px',
            });
    
            const modalPos: { top?: string; left?: string; bottom?: string; right?: string; transform: string } = { transform: 'translate(0, 0)' };
    
            switch (step.placement) {
              case 'top':
                modalPos.bottom = `${window.innerHeight - rect.top + padding + 10}px`;
                modalPos.left = `${rect.left + rect.width / 2}px`;
                modalPos.transform = 'translateX(-50%)';
                break;
              case 'left':
                modalPos.top = `${rect.top}px`;
                modalPos.right = `${window.innerWidth - rect.left + padding + 10}px`;
                break;
              case 'right':
                modalPos.top = `${rect.top}px`;
                modalPos.left = `${rect.left + rect.width + padding + 10}px`;
                break;
              default: // bottom
                modalPos.top = `${rect.bottom + padding + 10}px`;
                modalPos.left = `${rect.left + rect.width / 2}px`;
                modalPos.transform = 'translateX(-50%)';
            }
            setModalStyle(modalPos);
        }, 300);
        return () => clearTimeout(scrollTimer);

      } else {
        setSpotlightStyle({
            boxShadow: '0 0 0 9999px rgba(18, 25, 38, 0.8)',
        });
        setModalStyle({
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] backdrop-blur-sm">
      <div
        className="absolute transition-all duration-500 ease-in-out"
        style={spotlightStyle}
      ></div>
      <div
        className="absolute bg-[#1b263b] text-white rounded-lg p-6 w-80 shadow-2xl border border-white/10 transition-all duration-500 ease-in-out"
        style={modalStyle}
      >
        <span className="text-sm font-bold text-[#FF570A]">{`Étape ${currentStep + 1} / ${steps.length}`}</span>
        <h3 className="text-xl font-bold mt-2 mb-3">{steps[currentStep].title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{steps[currentStep].content}</p>
        <div className="flex justify-between items-center mt-6">
          <button onClick={onComplete} className="text-xs text-gray-400 hover:text-white">Passer le guide</button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={handlePrev} className="px-3 py-1.5 bg-transparent border border-white/20 text-white font-semibold rounded-md text-sm hover:bg-white/10">
                Précédent
              </button>
            )}
            <button onClick={handleNext} className="px-4 py-1.5 bg-[#FF570A] text-white font-semibold rounded-md text-sm hover:bg-opacity-80">
              {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTour;