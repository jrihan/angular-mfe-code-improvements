export interface CadastroCompanhiaResseguradaEntity {
  tipo_documento: string;
  tipo_pessoa: string;
  pais: string;
  numero_documento: string;
  codigo_susep: number;
  companhia_ressegurada: {
    codigo_companhia_ressegurada: number;
    codigo_centro_custo?: number;
  };
  dados_conta: {
    codigo_banco: string;
    codigo_agencia: string;
    codigo_tipo_conta: string;
    codigo_conta: string;
    dac: string;
  };
  dados_cadastrais: {
    nome_completo: string;
    nome_fantasia: string;
  };
}
