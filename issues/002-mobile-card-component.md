# Issue 002 — Componente MobileCard + BottomSheet de Formulários

**Prioridade:** Alta
**Dependências:** 001

## Descrição

Criar componentes reutilizáveis que substituem tabelas e modais:
- `MobileCard.tsx`: substitui rows de tabela, exibe info essencial, clicável
- `BottomSheet.tsx` (upgrade do `sheet.tsx`): componente padronizado para formulários de criação/edição no mobile
- Adaptar o `modal.tsx` para redirecionar para bottom sheet em viewports mobile

## Arquivos

- [NEW] `src/components/ui/mobile-card.tsx`
- [MODIFY] `src/components/ui/sheet.tsx` — melhorar animação, handle drag, max-height responsivo
- [MODIFY] `src/index.css` — adicionar `.mobile-card`, active states, touch feedback
