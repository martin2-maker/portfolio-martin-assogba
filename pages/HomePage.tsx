import React, { useEffect, useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';

interface AnimatedButtonProps {
    primary?: boolean;
    children?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, primary = true }) => {
    const commonClasses = "relative inline-block px-8 py-3 font-bold text-lg text-white rounded-md overflow-hidden transition-all duration-300";
    const primaryClasses = "bg-[#FF570A] group-hover:bg-opacity-90 animate-pulse-orange";
    const secondaryClasses = "border-2 border-[#FF570A] bg-transparent group-hover:text-white group-hover:bg-[#FF570A]";

    return (
        <div className="relative group">
            <button className={`${commonClasses} ${primary ? primaryClasses : secondaryClasses}`}>
                {children}
            </button>
        </div>
    );
};


const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        let particles: { x: number, y: number, radius: number, vx: number, vy: number }[] = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            });
        }

        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 overflow-hidden">
        <ParticleCanvas />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient from-purple-600/20 via-pink-500/10 to-transparent blur-3xl rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="container mx-auto px-6 z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-[38px] lg:text-5xl font-black mb-6 leading-tight">Je crée des pages qui transforment les clics en vrais clients.</h1>
                    <p className="text-lg text-gray-300 my-8 max-w-xl mx-auto md:mx-0">
                        Je suis un expert en création de landing pages et de tunnels de vente pour les SaaS, les coachs et les offres numériques.
                    </p>
                    <div className="flex justify-center md:justify-start gap-6">
                        <a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
                           <AnimatedButton primary>Voir mes projets</AnimatedButton>
                        </a>
                        <Link to="/contact">
                           <AnimatedButton primary={false}>Me contacter</AnimatedButton>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="relative w-80 h-80 lg:w-96 lg:h-96 animate-float" style={{ animation: 'float 6s ease-in-out infinite' }}>
                        <img 
                          src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/DSC_8064%20copie%20(1).jpg" 
                          alt="Martin Assogba" 
                          className="w-full h-full object-cover"
                          style={{ borderRadius: '3% 3% 3% 20%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const AboutMiniSection = () => (
    <section className="py-24 bg-[#121926]">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center">
                    <img src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Avatar.png" alt="Avatar" className="w-64 h-64 rounded-full" />
                </div>
                <div className="border-2 border-white/20 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-4">Freelance, mais pas tout seul dans mon coin.</h2>
                    <p className="text-lg text-gray-300">Je m'appelle Martin, freelance spécialisé dans la création de sites web sans code depuis 4 ans. Je conçois des landing pages, des sites complets et des boutiques en ligne 100 % opérationnelles — sans une seule ligne de code, mais avec beaucoup de passion.</p>
                </div>
            </div>
        </div>
    </section>
);

const projects = [
    { name: 'IAECHO', desc: 'Plateforme numérique indépendante sur l’intelligence artificielle et les technologies. J’ai conçu et développé cette plateforme pour qu’elle soit moderne, intuitive et responsive.', tags: ['Conception de sites web', 'Développement web', 'Plateforme numérique', 'Responsive design'], img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/iaecho%20capture.png' },
    { name: 'Divina Cosmetic', desc: 'Agence de beauté & bien-être sur-mesure. J’ai accompagné cette marque dans la conception et le développement d’un site WordPress élégant et performant.', tags: ['Conception de sites web', 'Développement web', 'Performance SEO', 'WordPress'], img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/divina-cosmetic.png' },
    { name: 'CryptoTrader Academy', desc: 'Formation en trading de cryptomonnaies. J’ai conçu un entonnoir de vente complet et une page d’accueil percutante afin d’optimiser la conversion.', tags: ["Créateur d'entonnoirs de vente", 'Entonnoir de vente', 'Conception de sites web'], img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/cryptoacademy.png' },
    { name: 'IA Business Master', desc: 'Programme de coaching en stratégies digitales basées sur l’IA. J’ai conçu un entonnoir de vente intelligent, combiné à une automatisation du marketing.', tags: ["Créateur d'entonnoirs de vente", 'Automatisation du marketing', 'Conception de page d\'accueil'], img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/IAMASTER.png' }
];

interface ProjectCardProps {
    project: typeof projects[0];
    index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
    
    return (
        <div ref={ref} className={`bg-white text-black rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all duration-500 ease-in-out ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative group">
                <img src={project.img} alt={project.name} className="w-full h-56 object-cover object-top transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-yellow-400 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-4 text-lg">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ProjectsSection = () => (
    <section id="projects" className="py-24 bg-white text-black">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Projets en vedette</h2>
            <p className="text-lg text-gray-600 mb-12">Découvrez quelques-unes de mes réalisations.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} />)}
            </div>
        </div>
    </section>
);

const expertises = [
    { title: 'Landing Pages qui convertissent', img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Landing%20Pages%20That%20Convert.jpg', text: 'Si vous cherchez une landing page claire, moderne et surtout efficace, vous êtes au bon endroit. À partir d’une simple idée, je crée une page qui attire l’attention, valorise votre offre et donne envie de passer à l’action — sans superflu, juste du résultat.' },
    { title: 'Tunnels de vente qui vendent', img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Sales%20Funnels%20That%20Sell.jpg', text: 'Vous voulez transformer vos visiteurs en vrais clients ? Je construis des tunnels de vente simples, cohérents et bien pensés pour guider votre audience du premier clic jusqu’à l’achat. Chaque étape est là pour inspirer confiance et booster vos ventes.' },
    { title: 'Applications no-code sur mesure', img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/No-Code%20SaaS%20Apps.jpg', text: 'Vous avez une idée d’application mais pas d’équipe technique ? Pas de souci. Avec des outils no-code, je vous crée une appli fonctionnelle, rapide à lancer et 100 % adaptée à vos besoins — sans ligne de code à écrire.' },
    { title: 'Intégrations et automatisations API', img: 'https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/API%20Integrations.jpg', text: 'Vous en avez marre de tout faire à la main ? Je relie vos outils entre eux pour automatiser vos process et vous faire gagner du temps. Résultat : moins de clics, moins d’erreurs et une vraie fluidité dans votre façon de travailler.' }
];

interface ExpertiseCardProps {
    expertise: typeof expertises[0];
    index: number;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ expertise, index }) => {
    const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
    const animationDelay = `${index * 150}ms`;

    return (
        <div
            ref={ref}
            className={`
                group relative bg-white rounded-2xl shadow-lg border border-[#FFE0B2]
                overflow-hidden transition-all duration-500 ease-out
                hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-amber-400/20
                ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}
            style={{ transitionDelay: animationDelay }}
        >
            <div className="relative h-[180px] overflow-hidden">
                <img
                    src={expertise.img}
                    alt={expertise.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full border border-black/80 transition-all duration-400 ease-in-out group-hover:rotate-3 group-hover:shadow-[0_0_15px_#FFB84D]">
                    Premium
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-[#121926] mb-2 flex items-center">
                    {expertise.title}
                    <span className="ml-2 text-[#FF570A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">⚡</span>
                </h3>
                <p className="text-base text-[#333333] leading-relaxed">
                    {expertise.text}
                </p>
            </div>
        </div>
    );
};


const ExpertiseSection = () => (
    <section className="py-24 bg-[#121926] overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
                <h2 className="relative text-4xl font-bold inline-block text-white">
                    Mes Expertises
                    <span className="absolute -bottom-2.5 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF570A] to-transparent"></span>
                </h2>
                <p className="text-lg text-[#FFE0B2] mt-8 max-w-3xl mx-auto">
                    Des solutions concrètes, pensées pour vos conversions, vos automatisations et votre croissance digitale.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {expertises.map((exp, i) => (
                    <ExpertiseCard key={exp.title} expertise={exp} index={i} />
                ))}
            </div>
        </div>
    </section>
);

const CTASection = () => (
    <section className="cta-container">
      <div className="cta-parent">
        <div className="cta-gradient"></div>
        <div className="cta-main_content">
          <div className="cta-left">
            <h3>Web</h3>
            <h1>Design & <br /><span>Development</span></h1>
            <h2>Prêt à faire grandir votre projet ?</h2>
            <p>
              Donnez vie à vos ambitions avec un design percutant et des
              stratégies digitales sur mesure. Ensemble, transformons vos idées
              en un projet florissant, visible et impactant.
            </p>
            <Link to="/contact" className="cta-button">
              Discutons de votre projet dès aujourd’hui !
            </Link>
          </div>
          <div className="cta-right">
            <img
              src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/mushroom.png"
              alt="Illustration portfolio"
            />
          </div>
        </div>
        <div className="cta-separator-gradient"></div>
      </div>
    </section>
);

const testimonials = [
    { date: 'Octobre 2025', text: 'Martin est top ! Il a transformé mon idée en une landing page qui convert vraiment. Je ne savais pas comment structurer mon offre, et maintenant j’ai un tunnel clair et efficace. Honnêtement, je recommande à 100 %.' },
    { date: 'Septembre 2025', text: 'Excellent travail ! Mon application no-code est enfin fonctionnelle et rapide à lancer. Martin comprend parfaitement les besoins et propose toujours des solutions simples mais efficaces. Très professionnel et sympa.' },
    { date: 'Août 2025', text: 'Je n’avais jamais fait appel à un freelance pour créer un funnel complet. Martin a tout géré de A à Z, avec une approche très structurée et claire. Les résultats ont été immédiats, mes ventes ont augmenté rapidement.' },
    { date: 'Juillet 2025', text: 'Martin est génial ! Il ne se contente pas de faire le travail, il réfléchit à comment améliorer votre projet et optimise tout pour que ce soit simple et efficace. Très créatif et fiable.' },
    { date: 'Juin 2025', text: 'Travailler avec Martin a été un vrai plaisir. Il a créé des intégrations entre mes outils qui m’ont fait gagner énormément de temps. Tout est fluide et je n’ai plus de process manuels. Vraiment professionnel.' },
    { date: 'Avril 2025', text: 'Je recommande Martin sans hésitation ! Son expertise en landing pages et tunnels de vente est top, et il sait expliquer les choses simplement. Il rend tout le processus très facile et agréable.' }
];

const TestimonialsSection = () => (
    <section className="bg-[#121926] py-24 text-center overflow-hidden">
        <div className="container mx-auto px-[10%] w-full">
            <div className="relative inline-block mb-4">
                <h2 className="text-5xl font-black mb-4">
                    {'Témoignages'.split('').map((char, index) => (
                        <span key={index} className="animate-fall" style={{ animationDelay: `${index * 50}ms` }}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h2>
                <div className="animated-underline"></div>
            </div>
            <p className="text-xl text-gray-400 mb-16">Derrière chaque projet, une belle rencontre</p>
            
            <div className="testimonial-scroller">
                <div className="testimonial-scroller-inner">
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-bold text-lg text-left">
                                        <span className="text-[#FF570A]">@Client</span>, {testimonial.date}
                                    </p>
                                </div>
                                <div className="flex text-[#FF570A]">
                                    {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                </div>
                            </div>
                            <p className="text-white text-left text-lg">« {testimonial.text} »</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);


const HomePage = () => (
    <>
        <HeroSection />
        <AboutMiniSection />
        <ProjectsSection />
        <ExpertiseSection />
        <FAQ />
        <TestimonialsSection />
        <CTASection />
    </>
);

export default HomePage;
