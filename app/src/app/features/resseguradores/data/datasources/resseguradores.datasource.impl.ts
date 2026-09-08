import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ListarResseguradoresResponseDto } from '../dtos/response/listar_resseguradores_response.dto';
import { BuscarResseguradorResponseDto } from '../dtos/response/buscar_ressegurador_response.dto';
import { ResseguradoresDatasource } from './resseguradores.datasource';
import { CriarResseguradorRequestDto } from '../dtos/request/criar_ressegurador_request.dto';
import { CriarResseguradorResponseDto } from '../dtos/response/criar_ressegurador_response.dto';
import { AtualizarResseguradorRequestDto } from '../dtos/request/atualizar_ressegurador_request.dto';
import { PaginationParams } from 'src/app/shared/interfaces/pagination-params.interface';
import { BuscarDadosCadastraisResponseDto } from 'src/app/shared/data/dtos/response/buscar_dados_cadastrais.response.dto';
import { BuscarDadosCadastraisRequestInterface } from 'src/app/shared/interfaces/request/buscar_dados_cadastrais.request.interface';
import { BuscarInstituicoesFinanceirasResponseDto } from 'src/app/shared/data/dtos/response/buscar_instituicoes_financeiras.response.dto';

@Injectable()
export class ResseguradoresDatasourceImpl implements ResseguradoresDatasource {
  private readonly apiBaseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  async atualizarRessegurador(
    payload: AtualizarResseguradorRequestDto
  ): Promise<null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`;
    try {
      const response = await firstValueFrom(this.http.put<null>(endpoint, payload));
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

  async buscarRessegurador(
    id: string
  ): Promise<BuscarResseguradorResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/resseguradores/${id}`;
    try {
      const response = await firstValueFrom(
        this.http.get<BuscarResseguradorResponseDto>(endpoint)
      );
      return response || null;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async listarResseguradores(
    params?: PaginationParams
  ): Promise<ListarResseguradoresResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`;
    try {
      const response = await firstValueFrom(
        this.http.get<ListarResseguradoresResponseDto>(endpoint, {
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

  async cadastrarRessegurador(
    payload: CriarResseguradorRequestDto
  ): Promise<CriarResseguradorResponseDto | null> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/resseguradores`;
    try {
      const response = await firstValueFrom(
        this.http.post<CriarResseguradorResponseDto>(endpoint, payload)
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
