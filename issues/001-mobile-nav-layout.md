# Issue 001 — Navegação Mobile: Layout Base + BottomTabBar

**Prioridade:** Alta (fundação para todas as outras issues)
**Dependências:** nenhuma

## Descrição

Refatorar o `Layout.tsx` e `MobileBottomNav.tsx` para criar a base da navegação mobile-first:
- Tornar o `MobileBottomNav` mais nativo (safe area, active indicators, animações)
- Adicionar filtros globais (Safra/Talhão) acessíveis via bottom sheet no mobile
- Criar componente `MobileHeader.tsx` reutilizável (título da tela)
- Ajustar o `Layout.tsx` para posicionar corretamente os elementos mobile vs desktop
- Garantir safe-area em toda a navegação inferior

## Arquivos

- [MODIFY] `src/components/Layout.tsx` — remover FAB sem lógica; mover filtros globais para bottom sheet mobile
- [MODIFY] `src/components/layout/MobileBottomNav.tsx` — melhorar visual, active state, safe area
- [NEW] `src/components/layout/MobileHeader.tsx` — header reutilizável para telas de detalhe
- [NEW] `src/components/layout/GlobalFiltersSheet.tsx` — bottom sheet com filtros safra/talhão para mobile
- [MODIFY] `src/index.css` — adicionar utilitários safe-area adicionais
