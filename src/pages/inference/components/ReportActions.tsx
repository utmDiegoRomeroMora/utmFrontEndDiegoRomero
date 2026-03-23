import { useState } from 'react';
import type { MunicipalRecord } from '../types';
import { CLASS_META } from '../utils';

interface Props { results: MunicipalRecord[] }

export default function ReportActions({ results }: Props) {
  const [copied, setCopied] = useState(false);
  const [showMsg, setShowMsg] = useState('');

  const showToast = (msg: string) => {
    setShowMsg(msg);
    setTimeout(() => setShowMsg(''), 2800);
  };

  const handleCopySummary = () => {
    const critCount = results.filter((r) => r.prioridad === 'critica').length;
    const altaCount = results.filter((r) => r.nivelAlerta === 'alta').length;
    const confAvg = Math.round(results.reduce((s, r) => s + r.confianza, 0) / results.length);
    const text = `RESUMEN TÉCNICO — SADSM\nTotal registros procesados: ${results.length}\nAlertas altas (D3/D4): ${altaCount}\nCasos críticos (D4): ${critCount}\nConfianza promedio del modelo: ${confAvg}%\nFecha de generación: ${new Date().toLocaleDateString('es-MX')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Resumen técnico copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Municipio', 'Estado', 'Clase Predicha', 'Nivel Alerta', 'Confianza (%)', 'Prob. Máx. (%)', 'P(S/S)', 'P(D0)', 'P(D1)', 'P(D2)', 'P(D3)', 'P(D4)', 'Observación', 'Prioridad'];
    const rows = results.map((r) => [
      r.id, r.municipio, r.estado, CLASS_META[r.clasePred].label,
      r.nivelAlerta, r.confianza, r.probMax,
      Math.round(r.probs.sin_sequia * 100), Math.round(r.probs.D0 * 100),
      Math.round(r.probs.D1 * 100), Math.round(r.probs.D2 * 100),
      Math.round(r.probs.D3 * 100), Math.round(r.probs.D4 * 100),
      `"${r.observacion}"`, r.prioridad,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `SADSM_resultados_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Archivo CSV exportado correctamente');
  };

  const handlePrint = () => { window.print(); };

  const actions = [
    { icon: 'ri-printer-line', label: 'Imprimir reporte', sub: 'Vista de impresión', onClick: handlePrint, primary: false },
    { icon: 'ri-download-2-line', label: 'Exportar CSV', sub: 'Datos completos + probabilidades', onClick: handleExportCSV, primary: true },
    { icon: copied ? 'ri-clipboard-fill' : 'ri-clipboard-line', label: copied ? '¡Copiado!' : 'Copiar resumen', sub: 'Resumen ejecutivo al portapapeles', onClick: handleCopySummary, primary: false },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <i className="ri-share-box-line text-xl text-guinda" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-sm text-guinda-dark">Acciones de Reporte</h3>
          <p className="font-body text-xs text-gray-400">Exportar, imprimir o compartir los resultados del análisis</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`cursor-pointer flex items-center gap-3 px-5 py-3 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                action.primary
                  ? 'bg-guinda border-guinda text-white hover:bg-guinda-medium'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-guinda hover:text-guinda'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <i className={`${action.icon} text-base`} />
              </div>
              <div className="text-left">
                <p className="font-body text-sm font-semibold leading-none">{action.label}</p>
                <p className={`font-body text-xs mt-0.5 ${action.primary ? 'text-white/70' : 'text-gray-400'}`}>{action.sub}</p>
              </div>
            </button>
          ))}

          {/* Summary stats */}
          <div className="ml-auto flex items-center gap-4 pl-4 border-l border-gray-200">
            <div className="text-center">
              <p className="font-heading font-black text-xl text-guinda-dark">{results.length}</p>
              <p className="font-body text-xs text-gray-400">Registros</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-black text-xl text-red-600">
                {results.filter((r) => r.nivelAlerta === 'alta').length}
              </p>
              <p className="font-body text-xs text-gray-400">Alertas altas</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-black text-xl text-guinda">
                {results.filter((r) => r.prioridad === 'critica').length}
              </p>
              <p className="font-body text-xs text-gray-400">Críticos</p>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-5 flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-gray-400 text-base" />
          </div>
          <p className="font-body text-xs text-gray-500 leading-relaxed">
            Los resultados exportados corresponden a la sesión de inferencia actual. Esta herramienta es de apoyo a la consulta institucional y no sustituye el análisis técnico especializado.
          </p>
        </div>
      </div>

      {/* Toast */}
      {showMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-guinda text-white font-body text-sm px-5 py-3 rounded-lg border border-guinda-light">
          <span className="flex items-center gap-2"><i className="ri-checkbox-circle-line text-dorado" />{showMsg}</span>
        </div>
      )}
    </div>
  );
}