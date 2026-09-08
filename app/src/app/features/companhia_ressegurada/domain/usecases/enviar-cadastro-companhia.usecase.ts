import { CadastroCompanhiaResseguradaEntity } from '../entities/cadastro-companhia-ressegurada.entity';

export abstract class EnviarCadastroCompanhiaUseCase {
  abstract execute(payload: CadastroCompanhiaResseguradaEntity): Promise<any>;
}
