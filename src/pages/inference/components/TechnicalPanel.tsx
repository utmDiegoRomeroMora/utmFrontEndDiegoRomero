import { useMemo } from 'react';
import type { MunicipalRecord } from '../types';
import { CLASS_META, SEVERITY_ORDER, getConfidenceLevel, getSecondClass } from '../utils';

interface Props { results: MunicipalRecord[] }

export default function TechnicalPanel({ results }: Props) {
  const stats = useMemo(() => {
    if (!results.length) return null;
    const confLevels = results.reduce((acc, r) => {
      const lv = getConfidenceLevel(r.confianza).label;
      acc[lv] = (acc[lv] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const borderCases = results.filter((r) => {
      const second = getSecondClass(r.probs as unknown as Record<string, number>, r.clasePred);
      return Math.abs(SEVERITY_ORDER[r.clasePred] - SEVERITY_ORDER[second]) === 1 &&
        (r.clasePred === 'D3' || r.clasePred === 'D4' || second === 'D3' || second === 'D4');
    });

    const confAvg = Math.round(results.reduce((s, r) => s + r.confianza, 0) / results.length);
    return { confLevels, borderCases: borderCases.slice(0, 3), confAvg };
  }, [results]);

  if (!stats) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <i className="ri-bar-chart-grouped-line text-xl text-guinda" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm text-guinda-dark">Panel de Interpretación Técnica</h3>
          <p className="font-body text-xs text-gray-400">Análisis de confianza y casos de incertidumbre probabilística</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-guinda-ultra border border-guinda/10 rounded-lg p-5">
          <h4 className="font-heading font-bold text-xs text-guinda-dark uppercase tracking-wide mb-4">
            Distribución de Certidumbre
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Alta certidumbre', key: 'Alta', desc: '≥ 70% confianza', color: '#16A34A', barColor: '#86EFAC' },
              { label: 'Certidumbre media', key: 'Media', desc: '50–69% confianza', color: '#CA8A04', barColor: '#FDE68A' },
              { label: 'Baja certidumbre', key: 'Baja', desc: '&lt; 50% confianza', color: '#DC2626', barColor: '#FECACA' },
            ].map((item) => {
              const count = stats.confLevels[item.key] || 0;
              const pct = Math.round((count / results.length) * 100);
              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-body text-xs" style={{ color: item.color }}>{item.label}</span>
                    <span className="font-body text-xs font-bold" style={{ color: item.color }}>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.barColor }} />
                  </div>
                  <p className="font-body text-xs text-gray-400 mt-0.5"
                    dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-guinda/10">
            <p className="font-body text-xs text-gray-500">
              Confianza promedio del lote: <strong className="text-guinda-dark">{stats.confAvg}%</strong>
            </p>
          </div>
        </div>
        <div className="bg-dorado-pale border border-dorado/20 rounded-lg p-5">
          <h4 className="font-heading font-bold text-xs text-guinda-dark uppercase tracking-wide mb-4">
            Guía de Interpretación
          </h4>
          <div className="flex flex-col gap-3">
            {[
              { icon: 'ri-award-line', color: '#16A34A', label: 'Predicción robusta', desc: 'La clase ganadora concentra ≥ 70% de probabilidad. Alta confianza en la clasificación.' },
              { icon: 'ri-alert-line', color: '#CA8A04', label: 'Confianza intermedia', desc: 'Probabilidad entre 50–69%. Se recomienda revisión con información complementaria.' },
              { icon: 'ri-error-warning-line', color: '#DC2626', label: 'Frontera de clase', desc: 'Dos clases adyacentes con probabilidades cercanas. El resultado requiere validación experta.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className={`${item.icon} text-base`} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-guinda-dark">{item.label}</p>
                  <p className="font-body text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h4 className="font-heading font-bold text-xs text-red-800 uppercase tracking-wide mb-1">
            Casos en Frontera D3/D4
          </h4>
          <p className="font-body text-xs text-red-600 mb-4">Registros con alta severidad y distribución incierta entre clases extremas</p>
          {stats.borderCases.length === 0 ? (
            <div className="flex items-center gap-2 py-4">
              <i className="ri-checkbox-circle-line text-green-500 text-xl" />
              <p className="font-body text-xs text-gray-500">No se identificaron casos de frontera D3/D4</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.borderCases.map((r) => {
                const second = getSecondClass(r.probs as unknown as Record<string, number>, r.clasePred);
                const cls = CLASS_META[r.clasePred];
                return (
                  <div key={r.id} className="bg-white border border-red-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: cls.bg, color: cls.text }}>
                        {cls.shortLabel}
                      </span>
                      <span className="font-heading font-bold text-xs text-guinda-dark">{r.municipio}</span>
                    </div>
                    <p className="font-body text-xs text-gray-500">
                      {r.clasePred} ({r.probMax}%) vs {CLASS_META[second]?.shortLabel} ({Math.round((r.probs[second] ?? 0) * 100)}%)
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-red-200">
            <p className="font-body text-xs text-red-700">
              <i className="ri-information-line mr-1" />
              Estos casos requieren revisión por especialista antes de tomar decisiones territoriales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}