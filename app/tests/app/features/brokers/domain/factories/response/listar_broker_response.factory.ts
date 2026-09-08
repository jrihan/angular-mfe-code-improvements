import { faker } from '@faker-js/faker';
import {
  ListarBrokersContentEntity,
  ListarBrokersResponseEntity,
} from 'src/app/features/brokers/domain/entities/response/listar_brokers_response.entity';
import { PaginationEntity } from 'src/app/shared/domain/entities/pagination.entity';
import { BuscarBrokerResponseEntityFactory } from './buscar_broker_response.factory';

export class ListarBrokersContentEntityFactory {
  static create(
    override?: Partial<Omit<ListarBrokersContentEntity, 'copyWith'>>
  ): ListarBrokersContentEntity {
    const base = BuscarBrokerResponseEntityFactory.create();

    const dadosCadastraisListagem = {
      nomeCompleto: base.dadosCadastrais.nomeCompleto,
      nomeFantasia: base.dadosCadastrais.nomeFantasia,
      tipoDocumento: base.dadosCadastrais.tipoDocumento,
      numeroDocumento: base.dadosCadastrais.numeroDocumento,
      pais: base.dadosCadastrais.pais,
    };

    return {
      codigoTipoPersona: override?.codigoTipoPersona ?? base.codigoTipoPersona,
      idCliente: override?.idCliente ?? base.idCliente,
      idDbResseguro: override?.idDbResseguro ?? base.idDbResseguro,
      situacaoCadastral: override?.situacaoCadastral ?? base.situacaoCadastral,
      codigoSusep: override?.codigoSusep ?? base.codigoSusep,
      dadosConta: override?.dadosConta ?? base.dadosConta,
      dadosCadastrais: override?.dadosCadastrais ?? dadosCadastraisListagem,
    } as ListarBrokersContentEntity;
  }

  static createList(count = 3): ListarBrokersContentEntity[] {
    return Array.from({ length: count }, () => this.create());
  }
}

export class ListarBrokersResponseEntityFactory {
  static create(
    override?: Partial<ListarBrokersResponseEntity>
  ): ListarBrokersResponseEntity {
    const totalElements =
      override?.page?.totalElements ?? faker.number.int({ min: 5, max: 100 });
    const size = override?.page?.size ?? 10;
    const number = override?.page?.number ?? 0;
    const totalPages =
      override?.page?.totalPages ?? Math.ceil(totalElements / size);

    const page: PaginationEntity = {
      size,
      number,
      totalElements,
      totalPages,
      ...override?.page,
    };

    const content =
      override?.content ?? ListarBrokersContentEntityFactory.createList(size);

    return new ListarBrokersResponseEntity(content, page);
  }
}
