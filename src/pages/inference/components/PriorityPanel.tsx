import { useMemo } from 'react';
import type { MunicipalRecord } from '../types';
import { CLASS_META, ALERT_META, PRIORITY_META } from '../utils';

interface Props { results: MunicipalRecord[] }

export default function PriorityPanel({ results }: Props) {
  const critical = useMemo(() =>
    results
      .filter((r) => r.prioridad === 'critica' || r.prioridad === 'alta')
      .sort((a, b) => {
        const pOrder = { critica: 0, alta: 1, media: 2, normal: 3 };
        if (pOrder[a.prioridad] !== pOrder[b.prioridad]) return pOrder[a.prioridad] - pOrder[b.prioridad];
        return b.confianza - a.confianza;
      }), [results]);

  if (!critical.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-full">
          <i className="ri-shield-check-line text-2xl text-green-600" />
        </div>
        <p className="font-heading font-bold text-sm text-guinda-dark">Sin municipios de prioridad crítica o alta</p>
        <p className="font-body text-xs text-gray-400">No se identificaron casos D3 ni D4 en el lote procesado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-guinda/15 bg-guinda-pale flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-alarm-warning-line text-xl text-guinda" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-guinda-dark">Municipios Prioritarios</h3>
            <p className="font-body text-xs text-gray-500">Casos D4 y D3 — requieren atención inmediata</p>
          </div>
        </div>
        <span className="font-heading font-black text-xl text-guinda">{critical.length}</span>
      </div>

      <div className="divide-y divide-gray-100">
        {critical.map((r) => {
          const classMeta = CLASS_META[r.clasePred];
          const alertMeta = ALERT_META[r.nivelAlerta];
          const prioMeta = PRIORITY_META[r.prioridad];
          const confColor = r.confianza >= 70 ? 'text-green-700' : r.confianza >= 50 ? 'text-amber-700' : 'text-red-600';

          return (
            <div key={r.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors duration-100">
              {/* Class badge */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-md font-heading font-black text-base flex-shrink-0"
                style={{ backgroundColor: classMeta.bg, color: classMeta.text, border: `1px solid ${classMeta.border}` }}
              >
                {classMeta.shortLabel}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading font-bold text-sm text-guinda-dark">{r.municipio}</p>
                  <span className="font-body text-xs text-gray-400">·</span>
                  <p className="font-body text-xs text-gray-500">{r.estado}</p>
                </div>
                <p className="font-body text-xs text-gray-400 leading-snug mt-0.5">{r.observacion}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <span
                  className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                  style={{ backgroundColor: classMeta.bg, color: classMeta.text, borderColor: classMeta.border }}
                >
                  {classMeta.label}
                </span>
                <span
                  className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                  style={{ backgroundColor: alertMeta.bg, color: alertMeta.text, borderColor: alertMeta.border }}
                >
                  Alerta {alertMeta.label}
                </span>
                <span
                  className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                  style={{ backgroundColor: prioMeta.bg, color: prioMeta.text, borderColor: prioMeta.border }}
                >
                  <i className={`${prioMeta.icon} mr-1`} />{prioMeta.label}
                </span>
                <span className={`font-body text-xs font-bold whitespace-nowrap ${confColor}`}>
                  {r.confianza}% confianza
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}