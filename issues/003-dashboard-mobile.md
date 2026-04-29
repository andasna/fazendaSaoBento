# Issue 003 — Dashboard Mobile

**Prioridade:** Alta
**Dependências:** 001, 002

## Descrição

Adaptar o `Dashboard.tsx` para mobile-first:
- KPIs em grid 2×2 em mobile (já existe, ajustar padding/espaçamento)
- Substituir tabelas "Próximas Atividades" e "Desempenho da Colheita" por listas de MobileCards
- Ajustar gráficos (recharts) para serem responsivos em tela pequena (h-[200px] no mobile)
- Remover `h1` redundante (o título já vem do Layout header)

## Arquivos

- [MODIFY] `src/pages/Dashboard.tsx`
