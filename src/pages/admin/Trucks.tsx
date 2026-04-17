import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { MOCK_TRUCKS } from "@/src/lib/mock-data";
import { Modal } from "@/src/components/ui/modal";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Trucks() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState(MOCK_TRUCKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'view' | 'delete'>('new');
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [formData, setFormData] = useState({ plate: '', model: '', capacity: 0, status: 'Ativo' });
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

  const filteredTrucks = trucks.filter(t => {
    const matchesSearch = t.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = !filterValues.model || t.model === filterValues.model;
    const matchesStatus = !filterValues.status || t.status === filterValues.status;
    return matchesSearch && matchesModel && matchesStatus;
  });

  const uniqueModels = Array.from(new Set(trucks.map(t => t.model)));
  const uniqueStatuses = Array.from(new Set(trucks.map(t => t.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ plate: '', model: '', capacity: 0, status: 'Ativo' });
    setIsModalOpen(true);
  };

  const openEdit = (truck: any) => {
    setModalMode('edit');
    setSelectedTruck(truck);
    setFormData({ ...truck });
    setIsModalOpen(true);
  };

  const openView = (truck: any) => {
    setModalMode('view');
    setSelectedTruck(truck);
    setIsModalOpen(true);
  };

  const openDelete = (truck: any) => {
    setModalMode('delete');
    setSelectedTruck(truck);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setTrucks(trucks.filter(t => t.id !== selectedTruck.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setTrucks([...trucks, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setTrucks(trucks.map(t => t.id === selectedTruck.id ? { ...t, ...formData } : t));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Frota de Caminhões</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os caminhões, placas e capacidades.</p>
        </div>
        <button 
          onClick={openNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Caminhão
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar caminhão..."
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
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Capacidade (ton)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrucks.map((truck) => (
                    <TableRow 
                      key={truck.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/admin/trucks/${truck.id}`)}
                    >
                      <TableCell>
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-slate-200 border border-slate-300 text-slate-800 font-mono font-bold text-sm shadow-sm">
                          {truck.plate}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{truck.model}</TableCell>
                      <TableCell>{truck.capacity}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          truck.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {truck.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/trucks/${truck.id}`)}
                          className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                           Ver Detalhes <ChevronRight className="inline h-3 w-3" />
                        </button>
                        <ActionDropdown 
                          onEdit={() => openEdit(truck)} 
                          onDelete={() => openDelete(truck)} 
                        />
                      </TableCell>
                    </TableRow>
              ))}
              {filteredTrucks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum caminhão encontrado.
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
        title="Filtrar Caminhões"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'model',
            label: 'Modelo',
            type: 'select',
            options: uniqueModels
          },
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
          modalMode === 'new' ? 'Novo Caminhão' : 
          modalMode === 'edit' ? 'Editar Caminhão' : 
          modalMode === 'view' ? 'Detalhes do Caminhão' : 'Excluir Caminhão'
        }
      >
        {modalMode === 'delete' && (
          <div className="space-y-4">
            <p className="text-slate-700">Tem certeza que deseja excluir o caminhão <strong>{selectedTruck?.plate}</strong>?</p>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>Excluir</Button>
            </div>
          </div>
        )}

        {modalMode === 'view' && selectedTruck && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500">Placa</h4>
                <p className="text-base text-slate-900">{selectedTruck.plate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">Status</h4>
                <p className="text-base text-slate-900">{selectedTruck.status}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">Modelo</h4>
                <p className="text-base text-slate-900">{selectedTruck.model}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500">Capacidade</h4>
                <p className="text-base text-slate-900">{selectedTruck.capacity} ton</p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Fechar</Button>
            </div>
          </div>
        )}

        {(modalMode === 'new' || modalMode === 'edit') && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Placa</label>
              <input 
                required 
                value={formData.plate} 
                onChange={e => setFormData({...formData, plate: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
              <input 
                required 
                value={formData.model} 
                onChange={e => setFormData({...formData, model: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacidade (ton)</label>
              <input 
                type="number"
                required 
                value={formData.capacity} 
                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Ativo">Ativo</option>
                <option value="Manutenção">Manutenção</option>
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
