import { useRef, useState, useCallback } from 'react';
import type { AppState } from '../types';

interface Props {
  appState: AppState;
  uploadedFile: File | null;
  errorMessage: string;
  onFileSelect: (file: File) => void;
  onRun: () => void;
  onClear: () => void;
}

const ALLOWED_EXT = ['.csv'];
const MAX_SIZE_MB = 10;

export default function UploadPanel({ appState, uploadedFile, errorMessage, onFileSelect, onRun, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validate = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.csv')) return 'El archivo debe tener extensión .csv';
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `El archivo no debe superar ${MAX_SIZE_MB} MB`;
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) { setValidationError(err); return; }
    setValidationError('');
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const isProcessing = appState === 'processing';
  const isComplete = appState === 'complete';
  const hasFile = !!uploadedFile;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Panel header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-file-upload-line text-xl text-guinda" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-guinda-dark">Panel de Carga</h3>
            <p className="font-body text-xs text-gray-400">Archivo CSV previamente procesado</p>
          </div>
        </div>
        {isComplete && (
          <span className="font-body text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <i className="ri-check-line mr-1" />Procesado correctamente
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Drop zone */}
        {!isComplete && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors duration-200 cursor-pointer ${
              dragOver
                ? 'border-guinda bg-guinda-pale'
                : hasFile
                ? 'border-dorado bg-dorado-pale'
                : 'border-gray-300 bg-gray-50 hover:border-guinda/50 hover:bg-guinda-ultra'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !isProcessing && inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept={ALLOWED_EXT.join(',')} onChange={onInputChange} className="hidden" />
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-gray-200">
              <i className={`ri-file-excel-2-line text-3xl ${hasFile ? 'text-dorado' : 'text-gray-400'}`} />
            </div>
            <div className="text-center">
              <p className="font-heading font-semibold text-sm text-guinda-dark">
                {dragOver ? 'Suelte el archivo aquí' : 'Arrastre y suelte su archivo CSV'}
              </p>
              <p className="font-body text-xs text-gray-400 mt-1">o haga clic para seleccionar</p>
              <p className="font-body text-xs text-gray-300 mt-1">Formatos aceptados: .csv · Máximo {MAX_SIZE_MB} MB</p>
            </div>
          </div>
        )}

        {/* File info */}
        {hasFile && (
          <div className="flex items-center gap-4 bg-dorado-pale border border-dorado/30 rounded-lg px-5 py-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-md border border-dorado/30 flex-shrink-0">
              <i className="ri-file-excel-2-line text-xl text-dorado-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-guinda-dark truncate">{uploadedFile.name}</p>
              <p className="font-body text-xs text-gray-500">{formatSize(uploadedFile.size)} · Formato CSV</p>
            </div>
            {!isProcessing && !isComplete && (
              <button onClick={onClear} className="cursor-pointer w-7 h-7 flex items-center justify-center text-gray-400 hover:text-guinda transition-colors flex-shrink-0">
                <i className="ri-close-line text-lg" />
              </button>
            )}
            {isComplete && (
              <div className="w-7 h-7 flex items-center justify-center text-green-600 flex-shrink-0">
                <i className="ri-checkbox-circle-line text-xl" />
              </div>
            )}
          </div>
        )}

        {/* Validation error */}
        {(validationError || errorMessage) && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-error-warning-line text-red-500 text-base" />
            </div>
            <p className="font-body text-sm text-red-700">{validationError || errorMessage}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-guinda-ultra border border-guinda/15 rounded-lg px-4 py-3">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-information-line text-guinda text-base" />
          </div>
          <p className="font-body text-xs text-guinda-dark leading-relaxed">
            <strong>Nota:</strong> El sistema recibe únicamente datos ya procesados y estructurados. No realiza preprocesamiento ni limpieza. Asegúrese de que su archivo cumpla con el formato requerido por el modelo.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            disabled={!hasFile || isProcessing || isComplete}
            onClick={onRun}
            className={`cursor-pointer flex-1 font-body font-bold text-sm px-6 py-3 rounded-md transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 ${
              hasFile && !isProcessing && !isComplete
                ? 'bg-guinda text-white hover:bg-guinda-medium'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <><i className="ri-loader-4-line animate-spin text-lg" /> Procesando...</>
            ) : isComplete ? (
              <><i className="ri-checkbox-circle-line text-lg" /> Inferencia completada</>
            ) : (
              <><i className="ri-play-circle-line text-lg" /> Ejecutar Inferencia</>
            )}
          </button>
          <button
            onClick={onClear}
            disabled={isProcessing}
            className="cursor-pointer font-body text-sm px-5 py-3 rounded-md border border-gray-300 text-gray-600 hover:border-guinda hover:text-guinda transition-colors duration-200 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2"><i className="ri-refresh-line" /> Limpiar</span>
          </button>
        </div>
      </div>
    </div>
  );
}