import { CompanhiaResseguradaRepository } from '../../domain/repositories/companhia-ressegurada.repository';
import { BuscarDadosCadastraisResponseEntity } from '../../domain/entities/buscar-dados-cadastrais.entity';
import { CadastroCompanhiaResseguradaEntity } from '../../domain/entities/cadastro-companhia-ressegurada.entity';
import { ListagemInstituicoesFinanceirasEntity } from '../../domain/entities/instituicoes-financeiras.entity';
import { CompanhiaResseguradaMapper } from '../mappers/listagem-dados-cadastrais.mapper';
import { CadastroCompanhiaResseguradaMapper } from '../mappers/cadastro-companhia-ressegurada.mapper';
import { CompanhiaResseguradaListItemMapper } from '../mappers/companhia-ressegurada-list-item.mapper';
import { ListagemInstituicoesFinanceirasMapper } from '../mappers/instituicoes-financeiras.mapper';
import { CompanhiaResseguradaDatasource } from '../datasources/companhia-ressegurada.datasource';
import { Inject, Injectable } from '@angular/core';
import { COMPANHIA_RESSEGURADA_DATASOURCE } from 'src/app/core/tokens/companhia_ressegurada.tokens';

@Injectable()
export class CompanhiaResseguradaRepositoryImpl
  implements CompanhiaResseguradaRepository
{
  constructor(
    @Inject(COMPANHIA_RESSEGURADA_DATASOURCE)
    private datasource: CompanhiaResseguradaDatasource
  ) {}

  async buscarDadosCadastrais(
    cnpj: string
  ): Promise<BuscarDadosCadastraisResponseEntity | null> {
    const dto = await this.datasource.buscarDadosCadastrais(cnpj, '', '');
    return CompanhiaResseguradaMapper.toEntity(dto);
  }

  enviarCadastro(payload: CadastroCompanhiaResseguradaEntity): Promise<any> {
    const dto = CadastroCompanhiaResseguradaMapper.toDTO(payload);
    return this.datasource.enviarCadastro(dto);
  }

  async listarCompanhias(): Promise<any> {
    const result = await this.datasource.listarCompanhias();
    return {
      ...result,
      content: result.content.map(CompanhiaResseguradaListItemMapper.toEntity),
    };
  }

  async buscarBancos(): Promise<ListagemInstituicoesFinanceirasEntity> {
    const result = await this.datasource.buscarBancos();
    return ListagemInstituicoesFinanceirasMapper.toEntity(result);
  }
}
