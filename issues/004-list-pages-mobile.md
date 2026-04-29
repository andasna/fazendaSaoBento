# Issue 004 — Páginas de Lista Mobile (Harvest, Activities, Financial, Stock)

**Prioridade:** Alta
**Dependências:** 001, 002

## Descrição

Converter todas as páginas de lista que usam tabelas em layouts mobile-first com MobileCards:
- Tabelas → MobileCard list (cards clicáveis com info essencial)
- Header de página com busca e filtro em linha para mobile
- Botão "Nova Atividade" → conectar ao FAB global do Layout
- Substituir `<Modal>` por `<Sheet side="bottom">` em todas essas páginas no mobile
- Manter tabela no desktop (sm:)

## Arquivos

- [MODIFY] `src/pages/Activities.tsx`
- [MODIFY] `src/pages/Harvest.tsx`
- [MODIFY] `src/pages/Financial.tsx`
- [MODIFY] `src/pages/Stock.tsx`
- [MODIFY] `src/pages/Fuel.tsx`
