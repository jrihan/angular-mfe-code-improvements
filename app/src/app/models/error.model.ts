export interface Error {
  title: string;
  description: string;
  detail: FailDetail[];
}
export interface FailDetail {
  message: string;
  typeError: TypeErrors;
}

export const enum TypeErrors {
  INVALID_REGISTER = 'Cadastro de parâmetro inválido',
}

export const enum MessageErrors {
  MENSAGEM_SEGMENTO = `É obrigatório o envio do contexto de 'segmento'
  para funcionar esse WebComponent`,
  MENSAGEM_TITULO = `É obrigatório o envio do inputdata 
  'mensagem.titulo' para funcionar esse WebComponent`,
}
