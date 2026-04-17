import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Download, Filter, Wheat, ChevronRight } from "lucide-react";
import { MOCK_HARVESTS, MOCK_TRUCKS, MOCK_DRIVERS } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import type { HarvestSummary } from "@/src/lib/types";

export function Harvest() {
  const navigate = useNavigate();
  const { selectedSafra, selectedTalhao, talhoesForSafra, getCulturaForTalhao } = useGlobalFilters();

  const [harvests, setHarvests] = useState<HarvestSummary[]>(MOCK_HARVESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // ── Filtros ───────────────────────────────────────────────
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilterValues({});

  const filteredHarvests = harvests.filter(h => {
    if (selectedSafra && h.safraId !== selectedSafra.id) return false;
    if (selectedTalhao && h.talhaoId !== selectedTalhao.id) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const driver = MOCK_DRIVERS.find(d => d.id === h.driverId);
      const truck = MOCK_TRUCKS.find(t => t.id === h.truckId);
      if (
        !h.cultura.toLowerCase().includes(term) &&
        !(driver?.name.toLowerCase().includes(term)) &&
        !(truck?.plate.toLowerCase().includes(term))
      ) return false;
    }
    if (filterValues.cultura && h.cultura !== filterValues.cultura) return false;
    if (filterValues.talhaoId && h.talhaoId !== filterValues.talhaoId) return false;
    if (filterValues.driverId && h.driverId !== filterValues.driverId) return false;
    return true;
  });

  // ── Opções únicas para filtros ────────────────────────────
  const uniqueCulturas = Array.from(new Set(harvests.map(h => h.cultura)));
  const uniqueDrivers = Array.from(new Set(harvests.map(h => h.driverId)))
    .map(id => MOCK_DRIVERS.find(d => d.id === id))
    .filter(Boolean);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de colheita?')) {
      setHarvests(harvests.filter(h => h.id !== id));
    }
  };

  // ── KPIs resumo ────────────────────────────────────────────
  const totalPesoLiquido = filteredHarvests.reduce((acc, h) => acc + h.pesoLiquido, 0);
  const totalArea = filteredHarvests.reduce((acc, h) => acc + h.area, 0);
  const produtividade = totalArea > 0 ? ((totalPesoLiquido / 60) / totalArea).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registro de Colheita</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os registros de colheita e viagens por safra.</p>
        </div>
        <button
          onClick={() => navigate('/harvest/new')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Colheita
        </button>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Colhido</p>
          <p className="text-xl font-bold text-emerald-700">
            {(totalPesoLiquido / 60).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} scs
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {(totalPesoLiquido / 1000).toFixed(1)} t peso líquido
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Área Colhida</p>
          <p className="text-xl font-bold text-slate-900">{totalArea.toLocaleString('pt-BR')} ha</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Produtividade</p>
          <p className="text-xl font-bold text-blue-700">{produtividade} scs/ha</p>
        </div>
      </div>

      {/* Tabela principal */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Barra de busca e filtros */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cultura, motorista ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border h-10 px-4 py-2 ${
                Object.values(filterValues).some(v => v !== '')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros {Object.values(filterValues).some(v => v !== '') && '(Ativo)'}
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cultura</TableHead>
                <TableHead>Talhão</TableHead>
                <TableHead className="text-right">Área (ha)</TableHead>
                <TableHead className="text-right">Peso Líquido</TableHead>
                <TableHead>Caminhão</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHarvests.map((harvest) => {
                const driver = MOCK_DRIVERS.find(d => d.id === harvest.driverId);
                const truck = MOCK_TRUCKS.find(t => t.id === harvest.truckId);
                const talhao = talhoesForSafra.find(t => t.id === harvest.talhaoId);

                return (
                  <TableRow
                    key={harvest.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/harvest/${harvest.id}`)}
                  >
                    <TableCell>
                      <span className="font-medium text-emerald-600 hover:text-emerald-800">
                        {format(new Date(harvest.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <Wheat className="h-3.5 w-3.5 text-amber-500" />
                        {harvest.cultura}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {talhao?.name ?? harvest.talhaoId}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{harvest.area}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">
                      {(harvest.pesoLiquido / 1000).toFixed(1)} t
                      <span className="text-xs text-slate-400 font-normal ml-1">
                        ({(harvest.pesoLiquido / 60).toFixed(0)} scs)
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {truck?.plate ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell>{driver?.name ?? '-'}</TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/harvest/${harvest.id}`)}
                          className="inline-flex items-center text-xs text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1 rounded hover:bg-emerald-50"
                        >
                          Ver detalhes <ChevronRight className="h-3 w-3 ml-0.5" />
                        </button>
                        <ActionDropdown
                          onEdit={() => navigate(`/harvest/${harvest.id}`)}
                          onDelete={() => handleDelete(harvest.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredHarvests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                    <Wheat className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    Nenhum registro encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Colheitas"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'cultura',
            label: 'Cultura',
            type: 'select',
            options: uniqueCulturas,
          },
          {
            key: 'talhaoId',
            label: 'Talhão',
            type: 'select',
            options: talhoesForSafra.map(t => t.id),
          },
          {
            key: 'driverId',
            label: 'Motorista',
            type: 'select',
            options: uniqueDrivers.map(d => d!.id),
          },
        ]}
      />
    </div>
  );
}
