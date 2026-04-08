const footerLinks = [
  { label: 'Inicio', id: 'hero' },
  { label: '¿Qué problema se atiende?', id: 'problema' },
  { label: '¿Qué hace el sistema?', id: 'sistema' },
  { label: '¿Cómo funciona?', id: 'como-funciona' },
  { label: 'Categorías de salida', id: 'categorias' },
  { label: 'Alcance del prototipo', id: 'alcance' },
];

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-guinda py-16">
      {/* Top dorado accent */}
      <div className="h-0.5 bg-dorado mb-12 mx-6 max-w-6xl lg:mx-auto" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
              </div>
              <div>
                <span className="font-heading font-bold text-white text-sm block leading-tight">SADSM</span>
                <span className="font-body text-white/60 text-xs">Sistema Institucional</span>
              </div>
            </div>
            <p className="font-body text-sm text-white/65 leading-relaxed">
              Sistema de Apoyo a la Detección de Sequía Municipal mediante modelos de aprendizaje automático. Herramienta institucional de análisis preventivo territorial.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-dorado animate-pulse" />
              <span className="font-body text-xs text-white/50">Prototipo funcional · Versión 1.0</span>
            </div>
          </div>

          {/* Column 2: Nav links */}
          <div>
            <h5 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-5">
              Navegación
            </h5>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="cursor-pointer font-body text-sm text-white/65 hover:text-dorado transition-colors duration-150 whitespace-nowrap text-left"
                  >
                    <span className="flex items-center gap-2">
                      <i className="ri-arrow-right-s-line text-dorado/70 text-base" />
                      {link.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Technical info */}
          <div>
            <h5 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-5">
              Información Técnica
            </h5>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-code-s-slash-line text-dorado" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-white/80 mb-0.5">Tecnología base</p>
                  <p className="font-body text-xs text-white/55">Modelo de aprendizaje automático + Interfaz web React</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-map-2-line text-dorado" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-white/80 mb-0.5">Cobertura</p>
                  <p className="font-body text-xs text-white/55">Nivel municipal · República Mexicana</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-bar-chart-2-line text-dorado" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-white/80 mb-0.5">Referencia técnica</p>
                  <p className="font-body text-xs text-white/55">Monitor de Sequía de América del Norte (NADM · CONAGUA)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-calendar-line text-dorado" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-white/80 mb-0.5">Última actualización</p>
                  <p className="font-body text-xs text-white/55">Marzo 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/40">
            © 2026 — Sistema Institucional de Apoyo a la Detección de Sequía Municipal · México
          </p>
          <p className="font-body text-xs text-white/35">
            Uso exclusivo para análisis institucional y de investigación
          </p>
        </div>
      </div>
    </footer>
  );
}
