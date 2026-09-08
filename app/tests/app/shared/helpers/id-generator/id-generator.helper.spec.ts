/**
 * @jest-environment jsdom
 */

import { IdGeneratorHelper } from 'src/app/shared/helpers/id-generator/id-generator.helper';
import { ID_GENERATOR_HELPER_MOCK_SCENARIOS } from './test/mock';

// Type assertion para resolver conflito de tipos Jest
declare const expect: jest.Expect;

describe('IdGeneratorHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Dado o método generateInstanceId', () => {
    it('Quando chamar com prefix padrão, Então deve gerar ID com formato instance-timestamp-random', () => {
      const id = IdGeneratorHelper.generateInstanceId();

      expect(id).toMatch(/^instance-\d+-[a-z0-9]+$/);
      expect(id.split('-')).toHaveLength(3);
    });

    it('Quando chamar com prefix customizado, Então deve usar prefix fornecido', () => {
      const cenario =
        ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX;
      const id = IdGeneratorHelper.generateInstanceId(cenario.PREFIX);

      expect(id).toMatch(new RegExp(`^${cenario.PREFIX}-\\d+-[a-z0-9]+$`));
      expect(id.startsWith(cenario.PREFIX)).toBe(true);
    });

    it('Quando chamar múltiplas vezes, Então deve gerar IDs únicos', () => {
      const ids = new Set();
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        ids.add(IdGeneratorHelper.generateInstanceId());
      }

      expect(ids.size).toBe(iterations);
    });

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS
        .CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX;

        const result = IdGeneratorHelper.generateInstanceId(cenario.PREFIX);

        expect(result).toContain(cenario.PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );
  });

  describe('Dado o método generateShortId', () => {
    it('Quando chamar com prefix padrão, Então deve gerar ID curto com formato id-random', () => {
      const id = IdGeneratorHelper.generateShortId();

      expect(id).toMatch(/^id-[a-z0-9]+$/);
      expect(id.split('-')).toHaveLength(2);
    });

    it('Quando chamar com prefix customizado, Então deve usar prefix fornecido', () => {
      const cenario =
        ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_WITH_PREFIX;
      const id = IdGeneratorHelper.generateShortId(cenario.PREFIX);

      expect(id).toMatch(new RegExp(`^${cenario.PREFIX}-[a-z0-9]+$`));
      expect(id.startsWith(cenario.PREFIX)).toBe(true);
    });

    it('Quando chamar múltiplas vezes, Então deve gerar IDs únicos', () => {
      const ids = new Set();
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        ids.add(IdGeneratorHelper.generateShortId());
      }

      expect(ids.size).toBe(iterations);
    });
  });

  describe('Dado o método generateFallbackId', () => {
    it("Quando chamar generateFallbackId, Então deve usar prefix 'fallback'", () => {
      const id = IdGeneratorHelper.generateFallbackId();

      expect(id).toMatch(/^fallback-\d+-[a-z0-9]+$/);
      expect(id.startsWith('fallback-')).toBe(true);
    });

    it('Quando chamar múltiplas vezes, Então deve gerar IDs únicos', () => {
      const ids = new Set();
      const iterations = 5;

      for (let i = 0; i < iterations; i++) {
        ids.add(IdGeneratorHelper.generateFallbackId());
      }

      expect(ids.size).toBe(iterations);
    });
  });

  describe('Dado o método generateId', () => {
    it('Quando chamar com prefix padrão, Então deve gerar ID com formato id-timestamp-random', () => {
      const id = IdGeneratorHelper.generateId();

      expect(id).toMatch(/^id-[a-z0-9]+-[a-z0-9]+$/);
      expect(id.split('-')).toHaveLength(3);
    });

    it('Quando chamar com prefix customizado, Então deve usar prefix fornecido', () => {
      const cenario =
        ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_ID_WITH_PREFIX;
      const id = IdGeneratorHelper.generateId(cenario.PREFIX);

      expect(id).toMatch(new RegExp(`^${cenario.PREFIX}-[a-z0-9]+-[a-z0-9]+$`));
    });

    it('Quando chamar múltiplas vezes rapidamente, Então deve gerar IDs únicos', () => {
      const ids = new Set();
      const iterations = 15;

      for (let i = 0; i < iterations; i++) {
        ids.add(IdGeneratorHelper.generateId());
      }

      expect(ids.size).toBe(iterations);
    });
  });

  describe('Dado o método generateUuid', () => {
    it('Quando chamar generateUuid, Então deve gerar UUID válido no formato padrão', () => {
      const uuid = IdGeneratorHelper.generateUuid();

      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(uuid).toHaveLength(36);
    });

    it('Quando chamar múltiplas vezes, Então deve gerar UUIDs únicos', () => {
      const uuids = new Set();
      const iterations = 10;

      for (let i = 0; i < iterations; i++) {
        uuids.add(IdGeneratorHelper.generateUuid());
      }

      expect(uuids.size).toBe(iterations);
    });

    it('Quando validar estrutura do UUID, Então deve ter versão 4', () => {
      const uuid = IdGeneratorHelper.generateUuid();
      const parts = uuid.split('-');

      expect(parts).toHaveLength(5);
      expect(parts[2].charAt(0)).toBe('4'); // Versão 4
      expect(['8', '9', 'a', 'b']).toContain(parts[3].charAt(0).toLowerCase()); // Variant
    });
  });

  describe('Dado o método generateNumericId', () => {
    it('Quando chamar com comprimento padrão, Então deve gerar ID numérico de 6 dígitos', () => {
      const id = IdGeneratorHelper.generateNumericId();

      expect(id).toMatch(/^\d{6}$/);
      expect(id).toHaveLength(6);
      expect(parseInt(id)).toBeGreaterThanOrEqual(100000);
      expect(parseInt(id)).toBeLessThanOrEqual(999999);
    });

    it('Quando chamar com comprimento customizado, Então deve gerar ID com comprimento especificado', () => {
      const cenario = ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_NUMERIC_ID;
      const customLength = cenario.LENGTH;
      const id = IdGeneratorHelper.generateNumericId(customLength);

      expect(id).toHaveLength(customLength);
      expect(id).toMatch(new RegExp(`^\\d{${customLength}}$`));
    });

    it('Quando chamar com comprimento 1, Então deve gerar ID de 1 dígito', () => {
      const id = IdGeneratorHelper.generateNumericId(1);

      expect(id).toMatch(/^\d$/);
      expect(id).toHaveLength(1);
      expect(parseInt(id)).toBeGreaterThanOrEqual(1);
      expect(parseInt(id)).toBeLessThanOrEqual(9);
    });
  });

  describe('Dado o método generateTimestampId', () => {
    it('Quando chamar generateTimestampId, Então deve retornar timestamp atual como string', () => {
      const beforeTimestamp = Date.now();
      const id = IdGeneratorHelper.generateTimestampId();
      const afterTimestamp = Date.now();

      const idAsNumber = parseInt(id);
      expect(idAsNumber).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(idAsNumber).toBeLessThanOrEqual(afterTimestamp);
      expect(id).toMatch(/^\d+$/);
    });

    it('Quando chamar em instantes diferentes, Então deve gerar timestamps diferentes', () => {
      // Controlamos o relógio para tornar o teste determinístico e não flaky,
      // já que Date.now() tem resolução de milissegundos e um setTimeout(1)
      // não garante avanço de ao menos 1ms entre as chamadas.
      const nowSpy = jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(1784906789503)
        .mockReturnValueOnce(1784906789504);

      const id1 = IdGeneratorHelper.generateTimestampId();
      const id2 = IdGeneratorHelper.generateTimestampId();

      expect(id1).not.toBe(id2);
      expect(parseInt(id2)).toBeGreaterThan(parseInt(id1));
      expect(nowSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Dado o método generateSequentialId', () => {
    it('Quando chamar com contador, Então deve gerar ID sequencial com padding', () => {
      const cenario = ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_SEQUENTIAL_ID;
      const id = IdGeneratorHelper.generateSequentialId(
        cenario.PREFIX,
        cenario.COUNTER
      );

      expect(id).toBe(
        `${cenario.PREFIX}-${cenario.COUNTER.toString().padStart(6, '0')}`
      );
      expect(id).toMatch(/^seq-\d{6}$/);
    });

    it('Quando chamar com prefix customizado, Então deve usar prefix fornecido', () => {
      const customPrefix = 'order';
      const counter = 42;
      const id = IdGeneratorHelper.generateSequentialId(customPrefix, counter);

      expect(id).toBe(`${customPrefix}-000042`);
      expect(id).toMatch(/^order-\d{6}$/);
    });

    it('Quando chamar com contador grande, Então deve manter todos os dígitos', () => {
      const largeCounter = 1234567;
      const id = IdGeneratorHelper.generateSequentialId('test', largeCounter);

      expect(id).toBe('test-1234567');
      expect(id).toMatch(/^test-\d{7}$/);
    });

    it("Quando chamar sem fornecer prefix, Então deve usar 'seq' como padrão", () => {
      const id = IdGeneratorHelper.generateSequentialId(undefined as any, 42);

      expect(id).toBe('seq-000042');
    });
  });

  describe('Dado cenários de integração', () => {
    it('Quando usar todos os métodos em sequência, Então deve gerar formatos distintos', () => {
      const instanceId = IdGeneratorHelper.generateInstanceId('app');
      const shortId = IdGeneratorHelper.generateShortId('temp');
      const fallbackId = IdGeneratorHelper.generateFallbackId();
      const genericId = IdGeneratorHelper.generateId('gen');
      const uuid = IdGeneratorHelper.generateUuid();
      const numericId = IdGeneratorHelper.generateNumericId(4);
      const timestampId = IdGeneratorHelper.generateTimestampId();
      const sequentialId = IdGeneratorHelper.generateSequentialId('seq', 1);

      const allIds = [
        instanceId,
        shortId,
        fallbackId,
        genericId,
        uuid,
        numericId,
        timestampId,
        sequentialId,
      ];
      const uniqueIds = new Set(allIds);

      expect(uniqueIds.size).toBe(allIds.length);

      expect(instanceId).toMatch(/^app-\d+-[a-z0-9]+$/);
      expect(shortId).toMatch(/^temp-[a-z0-9]+$/);
      expect(fallbackId).toMatch(/^fallback-\d+-[a-z0-9]+$/);
      expect(genericId).toMatch(/^gen-[a-z0-9]+-[a-z0-9]+$/);
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(numericId).toMatch(/^\d{4}$/);
      expect(timestampId).toMatch(/^\d+$/);
      expect(sequentialId).toBe('seq-000001');
    });

    it('Quando usar cenários de mock, Então deve validar comportamentos esperados', () => {
      const cenarios = ID_GENERATOR_HELPER_MOCK_SCENARIOS;

      const customId = IdGeneratorHelper.generateInstanceId(
        cenarios.CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX.PREFIX
      );
      expect(customId).toMatch(
        new RegExp(
          `^${cenarios.CENARIO_GENERATE_INSTANCE_ID_WITH_PREFIX.PREFIX}-\\d+-[a-z0-9]+$`
        )
      );

      const numericId = IdGeneratorHelper.generateNumericId(
        cenarios.GENERATE_NUMERIC_ID.LENGTH
      );
      expect(numericId).toHaveLength(cenarios.GENERATE_NUMERIC_ID.LENGTH);

      const sequentialId = IdGeneratorHelper.generateSequentialId(
        cenarios.GENERATE_SEQUENTIAL_ID.PREFIX,
        cenarios.GENERATE_SEQUENTIAL_ID.COUNTER
      );
      expect(sequentialId).toBe('seq-000042');
    });
  });

  describe('Dado cenários usando mock scenarios', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_INSTANCE_ID_DEFAULT
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_INSTANCE_ID_DEFAULT;

        const result = IdGeneratorHelper.generateInstanceId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_DEFAULT
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_DEFAULT;

        const result = IdGeneratorHelper.generateShortId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(2);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_FALLBACK_ID
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_FALLBACK_ID;

        const result = IdGeneratorHelper.generateFallbackId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );

    it(ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_UUID.DESCRIPTION, () => {
      const result = IdGeneratorHelper.generateUuid();

      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      expect(result).toHaveLength(36);
    });

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_NUMERIC_ID.DESCRIPTION,
      () => {
        const cenario = ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_NUMERIC_ID;

        const result = IdGeneratorHelper.generateNumericId(cenario.LENGTH);

        expect(result).toHaveLength(cenario.LENGTH);
        expect(result).toMatch(/^\d+$/);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_TIMESTAMP_ID.DESCRIPTION,
      () => {
        const result = IdGeneratorHelper.generateTimestampId();

        expect(result).toMatch(/^\d+$/);
        expect(parseInt(result)).toBeGreaterThan(0);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_SEQUENTIAL_ID.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_SEQUENTIAL_ID;

        const result = IdGeneratorHelper.generateSequentialId(
          cenario.PREFIX,
          cenario.COUNTER
        );

        expect(result).toBe(
          `${cenario.PREFIX}-${cenario.COUNTER.toString().padStart(6, '0')}`
        );
      }
    );
  });

  describe('generateShortId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_WITH_PREFIX
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_WITH_PREFIX;

        const result = IdGeneratorHelper.generateShortId(cenario.PREFIX);

        expect(result).toContain(cenario.PREFIX);
        expect(result.split('-')).toHaveLength(2);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_DEFAULT
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_SHORT_ID_DEFAULT;

        const result = IdGeneratorHelper.generateShortId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(2);
      }
    );
  });

  describe('generateFallbackId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_FALLBACK_ID
        .DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.CENARIO_GENERATE_FALLBACK_ID;

        const result = IdGeneratorHelper.generateFallbackId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );
  });

  describe('generateId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_ID_WITH_PREFIX.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_ID_WITH_PREFIX;

        const result = IdGeneratorHelper.generateId(cenario.PREFIX);

        expect(result).toContain(cenario.PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );

    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_ID_DEFAULT_PREFIX.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_ID_DEFAULT_PREFIX;

        const result = IdGeneratorHelper.generateId();

        expect(result).toContain(cenario.EXPECTED_PREFIX);
        expect(result.split('-')).toHaveLength(3);
      }
    );
  });

  describe('generateUuid', () => {
    it(ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_UUID.DESCRIPTION, () => {
      const cenario = ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_UUID;

      const result = IdGeneratorHelper.generateUuid();

      expect(result).toMatch(cenario.EXPECTED_PATTERN);
      expect(result).toHaveLength(36);
    });
  });

  describe('generateNumericId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_NUMERIC_ID.DESCRIPTION,
      () => {
        const cenario = ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_NUMERIC_ID;

        const result = IdGeneratorHelper.generateNumericId(cenario.LENGTH);

        expect(result).toHaveLength(cenario.LENGTH);
        expect(result).toMatch(cenario.EXPECTED_PATTERN);
      }
    );
  });

  describe('generateTimestampId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_TIMESTAMP_ID.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_TIMESTAMP_ID;

        const result = IdGeneratorHelper.generateTimestampId();

        expect(Number(result)).toBeGreaterThan(cenario.MIN_TIMESTAMP);
        expect(result).toMatch(cenario.EXPECTED_PATTERN);
      }
    );
  });

  describe('generateSequentialId', () => {
    it(
      ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_SEQUENTIAL_ID.DESCRIPTION,
      () => {
        const cenario =
          ID_GENERATOR_HELPER_MOCK_SCENARIOS.GENERATE_SEQUENTIAL_ID;

        const result = IdGeneratorHelper.generateSequentialId(
          cenario.PREFIX,
          cenario.COUNTER
        );

        expect(result).toBe(cenario.EXPECTED_RESULT);
        expect(result).toContain(cenario.PREFIX);
      }
    );
  });
});
