import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";
import { Modal } from "@/src/components/ui/modal";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { useGlobalFilters } from "@/src/contexts/GlobalFiltersContext";
import { MOCK_CROPS } from "@/src/lib/mock-data";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";

export function Talhoes() {
  const { talhoes, setTalhoes, safras } = useGlobalFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedTalhao, setSelectedTalhao] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', property: '', area: 0, crop: '', status: 'Ativo' });
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

  const filteredTalhoes = talhoes.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = !filterValues.property || t.property === filterValues.property;
    const matchesCrop = !filterValues.crop || t.crop === filterValues.crop;
    const matchesStatus = !filterValues.status || t.status === filterValues.status;
    return matchesSearch && matchesProperty && matchesCrop && matchesStatus;
  });

  const uniqueProperties = Array.from(new Set(talhoes.map(t => t.property)));
  const uniqueCrops = Array.from(new Set(talhoes.map(t => t.crop)));
  const uniqueStatuses = Array.from(new Set(talhoes.map(t => t.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', property: '', area: 0, crop: '', status: 'Ativo' });
    setIsModalOpen(true);
  };

  const openEdit = (talhao: any) => {
    setModalMode('edit');
    setSelectedTalhao(talhao);
    setFormData({ 
      name: talhao.name, 
      property: talhao.property, 
      area: talhao.area, 
      crop: talhao.crop,
      status: talhao.status
    });
    setIsModalOpen(true);
  };

  const openDelete = (talhao: any) => {
    setModalMode('delete');
    setSelectedTalhao(talhao);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setTalhoes(talhoes.filter(t => t.id !== selectedTalhao.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setTalhoes([...talhoes, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setTalhoes(talhoes.map(t => t.id === selectedTalhao.id ? { ...t, ...formData } : t));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Talhões</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as áreas de plantio da fazenda.</p>
        </div>
        <button 
          onClick={openNew}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Talhão
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar talhão..."
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
                <TableHead>Propriedade</TableHead>
                <TableHead className="text-right">Área (ha)</TableHead>
                <TableHead>Cultura Vinculada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTalhoes.map((talhao) => {
                return (
                  <TableRow key={talhao.id}>
                    <TableCell className="font-medium">{talhao.name}</TableCell>
                    <TableCell>{talhao.property}</TableCell>
                    <TableCell className="text-right">{talhao.area} ha</TableCell>
                    <TableCell>{talhao.crop}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        talhao.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {talhao.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionDropdown 
                        onEdit={() => openEdit(talhao)} 
                        onDelete={() => openDelete(talhao)} 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredTalhoes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Nenhum talhão encontrado.
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
        title="Filtrar Talhões"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'property',
            label: 'Propriedade',
            type: 'select',
            options: uniqueProperties
          },
          {
            key: 'crop',
            label: 'Cultura',
            type: 'select',
            options: uniqueCrops
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
          modalMode === 'new' ? 'Novo Talhão' : 
          modalMode === 'edit' ? 'Editar Talhão' : 'Excluir Talhão'
        }
      >
        {modalMode === 'delete' && (
          <div className="space-y-4">
            <p className="text-slate-700">Tem certeza que deseja excluir o talhão <strong>{selectedTalhao?.name}</strong>?</p>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>Excluir</Button>
            </div>
          </div>
        )}

        {(modalMode === 'new' || modalMode === 'edit') && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Talhão</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ex: Talhão A1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Propriedade</label>
                <input 
                  required 
                  value={formData.property} 
                  onChange={e => setFormData({...formData, property: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Ex: Fazenda São Bento"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Área (ha)</label>
                <input 
                  type="number"
                  step="0.01"
                  required 
                  value={formData.area} 
                  onChange={e => setFormData({...formData, area: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cultura Vinculada</label>
                <select 
                  required 
                  value={formData.crop} 
                  onChange={e => setFormData({...formData, crop: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                >
                  <option value="" disabled>Selecione uma cultura...</option>
                  {MOCK_CROPS.map(crop => (
                    <option key={crop.id} value={crop.name}>{crop.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
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
