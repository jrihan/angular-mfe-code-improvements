import { faker } from '@faker-js/faker';
import {
  ListarResseguradoresResponseEntity,
  ListagemBuscarResseguradorResponseEntity,
} from '../../../../src/app/features/resseguradores/domain/entities/response/listar_resseguradores_response.entity';
import { PaginationEntity } from '../../../../src/app/shared/domain/entities/pagination.entity';
import { BuscarResseguradorResponseEntityFactory } from './buscar_ressegurador_response_entity.factory';

export class ListagemBuscarResseguradorResponseEntityFactory {
  static create(
    override?: Partial<
      Omit<ListagemBuscarResseguradorResponseEntity, 'copyWith'>
    >
  ): ListagemBuscarResseguradorResponseEntity {
    const base = BuscarResseguradorResponseEntityFactory.create();

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
      tipoPerfil: override?.tipoPerfil ?? base.tipoPerfil,
      dadosConta: override?.dadosConta ?? base.dadosConta,
      dadosCadastrais: override?.dadosCadastrais ?? dadosCadastraisListagem,
    } as ListagemBuscarResseguradorResponseEntity;
  }

  static createList(count = 3): ListagemBuscarResseguradorResponseEntity[] {
    return Array.from({ length: count }, () => this.create());
  }
}

export class ListarResseguradoresResponseEntityFactory {
  static create(
    override?: Partial<ListarResseguradoresResponseEntity>
  ): ListarResseguradoresResponseEntity {
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
      override?.content ??
      ListagemBuscarResseguradorResponseEntityFactory.createList(size);

    return new ListarResseguradoresResponseEntity(content, page);
  }
}
