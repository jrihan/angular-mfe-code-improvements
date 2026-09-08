import {
  BuscarDadosCadastraisResponseEntity,
  EnderecoDadosCadastraisEntity,
  ContaDadosCadastraisEntity,
} from '../features/companhia_ressegurada/domain/entities/buscar-dados-cadastrais.entity';

import { CadastroCompanhiaResseguradaEntity } from '../features/companhia_ressegurada/domain/entities/cadastro-companhia-ressegurada.entity';
import { CompanhiaResseguradaListItemEntity } from '../features/companhia_ressegurada/domain/entities/companhia-ressegurada-list-item.entity';

import { faker } from '@faker-js/faker';

export class EntityGenerator {
  static cadastroCompanhiaRessegurada(): CadastroCompanhiaResseguradaEntity {
    return {
      tipo_pessoa: 'JURIDICA',
      pais: 'BR',
      codigo_susep: faker.number.int({ min: 10000, max: 99999 }),
      tipo_documento: 'CNPJ',
      numero_documento: faker.string.numeric(14),
      companhia_ressegurada: {
        codigo_companhia_ressegurada: faker.number.int({ min: 1, max: 999 }),
        codigo_centro_custo: faker.number.int({ min: 1, max: 9999 }),
      },
      dados_conta: {
        codigo_banco: faker.finance.accountNumber(3),
        codigo_agencia: faker.finance.accountNumber(4),
        codigo_tipo_conta: faker.helpers.arrayElement(['1', '2', '3']),
        codigo_conta: faker.finance.accountNumber(7),
        dac: faker.string.numeric(1),
      },
      dados_cadastrais: {
        nome_completo: faker.company.name(),
        nome_fantasia: faker.company.name(),
      },
    };
  }

  static companhiaResseguradaListItem(): CompanhiaResseguradaListItemEntity {
    return {
      codigo_tipo_persona: faker.helpers.arrayElement(['F', 'J']),
      id_cliente: faker.string.uuid(),
      id_dbresseguro: faker.string.uuid(),
      situacao_cadastral: faker.helpers.arrayElement([
        'ATIVO',
        'INATIVO',
        'PENDENTE',
      ]),
      codigo_susep: faker.number.int({ min: 10000, max: 99999 }),
      codigo_companhia_ressegurada: faker.number.int({ min: 1, max: 999 }),
      codigo_centro_custo: faker.number.int({ min: 1, max: 9999 }),
      dados_cadastrais: {
        nome_completo: faker.company.name(),
        nome_fantasia: faker.company.name(),
        tipo_documento: 'CNPJ',
        numero_documento: faker.string.numeric(14),
        pais: 'BR',
      },
    };
  }

  static enderecoCompanhiaRessegurada(): EnderecoDadosCadastraisEntity {
    return {
      proposito_endereco: faker.helpers.arrayElement([
        'Comercial',
        'Residencial',
        'Outros',
      ]),
      uf: faker.location.state({ abbreviated: true }),
      cidade: faker.location.city(),
      complemento: faker.location.secondaryAddress(),
      numero: faker.string.numeric(3),
      logradouro: faker.location.street(),
      bairro: faker.location.city(),
      cep: faker.location.zipCode('########'),
      pais: 'BR',
    };
  }

  static companhiaResseguradaResponseEntity({
    min = 0,
    max = 2,
  } = {}): BuscarDadosCadastraisResponseEntity {
    // 0, 1 ou 2 contas
    const numContas = faker.number.int({ min, max });
    const contas: ContaDadosCadastraisEntity[] = Array.from(
      { length: numContas },
      () => ({
        id_conta: faker.string.uuid(),
        codigo_empresa: faker.string.numeric(4),
        tipo_conta: faker.helpers.arrayElement(['1', '2', '3']),
        numero_unico_cliente: faker.string.numeric(12),
        segmento: faker.commerce.department(),
        codigo_banco: faker.finance.accountNumber(3),
        codigo_agencia: faker.finance.accountNumber(4),
        codigo_tipo_conta: faker.helpers.arrayElement(['1', '2', '3']),
        codigo_conta: faker.finance.accountNumber(7),
        dac: faker.string.numeric(1),
      })
    );
    return {
      id_cliente: faker.string.uuid(),
      situacao_cadastral: faker.helpers.arrayElement([
        'ATIVO',
        'INATIVO',
        'PENDENTE',
      ]),
      dados_cadastrais: {
        pais: 'BR',
        nome_completo: faker.company.name(),
        nome_fantasia: faker.company.name(),
        enderecos: [this.enderecoCompanhiaRessegurada()],
        telefones: [
          {
            tipo_telefone: 'Principal (Cartão CNPJ), Comercial ou Outros',
            ddi: faker.number.int({ min: 10, max: 99 }),
            ddd: faker.number.int({ min: 10, max: 99 }),
            numero: faker.number.int({ min: 100000000, max: 999999999 }),
            proposito_telefone: faker.helpers.arrayElement([
              'Principal (Cartão CNPJ)',
              'Comercial',
              'Outros',
            ]),
          },
        ],
        emails: [
          {
            proposito_email: faker.helpers.arrayElement([
              'Comercial',
              'Financeiro',
              'Outros',
            ]),
            departamento: faker.commerce.department(),
            email: faker.internet.email(),
            nome_contato: faker.person.fullName(),
          },
        ],
        tipo_pessoa: '',
        tipo_documento: '',
        numero_documento: '',
      },
      dados_conta: contas,
    };
  }
}
