import { PaginationEntity } from 'src/app/shared/domain/entities/pagination.entity';
import { BuscarResseguradorResponseEntity } from './buscar_ressegurador_response.entity';

export type ListagemBuscarResseguradorResponseEntity = Omit<
  BuscarResseguradorResponseEntity,
  'dadosCadastrais'
> & {
  dadosCadastrais: Omit<
    BuscarResseguradorResponseEntity['dadosCadastrais'],
    'enderecos' | 'telefones' | 'emails'
  >;
};

export class ListarResseguradoresResponseEntity {
  constructor(
    public content: ListagemBuscarResseguradorResponseEntity[],
    public page: PaginationEntity
  ) {}
}
