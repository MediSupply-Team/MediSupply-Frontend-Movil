// infrastructure/interfaces/cliente.ts

export interface Cliente {
  id: string;
  nit: string;
  nombre: string;
  codigo_unico: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompraHistorica {
  id: string;
  fecha: string;
  total: number;
  productos: any[];
  estado: string;
}

export interface ProductoPreferido {
  producto_id: string;
  nombre: string;
  frecuencia: number;
  ultima_compra: string;
}

export interface Devolucion {
  id: string;
  fecha: string;
  motivo: string;
  valor: number;
  productos: any[];
}

export interface EstadisticasCliente {
  cliente_id: string;
  total_compras: number;
  total_productos_unicos: number;
  total_devoluciones: number;
  valor_total_compras: number;
  promedio_orden: number;
  frecuencia_compra_mensual: number;
  tasa_devolucion: number;
  cliente_desde: string | null;
  ultima_compra: string | null;
  updated_at: string | null;
}

export interface MetadatosConsulta {
  consulta_took_ms: number;
  fecha_consulta: string;
  limite_meses: number;
  vendedor_id: string;
  incluyo_devoluciones: boolean;
  cumple_sla: boolean;
  total_items: {
    compras: number;
    productos_preferidos: number;
    devoluciones: number;
  };
  advertencias_performance: string[];
}

export interface HistoricoCliente {
  cliente: Cliente;
  historico_compras: CompraHistorica[];
  productos_preferidos: ProductoPreferido[];
  devoluciones: Devolucion[];
  estadisticas: EstadisticasCliente;
  metadatos: MetadatosConsulta;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  sla_max_response_ms: number;
  database: string;
}

export interface MetricasServicio {
  service: string;
  version: string;
  timestamp: string;
  stats: {
    total_clientes: number;
    clientes_activos: number;
    clientes_inactivos: number;
    consultas_realizadas_hoy: number;
  };
  sla: {
    max_response_time_ms: number;
    description: string;
  };
}

export interface ParamsListarClientes {
  limite?: number;
  offset?: number;
  activos_solo?: boolean;
}

export interface ParamsBuscarCliente {
  q: string;
  vendedor_id: string;
}

export interface ParamsHistoricoCliente {
  vendedor_id: string;
}