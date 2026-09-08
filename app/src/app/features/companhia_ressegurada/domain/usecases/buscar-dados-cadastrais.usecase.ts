import { BuscarDadosCadastraisResponseEntity } from '../entities/buscar-dados-cadastrais.entity';

export abstract class BuscarCompanhiaPorCnpjUseCase {
  abstract execute(
    cnpj: string
  ): Promise<BuscarDadosCadastraisResponseEntity | null>;
}
