import type { ClassProbs } from '../types';
import { CLASS_META, CLASS_KEYS } from '../utils';

interface Props {
  probs: ClassProbs;
  clasePred: string;
}

export default function ProbabilityBars({ probs, clasePred }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1">
      {CLASS_KEYS.map((key) => {
        const meta = CLASS_META[key];
        const pct = Math.round((probs[key] ?? 0) * 100);
        const isWinner = key === clasePred;
        return (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span
                className="font-body text-xs font-semibold"
                style={{ color: meta.text }}
              >
                {meta.shortLabel}
              </span>
              <span className="font-body text-xs text-gray-500">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isWinner ? meta.hex : '#D1D5DB',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}