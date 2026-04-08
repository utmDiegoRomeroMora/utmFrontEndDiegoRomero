import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { AppState, MunicipalRecord } from './types';
import Navbar from '../../components/feature/Navbar';
import InferenceHeader from './components/InferenceHeader';
import ProcessStepper from './components/ProcessStepper';
import UploadPanel from './components/UploadPanel';
import KPISummary from './components/KPISummary';
import ResultsTable from './components/ResultsTable';
import TechnicalPanel from './components/TechnicalPanel';
import ReportActions from './components/ReportActions';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const API_BASE = 'https://utmserviciobackendmlutm.onrender.com';
const HEALTH_URL = `${API_BASE}/health`;
const PREDICT_BATCH_URL = `${API_BASE}/predict_batch`;
const REQUEST_TIMEOUT_MS = 180000;
const HEALTH_TIMEOUT_MS = 30000;
const HEALTH_RETRIES = 3;
const HEALTH_RETRY_DELAY_MS = 2500;

type CsvRow = Record<string, unknown>;

interface BackendPrediction {
  predicted_class?: string;
  predicted_index?: number;
  confidence?: number;
  severity_level?: string;
  severity_description?: string;
  recommendation?: string;
  possible_mlp_results?: string[];
  probabilities?: Record<string, number>;
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function getValueFromCandidates(row: CsvRow, keys: string[]): string {
  const entries = Object.entries(row);
  for (const candidate of keys) {
    const normalizedCandidate = normalizeKey(candidate);
    const match = entries.find(([rawKey]) => normalizeKey(rawKey) === normalizedCandidate);
    if (!match) continue;
    const value = match[1];
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function mapClass(rawClass: string | undefined): MunicipalRecord['clasePred'] {
  const normalized = normalizeKey(rawClass ?? '');
  if (normalized === 'sinsequia') return 'sin_sequia';
  if (normalized === 'd0') return 'D0';
  if (normalized === 'd1') return 'D1';
  if (normalized === 'd2') return 'D2';
  if (normalized === 'd3') return 'D3';
  if (normalized === 'd4') return 'D4';
  return 'sin_sequia';
}

function getAlertLevel(clasePred: MunicipalRecord['clasePred']): MunicipalRecord['nivelAlerta'] {
  if (clasePred === 'D3' || clasePred === 'D4') return 'alta';
  if (clasePred === 'D1' || clasePred === 'D2') return 'media';
  return 'baja';
}

function getPriority(clasePred: MunicipalRecord['clasePred']): MunicipalRecord['prioridad'] {
  if (clasePred === 'D4') return 'critica';
  if (clasePred === 'D3') return 'alta';
  if (clasePred === 'D2') return 'media';
  return 'normal';
}

function getProbabilities(rawProbabilities: Record<string, number> | undefined): MunicipalRecord['probs'] {
  const source = rawProbabilities ?? {};
  const out: MunicipalRecord['probs'] = {
    sin_sequia: 0,
    D0: 0,
    D1: 0,
    D2: 0,
    D3: 0,
    D4: 0,
  };

  Object.entries(source).forEach(([key, value]) => {
    const normalized = normalizeKey(key);
    const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    if (normalized === 'sinsequia') out.sin_sequia = safeValue;
    if (normalized === 'd0') out.D0 = safeValue;
    if (normalized === 'd1') out.D1 = safeValue;
    if (normalized === 'd2') out.D2 = safeValue;
    if (normalized === 'd3') out.D3 = safeValue;
    if (normalized === 'd4') out.D4 = safeValue;
  });

  return out;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'La solicitud excedió el tiempo de espera. El servicio puede tardar más de 50 segundos; intente nuevamente.';
  }
  if (error instanceof Error) return error.message;
  return 'Ocurrió un error durante el procesamiento. Verifique el archivo e intente nuevamente.';
}

function normalizePredictionsPayload(payload: unknown): BackendPrediction[] {
  if (Array.isArray(payload)) return payload as BackendPrediction[];
  if (payload && typeof payload === 'object') {
    const maybeObj = payload as Record<string, unknown>;
    if (Array.isArray(maybeObj.predictions)) return maybeObj.predictions as BackendPrediction[];
    if (Array.isArray(maybeObj.results)) return maybeObj.results as BackendPrediction[];
    if (typeof maybeObj.predicted_class === 'string') return [maybeObj as BackendPrediction];
  }
  return [];
}

function buildObservation(prediction: BackendPrediction): string {
  const severity = prediction.severity_description?.trim();
  const recommendation = prediction.recommendation?.trim();
  if (severity && recommendation) return `${severity} Recomendación: ${recommendation}`;
  if (severity) return severity;
  if (recommendation) return `Recomendación: ${recommendation}`;
  return 'Resultado inferido por el modelo para este registro.';
}

function parseCsv(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      complete: (result) => {
        const rows = result.data.filter((row) => Object.values(row).some((value) => String(value ?? '').trim() !== ''));
        resolve(rows);
      },
      error: (error) => reject(error),
    });
  });
}

async function ensureBackendAvailable() {
  for (let attempt = 1; attempt <= HEALTH_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(HEALTH_URL, { method: 'GET' }, HEALTH_TIMEOUT_MS);
      if (response.ok) return;
    } catch {
      // Retry below
    }

    if (attempt < HEALTH_RETRIES) await delay(HEALTH_RETRY_DELAY_MS);
  }

  throw new Error('El servicio de inferencia no está disponible en este momento (health check fallido).');
}

export default function InferencePage() {
  const [appState, setAppState] = useState<AppState>('empty');
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<MunicipalRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile(file);
    setAppState('ready');
    setErrorMessage('');
  }, []);

  const handleRun = useCallback(async () => {
    if (!uploadedFile) return;
    setAppState('processing');
    setResults([]);
    setErrorMessage('');
    try {
      setCurrentStep(0);
      setProcessingMessage('Leyendo archivo CSV...');
      const csvRows = await parseCsv(uploadedFile);

      if (!csvRows.length) {
        throw new Error('El archivo CSV no contiene filas válidas para inferencia.');
      }

      setCurrentStep(1);
      setProcessingMessage('Validando estructura de datos...');
      await delay(400);

      setCurrentStep(2);
      setProcessingMessage('Verificando disponibilidad del backend...');
      await ensureBackendAvailable();

      setProcessingMessage('Servicio disponible. Enviando inferencia por lote (puede tardar más de 50 segundos)...');
      const response = await fetchWithTimeout(
        PREDICT_BATCH_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            observations: csvRows,
            return_proba: true,
          }),
        },
        REQUEST_TIMEOUT_MS,
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del backend (${response.status}): ${errorText || 'sin detalle adicional'}`);
      }

      const payload = await response.json();
      const predictions = normalizePredictionsPayload(payload);

      if (!predictions.length) {
        throw new Error('La respuesta del backend no contiene predicciones válidas.');
      }

      setCurrentStep(3);
      setProcessingMessage('Consolidando resultados para el dashboard...');

      const mappedResults: MunicipalRecord[] = predictions.map((prediction, index) => {
        const row = csvRows[index] ?? {};
        const clasePred = mapClass(prediction.predicted_class);
        const probs = getProbabilities(prediction.probabilities);
        const fallbackMaxProb = Math.max(...Object.values(probs));
        const rawConfidence = typeof prediction.confidence === 'number' ? prediction.confidence : fallbackMaxProb;
        const confidencePct = Math.max(0, Math.min(100, Math.round(rawConfidence * 100)));
        const municipio = getValueFromCandidates(row, ['municipio', 'municipality', 'nombre_municipio', 'city']) || `Registro ${index + 1}`;
        const estado = getValueFromCandidates(row, ['estado', 'state', 'entidad', 'entidad_federativa']) || 'Sin estado';

        return {
          id: index + 1,
          municipio,
          estado,
          clasePred,
          nivelAlerta: getAlertLevel(clasePred),
          confianza: confidencePct,
          probMax: confidencePct,
          probs,
          observacion: buildObservation(prediction),
          prioridad: getPriority(clasePred),
        };
      });

      setCurrentStep(4);
      setProcessingMessage('Inferencia finalizada. Generando reporte...');
      setResults(mappedResults);
      setAppState('complete');
      setProcessingMessage('');
    } catch (error) {
      setAppState('error');
      setErrorMessage(getErrorMessage(error));
    }
  }, [uploadedFile]);

  const handleClear = useCallback(() => {
    setAppState('empty');
    setCurrentStep(0);
    setUploadedFile(null);
    setResults([]);
    setErrorMessage('');
    setProcessingMessage('');
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

        {appState === 'processing' && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-guinda-pale">
              <i className="ri-loader-4-line text-3xl text-guinda animate-spin" />
            </div>
            <div>
              <p className="font-heading font-bold text-base text-guinda-dark">Ejecutando inferencia</p>
              <p className="font-body text-sm text-gray-500 mt-1">
                {processingMessage || 'El modelo está procesando los registros del archivo. Por favor espere...'}
              </p>
              <p className="font-body text-xs text-gray-400 mt-2">Este paso puede tardar más de 50 segundos según la disponibilidad del servicio.</p>
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

        {showResults && (
          <>
            <KPISummary results={results} />
            <ResultsTable results={results} />
            <TechnicalPanel results={results} />
            <ReportActions results={results} />
          </>
        )}

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

\      <footer className="bg-guinda mt-12 py-6 border-t border-guinda-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-white/70">SADSM · Módulo de Inferencia · Uso institucional</span>
          </div>
          <p className="font-body text-xs text-white/50">© 2026 — Sistema de Apoyo a la Detección de Sequía Municipal</p>
        </div>
      </footer>
    </div>
  );
}