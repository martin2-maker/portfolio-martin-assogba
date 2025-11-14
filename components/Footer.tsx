
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#121926] to-[#1E2A38] text-white font-sans-fallback py-16 px-5 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2.5">Martin ASSOGBA</h2>
          <p className="text-base text-gray-400">Expert en landing pages, tunnels de vente et applications SaaS no-code</p>
        </div>
        <nav className="mb-8">
          <ul className="list-none flex flex-wrap justify-center gap-6 p-0 m-0">
            <li><Link to="/" className="text-white hover:text-white transition-colors">Accueil</Link></li>
            <li><Link to="/a-propos" className="text-white hover:text-white transition-colors">À propos</Link></li>
            <li><Link to="/services" className="text-white hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/outils" className="text-white hover:text-white transition-colors">Outils</Link></li>
            <li><Link to="/contact" className="text-white hover:text-white transition-colors">Contact</Link></li>
            <li>
              <Link to="/compte" className="bg-[#FF570A] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#FF6F2C] transition-colors">
                Compte
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mb-8">
          <ul className="list-none flex flex-wrap justify-center gap-5 p-0 m-0">
            <li><Link to="/politique-de-confidentialite" className="text-gray-400 text-sm hover:text-white transition-colors">Politique de confidentialité</Link></li>
            <li><Link to="/mentions-legales" className="text-gray-400 text-sm hover:text-white transition-colors">Mentions légales</Link></li>
            <li><Link to="/conditions-generales-d-utilisation" className="text-gray-400 text-sm hover:text-white transition-colors">Conditions Générales d’Utilisation</Link></li>
          </ul>
        </div>
        <div className="mb-8 flex justify-center gap-5">
          <a href="https://www.linkedin.com/in/martin-assogba/" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-[#007BFF] transition-colors">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://www.upwork.com/freelancers/~01360b53eef14c12ce" target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-green-500 transition-colors">
            <i className="fab fa-upwork"></i>
          </a>
          <a href="mailto:martinassogba75@gmail.com" className="text-white text-2xl hover:text-red-500 transition-colors">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
        <hr className="border-none h-px bg-white/10 mb-4" />
        <p className="text-sm text-gray-400">&copy; 2025 Martin ASSOGBA. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;