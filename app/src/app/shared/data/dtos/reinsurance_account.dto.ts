export interface ReinsuranceAccountDto {
  agencia: string;
  banco: string;
  codigo_tipo_conta: string;
  numero_conta_outra_instituicao_financeira: string;
  numero_digito_validador_conta_outra_instituicao_financeira: string;
  numero_unico_conta: string | null;
}
