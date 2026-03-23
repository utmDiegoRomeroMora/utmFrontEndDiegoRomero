import { useEffect, useRef, useState } from 'react';

const keyPoints = [
  {
    icon: 'ri-drop-line',
    title: 'Escasez hídrica estructural',
    desc: 'México enfrenta déficits de precipitación recurrentes que afectan la disponibilidad de agua para uso agrícola, urbano e industrial.',
  },
  {
    icon: 'ri-map-pin-2-line',
    title: 'Impacto a nivel municipal',
    desc: 'Los efectos de la sequía se manifiestan de forma heterogénea entre municipios, exigiendo análisis territoriales desagregados.',
  },
  {
    icon: 'ri-alert-line',
    title: 'Necesidad de alerta temprana',
    desc: 'El análisis preventivo permite identificar zonas vulnerables antes de que la sequía alcance niveles críticos e irreversibles.',
  },
];

export default function ProblemSection() {
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
    <section id="problema" className="bg-guinda-ultra py-24">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Section header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-xs font-bold tracking-widest text-dorado uppercase">
            01 — Contexto
          </span>
          <div className="flex-1 max-w-16 h-px bg-dorado/50" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left column */}
          <div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-guinda-dark leading-snug mb-6">
              ¿Qué problema <br />
              <span className="text-guinda">se atiende?</span>
            </h2>
            <p className="font-body text-base text-gray-600 leading-relaxed mb-5">
              La <strong className="text-guinda-dark font-semibold">sequía</strong> es un fenómeno hidrometeorológico que ocurre cuando la disponibilidad de agua cae por debajo de los niveles normales históricos durante un período prolongado, afectando la actividad humana, los ecosistemas y la producción alimentaria.
            </p>
            <p className="font-body text-base text-gray-600 leading-relaxed mb-5">
              En México, la gestión territorial requiere instrumentos técnicos que permitan <strong className="text-guinda-dark font-semibold">identificar, clasificar y priorizar</strong> las zonas municipales afectadas de manera oportuna, sistemática y con fundamento en datos.
            </p>
            <p className="font-body text-base text-gray-600 leading-relaxed">
              Este sistema busca apoyar ese análisis preventivo mediante el uso de modelos de aprendizaje automático, facilitando la consulta de resultados de clasificación de sequía para la toma de decisiones informadas a nivel local.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-1 h-12 bg-guinda rounded-full" />
              <p className="font-body text-sm text-gray-500 italic leading-relaxed">
                El sistema no sustituye el juicio experto ni el análisis integral del territorio, sino que lo complementa con herramientas computacionales de apoyo.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {keyPoints.map((point, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4 transition-all duration-200 hover:border-guinda/30"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 flex items-center justify-center rounded-md bg-guinda-pale flex-shrink-0">
                  <i className={`${point.icon} text-xl text-guinda`} />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-guinda-dark mb-1">
                    {point.title}
                  </h4>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
