import React, { useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGlobalFilters } from "../../contexts/GlobalFiltersContext";
import { cn } from "../../lib/utils";

/**
 * GlobalFiltersSheet — botão de trigger + bottom sheet com filtros Safra/Talhão.
 * Visível apenas no mobile (sm:hidden).
 * O desktop mantém os filtros na sidebar.
 */
export function GlobalFiltersSheet() {
  const [open, setOpen] = useState(false);
  const {
    safras, talhoesForSafra,
    selectedSafra, setSelectedSafra,
    selectedTalhao, setSelectedTalhao,
    getCulturaForTalhao,
  } = useGlobalFilters();

  const hasActiveFilters = !!selectedSafra || !!selectedTalhao;

  return (
    <>
      {/* Trigger button — aparece no header mobile */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "sm:hidden relative flex items-center justify-center w-10 h-10 rounded-full transition-all flex-shrink-0",
          hasActiveFilters
            ? "bg-emerald-100 text-emerald-700"
            : "text-slate-500 hover:bg-slate-100"
        )}
        aria-label="Filtros globais"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {hasActiveFilters && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        )}
      </button>

      {/* Bottom Sheet via Portal para evitar problemas de CSS transform/backdrop-filter do Header */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 sm:hidden"
                onClick={() => setOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl sm:hidden flex flex-col"
                style={{ paddingBottom: "env(safe-area-inset-bottom)", maxHeight: "90vh" }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 bg-slate-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                  <h2 className="text-base font-bold text-slate-900">Filtros Globais</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Filters Scrollable Content */}
                <div className="px-5 py-4 space-y-5 overflow-y-auto overscroll-contain flex-1">
                  {/* Safra */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Safra
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSafra?.id || ''}
                        onChange={(e) => {
                          const safra = safras.find(s => s.id === e.target.value) || null;
                          setSelectedSafra(safra);
                        }}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 py-3 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      >
                        <option value="">Todas as Safras</option>
                        {safras.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Talhão */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Talhão
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTalhao?.id || ''}
                        onChange={(e) => {
                          const talhao = talhoesForSafra.find(t => t.id === e.target.value) || null;
                          setSelectedTalhao(talhao);
                        }}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 py-3 pl-4 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      >
                        <option value="">Todos os Talhões</option>
                        {talhoesForSafra.map(t => {
                          const cultura = getCulturaForTalhao(t.id);
                          return (
                            <option key={t.id} value={t.id}>
                              {t.name} — {t.property}{cultura ? ` (${cultura})` : ''}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Indicador de filtros ativos */}
                  {hasActiveFilters && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center justify-between mt-4">
                      <p className="text-xs text-emerald-700 font-medium">
                        {[selectedSafra?.name, selectedTalhao?.name].filter(Boolean).join(' · ')}
                      </p>
                      <button
                        onClick={() => { setSelectedSafra(null); setSelectedTalhao(null); }}
                        className="text-xs text-emerald-600 font-bold hover:text-emerald-800"
                      >
                        Limpar
                      </button>
                    </div>
                  )}
                </div>

                {/* Sticky Apply Button */}
                <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
