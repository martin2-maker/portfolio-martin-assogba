import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SolarSystem = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 scale-50 md:scale-75 lg:scale-100">
    <div className="solar-system-container">
      <div className="sun"><img src="https://raw.githubusercontent.com/CogniSolver/solar-system/main/images/soleil.png" alt="sun" className="w-[130%] h-[130%]" /></div>
      <div className="planet-orbit mercury planet-body"></div>
      <div className="planet-orbit venus planet-body"></div>
      <div className="planet-orbit earth planet-body">
        <div className="planet-orbit moon planet-body"></div>
      </div>
      <div className="planet-orbit mars planet-body"></div>
      <div className="planet-orbit jupiter planet-body"></div>
      <div className="planet-orbit saturn planet-body"></div>
      <div className="planet-orbit uranus planet-body"></div>
      <div className="planet-orbit neptune planet-body"></div>
      <div className="planet-orbit pluto planet-body"></div>
    </div>
  </div>
);

const Typewriter = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.substring(0, i + 1));
            i++;
            if (i === text.length) {
                clearInterval(interval);
                 setTimeout(() => { i=0; }, 2000); // loop
            }
        }, 100);
        return () => clearInterval(interval);
    }, [text]);

    return <h1 className="text-4xl md:text-6xl font-black mb-4 h-24 md:h-32">{displayedText}<span className="animate-ping">|</span></h1>;
};

const ImageSlider = ({ images, reverse = false }: { images: string[], reverse?: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-96 rounded-lg p-2">
            <div className={`absolute inset-0 rounded-lg bg-conic-from-90-at-50-50-from-purple-500-via-pink-500-to-orange-500 ${reverse ? 'rotating-border-animation animation-reverse' : 'rotating-border-animation'}`}></div>
            <div className="relative w-full h-full overflow-hidden rounded-md">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`slide-${index}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    />
                ))}
            </div>
        </div>
    );
};

interface ServiceSectionProps {
  title: string;
  text: React.ReactNode;
  ctaText: string;
  images: string[];
  imageSide?: 'left' | 'right';
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ title, text, ctaText, images, imageSide = 'right' }) => (
    <section className="py-24">
        <div className="container mx-auto px-6">
            <div className={`grid md:grid-cols-2 gap-16 items-center ${imageSide === 'left' ? 'md:grid-flow-col-dense' : ''}`}>
                <div className={` ${imageSide === 'left' ? 'md:col-start-2' : ''}`}>
                    <div className="relative bg-[#121926] border border-white/10 p-8 rounded-lg">
                        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-5 h-5 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-3 h-3 bg-gray-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
                        <h2 className="text-3xl font-bold text-[#FF570A] mb-4">{title}</h2>
                        <div className="text-lg text-white/90 space-y-4 mb-8">
                            {text}
                        </div>
                        <Link to="/contact" className="inline-block bg-[#FF570A] text-white font-bold px-8 py-3 rounded-md hover:bg-[#FF6F2C] transition-colors shadow-lg shadow-orange-500/10">
                            {ctaText}
                        </Link>
                    </div>
                </div>
                <div className={`${imageSide === 'left' ? 'md:col-start-1' : ''}`}>
                    <ImageSlider images={images} reverse={imageSide === 'left'} />
                </div>
            </div>
        </div>
    </section>
);

const ClockBackground = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-10">
      <div className="relative w-96 h-96 border-2 border-[#1b263b] rounded-full">
        <div
          className="absolute top-1/2 left-1/2 w-1 h-24 bg-[#1b263b] origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-[#1b263b] origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-px h-40 bg-[#1b263b] origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#1b263b] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};


export default function ServicesPage() {
    return (
        <div className="bg-[#121926] text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <SolarSystem />
                <div className="relative z-10 p-6">
                    <Typewriter text="Explorer mes services" />
                    <p className="text-lg md:text-xl text-gray-300">Je t’aide à passer de l’idée au concret, avec des solutions claires, modernes et efficaces.</p>
                </div>
            </section>
            
            <ServiceSection
                title="Landing Pages qui convertissent"
                text={<>
                    <p>Une bonne landing page, ce n’est pas qu’une belle page — c’est une page qui fait agir.</p>
                    <p>Je conçois des pages claires, modernes et percutantes, pensées pour attirer l’attention, valoriser ton offre et donner envie de passer à l’action dès les premières secondes.</p>
                    <p className="font-bold">👉 Moins de blabla. Plus de résultats.</p>
                </>}
                ctaText="Commandez la vôtre maintenant"
                images={[
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%204.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%203.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%202.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%201.jpg'
                ]}
                imageSide="right"
            />
            
            <ServiceSection
                title="Tunnels de vente qui vendent"
                text={<>
                    <p>Un bon tunnel de vente, c’est une histoire fluide qui transforme la curiosité en confiance — puis en action.</p>
                    <p>Je conçois des parcours simples, cohérents et performants, où chaque étape a un but précis : guider ton audience du premier clic jusqu’à l’achat, naturellement.</p>
                    <p className="font-bold">👉 Construisons ensemble ton tunnel qui vend vraiment.</p>
                </>}
                ctaText="Crée ton tunnel dès aujourd’hui"
                images={[
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%202.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%202.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%204.jpg'
                ]}
                imageSide="left"
            />
            
            <ServiceSection
                title="Applications no-code sur mesure"
                text={<>
                    <p>Tu as une idée d’application, mais pas le temps ou l’équipe technique pour la développer ?</p>
                    <p>Grâce au no-code, je crée pour toi des applications sur mesure, rapides à lancer, évolutives et prêtes à l’emploi — sans une seule ligne de code.</p>
                     <p className="font-bold">👉 Moins de complexité. Plus d’impact.</p>
                </>}
                ctaText="Lance ton app maintenant"
                images={[
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure4.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure3.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure2.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure1.jpg'
                ]}
                imageSide="right"
            />
            
            <ServiceSection
                title="Intégrations et automatisations API"
                text={<>
                    <p>Marre de répéter les mêmes tâches ? Je connecte vos outils entre eux pour automatiser ce qui peut l’être — et vous libérer du temps.</p>
                    <p>Que ce soit pour relier vos formulaires à votre CRM, connecter vos paiements Stripe ou PayPal, ou intégrer des services IA comme OpenAI, je mets en place des automatisations fluides et fiables.</p>
                    <p>Résultat : moins de clics, moins d’erreurs, et un vrai gain d’efficacité au quotidien.</p>
                </>}
                ctaText="Automatisez vos process dès aujourd’hui"
                 images={[
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure3.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20qui%20convertissent,%202.jpg',
                    'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Applications%20no-code%20sur%20mesure4.jpg'
                ]}
                imageSide="left"
            />
            
            {/* CTA Section */}
            <section className="relative py-32 bg-[#121926] overflow-hidden">
                <ClockBackground />
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#FF570A] mb-6">Prêt à transformer votre idée en projet concret ?</h2>
                    <p className="text-lg max-w-3xl mx-auto text-white/90 mb-10">Vous avez une idée, un service, un produit. On avance ensemble, étape par étape, jusqu’à ce que votre projet prenne forme. Pas de jargon. Pas de promesses en l’air. Juste du concret, du bon sens et des résultats.</p>
                    <Link to="/contact" className="inline-block bg-[#FF570A] text-white text-xl font-bold px-10 py-4 rounded-md hover:bg-[#FF6F2C] hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/20">
                        Discutons de votre projet
                    </Link>
                </div>
            </section>
        </div>
    );
}