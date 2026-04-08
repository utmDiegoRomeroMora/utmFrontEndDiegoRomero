import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setMenuOpen(false);
  };

  const goToInference = () => {
    navigate('/inferencia');
    setMenuOpen(false);
  };

  const navBg = isHome
    ? scrolled ? 'bg-white border-b border-gray-200' : 'bg-transparent'
    : 'bg-white border-b border-gray-200';

  const textColor = isHome && !scrolled ? 'text-white/90' : 'text-gray-600';
  const brandColor = isHome && !scrolled ? 'text-white' : 'text-guinda-dark';
  const subColor = isHome && !scrolled ? 'text-white/70' : 'text-gray-400';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`} style={{ height: '72px' }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
          </div>
          <div className="flex flex-col">
            <span className={`font-heading font-bold text-sm leading-tight whitespace-nowrap ${brandColor}`}>SADSM</span>
            <span className={`font-body text-xs leading-tight whitespace-nowrap ${subColor}`}>Sistema Apoyo a la Detección de Sequía</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {isHome && [
            { label: 'Inicio', id: 'hero' },
            { label: '¿Qué es?', id: 'problema' },
            { label: 'Funcionamiento', id: 'como-funciona' },
            { label: 'Categorías', id: 'categorias' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`cursor-pointer font-body text-sm font-medium transition-colors duration-200 whitespace-nowrap hover:text-dorado ${textColor}`}
            >
              {item.label}
            </button>
          ))}
          {!isHome && (
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer font-body text-sm font-medium text-gray-600 hover:text-guinda transition-colors duration-200 whitespace-nowrap"
            >
              <span className="flex items-center gap-1.5"><i className="ri-arrow-left-s-line" /> Inicio</span>
            </button>
          )}
          <button
            onClick={goToInference}
            className={`cursor-pointer font-body text-sm font-semibold px-5 py-2 rounded-md transition-all duration-200 whitespace-nowrap border-2 ${
              isHome && !scrolled
                ? 'border-dorado text-dorado hover:bg-dorado hover:text-guinda-dark'
                : 'border-guinda text-guinda hover:bg-guinda hover:text-white'
            }`}
          >
            Módulo de Inferencia
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden cursor-pointer text-2xl ${isHome && !scrolled ? 'text-white' : 'text-guinda'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={menuOpen ? 'ri-close-line' : 'ri-menu-line'} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {isHome && [
            { label: 'Inicio', id: 'hero' },
            { label: '¿Qué es?', id: 'problema' },
            { label: 'Funcionamiento', id: 'como-funciona' },
            { label: 'Categorías', id: 'categorias' },
          ].map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="cursor-pointer text-left font-body text-sm text-gray-700 hover:text-guinda">
              {item.label}
            </button>
          ))}
          <button onClick={goToInference} className="cursor-pointer text-left font-body text-sm font-semibold text-guinda">
            Módulo de Inferencia
          </button>
        </div>
      )}
    </nav>
  );
}