import React from 'react';

const skills = [
    { category: "No-code pur", tool: "Systeme.io", usage: "Création de tunnels de vente, automatisations marketing, e-mails, CRM intégré", level: 5 },
    { category: "No-code / CMS", tool: "WordPress", usage: "Sites vitrines, blogs, e-commerce, builders visuels et plugins", level: 5 },
    { category: "Vibe code / IA assistée", tool: "Lovable", usage: "Génération d’apps web (Next.js, Supabase), édition IA, logique avancée", level: 5 },
    { category: "Vibe code ++ / Dev IA temps réel", tool: "Bolt.new", usage: "Génération et édition en direct de code React/Next.js avec IA", level: 5 },
    { category: "Full code IA / Copilot", tool: "VS Code + Claude / ChatGPT", usage: "Environnement 100 % code, IA copilote, développement complet (front & back)", level: 4.5 },
    { category: "Low-code / Automation", tool: "GoHighLevel", usage: "CRM complet, gestion clients, funnels d’agence, marketing automation", level: 4 },
];

const values = [
    { title: "Clarté", text: "Je crois en une communication simple et directe. Pas de jargon technique inutile, juste des solutions claires qui répondent à vos besoins." },
    { title: "Efficacité", text: "Mon objectif est de vous livrer un projet qui fonctionne et qui convertit. Je me concentre sur ce qui apporte de la valeur, sans fioritures superflues." },
    { title: "Partenariat", text: "Je ne suis pas juste un prestataire, je suis votre partenaire. Je m'implique dans votre projet pour garantir son succès, comme si c'était le mien." },
    { title: "Adaptabilité", text: "Le monde du digital évolue vite. Je reste constamment à jour avec les derniers outils et tendances pour vous proposer les solutions les plus performantes." },
];

interface SkillCardProps {
    skill: typeof skills[0];
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => (
    <div className="bg-gradient-to-br from-[#1E2A38] to-[#121926] p-6 rounded-lg border-2 border-white/20 hover:border-[#FF570A] hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300">
        <h3 className="text-sm font-bold text-gray-300 uppercase">{skill.category}</h3>
        <h4 className="text-xl font-bold text-[#FF570A] my-1">{skill.tool}</h4>
        <p className="text-gray-400 text-sm mb-4 h-16">{skill.usage}</p>
        <div className="flex items-center">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(skill.level) ? 'text-[#FF570A]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                {skill.level % 1 !== 0 && (
                    <svg className="w-5 h-5 text-[#FF570A]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        <path d="M10 4.155v11.69l-2.8-2.034a1 1 0 00-1.175 0L2.98 15.844c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L.1 8.28c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" style={{ fill: 'rgba(24,30,41,0.5)' }} />
                    </svg>
                )}
            </div>
            <span className="text-sm font-bold ml-2 text-gray-300">{skill.level}/5</span>
        </div>
    </div>
);

interface ValueCardProps {
    value: typeof values[0];
}

const ValueCard: React.FC<ValueCardProps> = ({ value }) => (
    <div className="bg-[#1E2A38] p-8 rounded-lg border border-[#FF570A] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-1">
        <h3 className="text-2xl font-bold text-[#FF570A] mb-3">{value.title}</h3>
        <p className="text-white/90">{value.text}</p>
    </div>
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


export default function AboutPage() {
  return (
    <div className="bg-[#121926] text-white">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-[38px] font-black mb-6 leading-tight">Je suis Martin, freelance spécialisé dans la création de landing pages, tunnels de vente et apps no-code.</h1>
            <p className="text-lg text-gray-300">J’aide les entrepreneurs et petites entreprises à transformer leurs idées floues en projets concrets, beaux et efficaces. Mon objectif : vous faire gagner du temps, éviter les galères techniques et vous permettre de lancer rapidement quelque chose qui fonctionne vraiment.</p>
          </div>
          <div className="flex justify-center">
            <img src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/image/nouvelleimage.webp" alt="Martin Assogba Portrait" className="w-80 h-80 rounded-full object-cover shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-[#121926]">
          <div className="container mx-auto px-6 flex justify-center">
              <div className="relative w-full max-w-4xl rounded-2xl p-12 md:p-16 text-left text-white border-2 border-white/20 bg-gradient-to-br from-[#121926] via-[#1E2A38] to-[#007BFF]/50 shadow-2xl overflow-hidden">
                  <h2 className="text-3xl font-bold mb-4">Comment tout a commencé.</h2>
                  <div className="text-lg opacity-90 space-y-4 max-h-96 overflow-y-auto pr-4">
                      <p>Parce que chaque vie a une histoire. La mienne commence le jour où j’ai mis un pied à l’université. C’est là que j’ai découvert le monde du digital...</p>
                      <p>Aujourd’hui, j’ai soutenu ma licence en commerce international, mais je continue toujours le freelance, parce que c’est dans ce domaine que je me sens vraiment à ma place. Quatre ans plus tard, je n’ai jamais arrêté d’évoluer...</p>
                      <p>Puis est arrivée l’intelligence artificielle et la vague des outils no-code et vibe-code. Au lieu de regarder passer le train, j’ai décidé d’y monter. J’ai appris à utiliser ces nouvelles plateformes — Bubble, Webflow, Bolt.new, Lovable, et d’autres...</p>
                       <p>Alors voilà : je n’ai pas choisi ce métier par hasard. Je le vis, je l’apprends, je le perfectionne. Et si vous voulez qu’on discute de votre idée ou de votre outil préféré pour créer vos projets, vous pouvez me contacter à tout moment — je serai ravi d’en parler avec vous.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Skills Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Ce que je maîtrise</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map(skill => <SkillCard key={skill.tool} skill={skill} />)}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4 uppercase">Ma façon de travailler.</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-12">Chaque projet mérite la même attention. Je construis des solutions qui ont du sens, qui marchent vraiment et qui vous simplifient la vie.</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {values.map(value => <ValueCard key={value.title} value={value} />)}
            </div>
            <p className="text-xl italic text-white/80">"Je ne vends pas des sites. Je construis des leviers pour vos projets."</p>
        </div>
      </section>
      <TestimonialsSection />
    </div>
  );
}
