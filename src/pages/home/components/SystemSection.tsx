import { useEffect, useRef, useState } from 'react';

const capabilities = [
  {
    num: '01',
    icon: 'ri-file-upload-line',
    title: 'Recepción de datos procesados',
    desc: 'La plataforma acepta archivos CSV previamente estructurados con las variables requeridas por el modelo. No realiza preprocesamiento ni limpieza de datos en la interfaz.',
    tag: 'Entrada',
  },
  {
    num: '02',
    icon: 'ri-cpu-line',
    title: 'Inferencia con modelo entrenado',
    desc: 'El sistema ejecuta un servicio de inferencia sobre los datos cargados, utilizando un modelo de aprendizaje automático ya entrenado y validado externamente.',
    tag: 'Procesamiento',
  },
  {
    num: '03',
    icon: 'ri-table-line',
    title: 'Presentación organizada de resultados',
    desc: 'Los resultados se muestran en una tabla estructurada con nivel de sequía asignado, categoría de alerta y valor de confianza del modelo por registro municipal.',
    tag: 'Salida',
  },
];

export default function SystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="sistema" className="bg-white py-24">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-xs font-bold tracking-widest text-dorado uppercase">
            02 — Capacidades
          </span>
          <div className="flex-1 max-w-16 h-px bg-dorado/50" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-guinda-dark leading-snug">
            ¿Qué hace <span className="text-guinda">el sistema?</span>
          </h2>
          <p className="font-body text-sm text-gray-400 max-w-md lg:text-right leading-relaxed">
            La función principal de la plataforma es apoyar la interpretación y consulta de resultados generados por el modelo, no el entrenamiento de modelos dentro de la interfaz.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-5">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row transition-all duration-200 hover:border-guinda/30"
              style={{
                transitionDelay: `${i * 100}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s, border-color 0.2s`,
              }}
            >
              {/* Number accent */}
              <div className="md:w-24 bg-guinda-pale flex items-center justify-center py-6 md:py-8 px-4">
                <span className="font-heading font-black text-5xl text-guinda/25 leading-none">
                  {cap.num}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-guinda-pale flex-shrink-0">
                  <i className={`${cap.icon} text-2xl text-guinda`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="font-heading font-bold text-base text-guinda-dark">{cap.title}</h4>
                    <span className="font-body text-xs font-semibold text-dorado-dark border border-dorado/40 bg-dorado-pale px-2 py-0.5 rounded-full whitespace-nowrap">
                      {cap.tag}
                    </span>
                  </div>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-guinda-pale border-l-4 border-guinda rounded-r-lg p-5 flex items-start gap-3">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <i className="ri-information-line text-lg text-guinda" />
          </div>
          <p className="font-body text-sm text-guinda-dark leading-relaxed">
            <strong>Nota técnica:</strong> El modelo de clasificación es externo a la interfaz y ya se encuentra entrenado. La plataforma únicamente ejecuta el servicio de inferencia y presenta los resultados de manera organizada para su consulta, revisión y priorización por parte del usuario.
          </p>
        </div>
      </div>
    </section>
  );
}
