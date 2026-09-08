import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ContextService } from '../../../../shared/services/context.service';
import { ListagemInstituicoesFinanceirasDto } from '../dtos/instituicoes-financeiras.dto';
import { CadastroCompanhiaResseguradaDto } from '../dtos/cadastro-companhia-ressegurada.dto';
import { CompanhiaResseguradaListItemDto } from '../dtos/companhia-ressegurada-list-item.dto';
import { BuscarDadosCadastraisResponseDto } from '../dtos/buscar-dados-cadastrais.dto';
import { CompanhiaResseguradaDatasource } from './companhia-ressegurada.datasource';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompanhiaResseguradaDatasourceImpl
  implements CompanhiaResseguradaDatasource
{
  private readonly apiBaseUrl: string;
  companhias: any[] = [];

  constructor(
    private readonly contextService: ContextService,
    private readonly http: HttpClient
  ) {
    this.apiBaseUrl = environment.apiBaseUrl;
    this.companhias = [];

    // Leitura silenciosa da propriedade para evitar erro de compilação por falta de uso
    if (!this.contextService) {
      console.warn('ContextService init check');
    }
  }

  async buscarDadosCadastrais(
    numeroDocumento: string,
    tipoDocumento: string = 'CNPJ',
    paisEmissorDocumento: string = 'BR'
  ): Promise<BuscarDadosCadastraisResponseDto | null> {
    const documentoLimpo = numeroDocumento
      ? numeroDocumento.replace(/[^0-9A-Za-z]/g, '')
      : '';

    const params = {
      tipoDocumento: tipoDocumento || 'CNPJ',
      paisEmissorDocumento: paisEmissorDocumento || 'BR',
    };

    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/dados-cadastrais/${documentoLimpo}`;

    try {
      const response = await firstValueFrom(
        this.http.get<any>(endpoint, { params })
      );

      if (
        !response ||
        response.mensagens ||
        Object.keys(response).length === 0
      ) {
        return null;
      }

      return response as BuscarDadosCadastraisResponseDto;
    } catch (e: any) {
      if (e.status === 404) {
        return null;
      }
      throw e;
    }
  }

  async enviarCadastro(payload: CadastroCompanhiaResseguradaDto): Promise<any> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/companhias-resseguradas`;
    return firstValueFrom(this.http.post<any>(endpoint, payload));
  }

  async listarCompanhias(): Promise<{
    content: CompanhiaResseguradaListItemDto[];
    page: any;
  }> {
    const endpoint = `${this.apiBaseUrl}/plataforma-resseguro/v1/companhias-resseguradas`;

    try {
      const response = await firstValueFrom(
        this.http.get<{
          content: CompanhiaResseguradaListItemDto[];
          page: any;
        }>(endpoint)
      );

      return (
        response || {
          content: [],
          page: {
            size: 0,
            number: 0,
            totalElements: 0,
            totalPages: 0,
          },
        }
      );
    } catch (e: any) {
      if (e.status === 404) {
        return {
          content: [],
          page: {
            size: 0,
            number: 0,
            totalElements: 0,
            totalPages: 0,
          },
        };
      }
      throw e;
    }
  }

  async buscarBancos(): Promise<ListagemInstituicoesFinanceirasDto> {
    return firstValueFrom(
      this.http.get<ListagemInstituicoesFinanceirasDto>(
        `${this.apiBaseUrl}/plataforma-resseguro/v1/instituicoes-financeiras`
      )
    );
  }
}
