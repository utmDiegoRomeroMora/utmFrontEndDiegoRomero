import { useEffect, useRef, useState } from 'react';

const scope = [
  { icon: 'ri-checkbox-circle-line', text: 'Ejecutar inferencia sobre archivos CSV ya preparados con las variables requeridas.' },
  { icon: 'ri-checkbox-circle-line', text: 'Clasificar registros municipales en las categorías de sequía definidas por el modelo.' },
  { icon: 'ri-checkbox-circle-line', text: 'Presentar los resultados en una tabla organizada con nivel, alerta y confianza.' },
  { icon: 'ri-checkbox-circle-line', text: 'Facilitar la priorización y consulta de municipios según su nivel de sequía asignado.' },
];

const considerations = [
  { icon: 'ri-error-warning-line', text: 'No realiza limpieza, transformación ni preprocesamiento de datos en la interfaz.' },
  { icon: 'ri-error-warning-line', text: 'No entrena ni ajusta modelos de aprendizaje automático desde la plataforma.' },
  { icon: 'ri-error-warning-line', text: 'No sustituye el análisis experto ni la validación territorial por parte de especialistas.' },
  { icon: 'ri-error-warning-line', text: 'Trabaja como herramienta de apoyo a decisiones, no como sistema de pronóstico absoluto.' },
];

export default function ScopeSection() {
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
    <section id="alcance" className="bg-gray-50 py-24">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-xs font-bold tracking-widest text-dorado uppercase">
            05 — Alcance
          </span>
          <div className="flex-1 max-w-16 h-px bg-dorado/50" />
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-guinda-dark leading-snug mb-4">
          Alcance del <span className="text-guinda">prototipo</span>
        </h2>
        <p className="font-body text-base text-gray-500 leading-relaxed mb-12 max-w-2xl">
          El sistema está diseñado como un prototipo funcional enfocado en la inferencia y visualización de resultados. Es importante comprender sus capacidades y limitaciones antes de su uso.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scope column */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-guinda px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-check-double-line text-xl text-dorado" />
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Alcance del sistema
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {scope.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`${item.icon} text-base text-guinda`} />
                  </div>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Considerations column */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-dorado px-6 py-4 flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-alert-line text-xl text-guinda-dark" />
              </div>
              <h3 className="font-heading font-bold text-base text-guinda-dark">
                Consideraciones importantes
              </h3>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {considerations.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`${item.icon} text-base text-dorado-dark`} />
                  </div>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prototype badge */}
        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 border border-guinda/20 bg-guinda-pale px-6 py-3 rounded-full">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-flask-line text-base text-guinda" />
            </div>
            <span className="font-body text-sm text-guinda-dark">
              Este sistema es un <strong>prototipo funcional</strong> desarrollado con fines de investigación y apoyo técnico institucional.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
