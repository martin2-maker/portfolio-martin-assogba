import React, { useState, useRef } from 'react';
import FAQ from '../components/FAQ';

declare const emailjs: any;

const ContactPage = () => {
    const form = useRef<HTMLFormElement>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!form.current) return;

        setLoading(true);
        setError('');

        emailjs.sendForm('service_0zl2xjr', 'template_z34yxun', form.current)
            .then((result: any) => {
                console.log(result.text);
                setSuccess(true);
                if (form.current) {
                    form.current.reset();
                    setSubject('');
                }
            }, (error: any) => {
                console.log(error.text);
                setError('Une erreur est survenue. Veuillez réessayer.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-[#121926] text-white">
            <section className="py-24">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Vous avez un projet, une idée ou une question ? Discutons-en !</h1>
                        <p className="text-lg text-gray-400 mb-6">Je suis disponible 24h/7j pour répondre à vos demandes.</p>
                        <a href="#contact-form" className="inline-block bg-[#FF570A] text-white text-lg font-bold px-8 py-3 rounded-md hover:bg-[#FF6F2C] transition-colors">
                            📩 Envoyer un message
                        </a>
                        <p className="text-sm text-gray-500 mt-4">Réponse garantie sous 24 heures — ou plus vite encore.</p>
                    </div>
                    <div className="flex justify-center items-center">
                        <img 
                            src="https://zuzjruifyjdyzvivobyx.supabase.co/storage/v1/object/public/portfolio-public/Avatar.png" 
                            alt="Contact Illustration" 
                            className="w-64 h-64"
                        />
                    </div>
                </div>
            </section>

            <section id="contact-form" className="py-24 bg-[#121926]">
                <div className="container mx-auto px-6 flex flex-wrap justify-center items-start gap-10">
                    <div className="w-full max-w-lg bg-[#1a2133] border border-orange-500/30 shadow-2xl shadow-orange-500/10 rounded-2xl p-8 md:p-10">
                        {success ? (
                             <div className="text-center bg-orange-500/10 border border-[#FF570A] p-6 rounded-lg">
                                <h2 className="text-2xl font-bold mb-4">✅ Merci beaucoup pour votre message !</h2>
                                <p>Je le lirai attentivement et vous répondrai dès que possible. Merci de votre confiance 🤝</p>
                            </div>
                        ) : (
                        <>
                            <h2 className="text-3xl font-bold text-[#FF570A] mb-6">Me contacter</h2>
                            <form ref={form} onSubmit={sendEmail} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom complet <span className="text-[#FF570A]">*</span></label>
                                    <input type="text" name="from_name" required className="w-full bg-[#101620] border border-[#2b3345] rounded-lg p-3 focus:border-[#FF570A] focus:ring-[#FF570A] transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email <span className="text-[#FF570A]">*</span></label>
                                    <input type="email" name="reply_to" required className="w-full bg-[#101620] border border-[#2b3345] rounded-lg p-3 focus:border-[#FF570A] focus:ring-[#FF570A] transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Objet <span className="text-[#FF570A]">*</span></label>
                                    <select name="subject" required className="w-full bg-[#101620] border border-[#2b3345] rounded-lg p-3 focus:border-[#FF570A] focus:ring-[#FF570A] transition" onChange={(e) => setSubject(e.target.value)}>
                                        <option value="">Sélectionnez un objet</option>
                                        <option>Devis ou estimation de projet</option>
                                        <option>Collaboration ou partenariat</option>
                                        <option>Support ou assistance technique</option>
                                        <option>Création de landing page</option>
                                        <option>Création de tunnel de vente</option>
                                        <option>Création d'une application SaaS no-code</option>
                                        <option>Intégration API personnalisée</option>
                                        <option>Création d’outil IA personnalisé</option>
                                        <option>Intégration d’IA dans un site ou une app</option>
                                        <option>Conception de site web complet</option>
                                        <option>Refonte ou amélioration d’un site existant</option>
                                        <option>Autre (à préciser)</option>
                                    </select>
                                </div>
                                {subject.includes("Autre") && (
                                     <div>
                                        <label className="block text-sm font-medium mb-2">Précisez l'objet <span className="text-[#FF570A]">*</span></label>
                                        <input type="text" name="otherSubject" required className="w-full bg-[#101620] border border-[#2b3345] rounded-lg p-3 focus:border-[#FF570A] focus:ring-[#FF570A] transition" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message <span className="text-[#FF570A]">*</span></label>
                                    <textarea name="message" required rows={5} className="w-full bg-[#101620] border border-[#2b3345] rounded-lg p-3 focus:border-[#FF570A] focus:ring-[#FF570A] transition"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-[#FF570A] text-white font-bold py-3 rounded-lg hover:bg-[#FF6F2C] transition-transform hover:scale-105 disabled:opacity-50">
                                    {loading ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                                 <small className="block text-center mt-4 text-gray-400 text-xs">Votre message me parviendra directement et je vous répondrai rapidement.</small>
                            </form>
                        </>
                        )}
                    </div>
                    <div className="w-full max-w-lg space-y-5">
                         <div className="bg-[#1a2133] border-l-4 border-[#FF570A] p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-[#FF570A] mb-2">📧 Email direct</h3>
                            <a href="mailto:martinassogba75@gmail.com" className="hover:text-[#FF570A] transition">martinassogba75@gmail.com</a>
                        </div>
                         <div className="bg-[#1a2133] border-l-4 border-[#FF570A] p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-[#FF570A] mb-2">💼 LinkedIn</h3>
                            <a href="https://www.linkedin.com/in/martin-assogba/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF570A] transition">Profil LinkedIn</a>
                        </div>
                        <div className="bg-[#1a2133] border-l-4 border-[#FF570A] p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-[#FF570A] mb-2">🌍 Upwork</h3>
                             <a href="https://www.upwork.com/freelancers/~01360b53eef14c12ce" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF570A] transition">Voir mon profil Upwork</a>
                        </div>
                        <div className="bg-[#1a2133] border border-orange-500/30 p-6 rounded-2xl overflow-hidden">
                             <h3 className="text-lg font-bold text-[#FF570A] mb-2">📍 Carte & localisation</h3>
                             <p className="text-gray-300 mb-4"><strong>Ville :</strong> Cotonou, Bénin <br/> <strong>Disponibilité :</strong> 24h/7j</p>
                            <div className="h-64 rounded-lg overflow-hidden">
                                <iframe src="https://www.google.com/maps?q=Cotonou,+B%C3%A9nin&hl=fr&z=14&output=embed" loading="lazy" className="w-full h-full border-0"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FAQ />
        </div>
    );
};

export default ContactPage;