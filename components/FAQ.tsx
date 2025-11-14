import React, { useState } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const faqData = [
  {
    question: "Combien de temps faut-il pour créer une landing page ou un tunnel de vente ?",
    answer: "En moyenne, une landing page simple peut être prête en 2 à 4 jours, et un tunnel complet en 1 à 2 semaines selon la complexité. Mon but, c’est d’avancer vite tout en gardant un rendu propre, clair et performant."
  },
  {
    question: "Tu utilises quels outils pour construire les projets ?",
    answer: "J’utilise principalement des outils no-code comme WordPress, Systeme.io, Webflow, ou encore Bubble , selon le type de projet. Chaque outil a ses forces, donc je choisis celui qui correspond le mieux à vos besoins (vitesse, budget, flexibilité)."
  },
  {
    question: "Est-ce que tu t’occupes aussi du design et du texte ?",
    answer: "Oui, tout à fait. Je conçois le design complet et je peux aussi retravailler vos textes pour les rendre plus clairs et convaincants. Si vous partez de zéro, je vous aide à structurer votre message pour que la page convertisse vraiment."
  },
  {
    question: "Tu proposes aussi la connexion avec des outils externes (paiement, IA, CRM, etc.) ?",
    answer: "Oui, je gère toutes les intégrations nécessaires : Stripe, PayPal, OpenAI API, Airtable, Notion, et plein d’autres. Le but, c’est que tout fonctionne ensemble sans friction — automatisations, paiements,base de données, formulaires, tracking, CRM…"
  },
  {
    question: "Est-ce que tu peux m’aider à améliorer une page déjà existante ?",
    answer: "Bien sûr ! Je peux auditer votre landing page actuelle, repérer les points à optimiser (structure, texte, design, conversions) et vous livrer une version améliorée, prête à performer."
  },
  {
    question: "Quels sont tes tarifs ?",
    answer: "Pour les landing pages, une simple page démarre à 50 $, et peut aller jusqu’à 150 $ ou 200 $ selon la complexité du projet, les intégrations et l’outil utilisé. Les tunnels de vente ou apps no-code sont tarifés sur mesure après un court échange pour bien cerner vos besoins. Bref, c’est transparent, clair, et toujours adapté à votre budget."
  },
  {
    question: "Comment te contacter ?",
    answer: "Pour entrer en contact avec moi, tu peux utiliser le formulaire de contact disponible sur mon site ou m’envoyer un message directement sur Upwork via le bouton prévu à cet effet."
  }
];

// Fix: Define an interface for props.
interface FaqItemProps {
  item: typeof faqData[0];
  isOpen: boolean;
  onClick: () => void;
}

// Fix: Use React.FC to correctly type a functional component that will receive a `key` prop in a list.
const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/20">
      <button
        onClick={onClick}
        className="w-full text-left flex justify-between items-center py-6 focus:outline-none"
      >
        <span className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-[#FF7B3A]' : 'text-[#FF570A]'} hover:text-[#FF7B3A]`}>
          {item.question}
        </span>
        <span className={`transform transition-transform duration-400 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-[#FF570A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <p className="pb-6 text-white text-base md:text-lg font-bold leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Fix: Specify the element type for the intersection observer hook.
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#121926] py-24">
      <div ref={ref} className={`container mx-auto px-6 max-w-4xl transition-all duration-700 ease-out ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">FAQ – Questions fréquentes</h2>
          <p className="text-lg text-gray-300">Parce qu’il vaut mieux tout savoir avant de se lancer, non ?</p>
        </div>
        <div className="border-2 border-white/20 rounded-2xl p-4 md:p-8">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;