import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { Safra, Talhao, TalhaoSafra } from '../lib/types';
import { MOCK_TALHAO_SAFRA } from '../lib/mock-data';

interface GlobalFiltersContextType {
  selectedSafra: Safra | null;
  setSelectedSafra: (safra: Safra | null) => void;
  selectedTalhao: Talhao | null;
  setSelectedTalhao: (talhao: Talhao | null) => void;
  safras: Safra[];
  setSafras: (safras: Safra[]) => void;
  talhoes: Talhao[];
  setTalhoes: (talhoes: Talhao[]) => void;
  /** Talhões filtrados pela safra ativa */
  talhoesForSafra: Talhao[];
  /** Cultura do talhão dentro da safra selecionada */
  getCulturaForTalhao: (talhaoId: string, safraId?: string) => string;
  talhaoSafra: TalhaoSafra[];
  setTalhaoSafra: (items: TalhaoSafra[]) => void;
}

const MOCK_SAFRAS: Safra[] = [
  { id: '1', name: 'Safra 2025/2026', startDate: '2025-09-01', endDate: '2026-04-30', status: 'Ativa' },
  { id: '2', name: 'Safrinha 2026', startDate: '2026-02-01', endDate: '2026-08-30', status: 'Planejada' },
  { id: '3', name: 'Safra 2024/2025', startDate: '2024-09-01', endDate: '2025-04-30', status: 'Concluída' },
];

const MOCK_TALHOES: Talhao[] = [
  { id: 't1', name: 'A1', property: 'Fazenda São Bento', area: 150, status: 'Ativo' },
  { id: 't2', name: 'A2', property: 'Fazenda São Bento', area: 200, status: 'Ativo' },
  { id: 't3', name: 'B1', property: 'Fazenda Boa Vista', area: 100, status: 'Ativo' },
  { id: 't4', name: 'C1', property: 'Fazenda São Bento', area: 80, status: 'Inativo' },
];

const GlobalFiltersContext = createContext<GlobalFiltersContextType | undefined>(undefined);

export function GlobalFiltersProvider({ children }: { children: ReactNode }) {
  const [safras, setSafras] = useState<Safra[]>(MOCK_SAFRAS);
  const [talhoes, setTalhoes] = useState<Talhao[]>(MOCK_TALHOES);
  const [talhaoSafra, setTalhaoSafra] = useState<TalhaoSafra[]>(MOCK_TALHAO_SAFRA);
  const [selectedSafra, setSelectedSafra] = useState<Safra | null>(MOCK_SAFRAS[0]);
  const [selectedTalhao, setSelectedTalhao] = useState<Talhao | null>(null);

  /** Talhões que têm vínculo com a safra selecionada */
  const talhoesForSafra = useMemo(() => {
    if (!selectedSafra) return talhoes;
    const ids = talhaoSafra
      .filter(ts => ts.safraId === selectedSafra.id)
      .map(ts => ts.talhaoId);
    return talhoes.filter(t => ids.includes(t.id));
  }, [selectedSafra, talhoes, talhaoSafra]);

  /** Obtém a cultura de um talhão na safra indicada (ou selecionada) */
  const getCulturaForTalhao = (talhaoId: string, safraId?: string): string => {
    const sid = safraId ?? selectedSafra?.id ?? '';
    const ts = talhaoSafra.find(x => x.talhaoId === talhaoId && x.safraId === sid);
    return ts?.cultura ?? '';
  };

  /** Ao trocar a safra, limpa o talhão selecionado */
  const handleSetSafra = (safra: Safra | null) => {
    setSelectedSafra(safra);
    setSelectedTalhao(null);
  };

  return (
    <GlobalFiltersContext.Provider
      value={{
        selectedSafra,
        setSelectedSafra: handleSetSafra,
        selectedTalhao,
        setSelectedTalhao,
        safras,
        setSafras,
        talhoes,
        setTalhoes,
        talhoesForSafra,
        getCulturaForTalhao,
        talhaoSafra,
        setTalhaoSafra,
      }}
    >
      {children}
    </GlobalFiltersContext.Provider>
  );
}

export function useGlobalFilters() {
  const context = useContext(GlobalFiltersContext);
  if (context === undefined) {
    throw new Error('useGlobalFilters must be used within a GlobalFiltersProvider');
  }
  return context;
}

// Re-export types for convenience
export type { Safra, Talhao, TalhaoSafra };
