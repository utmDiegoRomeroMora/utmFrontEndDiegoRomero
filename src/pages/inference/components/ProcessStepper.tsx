import type { AppState } from '../types';

interface Props {
  currentStep: number;
  appState: AppState;
}

const STEPS = [
  { label: 'Carga', desc: 'Archivo CSV', icon: 'ri-file-upload-line' },
  { label: 'Validación', desc: 'Estructura de datos', icon: 'ri-shield-check-line' },
  { label: 'Inferencia', desc: 'Modelo ML', icon: 'ri-cpu-line' },
  { label: 'Resultados', desc: 'Clasificación', icon: 'ri-bar-chart-2-line' },
  { label: 'Reporte', desc: 'Listo para consulta', icon: 'ri-file-chart-line' },
];

export default function ProcessStepper({ currentStep, appState }: Props) {
  const isError = appState === 'error';
  const isProcessing = appState === 'processing';
  const isComplete = appState === 'complete';

  return (
    <div className="bg-guinda-ultra border-b border-gray-200 py-5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between relative">
          {/* Connector line */}
          <div className="absolute top-5 left-0 right-0 h-px bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-px bg-guinda z-0 transition-all duration-700"
            style={{ width: `${(Math.min(currentStep, STEPS.length - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step, i) => {
            const isDone = isComplete || i < currentStep;
            const isActive = !isComplete && i === currentStep && isProcessing;
            const isPending = !isDone && !isActive;

            return (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                {/* Circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isDone
                      ? 'bg-guinda border-guinda'
                      : isActive
                      ? 'bg-white border-guinda'
                      : isError && i === currentStep
                      ? 'bg-red-50 border-red-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isDone ? (
                    <i className="ri-check-line text-white text-base" />
                  ) : isActive ? (
                    <i className={`${step.icon} text-guinda text-base animate-spin`} />
                  ) : isError && i === currentStep ? (
                    <i className="ri-close-line text-red-500 text-base" />
                  ) : (
                    <i className={`${step.icon} text-gray-400 text-base`} />
                  )}
                </div>

                {/* Label */}
                <div className="text-center hidden sm:block">
                  <p
                    className={`font-heading font-semibold text-xs whitespace-nowrap ${
                      isDone ? 'text-guinda' : isActive ? 'text-guinda' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="font-body text-xs text-gray-400 whitespace-nowrap">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}