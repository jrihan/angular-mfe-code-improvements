import { Injectable } from '@angular/core';
import { ResseguradoresRepository } from '../../domain/repositories/resseguradores.repository';
import { BuscarResseguradorResponseEntity } from '../../domain/entities/response/buscar_ressegurador_response.entity';
import { ListarResseguradoresResponseEntity } from '../../domain/entities/response/listar_resseguradores_response.entity';
import { ResseguradoresDatasource } from '../datasources/resseguradores.datasource';
import { BuscarResseguradorResponseMapper } from '../mappers/response/buscar_ressegurador_response.mapper';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';

import { CriarResseguradorRequestEntity } from '../../domain/entities/request/criar_ressegurador_request.entity';
import { CriarResseguradorResponseEntity } from '../../domain/entities/response/criar_ressegurador_response.entity';
import { CriarResseguradorRequestMapper } from '../mappers/request/criar_ressegurador_request.mapper';
import { CriarResseguradorResponseMapper } from '../mappers/response/criar_ressegurador_response.mapper';
import { ListarResseguradoresResponseMapper } from '../mappers/response/listar_resseguradores_response.mapper';
import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { BuscarDadosCadastraisResponseMapper } from 'src/app/shared/data/mappers/response/buscar_dados_cadastrais.response.mapper';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarInstituicoesFinanceirasResponseMapper } from 'src/app/shared/data/mappers/response/buscar_instituicoes_financeiras.response.mapper';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { AtualizarResseguradorRequestEntity } from '../../domain/entities/request/atualizar_ressegurador_request.entity';
import { AtualizarResseguradorRequestMapper } from '../mappers/request/atualizar_ressegurador_request.mapper';

@Injectable()
export class ResseguradoresRepositoryImpl implements ResseguradoresRepository {
  constructor(private readonly datasource: ResseguradoresDatasource) {}

  async buscarRessegurador(
    id: string
  ): Promise<BuscarResseguradorResponseEntity | null> {
    const dto = await this.datasource.buscarRessegurador(id);
    return dto ? BuscarResseguradorResponseMapper.toEntity(dto) : null;
  }

  async listarResseguradores(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseEntity | null> {
    const dto = await this.datasource.listarResseguradores(params);
    return dto ? ListarResseguradoresResponseMapper.toEntity(dto) : null;
  }

  async cadastrarRessegurador(
    payload: CriarResseguradorRequestEntity
  ): Promise<CriarResseguradorResponseEntity | null> {
    const dto = await this.datasource.cadastrarRessegurador(
      CriarResseguradorRequestMapper.toDto(payload)
    );
    return dto ? CriarResseguradorResponseMapper.toEntity(dto) : null;
  }

  async atualizarRessegurador(
    payload: AtualizarResseguradorRequestEntity
  ): Promise<null> {
    const dto = AtualizarResseguradorRequestMapper.toDto(payload);
    return this.datasource.atualizarRessegurador(dto);
  }

  async buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseEntity | null> {
    const dto = await this.datasource.buscarDadosCadastrais(params);
    return dto ? BuscarDadosCadastraisResponseMapper.toEntity(dto) : null;
  }

  async buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseEntity | null> {
    const dto = await this.datasource.buscarInstituicoesFinanceiras();
    return dto
      ? BuscarInstituicoesFinanceirasResponseMapper.toEntity(dto)
      : null;
  }
}
