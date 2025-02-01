export interface User {
  criadorId: string;
  id: string;
  nome: string;
  email: string;
  tipo: "ADMINISTRADOR" | "PREFEITURA" | "ORGANIZACAO" | "REPRESENTANTE";
}

export interface Driver {
  criadorId: string;
  id: string;
  nome: string;
  cpf: string;
}

export interface Vehicle {
  criadorId: string;
  id: string;
  modelo: string;
  placa: string;
}

export interface Donation {
  criadorId: string;
  id: string;
  pesagem: number;
  tipologiaId: string;
  subtipologiaId: string;
  doadorId: string;
}

export interface Donator {
  criadorId: string;
  id: string;
  nome: string;
  endereco: string;
  tipo: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  cadastroNacional: string;
}

export interface Collection {
  criadorId: string;
  id: string;
  dataRealizacao: Date;
  dataChegada: Date;
  dataSaida: Date;
  pesagem: number;
  quilometragem: number;
  ativo: boolean;
  veiculoId: string;
  motoristaId: string;
  mtrGeradorId: string;
  mtrDestinadorId: string;
  mtrTransportadorId: string;
  diarioColetaId: string;
}

export interface Typology {
  criadorId: string;
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
}

export interface SubTypology {
  criadorId: string;
  id: string;
  nome: string;
  valor: number;
  ativo: boolean;
  tipologiaId: string;
}

export interface Triage {
  criadorId: string;
  id: string;
  data: Date;
  tipo: "TOTAL" | "PARCIAL";
  volumeTotal: number;
  volumeRejeito: number;
  tipoOrigem: "DOACAO" | "COLETA";
  tipoDestino: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface Pressing {
  criadorId: string;
  id: string;
  data: Date;
  volumeTotal: number;
  tipoOrigem: "DOACAO" | "COLETA";
  tipoDestino: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface InputMaterial {
  criadorId: string;
  id: string;
  quantidade: number;
  tipo: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface OutputMaterial {
  criadorId: string;
  id: string;
  quantidade: number;
  notaFiscalId: string;
  subtipologiaId: string;
}

export interface Sale {
  criadorId: string;
  id: string;
  comprador: string;
  data: Date;
  valor: number;
  notaFiscalId: string;
  mtrGeradorId: string;
  mtrTransportadorId: string;
  mtrDestinadorId: string;
}