import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { Plus, Search, Download, Filter, Wheat } from "lucide-react";
import { MOCK_HARVESTS, MOCK_TRUCKS, MOCK_DRIVERS } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import type { HarvestSummary } from "@/src/lib/types";

export function Harvest() {
  const navigate = useNavigate();
  const { selectedSafra, selectedTalhao, talhoesForSafra } = useGlobalFilters();

  const [harvests, setHarvests] = useState<HarvestSummary[]>(MOCK_HARVESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => setFilterValues(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilterValues({});

  const filteredHarvests = harvests.filter(h => {
    if (selectedSafra && h.safraId !== selectedSafra.id) return false;
    if (selectedTalhao && h.talhaoId !== selectedTalhao.id) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const driver = MOCK_DRIVERS.find(d => d.id === h.driverId);
      const truck = MOCK_TRUCKS.find(t => t.id === h.truckId);
      if (!h.cultura.toLowerCase().includes(term) && !driver?.name.toLowerCase().includes(term) && !truck?.plate.toLowerCase().includes(term)) return false;
    }
    if (filterValues.cultura && h.cultura !== filterValues.cultura) return false;
    if (filterValues.talhaoId && h.talhaoId !== filterValues.talhaoId) return false;
    if (filterValues.driverId && h.driverId !== filterValues.driverId) return false;
    return true;
  });

  const uniqueCulturas = Array.from(new Set(harvests.map(h => h.cultura)));
  const uniqueDrivers = Array.from(new Set(harvests.map(h => h.driverId))).map(id => MOCK_DRIVERS.find(d => d.id === id)).filter(Boolean);

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este registro de colheita?')) setHarvests(harvests.filter(h => h.id !== id));
  };

  const totalPesoLiquido = filteredHarvests.reduce((acc, h) => acc + h.pesoLiquido, 0);
  const totalArea = filteredHarvests.reduce((acc, h) => acc + h.area, 0);
  const produtividade = totalArea > 0 ? ((totalPesoLiquido / 60) / totalArea).toFixed(1) : '0';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registro de Colheita</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os registros de colheita e viagens por safra.</p>
        </div>
        <button
          onClick={() => navigate('/harvest/new')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />Nova Colheita
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Total Colhido</p>
          <p className="text-base sm:text-xl font-bold text-emerald-700">
            {(totalPesoLiquido / 60).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} scs
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{(totalPesoLiquido / 1000).toFixed(1)} t</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Área</p>
          <p className="text-base sm:text-xl font-bold text-slate-900">{totalArea.toLocaleString('pt-BR')} ha</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Produtividade</p>
          <p className="text-base sm:text-xl font-bold text-blue-700">{produtividade} scs/ha</p>
        </div>
      </div>

      {/* Busca + filtro + botão novo mobile */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 transition-colors ${Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}
        >
          <Filter className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate('/harvest/new')}
          className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden">
        <MobileCardList>
          {filteredHarvests.map(harvest => {
            const driver = MOCK_DRIVERS.find(d => d.id === harvest.driverId);
            const truck = MOCK_TRUCKS.find(t => t.id === harvest.truckId);
            const talhao = talhoesForSafra.find(t => t.id === harvest.talhaoId);
            const bagsPerHa = harvest.area > 0 ? ((harvest.pesoLiquido / 60) / harvest.area).toFixed(1) : '—';
            return (
              <MobileCard
                key={harvest.id}
                title={`${harvest.cultura} · ${talhao?.name ?? harvest.talhaoId}`}
                subtitle={`${format(new Date(harvest.date), "dd/MM/yyyy", { locale: ptBR })} · ${truck?.plate ?? '—'}`}
                detail={driver?.name}
                value={`${bagsPerHa} scs/ha`}
                valueColor="emerald"
                onClick={() => navigate(`/harvest/${harvest.id}`)}
              />
            );
          })}
          {filteredHarvests.length === 0 && <MobileCardEmpty icon={Wheat} message="Nenhum registro encontrado." />}
        </MobileCardList>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'}`}
            >
              <Filter className="mr-2 h-4 w-4" />Filtros
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />Exportar
            </button>
          </div>
        </div>
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
              {filteredHarvests.map(harvest => {
                const driver = MOCK_DRIVERS.find(d => d.id === harvest.driverId);
                const truck = MOCK_TRUCKS.find(t => t.id === harvest.truckId);
                const talhao = talhoesForSafra.find(t => t.id === harvest.talhaoId);
                return (
                  <TableRow key={harvest.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/harvest/${harvest.id}`)}>
                    <TableCell><span className="font-medium text-emerald-600">{format(new Date(harvest.date), "dd/MM/yyyy", { locale: ptBR })}</span></TableCell>
                    <TableCell>{harvest.cultura}</TableCell>
                    <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{talhao?.name ?? harvest.talhaoId}</span></TableCell>
                    <TableCell className="text-right">{harvest.area}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">{(harvest.pesoLiquido / 1000).toFixed(1)} t <span className="text-xs text-slate-400 font-normal">({(harvest.pesoLiquido / 60).toFixed(0)} scs)</span></TableCell>
                    <TableCell><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{truck?.plate ?? '-'}</span></TableCell>
                    <TableCell>{driver?.name ?? '-'}</TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <ActionDropdown onEdit={() => navigate(`/harvest/${harvest.id}`)} onDelete={() => handleDelete(harvest.id)} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredHarvests.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-10 text-slate-500"><Wheat className="h-8 w-8 text-slate-300 mx-auto mb-2" />Nenhum registro encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Colheitas"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'cultura', label: 'Cultura', type: 'select', options: uniqueCulturas },
          { key: 'talhaoId', label: 'Talhão', type: 'select', options: talhoesForSafra.map(t => t.id) },
          { key: 'driverId', label: 'Motorista', type: 'select', options: uniqueDrivers.map(d => d!.id) },
        ]}
      />
    </div>
  );
}
