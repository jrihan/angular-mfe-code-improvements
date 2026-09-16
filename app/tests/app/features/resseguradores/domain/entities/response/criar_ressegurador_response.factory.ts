import { faker } from '@faker-js/faker';
import { CriarResseguradorResponseEntity } from 'src/app/features/resseguradores/domain/entities/response/criar_ressegurador_response.entity';
import { ProfileTypeEnum } from 'src/app/shared/domain/enum/profile_type.enum';
import { ReinsuranceAccountEntityFactory } from 'tests/app/shared/factories/criar_ressegurador_response_entity.factory';

export class CriarResseguradorResponseEntityFactory {
  static create(
    override?: Partial<Omit<CriarResseguradorResponseEntity, 'copyWith'>>
  ): CriarResseguradorResponseEntity {
    return new CriarResseguradorResponseEntity({
      codigoRessegurador:
        override?.codigoRessegurador ?? faker.number.int({ min: 1000, max: 9999 }),
      codigoIdentificacaoPessoa:
        override?.codigoIdentificacaoPessoa ??
        `cli_${faker.string.alphanumeric(9)}`,
      codigoSusep:
        override?.codigoSusep ?? faker.number.int({ min: 10000, max: 99999 }),
      tipoPerfil:
        override?.tipoPerfil ?? faker.helpers.enumValue(ProfileTypeEnum),
      informacaoContaResseguro:
        override?.informacaoContaResseguro ??
        ReinsuranceAccountEntityFactory.create(),
    });
  }
}