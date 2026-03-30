import type { AppState } from '../types';

interface Props {
  appState: AppState;
  recordCount: number;
  fileName: string;
}

const STATUS_CONFIG = {
  empty: { label: 'En espera', dot: 'bg-gray-400', bar: 'bg-gray-100 text-gray-500', icon: 'ri-time-line' },
  ready: { label: 'Archivo cargado — listo para ejecutar', dot: 'bg-dorado animate-pulse', bar: 'bg-dorado-pale text-dorado-dark', icon: 'ri-checkbox-circle-line' },
  processing: { label: 'Procesando inferencia...', dot: 'bg-guinda animate-pulse', bar: 'bg-guinda-pale text-guinda', icon: 'ri-loader-4-line' },
  complete: { label: 'Inferencia completada', dot: 'bg-green-500', bar: 'bg-green-50 text-green-800', icon: 'ri-checkbox-circle-fill' },
  error: { label: 'Error en el proceso', dot: 'bg-red-500', bar: 'bg-red-50 text-red-700', icon: 'ri-error-warning-line' },
};

export default function InferenceHeader({ appState, recordCount, fileName }: Props) {
  const cfg = STATUS_CONFIG[appState];

  return (
    <div className="bg-white border-b border-gray-200 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-4 font-body text-xs text-gray-400">
          <i className="ri-home-4-line" />
          <span>Inicio</span>
          <i className="ri-arrow-right-s-line" />
          <span className="text-guinda font-medium">Módulo de Inferencia</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-guinda rounded-md">
                <i className="ri-cpu-line text-dorado text-lg" />
              </div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-guinda-dark leading-tight">
                Módulo de Inferencia de Sequía
              </h1>
            </div>
            <p className="font-body text-sm text-gray-500 max-w-xl leading-relaxed">
              Cargue un archivo CSV previamente procesado, ejecute la inferencia mediante el modelo entrenado y consulte los resultados de clasificación por municipio.
            </p>
          </div>

          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-lg border ${cfg.bar} border-current/20 flex-shrink-0`}>
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <span className="font-body text-sm font-semibold whitespace-nowrap">{cfg.label}</span>
            {appState === 'complete' && recordCount > 0 && (
              <span className="font-body text-xs opacity-70 whitespace-nowrap">
                · {recordCount} registros procesados
              </span>
            )}
            {appState === 'ready' && fileName && (
              <span className="font-body text-xs opacity-70 whitespace-nowrap truncate max-w-32">
                · {fileName}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6">
          {[
            { icon: 'ri-file-excel-2-line', label: 'Entrada: archivo CSV' },
            { icon: 'ri-cpu-line', label: 'Modelo: entrenado externamente' },
            { icon: 'ri-bar-chart-grouped-line', label: '6 categorías de salida' },
            { icon: 'ri-shield-check-line', label: 'Solo inferencia — sin entrenamiento' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={`${item.icon} text-sm text-dorado`} />
              </div>
              <span className="font-body text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}