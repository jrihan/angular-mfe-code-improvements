// status-badge.model.ts (opcional, mas ideal)
export const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  'em-andamento': {
    label: 'Em Andamento',
    class: 'status-in-progress',
  },
  'concluido': {
    label: 'Concluído',
    class: 'status-done',
  },
  'com-rateio': {
    label: 'Com Rateio',
    class: 'status-with-split',
  },
  'carregar-arquivos': {
    label: 'Carregar Arquivos',
    class: 'status-upload-required',
  },
};