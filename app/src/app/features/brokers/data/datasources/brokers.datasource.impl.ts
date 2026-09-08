import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarDadosCadastraisResponseDto } from 'src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { BrokersDatasource } from './brokers.datasource';
import { BuscarBrokerResponseDto } from '../dtos/response/buscar_broker_response.dto';
import { ListarBrokersResponseDto } from '../dtos/response/listar_brokers_response.dto';
import { CriarBrokerRequestDto } from '../dtos/request/criar_broker_request.dto';
import { CriarBrokerResponseDto } from '../dtos/response/criar_broker_response.dto';
import { BuscarInstituicoesFinanceirasResponseDto } from 'src/app/shared/data/dtos/response/buscar_instituicoes_financeiras.response.dto';
import { AtualizarBrokerRequestDto } from '../dtos/request/atualizar_broker_request.dto';

@Injectable()
export class BrokersDatasourceImpl implements BrokersDatasource {
  private readonly apiBaseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  async atualizarBroker(payload: AtualizarBrokerRequestDto): Promise<null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/brokers`;
    try {
      const response = await firstValueFrom(
        this.http.put<null>(endpoint, payload)
      );
      return response ?? null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  buscarInstituicoesFinanceiras(): Promise<BuscarInstituicoesFinanceirasResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/instituicoes-financeiras`;
    return firstValueFrom(
      this.http.get<BuscarInstituicoesFinanceirasResponseDto>(endpoint)
    ).catch((e: any) => {
      if (e.status === 404) {
        return null;
      }
      throw e;
    });
  }

  async buscarDadosCadastrais(
    params: BuscarDadosCadastraisRequestInterface
  ): Promise<BuscarDadosCadastraisResponseDto | null> {
    const documentoLimpo = params.documentNumber
      ? params.documentNumber.replace(/[^0-9A-Za-z]/g, '')
      : '';

    const queryParams = {
      tipoDocumento: params.documentType || 'CNPJ',
      paisEmissorDocumento: params.countryCode || 'BR',
    };

    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/${documentoLimpo}`;
    try {
      const response = await firstValueFrom(
        this.http.get<BuscarDadosCadastraisResponseDto>(endpoint, {
          params: queryParams,
        })
      );
      return response || null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async buscarBroker(id: string): Promise<BuscarBrokerResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/brokers/${id}`;
    try {
      const response = await firstValueFrom(
        this.http.get<BuscarBrokerResponseDto>(endpoint)
      );
      return response || null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async listarBrokers(
    params?: PaginationParams
  ): Promise<ListarBrokersResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/brokers`;
    try {
      const response = await firstValueFrom(
        this.http.get<ListarBrokersResponseDto>(endpoint, {
          params: params as any,
        })
      );
      return response || null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async cadastrarBroker(
    payload: CriarBrokerRequestDto
  ): Promise<CriarBrokerResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/brokers`;
    try {
      const response = await firstValueFrom(
        this.http.post<CriarBrokerResponseDto>(endpoint, payload)
      );
      return response || null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }
}
