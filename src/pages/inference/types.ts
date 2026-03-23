export type DroughtClass = 'sin_sequia' | 'D0' | 'D1' | 'D2' | 'D3' | 'D4';
export type AlertLevel = 'baja' | 'media' | 'alta';
export type Priority = 'critica' | 'alta' | 'media' | 'normal';
export type AppState = 'empty' | 'ready' | 'processing' | 'complete' | 'error';

export interface ClassProbs {
  sin_sequia: number;
  D0: number;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
}

export interface MunicipalRecord {
  id: number;
  municipio: string;
  estado: string;
  clasePred: DroughtClass;
  nivelAlerta: AlertLevel;
  confianza: number;
  probMax: number;
  probs: ClassProbs;
  observacion: string;
  prioridad: Priority;
}

export interface TableFilters {
  search: string;
  estado: string;
  clase: string;
  alerta: string;
  prioridad: string;
  sortBy: 'confianza_asc' | 'confianza_desc' | 'severidad_asc' | 'severidad_desc' | 'default';
}