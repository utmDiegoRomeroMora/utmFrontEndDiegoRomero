import type { DroughtClass, AlertLevel, Priority } from './types';

export const SEVERITY_ORDER: Record<DroughtClass, number> = {
  sin_sequia: 0, D0: 1, D1: 2, D2: 3, D3: 4, D4: 5,
};

export const CLASS_META: Record<DroughtClass, { label: string; shortLabel: string; bg: string; text: string; border: string; hex: string }> = {
  sin_sequia: { label: 'Sin Sequía', shortLabel: 'S/S', bg: '#F0FDF4', text: '#14532D', border: '#86EFAC', hex: '#16A34A' },
  D0: { label: 'D0 — Incipiente', shortLabel: 'D0', bg: '#FEFCE8', text: '#713F12', border: '#FDE047', hex: '#CA8A04' },
  D1: { label: 'D1 — Moderada', shortLabel: 'D1', bg: '#FFF7ED', text: '#7C2D12', border: '#FED7AA', hex: '#EA580C' },
  D2: { label: 'D2 — Severa', shortLabel: 'D2', bg: '#FEF2F2', text: '#7F1D1D', border: '#FECACA', hex: '#DC2626' },
  D3: { label: 'D3 — Extrema', shortLabel: 'D3', bg: '#FFF1F2', text: '#881337', border: '#FECDD3', hex: '#BE123C' },
  D4: { label: 'D4 — Excepcional', shortLabel: 'D4', bg: '#FAF3F4', text: '#4E1F26', border: '#F4C7CC', hex: '#722F37' },
};

export const ALERT_META: Record<AlertLevel, { label: string; bg: string; text: string; border: string }> = {
  baja: { label: 'Baja', bg: '#F0FDF4', text: '#14532D', border: '#86EFAC' },
  media: { label: 'Media', bg: '#FFFBEB', text: '#78350F', border: '#FDE68A' },
  alta: { label: 'Alta', bg: '#FEF2F2', text: '#7F1D1D', border: '#FECACA' },
};

export const PRIORITY_META: Record<Priority, { label: string; icon: string; bg: string; text: string; border: string }> = {
  normal: { label: 'Normal', icon: 'ri-checkbox-blank-circle-line', bg: '#F9FAFB', text: '#4B5563', border: '#E5E7EB' },
  media: { label: 'Media', icon: 'ri-alert-line', bg: '#FFFBEB', text: '#78350F', border: '#FDE68A' },
  alta: { label: 'Alta', icon: 'ri-error-warning-line', bg: '#FFF7ED', text: '#7C2D12', border: '#FED7AA' },
  critica: { label: 'Crítica', icon: 'ri-alarm-warning-line', bg: '#FAF3F4', text: '#4E1F26', border: '#F4C7CC' },
};

export const CLASS_KEYS: DroughtClass[] = ['sin_sequia', 'D0', 'D1', 'D2', 'D3', 'D4'];

export function getConfidenceLevel(confianza: number): { label: string; color: string } {
  if (confianza >= 70) return { label: 'Alta', color: '#16A34A' };
  if (confianza >= 50) return { label: 'Media', color: '#CA8A04' };
  return { label: 'Baja', color: '#DC2626' };
}

export function getSecondClass(probs: Record<string, number>, clasePred: string): DroughtClass {
  const sorted = CLASS_KEYS
    .filter((k) => k !== clasePred)
    .sort((a, b) => (probs[b] ?? 0) - (probs[a] ?? 0));
  return sorted[0];
}