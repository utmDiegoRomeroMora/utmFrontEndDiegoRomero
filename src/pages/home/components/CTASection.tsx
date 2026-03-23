import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="inferencia-cta" className="bg-guinda-dark py-24 relative overflow-hidden">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 40px), repeating-linear-gradient(-45deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 40px)',
          }}
        />
      </div>
      {/* Top dorado bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-dorado" />

      <div
        ref={ref}
        className={`relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Icon */}
        <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dorado/60">
          <i className="ri-database-2-line text-3xl text-dorado" />
        </div>

        {/* Title */}
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white leading-snug">
          Cargue sus datos y consulte los{' '}
          <span className="text-dorado">resultados de clasificación</span>
        </h2>

        {/* Description */}
        <p className="font-body text-base text-white/75 leading-relaxed max-w-xl">
          Acceda al módulo de inferencia para cargar su archivo CSV, ejecutar el análisis de sequía y visualizar los resultados municipales de forma organizada.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 w-28">
          <div className="flex-1 h-px bg-dorado/50" />
          <div className="w-1.5 h-1.5 rotate-45 bg-dorado" />
          <div className="flex-1 h-px bg-dorado/50" />
        </div>

        {/* Steps preview */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-sm font-body text-white/60">
          <span className="flex items-center gap-2">
            <i className="ri-file-upload-line text-dorado" /> Cargar CSV
          </span>
          <i className="ri-arrow-right-s-line text-dorado" />
          <span className="flex items-center gap-2">
            <i className="ri-cpu-line text-dorado" /> Ejecutar inferencia
          </span>
          <i className="ri-arrow-right-s-line text-dorado" />
          <span className="flex items-center gap-2">
            <i className="ri-table-line text-dorado" /> Consultar resultados
          </span>
        </div>

        {/* Main CTA button */}
        <button
          className="cursor-pointer font-body font-bold text-base px-10 py-4 rounded-md bg-dorado text-guinda-dark hover:bg-dorado-light transition-colors duration-200 whitespace-nowrap mt-2"
          onClick={() => navigate('/inferencia')}
        >
          <span className="flex items-center gap-3">
            <i className="ri-upload-cloud-2-line text-xl" />
            Acceder al Módulo de Inferencia
          </span>
        </button>

        <p className="font-body text-xs text-white/40">
          Prototipo funcional · Solo para uso institucional · Datos procesados localmente
        </p>
      </div>
    </section>
  );
}
