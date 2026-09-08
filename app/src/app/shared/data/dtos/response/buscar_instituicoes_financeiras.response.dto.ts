export interface InstituicoesFinanceirasDto {
  codigo: string;
  nome: string;
}

export interface BuscarInstituicoesFinanceirasResponseDto {
  data: InstituicoesFinanceirasDto[];
}
