import { useState, useMemo } from 'react';
import type { MunicipalRecord } from '../types';
import { CLASS_META, ALERT_META, PRIORITY_META, SEVERITY_ORDER, CLASS_KEYS } from '../utils';
import ProbabilityBars from './ProbabilityBars';

interface Props { results: MunicipalRecord[] }

const PER_PAGE = 10;

export default function ResultsTable({ results }: Props) {
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterClase, setFilterClase] = useState('');
  const [filterAlerta, setFilterAlerta] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const estados = useMemo(() => [...new Set(results.map((r) => r.estado))].sort(), [results]);

  const filtered = useMemo(() => {
    let data = [...results];
    if (search) data = data.filter((r) => r.municipio.toLowerCase().includes(search.toLowerCase()) || r.estado.toLowerCase().includes(search.toLowerCase()));
    if (filterEstado) data = data.filter((r) => r.estado === filterEstado);
    if (filterClase) data = data.filter((r) => r.clasePred === filterClase);
    if (filterAlerta) data = data.filter((r) => r.nivelAlerta === filterAlerta);
    if (filterPrioridad) data = data.filter((r) => r.prioridad === filterPrioridad);
    if (sortBy === 'confianza_desc') data.sort((a, b) => b.confianza - a.confianza);
    else if (sortBy === 'confianza_asc') data.sort((a, b) => a.confianza - b.confianza);
    else if (sortBy === 'severidad_desc') data.sort((a, b) => SEVERITY_ORDER[b.clasePred] - SEVERITY_ORDER[a.clasePred]);
    else if (sortBy === 'severidad_asc') data.sort((a, b) => SEVERITY_ORDER[a.clasePred] - SEVERITY_ORDER[b.clasePred]);
    return data;
  }, [results, search, filterEstado, filterClase, filterAlerta, filterPrioridad, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch(''); setFilterEstado(''); setFilterClase('');
    setFilterAlerta(''); setFilterPrioridad(''); setSortBy('default'); setPage(1);
  };
  const hasFilters = search || filterEstado || filterClase || filterAlerta || filterPrioridad || sortBy !== 'default';

  const selectCls = 'cursor-pointer font-body text-xs border border-gray-200 rounded px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-guinda';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-table-line text-xl text-guinda" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-guinda-dark">Resultados de Clasificación</h3>
            <p className="font-body text-xs text-gray-400">{filtered.length} registros {hasFilters ? 'filtrados' : 'totales'}</p>
          </div>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="cursor-pointer font-body text-xs text-guinda border border-guinda/30 px-3 py-1.5 rounded hover:bg-guinda-pale transition-colors whitespace-nowrap">
            <i className="ri-filter-off-line mr-1" />Limpiar filtros
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar municipio o estado..."
            className="w-full pl-8 pr-3 py-1.5 font-body text-xs border border-gray-200 rounded bg-white focus:outline-none focus:border-guinda"
          />
        </div>
        {/* Estado */}
        <select value={filterEstado} onChange={(e) => { setFilterEstado(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">Todos los estados</option>
          {estados.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        {/* Clase */}
        <select value={filterClase} onChange={(e) => { setFilterClase(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">Todas las clases</option>
          {CLASS_KEYS.map((k) => <option key={k} value={k}>{CLASS_META[k].label}</option>)}
        </select>
        {/* Alerta */}
        <select value={filterAlerta} onChange={(e) => { setFilterAlerta(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">Todas las alertas</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        {/* Prioridad */}
        <select value={filterPrioridad} onChange={(e) => { setFilterPrioridad(e.target.value); setPage(1); }} className={selectCls}>
          <option value="">Todas las prioridades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="normal">Normal</option>
        </select>
        {/* Sort */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectCls}>
          <option value="default">Orden original</option>
          <option value="confianza_desc">Confianza ↓</option>
          <option value="confianza_asc">Confianza ↑</option>
          <option value="severidad_desc">Severidad ↓</option>
          <option value="severidad_asc">Severidad ↑</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="sticky top-0 bg-guinda-ultra border-b border-gray-200 z-10">
            <tr>
              {['#', 'Municipio / Estado', 'Clase predicha', 'Nivel alerta', 'Confianza', 'Prob. máx.', 'Distribución', 'Observación técnica', 'Prioridad'].map((h, i) => (
                <th key={i} className={`px-4 py-3 font-heading font-bold text-xs text-guinda-dark whitespace-nowrap ${i === 0 ? 'text-center w-12' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                      <i className="ri-search-line text-2xl text-gray-400" />
                    </div>
                    <p className="font-body text-sm text-gray-500">Sin resultados con los filtros aplicados</p>
                    <button onClick={clearFilters} className="cursor-pointer font-body text-xs text-guinda hover:underline">Limpiar filtros</button>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((r, rowIdx) => {
                const cls = CLASS_META[r.clasePred];
                const alrt = ALERT_META[r.nivelAlerta];
                const prio = PRIORITY_META[r.prioridad];
                const isExp = expanded.has(r.id);
                const confColor = r.confianza >= 70 ? '#16A34A' : r.confianza >= 50 ? '#CA8A04' : '#DC2626';
                return (
                  <>
                    <tr key={r.id} className={`border-b border-gray-100 transition-colors duration-100 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-guinda-ultra`}>
                      <td className="px-4 py-3 text-center font-body text-xs text-gray-400">{(page - 1) * PER_PAGE + rowIdx + 1}</td>
                      <td className="px-4 py-3 min-w-[160px]">
                        <p className="font-body text-sm font-semibold text-guinda-dark whitespace-nowrap">{r.municipio}</p>
                        <p className="font-body text-xs text-gray-400">{r.estado}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                          style={{ backgroundColor: cls.bg, color: cls.text, borderColor: cls.border }}>
                          {cls.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                          style={{ backgroundColor: alrt.bg, color: alrt.text, borderColor: alrt.border }}>
                          {alrt.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 min-w-[100px]">
                        <div className="flex flex-col gap-1">
                          <span className="font-body text-sm font-bold" style={{ color: confColor }}>{r.confianza}%</span>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-20">
                            <div className="h-full rounded-full" style={{ width: `${r.confianza}%`, backgroundColor: confColor }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-gray-600">{r.probMax}%</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleExpanded(r.id)}
                          className="cursor-pointer font-body text-xs border border-gray-200 rounded px-2.5 py-1 text-gray-600 hover:border-guinda hover:text-guinda transition-colors whitespace-nowrap">
                          <i className={`${isExp ? 'ri-eye-off-line' : 'ri-eye-line'} mr-1`} />
                          {isExp ? 'Ocultar' : 'Ver dist.'}
                        </button>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-body text-xs text-gray-500 leading-relaxed line-clamp-2">{r.observacion}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
                          style={{ backgroundColor: prio.bg, color: prio.text, borderColor: prio.border }}>
                          <i className={`${prio.icon} mr-1`} />{prio.label}
                        </span>
                      </td>
                    </tr>
                    {isExp && (
                      <tr key={`exp-${r.id}`} className="bg-guinda-ultra border-b border-gray-100">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="max-w-xl">
                            <p className="font-heading font-semibold text-xs text-guinda-dark mb-3">
                              Distribución de probabilidades — {r.municipio}, {r.estado}
                            </p>
                            <ProbabilityBars probs={r.probs} clasePred={r.clasePred} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="font-body text-xs text-gray-400">
            Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length} registros
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-guinda hover:text-guinda disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded border font-body text-xs transition-colors ${
                  p === page ? 'bg-guinda border-guinda text-white' : 'border-gray-200 text-gray-500 hover:border-guinda hover:text-guinda'
                }`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-guinda hover:text-guinda disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}