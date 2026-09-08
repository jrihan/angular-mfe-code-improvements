export interface ListarResseguradoresResponseDto {
  content: {
    codigo_tipo_persona: string;
    id_cliente: string;
    id_dbresseguro: string;
    situacao_cadastral: string;
    codigo_susep: number;
    tipo_perfil: string;
    dados_cadastrais: {
      nome_completo: string;
      nome_fantasia: string;
      tipo_documento: string;
      numero_documento: string;
      pais: string;
    };
  }[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
