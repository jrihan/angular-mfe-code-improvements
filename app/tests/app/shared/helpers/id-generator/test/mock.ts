export const ID_GENERATOR_HELPER_MOCK_SCENARIOS = {
  CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX: {
    DESCRIPTION: 'deve gerar instance ID com prefixo personalizado',
    PREFIX: 'test',
    EXPECTED_PARTS: 3
  },
  CENARIO_GENERATE_INSTANCE_ID_DEFAULT: {
    DESCRIPTION: 'deve gerar instance ID com prefixo padrão',
    EXPECTED_PREFIX: 'instance',
    EXPECTED_PARTS: 3
  },
  CENARIO_GENERATE_SHORT_ID_WITH_PREFIX: {
    DESCRIPTION: 'deve gerar short ID com prefixo personalizado',
    PREFIX: 'custom',
    EXPECTED_PARTS: 2
  },
  CENARIO_GENERATE_SHORT_ID_DEFAULT: {
    DESCRIPTION: 'deve gerar short ID com prefixo padrão',
    EXPECTED_PREFIX: 'id',
    EXPECTED_PARTS: 2
  },
  CENARIO_GENERATE_FALLBACK_ID: {
    DESCRIPTION: 'deve gerar fallback ID',
    EXPECTED_PREFIX: 'fallback',
    EXPECTED_PARTS: 3
  },
  GENERATE_ID_WITH_PREFIX: {
    DESCRIPTION: 'deve gerar ID com prefixo personalizado',
    PREFIX: 'test',
    EXPECTED_PARTS: 3
  },
  GENERATE_ID_DEFAULT_PREFIX: {
    DESCRIPTION: 'deve gerar ID com prefixo padrão',
    EXPECTED_PREFIX: 'id',
    EXPECTED_PARTS: 3
  },
  GENERATE_UUID: {
    DESCRIPTION: 'deve gerar UUID válido',
    EXPECTED_PATTERN: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    EXPECTED_LENGTH: 36
  },
  GENERATE_NUMERIC_ID: {
    DESCRIPTION: 'deve gerar ID numérico com comprimento especificado',
    LENGTH: 8,
    EXPECTED_PATTERN: /^[0-9]{8}$/
  },
  GENERATE_TIMESTAMP_ID: {
    DESCRIPTION: 'deve gerar ID baseado em timestamp',
    MIN_TIMESTAMP: 1600000000000,
    EXPECTED_PATTERN: /^[0-9]+$/
  },
  GENERATE_SEQUENTIAL_ID: {
    DESCRIPTION: 'deve gerar ID sequencial com prefixo e contador',
    PREFIX: 'seq',
    COUNTER: 42,
    EXPECTED_RESULT: 'seq-000042'
  }
};
