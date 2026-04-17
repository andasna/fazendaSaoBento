import type {
  Crop,
  Machine,
  Truck,
  Driver,
  HarvestSummary,
  HarvestTrip,
  FuelRecord,
  FuelMovement,
  FinancialRecord,
  Activity,
  StockItem,
  StockMovement,
  TalhaoSafra,
} from './types';

// ─── Culturas ────────────────────────────────────────────────
export const MOCK_CROPS: Crop[] = [
  { id: "1", name: "Soja", description: "Soja convencional e transgênica", status: "Ativa" },
  { id: "2", name: "Milho", description: "Milho safrinha", status: "Ativa" },
  { id: "3", name: "Trigo", description: "Trigo de inverno", status: "Inativa" },
];

// ─── Máquinas ────────────────────────────────────────────────
export const MOCK_MACHINES: Machine[] = [
  { id: '1', name: 'Colheitadeira S700', type: 'Colheitadeira', brand: 'John Deere', year: 2022, status: 'Ativa' },
  { id: '2', name: 'Trator Magnum 340', type: 'Trator', brand: 'Case IH', year: 2021, status: 'Ativa' },
  { id: '3', name: 'Pulverizador Patriot', type: 'Pulverizador', brand: 'Case IH', year: 2020, status: 'Manutenção' },
];

// ─── Caminhões ───────────────────────────────────────────────
export const MOCK_TRUCKS: Truck[] = [
  { id: '1', plate: 'ABC-1234', model: 'Volvo FH 540', capacity: 35, status: 'Ativo' },
  { id: '2', plate: 'DEF-5678', model: 'Scania R450', capacity: 30, status: 'Manutenção' },
  { id: '3', plate: 'GHI-9012', model: 'Mercedes Actros', capacity: 40, status: 'Ativo' },
];

// ─── Motoristas ──────────────────────────────────────────────
export const MOCK_DRIVERS: Driver[] = [
  { id: '1', name: 'João Silva', cnh: '123456789', status: 'Ativo' },
  { id: '2', name: 'Pedro Santos', cnh: '987654321', status: 'Ativo' },
  { id: '3', name: 'Carlos Oliveira', cnh: '456123789', status: 'Férias' },
];

// ─── Talhão + Safra → Cultura ────────────────────────────────
export const MOCK_TALHAO_SAFRA: TalhaoSafra[] = [
  { id: 'ts1', talhaoId: 't1', safraId: '1', cultura: 'Soja', areaPlanejada: 150 },
  { id: 'ts2', talhaoId: 't2', safraId: '1', cultura: 'Milho', areaPlanejada: 200 },
  { id: 'ts3', talhaoId: 't3', safraId: '1', cultura: 'Soja', areaPlanejada: 100 },
  { id: 'ts4', talhaoId: 't1', safraId: '2', cultura: 'Milho Safrinha', areaPlanejada: 150 },
  { id: 'ts5', talhaoId: 't2', safraId: '2', cultura: 'Soja', areaPlanejada: 200 },
  { id: 'ts6', talhaoId: 't1', safraId: '3', cultura: 'Soja', areaPlanejada: 150 },
  { id: 'ts7', talhaoId: 't3', safraId: '3', cultura: 'Trigo', areaPlanejada: 100 },
];

// ─── Colheita (Resumo) ──────────────────────────────────────
export const MOCK_HARVESTS: HarvestSummary[] = [
  { id: 'h1', date: '2026-03-18T08:00:00Z', safraId: '1', talhaoId: 't1', cultura: 'Soja', area: 20, pesoLiquido: 72000, truckId: '1', driverId: '1' },
  { id: 'h2', date: '2026-03-18T10:30:00Z', safraId: '1', talhaoId: 't2', cultura: 'Milho', area: 15, pesoLiquido: 48000, truckId: '2', driverId: '2' },
  { id: 'h3', date: '2026-03-17T14:15:00Z', safraId: '1', talhaoId: 't3', cultura: 'Soja', area: 19, pesoLiquido: 69000, truckId: '3', driverId: '1' },
  { id: 'h4', date: '2026-03-20T07:00:00Z', safraId: '1', talhaoId: 't1', cultura: 'Soja', area: 25, pesoLiquido: 90000, truckId: '1', driverId: '2' },
  { id: 'h5', date: '2026-03-22T09:00:00Z', safraId: '1', talhaoId: 't2', cultura: 'Milho', area: 18, pesoLiquido: 54000, truckId: '3', driverId: '3' },
];

// ─── Colheita (Viagens Granulares) ───────────────────────────
export const MOCK_HARVEST_TRIPS: HarvestTrip[] = [
  // Viagens do resumo h1
  { id: 'ht1', harvestId: 'h1', date: '2026-03-18T08:00:00Z', pesoBruto: 38500, pesoLiquido: 36000, umidade: 14.2, impureza: 1.5, descontos: 2500, truckId: '1', driverId: '1', destino: 'Silo Central', frete: 1500, origem: 'Fazenda São Bento (A1)' },
  { id: 'ht2', harvestId: 'h1', date: '2026-03-18T11:30:00Z', pesoBruto: 38000, pesoLiquido: 36000, umidade: 13.8, impureza: 1.2, descontos: 2000, truckId: '1', driverId: '1', destino: 'Silo Central', frete: 1500, origem: 'Fazenda São Bento (A1)' },
  // Viagens do resumo h2
  { id: 'ht3', harvestId: 'h2', date: '2026-03-18T10:30:00Z', pesoBruto: 26000, pesoLiquido: 24000, umidade: 15.0, impureza: 2.0, descontos: 2000, truckId: '2', driverId: '2', destino: 'Cooperativa', frete: 800, origem: 'Fazenda São Bento (A2)' },
  { id: 'ht4', harvestId: 'h2', date: '2026-03-18T14:00:00Z', pesoBruto: 25500, pesoLiquido: 24000, umidade: 14.5, impureza: 1.8, descontos: 1500, truckId: '2', driverId: '2', destino: 'Cooperativa', frete: 800, origem: 'Fazenda São Bento (A2)' },
  // Viagens do resumo h3
  { id: 'ht5', harvestId: 'h3', date: '2026-03-17T14:15:00Z', pesoBruto: 36000, pesoLiquido: 34500, umidade: 13.5, impureza: 1.0, descontos: 1500, truckId: '3', driverId: '1', destino: 'Porto de Paranaguá', frete: 3200, origem: 'Fazenda Boa Vista (B1)' },
  { id: 'ht6', harvestId: 'h3', date: '2026-03-17T17:30:00Z', pesoBruto: 36500, pesoLiquido: 34500, umidade: 13.8, impureza: 1.3, descontos: 2000, truckId: '3', driverId: '1', destino: 'Porto de Paranaguá', frete: 3200, origem: 'Fazenda Boa Vista (B1)' },
  // Viagens do resumo h4
  { id: 'ht7', harvestId: 'h4', date: '2026-03-20T07:00:00Z', pesoBruto: 32000, pesoLiquido: 30000, umidade: 14.0, impureza: 1.6, descontos: 2000, truckId: '1', driverId: '2', destino: 'Silo Central', frete: 1500, origem: 'Fazenda São Bento (A1)' },
  { id: 'ht8', harvestId: 'h4', date: '2026-03-20T10:30:00Z', pesoBruto: 32000, pesoLiquido: 30000, umidade: 13.9, impureza: 1.4, descontos: 2000, truckId: '1', driverId: '2', destino: 'Silo Central', frete: 1500, origem: 'Fazenda São Bento (A1)' },
  { id: 'ht9', harvestId: 'h4', date: '2026-03-20T14:00:00Z', pesoBruto: 32000, pesoLiquido: 30000, umidade: 14.1, impureza: 1.5, descontos: 2000, truckId: '1', driverId: '2', destino: 'Silo Central', frete: 1500, origem: 'Fazenda São Bento (A1)' },
  // Viagens do resumo h5
  { id: 'ht10', harvestId: 'h5', date: '2026-03-22T09:00:00Z', pesoBruto: 29000, pesoLiquido: 27000, umidade: 15.5, impureza: 2.2, descontos: 2000, truckId: '3', driverId: '3', destino: 'Cooperativa', frete: 800, origem: 'Fazenda São Bento (A2)' },
  { id: 'ht11', harvestId: 'h5', date: '2026-03-22T12:30:00Z', pesoBruto: 29000, pesoLiquido: 27000, umidade: 15.2, impureza: 2.0, descontos: 2000, truckId: '3', driverId: '3', destino: 'Cooperativa', frete: 800, origem: 'Fazenda São Bento (A2)' },
];

// ─── Abastecimento (Diesel) ─────────────────────────────────
export const MOCK_FUEL: FuelRecord[] = [
  { id: '1', date: '2026-03-18T07:30:00Z', equipment: 'Trator Magnum 340', machineId: '2', employee: 'João Silva', liters: 150, cost: 750 },
  { id: '2', date: '2026-03-18T09:45:00Z', equipment: 'Colheitadeira S700', machineId: '1', employee: 'Pedro Santos', liters: 300, cost: 1500 },
  { id: '3', date: '2026-03-17T16:20:00Z', equipment: 'Pulverizador Patriot', machineId: '3', employee: 'Carlos Oliveira', liters: 200, cost: 1000 },
];

// ─── Movimentações de Diesel ─────────────────────────────────
export const MOCK_MOVEMENTS: FuelMovement[] = [
  { id: '1', date: '2026-03-18T08:00:00Z', type: 'Entrada', description: 'Compra de Diesel S10', liters: 5000, value: 25000, financialRecordId: 'fin4' },
  { id: '2', date: '2026-03-18T09:00:00Z', type: 'Saída', description: 'Abastecimento Trator JD', liters: 200, value: 0, fuelRecordId: '1' },
  { id: '3', date: '2026-03-18T11:00:00Z', type: 'Entrada', description: 'Compra de Diesel S500', liters: 3000, value: 14000, financialRecordId: 'fin5' },
];

// ─── Financeiro ──────────────────────────────────────────────
export const MOCK_FINANCIAL: FinancialRecord[] = [
  // Receita de venda de soja
  { id: 'fin1', date: '2026-03-20', fornecedor: 'Cooperativa Agroindustrial', descricao: 'Venda de Soja — Safra 25/26', categoria: 'receita', tipo: 'colheita', valor: 180000, banco: 'Banco do Brasil', vencimento: '2026-04-20', status: 'aberto', parcela: 1, totalParcelas: 1, parcelamentoGroupId: 'pg1', safraId: '1' },
  // Despesa de fertilizante (parcelado em 3x)
  { id: 'fin2a', date: '2026-02-10', fornecedor: 'AgroShop', descricao: 'Fertilizante NPK 10-10-10', categoria: 'despesa', tipo: 'estoque', valor: 8000, banco: 'Sicredi', vencimento: '2026-03-10', status: 'pago', parcela: 1, totalParcelas: 3, parcelamentoGroupId: 'pg2', safraId: '1' },
  { id: 'fin2b', date: '2026-02-10', fornecedor: 'AgroShop', descricao: 'Fertilizante NPK 10-10-10', categoria: 'despesa', tipo: 'estoque', valor: 8000, banco: 'Sicredi', vencimento: '2026-04-10', status: 'aberto', parcela: 2, totalParcelas: 3, parcelamentoGroupId: 'pg2', safraId: '1' },
  { id: 'fin2c', date: '2026-02-10', fornecedor: 'AgroShop', descricao: 'Fertilizante NPK 10-10-10', categoria: 'despesa', tipo: 'estoque', valor: 8000, banco: 'Sicredi', vencimento: '2026-05-10', status: 'aberto', parcela: 3, totalParcelas: 3, parcelamentoGroupId: 'pg2', safraId: '1' },
  // Despesa de manutenção de máquina
  { id: 'fin3', date: '2026-03-05', fornecedor: 'Oficina Mecânica Rural', descricao: 'Manutenção preventiva — Pulverizador Patriot', categoria: 'despesa', tipo: 'maquina', valor: 4500, banco: 'Banco do Brasil', vencimento: '2026-03-15', status: 'pago', parcela: 1, totalParcelas: 1, parcelamentoGroupId: 'pg3', machineId: '3', safraId: '1' },
  // Diesel
  { id: 'fin4', date: '2026-03-18', fornecedor: 'Posto Rural', descricao: 'Diesel S10 — 5.000L', categoria: 'despesa', tipo: 'diesel', valor: 25000, banco: 'Sicredi', vencimento: '2026-04-18', status: 'aberto', parcela: 1, totalParcelas: 1, parcelamentoGroupId: 'pg4', safraId: '1' },
  { id: 'fin5', date: '2026-03-18', fornecedor: 'Posto Rural', descricao: 'Diesel S500 — 3.000L', categoria: 'despesa', tipo: 'diesel', valor: 14000, banco: 'Sicredi', vencimento: '2026-04-18', status: 'aberto', parcela: 1, totalParcelas: 1, parcelamentoGroupId: 'pg5', safraId: '1' },
  // Despesa administrativa
  { id: 'fin6', date: '2026-03-01', fornecedor: 'Contabilidade Silva', descricao: 'Honorários contábeis — Março/2026', categoria: 'despesa', tipo: 'administrativo', valor: 2500, banco: 'Banco do Brasil', vencimento: '2026-03-15', status: 'pago', parcela: 1, totalParcelas: 1, parcelamentoGroupId: 'pg6', safraId: '1' },
];

// ─── Atividades ──────────────────────────────────────────────
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    tipo: 'plantio',
    talhaoId: 't1',
    safraId: '1',
    cultura: 'Soja',
    date: '2025-10-15T08:00:00Z',
    produtos: [
      { stockItemId: '1', nome: 'Semente de Soja XPTO', quantidade: 2000, unidade: 'kg' },
      { stockItemId: '2', nome: 'Fertilizante NPK 10-10-10', quantidade: 3000, unidade: 'kg' },
    ],
    custoTotal: 15000,
    status: 'Concluída',
  },
  {
    id: 'act2',
    tipo: 'pulverizacao',
    talhaoId: 't1',
    safraId: '1',
    cultura: 'Soja',
    date: '2025-12-10T06:30:00Z',
    produtos: [
      { stockItemId: '3', nome: 'Herbicida Glifosato', quantidade: 300, unidade: 'L' },
    ],
    custoTotal: 4500,
    status: 'Concluída',
  },
  {
    id: 'act3',
    tipo: 'plantio',
    talhaoId: 't2',
    safraId: '1',
    cultura: 'Milho',
    date: '2025-10-20T07:00:00Z',
    produtos: [
      { stockItemId: '2', nome: 'Fertilizante NPK 10-10-10', quantidade: 4000, unidade: 'kg' },
    ],
    custoTotal: 12000,
    status: 'Concluída',
  },
  {
    id: 'act4',
    tipo: 'colheita',
    talhaoId: 't1',
    safraId: '1',
    cultura: 'Soja',
    date: '2026-03-18T08:00:00Z',
    produtos: [],
    custoTotal: 0,
    status: 'Concluída',
    observacao: 'Colheita mecanizada — Colheitadeira S700',
  },
];

// ─── Estoque de Insumos ─────────────────────────────────────
export const MOCK_STOCK: StockItem[] = [
  { id: '1', name: 'Semente de Soja XPTO', category: 'Sementes', quantity: 5000, unit: 'kg', lastUpdate: '2023-10-25T14:30:00Z' },
  { id: '2', name: 'Fertilizante NPK 10-10-10', category: 'Fertilizantes', quantity: 12000, unit: 'kg', lastUpdate: '2023-10-24T09:15:00Z' },
  { id: '3', name: 'Herbicida Glifosato', category: 'Defensivos', quantity: 800, unit: 'L', lastUpdate: '2023-10-26T11:20:00Z' },
  { id: '4', name: 'Óleo Lubrificante 15W40', category: 'Manutenção', quantity: 200, unit: 'L', lastUpdate: '2023-10-20T16:45:00Z' },
];

export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  { id: '1', stockId: '1', date: '2023-10-25T14:30:00Z', type: 'Entrada', quantity: 2000, document: 'NF 12345', user: 'João Silva', financialRecordId: 'fin2a' },
  { id: '2', stockId: '1', date: '2023-10-20T08:00:00Z', type: 'Saída', quantity: 500, document: 'Atividade: Plantio A1', user: 'Maria Souza', destination: 'Talhão A1', activityId: 'act1' },
  { id: '3', stockId: '3', date: '2023-10-26T11:20:00Z', type: 'Saída', quantity: 300, document: 'Atividade: Pulverização A1', user: 'Carlos Oliveira', destination: 'Talhão A1', activityId: 'act2' },
];
