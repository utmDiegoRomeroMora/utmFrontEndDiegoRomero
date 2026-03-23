import { useEffect, useRef, useState } from 'react';

const categories = [
  {
    code: 'S/S',
    name: 'Sin Sequía',
    desc: 'Condiciones hídricas normales. No se registran déficits significativos de precipitación ni indicadores de estrés hídrico en el municipio.',
    color: '#2E7D32',
    bg: '#F1F8E9',
    border: '#A5D6A7',
    level: 0,
  },
  {
    code: 'D0',
    name: 'Sequía Incipiente',
    desc: 'Inicio de condiciones anormalmente secas. Posibles deficiencias en la recarga de acuíferos y reducción marginal en la disponibilidad de agua.',
    color: '#F9A825',
    bg: '#FFFDE7',
    border: '#FFE082',
    level: 1,
  },
  {
    code: 'D1',
    name: 'Sequía Moderada',
    desc: 'Estrés hídrico moderado con impacto potencial en cultivos de temporal. Mermas incipientes en ríos, embalses y pozos superficiales.',
    color: '#FB8C00',
    bg: '#FFF3E0',
    border: '#FFCC80',
    level: 2,
  },
  {
    code: 'D2',
    name: 'Sequía Severa',
    desc: 'Pérdidas probables en cultivos. Reducción notable en cuerpos de agua superficiales. Restricciones de abastecimiento en zonas rurales.',
    color: '#EF6C00',
    bg: '#FBE9E7',
    border: '#FFAB91',
    level: 3,
  },
  {
    code: 'D3',
    name: 'Sequía Extrema',
    desc: 'Pérdidas importantes en cultivos y pastizales. Riesgo de desabasto generalizado. Daños significativos a la economía local.',
    color: '#C62828',
    bg: '#FFEBEE',
    border: '#EF9A9A',
    level: 4,
  },
  {
    code: 'D4',
    name: 'Sequía Excepcional',
    desc: 'Nivel más severo. Crisis hídrica generalizada, pérdidas catastróficas en agricultura y ganadería. Situación de emergencia territorial.',
    color: '#6D1527',
    bg: '#FCE4EC',
    border: '#F48FB1',
    level: 5,
  },
];

export default function DroughtCategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="categorias" className="bg-white py-24">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-body text-xs font-bold tracking-widest text-dorado uppercase">
            04 — Clasificación
          </span>
          <div className="flex-1 max-w-16 h-px bg-dorado/50" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-guinda-dark leading-snug">
            Categorías de <span className="text-guinda">salida del sistema</span>
          </h2>
          <p className="font-body text-sm text-gray-400 max-w-sm lg:text-right leading-relaxed">
            Basadas en la escala de sequía del Monitor de Sequía de América del Norte (NADM/CONAGUA).
          </p>
        </div>

        {/* Severity scale bar */}
        <div className="mb-10 flex items-center gap-2">
          <span className="font-body text-xs text-gray-400 whitespace-nowrap">Menor severidad</span>
          <div className="flex-1 h-2 rounded-full overflow-hidden flex">
            {categories.map((cat) => (
              <div
                key={cat.code}
                className="flex-1 h-full"
                style={{ backgroundColor: cat.color }}
              />
            ))}
          </div>
          <span className="font-body text-xs text-gray-400 whitespace-nowrap">Mayor severidad</span>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.code}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="rounded-lg border overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: hovered === i ? cat.bg : '#fff',
                borderColor: hovered === i ? cat.color : '#E5E7EB',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, background-color 0.2s, border-color 0.2s`,
              }}
            >
              {/* Top color bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: cat.color }} />
              <div className="p-5">
                {/* Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-heading font-black text-sm px-3 py-1 rounded-full text-white whitespace-nowrap"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.code}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-guinda-dark leading-snug">
                    {cat.name}
                  </h4>
                </div>
                <p className="font-body text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
                {/* Severity dots */}
                <div className="flex items-center gap-1 mt-4">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: idx <= cat.level ? cat.color : '#E5E7EB',
                      }}
                    />
                  ))}
                  <span className="font-body text-xs text-gray-400 ml-1">
                    Nivel {cat.level}/5
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
