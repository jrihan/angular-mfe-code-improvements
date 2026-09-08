import { faker } from '@faker-js/faker';
import { ContratoResponseEntity } from '../../../../../../src/app/features/contrato/domain/entities/contrato_response.entity';
import { ContractTypeEnum } from '../../../../../../src/app/features/contrato/domain/enums/contract_type.enum';
import { ContractModalityEnum } from '../../../../../../src/app/features/contrato/domain/enums/contract_modality.enum';
import { ContractSubModalityEnum } from '../../../../../../src/app/features/contrato/domain/enums/contract_submodality.enum';
import { CoverageBaseEnum } from '../../../../../../src/app/features/contrato/domain/enums/coverage_base.enum';

export class ContratoResponseEntityFactory {
  static create(
    override?: Partial<Omit<ContratoResponseEntity, 'copyWith'>>
  ): ContratoResponseEntity {
    return new ContratoResponseEntity({
      id: override?.id ?? faker.string.uuid(),
      nomeDoContrato: override?.nomeDoContrato ?? faker.company.name(),
      status:
        override?.status ??
        faker.helpers.arrayElement(['ATIVO', 'INATIVO', 'EM_ANALISE']),
      vigencia:
        override?.vigencia ??
        `${faker.date.past().toISOString().slice(0, 10)} - ${faker.date
          .future()
          .toISOString()
          .slice(0, 10)}`,
      tipoDeContrato:
        override?.tipoDeContrato ??
        faker.helpers.arrayElement(Object.values(ContractTypeEnum)),
      modalidadeDeContrato:
        override?.modalidadeDeContrato ??
        faker.helpers.arrayElement(Object.values(ContractModalityEnum)),
      baseDeCobertura:
        override?.baseDeCobertura ??
        faker.helpers.arrayElement(Object.values(CoverageBaseEnum)),
      submodalidade:
        override?.submodalidade ??
        faker.helpers.arrayElement(Object.values(ContractSubModalityEnum)),
      companhia: override?.companhia ?? faker.company.name(),
      broker: override?.broker ?? faker.person.fullName(),
      resseguradoras: override?.resseguradoras ?? faker.company.name(),
    });
  }

  static createList(
    count = 3,
    override?: Partial<Omit<ContratoResponseEntity, 'copyWith'>>
  ): ContratoResponseEntity[] {
    return Array.from({ length: count }, () => this.create(override));
  }
}
