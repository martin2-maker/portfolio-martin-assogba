import React from 'react';
import { Link } from 'react-router-dom';

const toolData = [
    {
        icon: 'fa-project-diagram',
        title: 'Projet',
        description: 'Gérez vos projets en toute simplicité : suivez vos étapes, vos livrables et vos délais depuis un espace intuitif.'
    },
    {
        icon: 'fa-tasks',
        title: 'Tâches & Notes',
        description: 'Créez, organisez et suivez vos tâches et idées depuis un espace unifié pour une productivité maximale.'
    },
    {
        icon: 'fa-at',
        title: 'Extracteur d’e-mails',
        description: 'Identifiez et extrayez facilement des adresses e-mail pertinentes à partir de vos fichiers ou pages web.'
    },
    {
        icon: 'fa-chart-line',
        title: 'Analyse de rentabilité',
        description: 'Évaluez vos projets et investissements grâce à un outil simple et automatisé d’analyse financière.'
    },
    {
        icon: 'fa-calculator',
        title: 'Calculatrice',
        description: 'Effectuez des calculs rapides et précis, que ce soit pour vos budgets ou vos simulations de projet.'
    },
    {
        icon: 'fa-file-word',
        title: 'Compteur de mots',
        description: 'Analysez vos textes en détail : comptez mots, caractères, phrases et estimez le temps de lecture en un clin d\'œil.'
    }
];

interface ToolCardProps {
    icon: string;
    title: string;
    description: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-[#1E2A38] to-[#121926] p-8 rounded-xl border-2 border-white/10 hover:border-[#FF570A] hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col items-start">
        <div className="bg-[#FF570A] p-4 rounded-full mb-5">
            <i className={`fas ${icon} text-3xl text-white animate-icon-pulse`}></i>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-base flex-grow">{description}</p>
    </div>
);

const ToolsPage = () => {
    return (
        <div className="bg-[#121926] text-white">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10 relative">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl lg:text-5xl font-black mb-6 leading-tight text-white">
                            Découvrez vos outils gratuits pour booster votre productivité
                        </h1>
                        <p className="text-lg text-gray-300 my-8 max-w-xl mx-auto md:mx-0">
                            Gérez vos projets, automatisez vos tâches et optimisez votre rentabilité grâce à une suite d’outils puissants et intuitifs. Tout est réuni sur une seule plateforme — pensée pour les créateurs, les freelances et les entrepreneurs modernes.
                        </p>
                        <Link to="/compte" className="inline-block px-8 py-4 font-bold text-lg text-white rounded-md bg-[#FF570A] hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-orange-500/20 animate-pulse-orange">
                            Accéder à mes outils gratuits
                        </Link>
                    </div>
                    <div className="flex justify-center items-center">
                        <img 
                            src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/image/62bee75f39092_8.png" 
                            alt="Productivity Tools Illustration" 
                            className="w-full max-w-md rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Tools Section */}
            <section className="py-24 bg-[#1E2A38]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white">Vos outils disponibles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {toolData.map(tool => (
                            <ToolCard key={tool.title} {...tool} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-32 bg-[#121926] text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-[#FF570A] mb-6">Prêt à passer à la vitesse supérieure ?</h2>
                    <p className="text-lg max-w-3xl mx-auto text-white/90 mb-10">
                        Profitez dès maintenant de tous nos outils gratuits et centralisez vos projets, vos notes et vos analyses sur une seule plateforme.
                    </p>
                    <Link to="/compte" className="inline-block px-10 py-4 bg-[#FF570A] text-white text-xl font-bold rounded-md hover:bg-[#FF6F2C] hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/20">
                        Commencer gratuitement
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ToolsPage;
