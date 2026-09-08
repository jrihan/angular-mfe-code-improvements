export interface EnderecoDadosCadastraisDto {
  proposito_endereco: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  pais: string;
}

export interface TelefoneDadosCadastraisDto {
  proposito_telefone: string;
  tipo_telefone: string;
  ddi: number;
  ddd: number;
  numero: number;
}

export interface EmailDadosCadastraisDto {
  proposito_email: string;
  departamento?: string;
  email?: string;
  nome_contato: string;
}

export interface DadosCadastraisDto {
  tipo_pessoa: string;
  nome_completo: string;
  nome_fantasia: string;
  tipo_documento: string;
  numero_documento: string;
  pais: string;
  enderecos: EnderecoDadosCadastraisDto[];
  telefones: TelefoneDadosCadastraisDto[];
  emails: EmailDadosCadastraisDto[];
}

export interface ContaDadosCadastraisDto {
  id_conta: string;
  codigo_empresa: string;
  codigo_banco: string;
  codigo_agencia: string;
  codigo_conta: string;
  dac: string;
  tipo_conta: string;
  numero_unico_cliente: string;
  segmento: string;
}

export interface BuscarDadosCadastraisResponseDto {
  id_cliente: string;
  situacao_cadastral: string;
  dados_cadastrais: DadosCadastraisDto;
  dados_conta: ContaDadosCadastraisDto[];
}
