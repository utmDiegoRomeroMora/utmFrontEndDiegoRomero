import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://readdy.ai/api/search-image?query=abstract%20topographic%20contour%20map%20lines%20arid%20Mexican%20terrain%20drought%20monitoring%20stylized%20artistic%20illustration%20warm%20earth%20tones%20terracotta%20rust%20deep%20red%20technical%20minimal%20atmospheric%20overhead%20view%20dry%20land%20cracked%20soil%20patterns&width=1440&height=900&seq=drought_hero_bg_2025&orientation=landscape)',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-guinda-dark/85 via-guinda-dark/75 to-guinda-dark/90" />

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-dorado" />

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ paddingTop: '96px' }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-dorado/70 px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-dorado inline-block" />
          <span className="font-body text-xs font-semibold tracking-widest text-dorado uppercase">
            Sistema Institucional · Versión Prototipo
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight max-w-3xl">
          Sistema de Apoyo para la Detección y Clasificación de{' '}
          <span className="text-dorado">Sequía Municipal</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg text-white/85 max-w-2xl leading-relaxed">
          Plataforma web institucional para apoyar la clasificación preventiva de sequía a
          nivel municipal mediante un modelo de aprendizaje automático previamente entrenado.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 w-32">
          <div className="flex-1 h-px bg-dorado/60" />
          <div className="w-2 h-2 rotate-45 bg-dorado" />
          <div className="flex-1 h-px bg-dorado/60" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <button
            onClick={() => scrollTo('inferencia-cta')}
            className="cursor-pointer font-body font-semibold text-base px-8 py-3.5 rounded-md bg-dorado text-guinda-dark hover:bg-dorado-light transition-colors duration-200 whitespace-nowrap"
          >
            <span className="flex items-center gap-2">
              <i className="ri-arrow-right-circle-line text-xl" />
              Acceder al Módulo de Inferencia
            </span>
          </button>
          <button
            onClick={() => scrollTo('como-funciona')}
            className="cursor-pointer font-body font-medium text-base px-8 py-3.5 rounded-md border-2 border-white/70 text-white hover:border-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
          >
            <span className="flex items-center gap-2">
              <i className="ri-information-line text-xl" />
              Conocer el Funcionamiento
            </span>
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center gap-0 sm:gap-0 mt-6 border border-white/20 rounded-lg overflow-hidden">
          {[
            { value: '6', label: 'Categorías de Sequía' },
            { value: 'ML', label: 'Modelo Entrenado' },
            { value: 'CSV', label: 'Entrada de Datos' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex-1 px-8 py-4 text-center ${
                i < 2 ? 'border-b sm:border-b-0 sm:border-r border-white/20' : ''
              }`}
            >
              <div className="font-heading font-bold text-2xl text-dorado">{stat.value}</div>
              <div className="font-body text-xs text-white/70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={() => scrollTo('problema')}
          className="cursor-pointer flex flex-col items-center gap-2 text-white/60 hover:text-dorado transition-colors duration-200"
        >
          <span className="font-body text-xs tracking-widest uppercase">Explorar</span>
          <div className="w-6 h-6 flex items-center justify-center animate-bounce-slow">
            <i className="ri-arrow-down-line text-xl text-dorado" />
          </div>
        </button>
      </div>
    </section>
  );
}
