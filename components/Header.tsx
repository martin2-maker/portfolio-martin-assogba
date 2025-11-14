import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const AnimatedName = () => {
  const name = "Martin ASSOGBA";
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prevKey => prevKey + 1);
    }, 6000 + 3000); // Animation duration + pause

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-[#FF570A] text-4xl font-black tracking-wider" key={key}>
      {name.split('').map((char, index) => (
        <span
          key={index}
          className="name-char"
          style={{ animationDelay: `${(name.length - 1 - index) * 0.1}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Services', path: '/services' },
    { name: 'Outils', path: '/outils' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeLinkStyle = {
    color: '#FF570A',
    textDecoration: 'underline',
    textUnderlineOffset: '8px',
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121926] border-b border-white/20 font-sans-fallback">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <AnimatedName />
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="text-lg font-bold text-white hover:text-white transition-colors duration-300"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              {item.name}
            </NavLink>
          ))}
          <a
            href="https://tawk.to/chat/69127d18bb14421953fd3b14/1j9o3haf7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-white hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            <i className="fas fa-question-circle"></i>
            Aide
          </a>
          <NavLink
            to="/compte"
            className="text-lg font-bold bg-[#FF570A] text-white px-6 py-2 rounded-md hover:bg-opacity-80 transition-all duration-300"
          >
            Compte
          </NavLink>
        </nav>
        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#121926] absolute w-full left-0 top-full shadow-lg">
          <nav className="flex flex-col items-center space-y-4 p-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className="text-lg font-bold text-white hover:text-white transition-colors duration-300"
                style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            <a
              href="https://tawk.to/chat/69127d18bb14421953fd3b14/1j9o3haf7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-white hover:text-white transition-colors duration-300 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-question-circle"></i>
              Aide
            </a>
            <NavLink
              to="/compte"
              className="text-lg font-bold bg-[#FF570A] text-white px-6 py-2 rounded-md hover:bg-opacity-80 transition-all duration-300"
               onClick={() => setIsMenuOpen(false)}
            >
              Compte
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;