import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    num: '01',
    icon: 'ri-file-excel-2-line',
    title: 'Carga de Archivo CSV',
    desc: 'El usuario carga un archivo CSV previamente preparado con las variables requeridas para la clasificación de cada registro municipal.',
    color: 'bg-dorado-pale border-dorado',
    iconColor: 'text-dorado-dark',
  },
  {
    num: '02',
    icon: 'ri-settings-3-line',
    title: 'Procesamiento de Datos',
    desc: 'El sistema envía la información al servicio de inferencia, donde el modelo previamente entrenado analiza cada registro del archivo.',
    color: 'bg-guinda-pale border-guinda/30',
    iconColor: 'text-guinda',
  },
  {
    num: '03',
    icon: 'ri-mind-map',
    title: 'Clasificación por Registro',
    desc: 'El modelo genera una categoría de sequía asignada (de Sin Sequía hasta D4) para cada municipio, incluyendo el nivel de confianza del modelo.',
    color: 'bg-dorado-pale border-dorado',
    iconColor: 'text-dorado-dark',
  },
  {
    num: '04',
    icon: 'ri-bar-chart-grouped-line',
    title: 'Visualización de Resultados',
    desc: 'La plataforma muestra una tabla organizada con nivel de sequía, categoría de alerta y confianza, lista para consulta y priorización.',
    color: 'bg-guinda-pale border-guinda/30',
    iconColor: 'text-guinda',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="bg-guinda-pale py-24">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-xs font-bold tracking-widest text-dorado uppercase">
            03 — Operación
          </span>
          <div className="flex-1 max-w-16 h-px bg-dorado/50" />
        </div>
        <div className="mb-12 max-w-xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-guinda-dark leading-snug mb-4">
            ¿Cómo <span className="text-guinda">funciona?</span>
          </h2>
          <p className="font-body text-base text-gray-600 leading-relaxed">
            El sistema opera en cuatro etapas secuenciales, desde la carga de datos hasta la
            presentación de resultados de clasificación de sequía.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`,
              }}
            >
              <div className={`${step.color} border rounded-lg p-6 h-full flex flex-col gap-4 hover:border-guinda/50 transition-colors duration-200`}>
                {/* Step number */}
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-guinda text-white font-heading font-bold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <i className={`${step.icon} text-2xl ${step.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h4 className="font-heading font-bold text-sm text-guinda-dark mb-2 leading-snug">
                    {step.title}
                  </h4>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>

              {/* Arrow connector (not last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 items-center justify-center w-6 h-6">
                  <i className="ri-arrow-right-s-line text-xl text-guinda/60" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 flex items-center gap-4 justify-center">
          <div className="h-px bg-guinda/20 flex-1 max-w-24" />
          <p className="font-body text-xs text-gray-400 text-center max-w-md">
            Todo el proceso ocurre dentro de la plataforma web sin necesidad de instalar software adicional. El archivo de salida puede descargarse para uso posterior.
          </p>
          <div className="h-px bg-guinda/20 flex-1 max-w-24" />
        </div>
      </div>
    </section>
  );
}
