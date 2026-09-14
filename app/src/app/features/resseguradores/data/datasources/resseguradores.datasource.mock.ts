import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { Injectable } from '@angular/core';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseDto } from 'src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { BuscarInstituicoesFinanceirasResponseDto } from 'src/app/shared/data/dtos/response/buscar_instituicoes_financeiras.response.dto';
import { AtualizarResseguradorRequestDto } from '../dtos/request/atualizar_ressegurador_request.dto';
import { CriarResseguradorRequestDto } from '../dtos/request/criar_ressegurador_request.dto';
import { CriarResseguradorResponseDto } from '../dtos/response/criar_ressegurador_response.dto';
import { BuscarResseguradorResponseDto } from '../dtos/response/buscar_ressegurador_response.dto';
import { ListarResseguradoresResponseDto } from '../dtos/response/listar_resseguradores_response.dto';
import { ResseguradoresDatasource } from './resseguradores.datasource';
import { BuscarResseguradorResponseMapper } from '../mappers/response/buscar_ressegurador_response.mapper';
import { CriarResseguradorResponseMapper } from '../mappers/response/criar_ressegurador_response.mapper';
import { ListarResseguradoresResponseMapper } from '../mappers/response/listar_resseguradores_response.mapper';
import { RegistrationDataMapper } from 'src/app/shared/data/mappers/registration_data.mapper';
import { BankAccountMapper } from 'src/app/shared/data/mappers/bank_account.mapper';
import { LogService } from 'src/app/shared/services/log/log.service';
import { BuscarResseguradorResponseEntityFactory } from 'tests/app/features/resseguradores/domain/entities/response/buscar_ressegurador_response.factory';
import { CriarResseguradorResponseEntityFactory } from 'tests/app/features/resseguradores/domain/entities/response/criar_ressegurador_response.factory';
import { ListarResseguradoresResponseEntityFactory } from 'tests/app/features/resseguradores/domain/entities/response/listar_resseguradores_response.factory';

@Injectable()
export class ResseguradoresDatasourceMock implements ResseguradoresDatasource {
  private readonly delayMs = 300;

  constructor(private readonly logService: LogService) {}

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }

  async buscarRessegurador(
    id: string
  ): Promise<BuscarResseguradorResponseDto | null> {
    await this.delay();
    const response = BuscarResseguradorResponseMapper.toDto(
      BuscarResseguradorResponseEntityFactory.create()
    );
    this.logRequestResponse('buscarRessegurador', { id }, response);
    return response;
  }

  async listarResseguradores(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseDto | null> {
    await this.delay();
    const response = ListarResseguradoresResponseMapper.toDto(
      ListarResseguradoresResponseEntityFactory.create()
    );
    this.logRequestResponse('listarResseguradores', params, response);
    return response;
  }

  async cadastrarRessegurador(
    payload: CriarResseguradorRequestDto
  ): Promise<CriarResseguradorResponseDto | null> {
    await this.delay();
    const response = CriarResseguradorResponseMapper.toDto(
      CriarResseguradorResponseEntityFactory.create()
    );
    this.logRequestResponse('cadastrarRessegurador', payload, response);
    return response;
  }

  async atualizarRessegurador(
    payload: AtualizarResseguradorRequestDto
  ): Promise<null> {
    await this.delay();
    this.logRequestResponse('atualizarRessegurador', payload, null);
    return null;
  }

  async buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseDto | null> {
    await this.delay();
    const entity = BuscarResseguradorResponseEntityFactory.create();

    const response = {
      id_cliente: entity.idCliente,
      situacao_cadastral: entity.situacaoCadastral,
      dados_cadastrais: RegistrationDataMapper.toDto(entity.dadosCadastrais),
      dados_conta: entity.dadosConta.map((conta) =>
        BankAccountMapper.toDto(conta)
      ),
    };
    this.logRequestResponse('buscarDadosCadastrais', params, response);
    return response;
  }

  async buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseDto | null> {
    await this.delay();
    const response = {
      data: [
        { codigo: '001', nome: 'Banco do Brasil' },
        { codigo: '341', nome: 'Itaú Unibanco' },
      ],
    };
    this.logRequestResponse('buscarInstituicoesFinanceiras', undefined, response);
    return response;
  }

  private logRequestResponse(
    method: string,
    request: unknown,
    response: unknown
  ): void {
    this.logService.info(`[ResseguradoresDatasourceMock] ${method}`, {
      request,
      response,
    });
  }
}