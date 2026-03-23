import { useMemo } from 'react';
import type { MunicipalRecord } from '../types';
import { CLASS_META, SEVERITY_ORDER } from '../utils';

interface Props { results: MunicipalRecord[] }

export default function KPISummary({ results }: Props) {
  const kpis = useMemo(() => {
    if (!results.length) return null;
    const total = results.length;
    const alertas = { alta: 0, media: 0, baja: 0 };
    const claseCount: Record<string, number> = {};
    let confSum = 0;
    let bajaConf = 0;
    let casosD3 = 0;
    let casosD4 = 0;
    results.forEach((r) => {
      alertas[r.nivelAlerta]++;
      claseCount[r.clasePred] = (claseCount[r.clasePred] || 0) + 1;
      confSum += r.confianza;
      if (r.confianza < 60) bajaConf++;
      if (r.clasePred === 'D3') casosD3++;
      if (r.clasePred === 'D4') casosD4++;
    });
    const predominante = Object.entries(claseCount).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof SEVERITY_ORDER;
    return {
      total, alertas, predominante,
      confProm: Math.round(confSum / total),
      casosD3, casosD4, bajaConf,
    };
  }, [results]);

  if (!kpis) return null;

  const cards = [
    { icon: 'ri-list-check-2', label: 'Total registros', value: String(kpis.total), sub: 'municipios procesados', color: 'text-guinda', bg: 'bg-guinda-pale' },
    { icon: 'ri-alarm-warning-fill', label: 'Alertas altas', value: String(kpis.alertas.alta), sub: 'D3 y D4', color: 'text-red-700', bg: 'bg-red-50' },
    { icon: 'ri-alert-fill', label: 'Alertas medias', value: String(kpis.alertas.media), sub: 'D1 y D2', color: 'text-amber-700', bg: 'bg-amber-50' },
    { icon: 'ri-checkbox-circle-fill', label: 'Alertas bajas', value: String(kpis.alertas.baja), sub: 'D0 y sin sequía', color: 'text-green-700', bg: 'bg-green-50' },
    {
      icon: 'ri-bar-chart-grouped-line',
      label: 'Clase predominante',
      value: CLASS_META[kpis.predominante as keyof typeof CLASS_META]?.shortLabel ?? kpis.predominante,
      sub: CLASS_META[kpis.predominante as keyof typeof CLASS_META]?.label ?? '',
      color: 'text-guinda', bg: 'bg-guinda-pale',
    },
    { icon: 'ri-percent-line', label: 'Confianza promedio', value: `${kpis.confProm}%`, sub: 'del modelo en el lote', color: 'text-guinda', bg: 'bg-guinda-pale' },
    { icon: 'ri-fire-line', label: 'Casos D3', value: String(kpis.casosD3), sub: 'sequía extrema', color: 'text-red-700', bg: 'bg-red-50' },
    { icon: 'ri-skull-line', label: 'Casos D4', value: String(kpis.casosD4), sub: 'sequía excepcional', color: 'text-guinda-dark', bg: 'bg-guinda-pale' },
    { icon: 'ri-question-mark', label: 'Baja confianza', value: String(kpis.bajaConf), sub: 'confianza &lt; 60%', color: 'text-amber-700', bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <i className="ri-dashboard-line text-xl text-guinda" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm text-guinda-dark">Resumen Ejecutivo</h3>
          <p className="font-body text-xs text-gray-400">Indicadores globales del lote procesado</p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-guinda/20 transition-colors duration-150">
              <div className={`w-9 h-9 flex items-center justify-center rounded-md ${card.bg}`}>
                <i className={`${card.icon} text-base ${card.color}`} />
              </div>
              <div>
                <p className={`font-heading font-black text-xl leading-none ${card.color}`}>{card.value}</p>
                <p className="font-body text-xs text-gray-500 mt-1 leading-tight">{card.label}</p>
                <p className="font-body text-xs text-gray-300 leading-tight"
                  dangerouslySetInnerHTML={{ __html: card.sub }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}