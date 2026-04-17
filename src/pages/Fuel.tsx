import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Fuel as FuelIcon, ArrowUpRight, ArrowDownRight, ChevronRight, Droplets } from "lucide-react";
import { MOCK_MOVEMENTS, MOCK_FUEL, MOCK_MACHINES, MOCK_DRIVERS } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Modal } from "@/src/components/ui/modal";

export function Fuel() {
  const navigate = useNavigate();
  const { selectedSafra } = useGlobalFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // ── Modal de Abastecimento ──
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    equipment: '',
    employee: '',
    liters: 0,
    cost: 0
  });

  // ── Filtros ──
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => setFilterValues({});

  // Unindo as duas listas para exibição simplificada ou mantendo separadas?
  // O plano diz: Tabela simplificada. Vamos mostrar Abastecimentos (Saídas) por padrão.
  const filteredFuel = MOCK_FUEL.filter(f => {
    // No mock atual não temos safraId em Fuel, mas na vida real filtrariamos.
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!f.equipment.toLowerCase().includes(term) && !f.employee.toLowerCase().includes(term)) return false;
    }
    if (filterValues.equipment && f.equipment !== filterValues.equipment) return false;
    return true;
  });

  // KPIs
  const totalLitros = filteredFuel.reduce((a, f) => a + f.liters, 0);
  const totalCusto = filteredFuel.reduce((a, f) => a + f.cost, 0);
  // Simulação de saldo de tanque (Entradas - Saídas)
  const entradas = MOCK_MOVEMENTS.filter(m => m.type === 'Entrada').reduce((a, m) => a + m.liters, 0);
  const balance = entradas - MOCK_FUEL.reduce((a, f) => a + f.liters, 0);

  const uniqueEquipments = Array.from(new Set(MOCK_FUEL.map(f => f.equipment)));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de salvamento mock
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Controle de Diesel</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de estoque de combustível e abastecimentos.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/financial')} // Entradas agora são via Financeiro
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-10 px-4 py-2"
          >
            <ArrowDownRight className="mr-2 h-4 w-4 text-emerald-600" />
            Nova Entrada
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
          >
            <Droplets className="mr-2 h-4 w-4" />
            Abastecer
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Saldo em Tanque</p>
          <p className="text-xl font-bold text-emerald-700">{balance.toLocaleString('pt-BR')} L</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Consumido (Período)</p>
          <p className="text-xl font-bold text-orange-600">{totalLitros.toLocaleString('pt-BR')} L</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Custo Total</p>
          <p className="text-xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCusto)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Custo Médio/L</p>
          <p className="text-xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCusto / (totalLitros || 1))}
          </p>
        </div>
      </div>

      {/* Tabela de Abastecimentos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por equipamento ou motorista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${
                filterValues.equipment ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Motorista/Operador</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuel.map((f) => (
                <TableRow
                  key={f.id}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/fuel/${f.id}`)}
                >
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {format(new Date(f.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{f.equipment}</TableCell>
                  <TableCell className="text-slate-600">{f.employee}</TableCell>
                  <TableCell className="text-right font-bold text-orange-600">
                    {f.liters.toLocaleString('pt-BR')} L
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(f.cost)}
                  </TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/fuel/${f.id}`)}
                      className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                    >
                      Detalhes <ChevronRight className="inline h-3 w-3" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFuel.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    <FuelIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    Nenhum abastecimento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Abastecimentos"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'equipment',
            label: 'Equipamento',
            type: 'select',
            options: uniqueEquipments
          }
        ]}
      />

      {/* Modal de Abastecimento */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Novo Abastecimento">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Data e Hora</label>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Equipamento</label>
              <select
                required
                value={form.equipment}
                onChange={e => setForm({ ...form, equipment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione...</option>
                {MOCK_MACHINES.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Motorista/Operador</label>
              <select
                required
                value={form.employee}
                onChange={e => setForm({ ...form, employee: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione...</option>
                {MOCK_DRIVERS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Litros</label>
              <input
                type="number"
                required
                min="1"
                value={form.liters || ''}
                onChange={e => setForm({ ...form, liters: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custo Total (R$)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={form.cost || ''}
                onChange={e => setForm({ ...form, cost: +e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Abastecimento</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
