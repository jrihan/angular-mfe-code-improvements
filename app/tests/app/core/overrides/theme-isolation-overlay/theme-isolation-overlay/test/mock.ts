export const CENARIO_INICIALIZACAO_SERVICO_SUCESSO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve criar instância do serviço com sucesso'
};

export const CENARIO_CRIACAO_CONTAINER_SUCESSO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve criar container overlay com classes CSS adequadas'
};

export const CENARIO_APLICACAO_CLASSES_TEMA_SUCESSO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve aplicar classes de tema padrão ao container'
};

export const CENARIO_ATUALIZACAO_TEMA_EMPRESAS: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve atualizar tema para empresas removendo tema anterior'
};

export const CENARIO_ATUALIZACAO_TEMA_VAREJO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve atualizar tema para varejo removendo tema anterior'
};

export const CENARIO_OBTENCAO_CONTAINER_AUTO_INICIALIZACAO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve obter container com auto-inicialização quando não inicializado'
};

export const CENARIO_DESTRUICAO_SERVICO_SUCESSO: {
  DESCRIPTION: string;
} = {
  DESCRIPTION: 'deve destruir serviço e limpar subscriptions'
};

export const CENARIO_CONTEXTO_SEM_SEGMENTO: {
  REQUEST: { segmento?: string };
  DESCRIPTION: string;
} = {
  REQUEST: {},
  DESCRIPTION: 'deve tratar contexto sem segmento aplicando tema padrão'
};

export const CENARIO_CONTEXTO_COM_SEGMENTO_EMPRESAS: {
  REQUEST: { segmento: string };
  EXPECTED: { segmento: string };
  DESCRIPTION: string;
} = {
  REQUEST: { segmento: 'empresas' },
  EXPECTED: { segmento: 'empresas' },
  DESCRIPTION: 'deve processar contexto com segmento empresas'
};

export const CENARIO_CONTEXTO_COM_SEGMENTO_VAREJO: {
  REQUEST: { segmento: string };
  EXPECTED: { segmento: string };
  DESCRIPTION: string;
} = {
  REQUEST: { segmento: 'varejo' },
  EXPECTED: { segmento: 'varejo' },
  DESCRIPTION: 'deve processar contexto com segmento varejo'
};
