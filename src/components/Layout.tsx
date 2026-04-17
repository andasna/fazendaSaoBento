import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs } from "./ui/breadcrumbs";
import {
  LayoutDashboard,
  Truck,
  Tractor,
  Fuel,
  Settings,
  ChevronDown,
  CalendarDays,
  Map,
  Sprout,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  Plus,
  DollarSign,
  Layers,
  Wheat,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/src/lib/utils";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { MobileBottomNav } from "./layout/MobileBottomNav";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Colheita', href: '/harvest', icon: Wheat },
  { name: 'Atividades', href: '/activities', icon: Layers },
  { name: 'Financeiro', href: '/financial', icon: DollarSign },
  { name: 'Controle de Diesel', href: '/fuel', icon: Fuel },
  { name: 'Estoque de Insumos', href: '/stock', icon: Package },
];

const adminNavigation = [
  { name: 'Safras', href: '/admin/safras', icon: CalendarDays },
  { name: 'Talhões', href: '/admin/talhoes', icon: Map },
  { name: 'Máquinas', href: '/admin/machines', icon: Tractor },
  { name: 'Caminhões', href: '/admin/trucks', icon: Truck },
  { name: 'Culturas', href: '/admin/crops', icon: Sprout },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Layout({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { safras, talhoesForSafra, selectedSafra, setSelectedSafra, selectedTalhao, setSelectedTalhao, getCulturaForTalhao } = useGlobalFilters();

  return (
    <div className="min-h-screen bg-background text-sm flex flex-col font-sans">
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden sm:fixed sm:inset-y-0 sm:left-0 sm:flex sm:flex-col transition-all duration-300 z-50",
        // Fundo suave para integrar com o background do dashboard
        "bg-[#fcfdfb] border-r border-slate-200/60",
        sidebarCollapsed ? "sm:w-16" : "sm:w-64"
      )}>
        <div className="flex h-14 items-center justify-between px-4">
          {!sidebarCollapsed && (
            <span className="text-base font-bold font-display text-emerald-900 truncate">Fazenda São Bento</span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-emerald-700 p-1.5 rounded-xl hover:bg-emerald-50 transition-all ml-auto flex-shrink-0"
            title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden scrollbar-thin">
          {/* Global Filters in Sidebar - Styled like a subtle card */}
          {!sidebarCollapsed && (
            <div className="space-y-4 px-1">
              <div className="bg-white/50 border border-slate-100 rounded-2xl p-3 space-y-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Safra</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50/50 hover:bg-white border border-slate-100 text-slate-700 py-1.5 pl-3 pr-8 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={selectedSafra?.id || ''}
                      onChange={(e) => {
                        const safra = safras.find(s => s.id === e.target.value) || null;
                        setSelectedSafra(safra);
                      }}
                    >
                      <option value="">Todas as Safras</option>
                      {safras.map(safra => (
                        <option key={safra.id} value={safra.id}>{safra.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Talhão</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-50/50 hover:bg-white border border-slate-100 text-slate-700 py-1.5 pl-3 pr-8 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      value={selectedTalhao?.id || ''}
                      onChange={(e) => {
                        const talhao = talhoesForSafra.find(t => t.id === e.target.value) || null;
                        setSelectedTalhao(talhao);
                      }}
                    >
                      <option value="">Todos os Talhões</option>
                      {talhoesForSafra.map(talhao => {
                        const cultura = getCulturaForTalhao(talhao.id);
                        return (
                          <option key={talhao.id} value={talhao.id}>
                            {talhao.name} — {talhao.property}{cultura ? ` (${cultura})` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {!sidebarCollapsed && <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Operacional</div>}
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    "group flex items-center py-2.5 text-[13px] font-medium rounded-xl transition-all relative",
                    sidebarCollapsed ? "justify-center px-0" : "px-3",
                    isActive
                      ? "bg-emerald-50/60 text-emerald-800 shadow-sm shadow-emerald-900/5"
                      : "text-slate-500 hover:bg-slate-100/50 hover:text-emerald-700"
                  )}
                >
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-full" />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors", 
                    !sidebarCollapsed && "mr-3", 
                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                  )} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            {!sidebarCollapsed && <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Administração</div>}
            {adminNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    "group flex items-center py-2.5 text-[13px] font-medium rounded-xl transition-all relative",
                    sidebarCollapsed ? "justify-center px-0" : "px-3",
                    isActive
                      ? "bg-emerald-50/60 text-emerald-800 shadow-sm shadow-emerald-900/5"
                      : "text-slate-500 hover:bg-slate-100/50 hover:text-emerald-700"
                  )}
                >
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-full" />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors", 
                    !sidebarCollapsed && "mr-3", 
                    isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                  )} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto w-full p-4 border-t border-slate-100 bg-[#f8faf7]/50">
          <Link
            to="/profile"
            title={sidebarCollapsed ? "Perfil" : undefined}
            className={cn(
              "flex items-center rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100",
              sidebarCollapsed ? "justify-center py-2" : "px-3 py-2 gap-3"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0 shadow-inner">
              U
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">André Thomé</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">Administrador</p>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-0",
        sidebarCollapsed ? "sm:pl-16" : "sm:pl-64"
      )}>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-center sm:justify-between border-b border-slate-100/60 bg-white/70 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="sm:hidden absolute left-4 text-emerald-700 font-display font-bold">
            FSB
          </div>
          <h1 className="text-base font-bold font-display text-slate-800 text-center sm:text-left">
            {navigation.find(n => n.href === location.pathname)?.name ||
              adminNavigation.find(n => n.href === location.pathname)?.name ||
              (location.pathname === '/profile' ? 'Perfil do Usuário' : 'Fazenda São Bento')}
          </h1>
          <div className="hidden sm:flex items-center">
            <Breadcrumbs />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Global FAB */}
      <div className="sm:hidden fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40">
        <button
          className="w-14 h-14 bg-emerald-600 rounded-full shadow-lg shadow-emerald-900/20 flex items-center justify-center text-white hover:bg-emerald-500 transition-all active:scale-95"
          onClick={() => { }}
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
