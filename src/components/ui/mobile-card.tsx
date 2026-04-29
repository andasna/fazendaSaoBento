import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export type BadgeVariant = "emerald" | "blue" | "amber" | "red" | "slate" | "indigo";

const badgeColors: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-red-600 border-red-100",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export interface MobileCardBadge {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ElementType;
}

export interface MobileCardProps {
  key?: React.Key;
  /** Linha principal — ex: nome do produto, tipo de atividade */
  title: string;
  /** Linha secundária — ex: talhão, data, motorista */
  subtitle?: string;
  /** Terceira linha — detalhe adicional */
  detail?: string;
  /** Badge de status */
  badge?: MobileCardBadge;
  /** Valor numérico destacado (canto direito) */
  value?: string;
  /** Cor do valor */
  valueColor?: "default" | "emerald" | "red" | "blue";
  /** Ícone à esquerda */
  icon?: React.ElementType;
  /** Cor do ícone */
  iconColor?: string;
  /** Ação ao clicar — torna o card navegável */
  onClick?: () => void;
  /** Ocultar chevron mesmo com onClick */
  hideChevron?: boolean;
  /** Componentes de ação adicionais (ex: ActionDropdown) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * MobileCard — substitui linhas de tabela em viewport mobile.
 * No desktop as páginas mantêm a tabela normal.
 */
export function MobileCard({
  title,
  subtitle,
  detail,
  badge,
  value,
  valueColor = "default",
  icon: Icon,
  iconColor = "text-slate-400",
  onClick,
  hideChevron = false,
  actions,
  className,
}: MobileCardProps) {
  const valueColorClass = {
    default: "text-slate-800",
    emerald: "text-emerald-700",
    red: "text-red-600",
    blue: "text-blue-700",
  }[valueColor];

  const BadgeIcon = badge?.icon;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 min-h-[64px] bg-white transition-colors",
        onClick && "cursor-pointer active:bg-slate-50 hover:bg-slate-50/80",
        className
      )}
    >
      {/* Ícone opcional */}
      {Icon && (
        <div className={cn("flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-900 truncate">{title}</span>
          {badge && (
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
              badgeColors[badge.variant ?? "slate"]
            )}>
              {BadgeIcon && <BadgeIcon className="h-2.5 w-2.5" />}
              {badge.label}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
        )}
        {detail && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{detail}</p>
        )}
      </div>

      {/* Valor + Chevron + Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {value && (
          <span className={cn("text-sm font-bold", valueColorClass)}>{value}</span>
        )}
        {actions && (
          <div className="ml-1 flex items-center" onClick={e => e.stopPropagation()}>
            {actions}
          </div>
        )}
        {onClick && !hideChevron && (
          <ChevronRight className="h-4 w-4 text-slate-300" />
        )}
      </div>
    </div>
  );
}

/**
 * MobileCardList — wrapper que aplica o estilo de lista com divisores.
 * Substitui a estrutura `<div className="overflow-x-auto"><Table>...` no mobile.
 */
export function MobileCardList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mobile-list", className)}>
      {children}
    </div>
  );
}

/**
 * MobileCardEmpty — estado vazio para listas sem resultados.
 */
export function MobileCardEmpty({
  icon: Icon,
  message = "Nenhum item encontrado.",
}: {
  icon?: React.ElementType;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white">
      {Icon && <Icon className="h-10 w-10 text-slate-200 mb-3" />}
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}
