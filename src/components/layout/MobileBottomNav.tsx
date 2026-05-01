import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wheat, Layers, DollarSign, Fuel } from "lucide-react";
import { cn } from "../../lib/utils";

const mainTabs = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Colheita', href: '/harvest', icon: Wheat },
  { name: 'Atividades', href: '/activities', icon: Layers },
  { name: 'Financeiro', href: '/financial', icon: DollarSign },
  { name: 'Diesel', href: '/fuel', icon: Fuel },
];

export function MobileBottomNav() {
  const location = useLocation();

  const isActiveTab = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center h-[4.5rem] px-2">
        {mainTabs.map((item) => {
          const isActive = isActiveTab(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1.5 relative transition-all active:scale-95",
                isActive ? "text-emerald-700" : "text-slate-400"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-emerald-500 rounded-b-full" />
              )}
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-600" : "")} />
              <span className="text-[10px] font-semibold leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
