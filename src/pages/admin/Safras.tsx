import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Modal } from "@/src/components/ui/modal";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGlobalFilters } from "@/src/contexts/GlobalFiltersContext";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";

export function Safras() {
  const { safras, setSafras } = useGlobalFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedSafra, setSelectedSafra] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', status: 'Ativa' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const filteredSafras = safras.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterValues.status || s.status === filterValues.status;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(safras.map(s => s.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', startDate: '', endDate: '', status: 'Ativa' });
    setIsModalOpen(true);
  };

  const openEdit = (safra: any) => {
    setModalMode('edit');
    setSelectedSafra(safra);
    setFormData({ 
      name: safra.name, 
      startDate: safra.startDate, 
      endDate: safra.endDate, 
      status: safra.status 
    });
    setIsModalOpen(true);
  };

  const openDelete = (safra: any) => {
    setModalMode('delete');
    setSelectedSafra(safra);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setSafras(safras.filter(s => s.id !== selectedSafra.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setSafras([...safras, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setSafras(safras.map(s => s.id === selectedSafra.id ? { ...s, ...formData } : s));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Safras</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as safras, períodos e status.</p>
        </div>
        <button 
          onClick={openNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Safra
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar safra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border h-10 px-4 py-2 ${
                Object.keys(filterValues).length > 0 && Object.values(filterValues).some(v => v !== '')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros {Object.keys(filterValues).length > 0 && Object.values(filterValues).some(v => v !== '') && '(Ativo)'}
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Data de Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSafras.map((safra) => (
                <TableRow key={safra.id}>
                  <TableCell className="font-medium">{safra.name}</TableCell>
                  <TableCell>{format(new Date(safra.startDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{format(new Date(safra.endDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      safra.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 
                      safra.status === 'Planejada' ? 'bg-blue-100 text-blue-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {safra.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown 
                      onEdit={() => openEdit(safra)} 
                      onDelete={() => openDelete(safra)} 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredSafras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhuma safra encontrada.
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
        title="Filtrar Safras"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: uniqueStatuses
          }
        ]}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          modalMode === 'new' ? 'Nova Safra' : 
          modalMode === 'edit' ? 'Editar Safra' : 'Excluir Safra'
        }
      >
        {modalMode === 'delete' && (
          <div className="space-y-4">
            <p className="text-slate-700">Tem certeza que deseja excluir a safra <strong>{selectedSafra?.name}</strong>?</p>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>Excluir</Button>
            </div>
          </div>
        )}

        {(modalMode === 'new' || modalMode === 'edit') && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Safra</label>
              <input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                placeholder="Ex: Safra 2023/2024"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Início</label>
                <input 
                  type="date"
                  required 
                  value={formData.startDate} 
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Fim</label>
                <input 
                  type="date"
                  required 
                  value={formData.endDate} 
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Planejada">Planejada</option>
                <option value="Ativa">Ativa</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
