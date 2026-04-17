// ============================================================
// Tipos e Interfaces Centralizadas — Fazenda São Bento
// ============================================================

// ─── Safra ───────────────────────────────────────────────────
export interface Safra {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Ativa' | 'Concluída' | 'Planejada';
}

// ─── Talhão ──────────────────────────────────────────────────
export interface Talhao {
  id: string;
  name: string;
  property: string;
  area: number;
  status: 'Ativo' | 'Inativo';
}

/** Relacionamento Talhão + Safra → Cultura */
export interface TalhaoSafra {
  id: string;
  talhaoId: string;
  safraId: string;
  cultura: string;
  areaPlanejada: number;
}

// ─── Cultura ─────────────────────────────────────────────────
export interface Crop {
  id: string;
  name: string;
  description: string;
  status: 'Ativa' | 'Inativa';
}

// ─── Máquina ─────────────────────────────────────────────────
export interface Machine {
  id: string;
  name: string;
  type: string;
  brand: string;
  year: number;
  status: 'Ativa' | 'Manutenção' | 'Inativa';
}

// ─── Caminhão ────────────────────────────────────────────────
export interface Truck {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  status: 'Ativo' | 'Manutenção' | 'Inativo';
}

// ─── Motorista ───────────────────────────────────────────────
export interface Driver {
  id: string;
  name: string;
  cnh: string;
  status: 'Ativo' | 'Férias' | 'Inativo';
}

// ─── Colheita (Resumo) ──────────────────────────────────────
/** Registro resumo de colheita — alimentado pelas viagens */
export interface HarvestSummary {
  id: string;
  date: string;
  safraId: string;
  talhaoId: string;
  cultura: string;
  area: number;
  /** Peso líquido total (soma das viagens), em kg */
  pesoLiquido: number;
  /** Caminhão principal associado */
  truckId: string;
  /** Motorista principal */
  driverId: string;
}

// ─── Colheita (Viagem Granular) ──────────────────────────────
/** Registro individual de viagem de colheita */
export interface HarvestTrip {
  id: string;
  /** ID do resumo associado */
  harvestId: string;
  date: string;
  /** Peso bruto (entrada), em kg */
  pesoBruto: number;
  /** Peso líquido (saída), em kg */
  pesoLiquido: number;
  /** Percentual de umidade */
  umidade: number;
  /** Percentual de impureza */
  impureza: number;
  /** Descontos aplicados, em kg */
  descontos: number;
  /** ID do caminhão */
  truckId: string;
  /** ID do motorista */
  driverId: string;
  /** Destino (silo/armazém) */
  destino: string;
  /** Frete (R$) */
  frete: number;
  /** Origem */
  origem: string;
}

// ─── Financeiro ──────────────────────────────────────────────
export type FinancialType =
  | 'maquina'
  | 'estoque'
  | 'colheita'
  | 'administrativo'
  | 'diesel'
  | 'outros';

export type FinancialStatus = 'aberto' | 'pago';
export type FinancialCategory = 'receita' | 'despesa';

export interface FinancialRecord {
  id: string;
  date: string;
  /** Loja/Fornecedor */
  fornecedor: string;
  /** Produto ou descrição */
  descricao: string;
  /** Categoria: receita ou despesa */
  categoria: FinancialCategory;
  /** Tipo de movimentação */
  tipo: FinancialType;
  /** Valor da parcela ou total */
  valor: number;
  banco: string;
  /** Data de vencimento */
  vencimento: string;
  status: FinancialStatus;
  /** Número da parcela (1 de N) */
  parcela: number;
  /** Total de parcelas */
  totalParcelas: number;
  /** ID de grupo de parcelamento (todas as parcelas compartilham) */
  parcelamentoGroupId: string;
  /** Referências cruzadas */
  machineId?: string;
  talhaoId?: string;
  activityId?: string;
  safraId?: string;
}

// ─── Atividade ───────────────────────────────────────────────
export type ActivityType = 'plantio' | 'pulverizacao' | 'colheita' | 'outros';

export interface ActivityProduct {
  /** ID do produto no estoque */
  stockItemId: string;
  /** Nome do produto (para exibição) */
  nome: string;
  /** Quantidade utilizada */
  quantidade: number;
  /** Unidade de medida */
  unidade: string;
}

export interface Activity {
  id: string;
  tipo: ActivityType;
  talhaoId: string;
  safraId: string;
  cultura: string;
  date: string;
  /** Produtos utilizados na atividade */
  produtos: ActivityProduct[];
  /** Custo total da atividade (soma dos produtos) */
  custoTotal: number;
  status: 'Agendada' | 'Em Andamento' | 'Concluída';
  observacao?: string;
}

// ─── Abastecimento (Diesel) ─────────────────────────────────
export interface FuelRecord {
  id: string;
  date: string;
  /** Nome ou ID do equipamento/máquina */
  equipment: string;
  machineId?: string;
  /** Funcionário que abasteceu */
  employee: string;
  liters: number;
  cost: number;
  /** Referência ao registro financeiro (se entrada) */
  financialRecordId?: string;
}

export interface FuelMovement {
  id: string;
  date: string;
  type: 'Entrada' | 'Saída';
  description: string;
  liters: number;
  value: number;
  /** Referência ao registro financeiro (se entrada) */
  financialRecordId?: string;
  /** Referência ao abastecimento (se saída) */
  fuelRecordId?: string;
}

// ─── Estoque de Insumos ─────────────────────────────────────
export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdate: string;
}

export interface StockMovement {
  id: string;
  stockId: string;
  date: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  document: string;
  user: string;
  destination?: string;
  /** Referência ao registro financeiro (se entrada) */
  financialRecordId?: string;
  /** Referência à atividade (se saída) */
  activityId?: string;
}

// ─── Dashboard / Produtividade ──────────────────────────────
export interface ProductionByTalhao {
  talhaoId: string;
  talhaoName: string;
  cultura: string;
  area: number;
  /** Total produzido em sacas */
  totalSacas: number;
  /** Produtividade: scs/ha */
  produtividade: number;
}

export interface ProductionByCultura {
  cultura: string;
  totalArea: number;
  totalSacas: number;
  produtividade: number;
}
