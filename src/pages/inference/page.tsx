import { useState, useCallback } from 'react';
import type { AppState, MunicipalRecord } from './types';
import { mockInferenceResults } from '../../mocks/inferenceData';
import Navbar from '../../components/feature/Navbar';
import InferenceHeader from './components/InferenceHeader';
import ProcessStepper from './components/ProcessStepper';
import UploadPanel from './components/UploadPanel';
import KPISummary from './components/KPISummary';
import PriorityPanel from './components/PriorityPanel';
import ResultsTable from './components/ResultsTable';
import TechnicalPanel from './components/TechnicalPanel';
import ReportActions from './components/ReportActions';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function InferencePage() {
  const [appState, setAppState] = useState<AppState>('empty');
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<MunicipalRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile(file);
    setAppState('ready');
    setErrorMessage('');
  }, []);

  const handleRun = useCallback(async () => {
    if (!uploadedFile) return;
    setAppState('processing');
    setResults([]);
    try {
      setCurrentStep(0); await delay(1200);
      setCurrentStep(1); await delay(1400);
      setCurrentStep(2); await delay(2200);
      setCurrentStep(3); await delay(1200);
      setCurrentStep(4); await delay(500);
      setResults(mockInferenceResults);
      setAppState('complete');
    } catch {
      setAppState('error');
      setErrorMessage('Ocurrió un error durante el procesamiento. Verifique el archivo e intente nuevamente.');
    }
  }, [uploadedFile]);

  const handleClear = useCallback(() => {
    setAppState('empty');
    setCurrentStep(0);
    setUploadedFile(null);
    setResults([]);
    setErrorMessage('');
  }, []);

  const showResults = appState === 'complete' && results.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <InferenceHeader
        appState={appState}
        recordCount={results.length}
        fileName={uploadedFile?.name ?? ''}
      />
      <ProcessStepper currentStep={currentStep} appState={appState} />

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Upload panel - always visible unless complete */}
        {appState !== 'complete' ? (
          <div className="max-w-2xl mx-auto w-full">
            <UploadPanel
              appState={appState}
              uploadedFile={uploadedFile}
              errorMessage={errorMessage}
              onFileSelect={handleFileSelect}
              onRun={handleRun}
              onClear={handleClear}
            />
          </div>
        ) : (
          /* Collapsed file info when complete */
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-green-50 rounded-md">
                <i className="ri-checkbox-circle-fill text-green-600 text-lg" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-guinda-dark">{uploadedFile?.name}</p>
                <p className="font-body text-xs text-gray-400">Inferencia completada · {results.length} registros municipales procesados</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="cursor-pointer font-body text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded hover:border-guinda hover:text-guinda transition-colors whitespace-nowrap"
            >
              <span className="flex items-center gap-2"><i className="ri-refresh-line" /> Nueva inferencia</span>
            </button>
          </div>
        )}

        {/* Processing loading state */}
        {appState === 'processing' && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-guinda-pale">
              <i className="ri-loader-4-line text-3xl text-guinda animate-spin" />
            </div>
            <div>
              <p className="font-heading font-bold text-base text-guinda-dark">Ejecutando inferencia</p>
              <p className="font-body text-sm text-gray-500 mt-1">
                El modelo está procesando los registros del archivo. Por favor espere...
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-guinda animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results dashboard */}
        {showResults && (
          <>
            <KPISummary results={results} />
            <PriorityPanel results={results} />
            <ResultsTable results={results} />
            <TechnicalPanel results={results} />
            <ReportActions results={results} />
          </>
        )}

        {/* Empty state guidance */}
        {appState === 'empty' && (
          <div className="max-w-2xl mx-auto w-full bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="font-heading font-bold text-sm text-guinda-dark mb-4">Instrucciones de uso</h3>
            <ol className="flex flex-col gap-3">
              {[
                { n: '1', text: 'Prepare su archivo CSV con los datos municipales ya procesados y estructurados según el formato requerido por el modelo.' },
                { n: '2', text: 'Cargue el archivo en el panel superior arrastrándolo o haciendo clic en el área de carga.' },
                { n: '3', text: 'Haga clic en "Ejecutar Inferencia" para enviar los datos al servicio de clasificación.' },
                { n: '4', text: 'Consulte el resumen ejecutivo, los municipios prioritarios y la tabla de resultados con la distribución de probabilidades.' },
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-4">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-guinda text-white font-heading font-bold text-xs flex-shrink-0">
                    {step.n}
                  </div>
                  <p className="font-body text-sm text-gray-600 leading-relaxed pt-0.5">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="font-body text-xs text-gray-400 leading-relaxed">
                <strong className="text-guinda-dark">Nota técnica:</strong> Este módulo solo ejecuta inferencia con el modelo previamente entrenado. No realiza preprocesamiento de datos ni entrena modelos desde la interfaz. Los resultados son de carácter orientativo y deben complementarse con análisis experto.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-guinda mt-12 py-6 border-t border-guinda-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src="https://public.readdy.ai/ai/img_res/356ff700-05b0-4070-a229-7fe33bf1f6a9.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="font-body text-xs text-white/70">SADSM · Módulo de Inferencia · Uso institucional</span>
          </div>
          <p className="font-body text-xs text-white/50">© 2026 — Sistema de Apoyo a la Detección de Sequía Municipal</p>
        </div>
      </footer>
    </div>
  );
}