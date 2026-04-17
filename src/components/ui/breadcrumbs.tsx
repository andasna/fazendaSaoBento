import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Mapa de rotas para breadcrumbs legíveis */
const ROUTE_LABELS: Record<string, string> = {
  '': 'Dashboard',
  'harvest': 'Colheita',
  'fuel': 'Controle de Diesel',
  'stock': 'Estoque de Insumos',
  'financial': 'Financeiro',
  'activities': 'Atividades',
  'admin': 'Administração',
  'safras': 'Safras',
  'talhoes': 'Talhões',
  'machines': 'Máquinas',
  'trucks': 'Caminhões',
  'crops': 'Culturas',
  'users': 'Usuários',
  'settings': 'Configurações',
  'profile': 'Perfil',
};

/**
 * Gera breadcrumbs automaticamente a partir do pathname.
 * Para rotas com IDs (ex: /harvest/h1), exibe "Detalhes" como último item.
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/' }];

  if (segments.length === 0) return crumbs;

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = ROUTE_LABELS[segment] || (
      // Se parece um ID (ex: h1, fin2a), exibe "Detalhes"
      /^[a-z0-9]+$/i.test(segment) && !ROUTE_LABELS[segment] ? 'Detalhes' : segment
    );

    crumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return crumbs;
}

export function Breadcrumbs() {
  const location = useLocation();
  const crumbs = generateBreadcrumbs(location.pathname);

  // Não renderiza breadcrumbs na Dashboard (é a raiz)
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const isFirst = index === 0;

        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400 flex-shrink-0" />}
            {isLast ? (
              <span className="font-medium text-slate-900 truncate max-w-[200px]">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.href || '/'}
                className="hover:text-emerald-600 transition-colors flex items-center gap-1 truncate max-w-[150px]"
              >
                {isFirst && <Home className="h-3.5 w-3.5 flex-shrink-0" />}
                <span className="hidden sm:inline">{crumb.label}</span>
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
