# Issue 005 — Páginas de Detalhe Mobile (*Detail.tsx)

**Prioridade:** Média
**Dependências:** 001, 002

## Descrição

Converter todas as páginas de detalhe para usar o padrão mobile nativo:
- Usar MobileHeader (com botão voltar + título da entidade) no topo
- Substituir tabelas de sub-items por MobileCards
- Info cards em grid 2×2 (já parcialmente feito, ajustar espaçamento)
- Remover breadcrumbs dessas páginas (já ocultos no mobile)

## Arquivos

- [MODIFY] `src/pages/ActivityDetail.tsx`
- [MODIFY] `src/pages/HarvestDetail.tsx`
- [MODIFY] `src/pages/FinancialDetail.tsx`
- [MODIFY] `src/pages/StockDetail.tsx`
- [MODIFY] `src/pages/FuelDetail.tsx`
- [MODIFY] `src/pages/MachineDetail.tsx`
- [MODIFY] `src/pages/TruckDetail.tsx`
