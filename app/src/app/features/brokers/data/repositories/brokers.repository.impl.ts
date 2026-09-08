import { BuscarDadosCadastraisResponseEntity } from 'src/app/shared/domain/entities/response/buscar_dados_cadastrais.response.entity';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { CriarBrokerRequestEntity } from '../../domain/entities/request/criar_broker_request.entity';
import { BuscarBrokerResponseEntity } from '../../domain/entities/response/buscar_broker_response.entity';
import { CriarBrokerResponseEntity } from '../../domain/entities/response/criar_broker_response.entity';
import { ListarBrokersResponseEntity } from '../../domain/entities/response/listar_brokers_response.entity';
import { BrokersRepository } from '../../domain/repositories/brokers.repository';
import { BrokersDatasource } from '../datasources/brokers.datasource';
import { BuscarBrokerResponseMapper } from '../mappers/response/buscar_broker_response.mapper';
import { ListarBrokersResponseMapper } from '../mappers/response/listar_brokers_response.mapper';
import { CriarBrokerRequestMapper } from '../mappers/request/criar_broker_request.mapper';
import { CriarBrokerResponseMapper } from '../mappers/response/criar_broker_response.mapper';
import { BuscarDadosCadastraisResponseMapper } from 'src/app/shared/data/mappers/response/buscar_dados_cadastrais.response.mapper';
import { Injectable } from '@angular/core';
import { BuscarInstituicoesFinanceirasResponseMapper } from 'src/app/shared/data/mappers/response/buscar_instituicoes_financeiras.response.mapper';
import { BuscarInstituicoesFinanceirasResponseEntity } from 'src/app/shared/domain/entities/response/buscar_instituicoes_financeiras.response.entity';
import { AtualizarBrokerRequestEntity } from '../../domain/entities/request/atualizar_broker_request.entity';
import { AtualizarBrokerRequestMapper } from '../mappers/request/atualizar_broker_request.mapper';

@Injectable()
export class BrokersRepositoryImpl implements BrokersRepository {
  constructor(private readonly datasource: BrokersDatasource) {}
  async buscarBroker(id: string): Promise<BuscarBrokerResponseEntity | null> {
    const dto = await this.datasource.buscarBroker(id);
    return dto ? BuscarBrokerResponseMapper.toEntity(dto) : null;
  }
  async listarBrokers(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseEntity | null> {
    const dto = await this.datasource.listarBrokers(params);
    return dto ? ListarBrokersResponseMapper.toEntity(dto) : null;
  }
  async cadastrarBroker(
    payload: CriarBrokerRequestEntity
  ): Promise<CriarBrokerResponseEntity | null> {
    const dto = await this.datasource.cadastrarBroker(
      CriarBrokerRequestMapper.toDto(payload)
    );
    return dto ? CriarBrokerResponseMapper.toEntity(dto) : null;
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
  async atualizarBroker(payload: AtualizarBrokerRequestEntity): Promise<null> {
    const dto = AtualizarBrokerRequestMapper.toDto(payload);
    return this.datasource.atualizarBroker(dto);
  }
}
