import { FormikValues } from "formik";

export interface Model extends FormikValues {
  criadorId: string;
  id: string;
}

export interface User extends Model {
  nome: string;
  email: string;
  tipo: "ADMINISTRADOR" | "PREFEITURA" | "ORGANIZACAO" | "REPRESENTANTE";
}

export interface Driver extends Model {
  nome: string;
  cpf: string;
}

export interface Vehicle extends Model {
  modelo: string;
  placa: string;
}

export interface Donation extends Model {
  pesagem: number;
  tipologiaId: string;
  subtipologiaId: string;
  doadorId: string;
}

export interface Donator extends Model {
  nome: string;
  endereco: string;
  tipo: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  cadastroNacional: string;
}

export interface Collection extends Model {
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

export interface Typology extends Model {
  nome: string;
  valor: number;
  ativo: boolean;
}

export interface SubTypology extends Model {
  nome: string;
  valor: number;
  ativo: boolean;
  tipologiaId: string;
}

export interface Triage extends Model {
  data: Date;
  tipo: "TOTAL" | "PARCIAL";
  volumeTotal: number;
  volumeRejeito: number;
  tipoOrigem: "DOACAO" | "COLETA";
  tipoDestino: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface Pressing extends Model {
  data: Date;
  volumeTotal: number;
  tipoOrigem: "DOACAO" | "COLETA";
  tipoDestino: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface InputMaterial extends Model {
  quantidade: number;
  tipo: "DOACAO" | "COLETA";
  subtipologiaId: string;
}

export interface OutputMaterial extends Model {
  quantidade: number;
  notaFiscalId: string;
  subtipologiaId: string;
}

export interface Sale extends Model {
  comprador: string;
  data: Date;
  valor: number;
  notaFiscalId: string;
  mtrGeradorId: string;
  mtrTransportadorId: string;
  mtrDestinadorId: string;
}

export interface Media extends Model {
  dados: string;
}

export interface Document extends Model {
  nome: string;
  dataDocumento: Date;
  dataInsercao: Date;
  tipo: "NOTA_FISCAL" | "MTR_GERADOR" | "MTR_TRANSPORTADOR" | "MTR_DESTINADOR" | "DIARIO_COLETA";
  mediaId: string;
  coletasMTRGerador: string;
  coletasMTRDestinador: string;
  coletasMTRTransportador: string;
  coletasDiarioColota: string;
  materialSaida: string;
  notaFiscalVenda: string;
  mtrGeradorVenda: string;
  mtrTransportadorVenda: string;
  mtrDestinadorVenda: string;
}