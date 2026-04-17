import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Modal } from "@/src/components/ui/modal";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { MOCK_CROPS } from "@/src/lib/mock-data";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";

export function Crops() {
  const [crops, setCrops] = useState(MOCK_CROPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Ativa' });

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterValues.status || c.status === filterValues.status;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(crops.map(c => c.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', description: '', status: 'Ativa' });
    setIsModalOpen(true);
  };

  const openEdit = (crop: any) => {
    setModalMode('edit');
    setSelectedCrop(crop);
    setFormData({ 
      name: crop.name, 
      description: crop.description, 
      status: crop.status 
    });
    setIsModalOpen(true);
  };

  const openDelete = (crop: any) => {
    setModalMode('delete');
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setCrops(crops.filter(c => c.id !== selectedCrop.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setCrops([...crops, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setCrops(crops.map(c => c.id === selectedCrop.id ? { ...c, ...formData } : c));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Culturas</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as culturas plantadas na fazenda.</p>
        </div>
        <button 
          onClick={openNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Cultura
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cultura..."
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>{crop.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      crop.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {crop.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown 
                      onEdit={() => openEdit(crop)} 
                      onDelete={() => openDelete(crop)} 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredCrops.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhuma cultura encontrada.
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
        title="Filtrar Culturas"
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
          modalMode === 'new' ? 'Nova Cultura' : 
          modalMode === 'edit' ? 'Editar Cultura' : 'Excluir Cultura'
        }
      >
        {modalMode === 'delete' && (
          <div className="space-y-4">
            <p className="text-slate-700">Tem certeza que deseja excluir a cultura <strong>{selectedCrop?.name}</strong>?</p>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>Excluir</Button>
            </div>
          </div>
        )}

        {(modalMode === 'new' || modalMode === 'edit') && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ex: Soja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ex: Soja convencional e transgênica"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
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
