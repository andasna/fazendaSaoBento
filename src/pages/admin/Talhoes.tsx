import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Map as MapIcon, ChevronRight } from "lucide-react";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { useGlobalFilters } from "@/src/contexts/GlobalFiltersContext";
import { MOCK_CROPS } from "@/src/lib/mock-data";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";

export function Talhoes() {
  const { talhoes, setTalhoes } = useGlobalFilters();
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
    const term = searchTerm.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(term);
    const matchesProperty = !filterValues.property || t.property === filterValues.property;
    const matchesCrop = !filterValues.crop || t.crop === filterValues.crop;
    const matchesStatus = !filterValues.status || t.status === filterValues.status;
    return matchesSearch && matchesProperty && matchesCrop && matchesStatus;
  });

  const uniqueProperties = Array.from(new Set(talhoes.map(t => t.property)));
  const uniqueCrops = Array.from(new Set(talhoes.map(t => t.crop)));
  const uniqueStatuses = Array.from(new Set(talhoes.map(t => t.status)));

  const totalArea = talhoes.reduce((acc, t) => acc + t.area, 0);

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

  const TalhaoForm = () => (
    <div className="space-y-4 pb-4">
      {modalMode === 'delete' ? (
        <div className="space-y-4">
          <p className="text-slate-700">Tem certeza que deseja excluir o talhão <strong>{selectedTalhao?.name}</strong>?</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} className="flex-1">Excluir</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="Ex: A1" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Área (ha)</label>
              <input type="number" step="0.01" required value={formData.area} onChange={e => setFormData({...formData, area: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Propriedade</label>
            <input required value={formData.property} onChange={e => setFormData({...formData, property: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="Ex: Fazenda São Bento" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cultura</label>
              <select required value={formData.crop} onChange={e => setFormData({...formData, crop: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                <option value="" disabled>Selecione...</option>
                {MOCK_CROPS.map(crop => <option key={crop.id} value={crop.name}>{crop.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          <div className="pt-2 flex gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapIcon className="h-6 w-6 text-emerald-600" />
            Gestão de Talhões
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as áreas de plantio da fazenda.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Novo Talhão
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Novo Talhão' : modalMode === 'edit' ? 'Editar Talhão' : 'Excluir Talhão'}
              </SheetTitle>
            </SheetHeader>
            <TalhaoForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1"><MapIcon className="h-3.5 w-3.5" /><span className="text-[10px] font-medium uppercase tracking-tight">Total</span></div>
          <p className="text-lg font-bold text-slate-900">{talhoes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm col-span-1">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1"><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Área Total</span></div>
          <p className="text-lg font-bold text-emerald-700">{totalArea.toLocaleString('pt-BR')} ha</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar talhão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 transition-colors ${
            Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <Filter className="h-4 w-4" />
        </button>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
             <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Novo Talhão' : modalMode === 'edit' ? 'Editar Talhão' : 'Excluir Talhão'}
              </SheetTitle>
            </SheetHeader>
            <TalhaoForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="sm:hidden">
        <MobileCardList>
          {filteredTalhoes.map(t => (
            <MobileCard
              key={t.id}
              title={t.name}
              subtitle={`${t.property} · ${t.crop}`}
              badge={{ label: t.status, variant: t.status === 'Ativo' ? 'emerald' : 'slate' }}
              value={`${t.area} ha`}
              valueColor="default"
              hideChevron
              actions={
                <ActionDropdown 
                  onEdit={() => openEdit(t)}
                  onDelete={() => openDelete(t)}
                />
              }
            />
          ))}
          {filteredTalhoes.length === 0 && <MobileCardEmpty icon={MapIcon} message="Nenhum talhão encontrado." />}
        </MobileCardList>
      </div>

      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-end gap-2">
           <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />Exportar
            </button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Propriedade</TableHead>
                <TableHead className="text-right">Área (ha)</TableHead>
                <TableHead>Cultura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTalhoes.map((talhao) => (
                <TableRow key={talhao.id}>
                  <TableCell className="font-medium text-slate-900">{talhao.name}</TableCell>
                  <TableCell className="text-slate-600">{talhao.property}</TableCell>
                  <TableCell className="text-right">{talhao.area.toLocaleString('pt-BR')} ha</TableCell>
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
              ))}
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
          { key: 'property', label: 'Propriedade', type: 'select', options: uniqueProperties as string[] },
          { key: 'crop', label: 'Cultura', type: 'select', options: uniqueCrops as string[] },
          { key: 'status', label: 'Status', type: 'select', options: uniqueStatuses as string[] }
        ]}
      />
    </div>
  );
}
