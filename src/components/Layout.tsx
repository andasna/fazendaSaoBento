import { Link, useLocation, useNavigate } from "react-router-dom";
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
  DollarSign,
  Layers,
  Wheat,
  Menu,
  ArrowLeft,
  X
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/src/lib/utils";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { MobileBottomNav } from "./layout/MobileBottomNav";
import { GlobalFiltersSheet } from "./layout/GlobalFiltersSheet";
import { motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Colheita', href: '/harvest', icon: Wheat },
  { name: 'Atividades', href: '/activities', icon: Layers },
  { name: 'Financeiro', href: '/financial', icon: DollarSign },
  { name: 'Diesel', href: '/fuel', icon: Fuel },
];

const adminNavigation = [
  { name: 'Estoque de Insumos', href: '/stock', icon: Package },
  { name: 'Máquinas', href: '/admin/machines', icon: Tractor },
  { name: 'Caminhões', href: '/admin/trucks', icon: Truck },
  { name: 'Safras', href: '/admin/safras', icon: CalendarDays },
  { name: 'Talhões', href: '/admin/talhoes', icon: Map },
  { name: 'Culturas', href: '/admin/crops', icon: Sprout },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Layout({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { safras, talhoesForSafra, selectedSafra, setSelectedSafra, selectedTalhao, setSelectedTalhao, getCulturaForTalhao } = useGlobalFilters();

  let currentPageName =
    navigation.find(n => n.href === location.pathname)?.name ||
    adminNavigation.find(n => n.href === location.pathname)?.name ||
    (location.pathname === '/profile' ? 'Perfil' : 'Fazenda São Bento');

  let contextualTitle = currentPageName;
  let isDetail = false;

  // Determinar se é tela de detalhe e ajustar o título
  if (location.pathname.startsWith('/harvest/') && location.pathname !== '/harvest') { contextualTitle = 'Colheita'; isDetail = true; }
  else if (location.pathname.startsWith('/activities/') && location.pathname !== '/activities') { contextualTitle = 'Atividades'; isDetail = true; }
  else if (location.pathname.startsWith('/financial/') && location.pathname !== '/financial') { contextualTitle = 'Financeiro'; isDetail = true; }
  else if (location.pathname.startsWith('/fuel/') && location.pathname !== '/fuel') { contextualTitle = 'Diesel'; isDetail = true; }
  else if (location.pathname.startsWith('/stock/') && location.pathname !== '/stock') { contextualTitle = 'Estoque de Insumos'; isDetail = true; }
  else if (location.pathname.startsWith('/admin/machines/') && location.pathname !== '/admin/machines') { contextualTitle = 'Máquinas'; isDetail = true; }
  else if (location.pathname.startsWith('/admin/trucks/') && location.pathname !== '/admin/trucks') { contextualTitle = 'Caminhões'; isDetail = true; }

  const renderNavLinks = (isMobileMenu = false) => {
    // No mobile, removemos as rotas que já estão na Bottom Nav (que são o navigation)
    // Mostramos apenas adminNavigation, ou tudo dependendo da escolha.
    // O requisito diz: "Esse menu deve conter todas as outras rotas/páginas que não estão na tab bar"
    const items = isMobileMenu ? adminNavigation : [...navigation, ...adminNavigation];

    return items.map((item) => {
      const isActive = location.pathname === item.href;
      return (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => isMobileMenu && setMobileMenuOpen(false)}
          title={!isMobileMenu && sidebarCollapsed ? item.name : undefined}
          className={cn(
            "group flex items-center py-2.5 text-[13px] font-medium rounded-xl transition-all relative",
            !isMobileMenu && sidebarCollapsed ? "justify-center px-0" : "px-3",
            isActive
              ? "bg-emerald-50/60 text-emerald-800 shadow-sm shadow-emerald-900/5"
              : "text-slate-500 hover:bg-slate-100/50 hover:text-emerald-700"
          )}
        >
          {isActive && (!sidebarCollapsed || isMobileMenu) && (
            <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-full" />
          )}
          <item.icon className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            (!sidebarCollapsed || isMobileMenu) && "mr-3",
            isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
          )} />
          {(!sidebarCollapsed || isMobileMenu) && <span>{item.name}</span>}
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background text-sm flex flex-col font-sans">
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[80vw] z-[70] bg-white sm:hidden flex flex-col shadow-2xl"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <div className="flex h-14 items-center justify-between px-4 border-b border-slate-100 shrink-0">
                <span className="text-base font-bold font-display text-emerald-900 truncate">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {renderNavLinks(true)}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">U</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">André Thomé</p>
                    <p className="text-[10px] text-slate-400 truncate">Admin</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden sm:fixed sm:inset-y-0 sm:left-0 sm:flex sm:flex-col transition-all duration-300 z-50",
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
          {/* Global Filters in Sidebar */}
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
            {!sidebarCollapsed && <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Menu</div>}
            {renderNavLinks(false)}
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
        "flex flex-col min-h-screen transition-all duration-300",
        // Mobile: padding bottom para o BottomNav
        "pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-0",
        sidebarCollapsed ? "sm:pl-16" : "sm:pl-64"
      )}>
        {/* Top header — mobile mostra Menu + Título + Filtros; desktop mostra breadcrumbs */}
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b border-slate-100/60 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          {/* Mobile: Hamburger/Back + título */}
          <div className="sm:hidden flex items-center gap-3 flex-1 min-w-0">
            {isDetail ? (
              <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-full active:scale-95 transition-all">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 -ml-1.5 text-slate-600 hover:bg-slate-100 rounded-full active:scale-95 transition-all">
                <Menu className="h-5 w-5" />
              </button>
            )}
            
            <h1 className="text-[15px] font-bold font-display text-slate-800 truncate leading-none pt-0.5">
              {contextualTitle}
            </h1>
          </div>

          {/* Desktop: título à esquerda */}
          <h1 className="hidden sm:block text-base font-bold font-display text-slate-800 flex-1">
            {contextualTitle}
          </h1>

          {/* Desktop: Breadcrumbs à direita */}
          <div className="hidden sm:flex items-center">
            <Breadcrumbs />
          </div>

          {/* Mobile: filtros globais à direita */}
          <GlobalFiltersSheet />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
