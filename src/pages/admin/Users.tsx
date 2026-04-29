import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Users as UsersIcon, Activity } from "lucide-react";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";

// Mock Data
const MOCK_USERS = [
  { id: "1", name: "João Silva", email: "joao@fazendasb.com.br", role: "Administrador", status: "Ativo" },
  { id: "2", name: "Maria Souza", email: "maria@fazendasb.com.br", role: "Operador", status: "Ativo" },
  { id: "3", name: "Carlos Oliveira", email: "carlos@fazendasb.com.br", role: "Motorista", status: "Inativo" },
];

export function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'Ativo' });
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

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(term) || 
                          u.email.toLowerCase().includes(term);
    const matchesRole = !filterValues.role || u.role === filterValues.role;
    const matchesStatus = !filterValues.status || u.status === filterValues.status;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const uniqueRoles = Array.from(new Set(users.map(u => u.role)));
  const uniqueStatuses = Array.from(new Set(users.map(u => u.status)));

  const activeUsers = users.filter(u => u.status === 'Ativo').length;

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', email: '', role: '', status: 'Ativo' });
    setIsModalOpen(true);
  };

  const openEdit = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status 
    });
    setIsModalOpen(true);
  };

  const openDelete = (user: any) => {
    setModalMode('delete');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setUsers([...users, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    }
    setIsModalOpen(false);
  };

  const UserForm = () => (
    <div className="space-y-4 pb-4">
      {modalMode === 'delete' ? (
        <div className="space-y-4">
          <p className="text-slate-700">Tem certeza que deseja excluir o usuário <strong>{selectedUser?.name}</strong>?</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} className="flex-1">Excluir</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome Completo</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="Ex: João Silva" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-mail</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="Ex: joao@fazendasb.com.br" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Função</label>
              <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                <option value="" disabled>Selecione...</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Operador">Operador</option>
                <option value="Motorista">Motorista</option>
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
            <UsersIcon className="h-6 w-6 text-emerald-600" />
            Gestão de Usuários
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os acessos e permissões do sistema.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Novo Usuário
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Novo Usuário' : modalMode === 'edit' ? 'Editar Usuário' : 'Excluir Usuário'}
              </SheetTitle>
            </SheetHeader>
            <UserForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1"><UsersIcon className="h-3.5 w-3.5" /><span className="text-[10px] font-medium uppercase tracking-tight">Total</span></div>
          <p className="text-lg font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm col-span-1">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1"><Activity className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Ativos</span></div>
          <p className="text-lg font-bold text-emerald-700">{activeUsers}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuário..."
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
                {modalMode === 'new' ? 'Novo Usuário' : modalMode === 'edit' ? 'Editar Usuário' : 'Excluir Usuário'}
              </SheetTitle>
            </SheetHeader>
            <UserForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="sm:hidden">
        <MobileCardList>
          {filteredUsers.map(u => (
            <MobileCard
              key={u.id}
              title={u.name}
              subtitle={`${u.role} · ${u.email}`}
              badge={{ label: u.status, variant: u.status === 'Ativo' ? 'emerald' : 'slate' }}
              hideChevron
              actions={
                <ActionDropdown 
                  onEdit={() => openEdit(u)}
                  onDelete={() => openDelete(u)}
                />
              }
            />
          ))}
          {filteredUsers.length === 0 && <MobileCardEmpty icon={UsersIcon} message="Nenhum usuário encontrado." />}
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
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown 
                      onEdit={() => openEdit(user)} 
                      onDelete={() => openDelete(user)} 
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
        title="Filtrar Usuários"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'role', label: 'Função', type: 'select', options: uniqueRoles as string[] },
          { key: 'status', label: 'Status', type: 'select', options: uniqueStatuses as string[] }
        ]}
      />
    </div>
  );
}
