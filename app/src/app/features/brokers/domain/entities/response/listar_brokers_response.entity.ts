import { PaginationEntity } from 'src/app/shared/domain/entities/pagination.entity';
import { BuscarBrokerResponseEntity } from './buscar_broker_response.entity';

export type ListarBrokersContentEntity = Omit<
  BuscarBrokerResponseEntity,
  'dadosCadastrais'
> & {
  dadosCadastrais: Omit<
    BuscarBrokerResponseEntity['dadosCadastrais'],
    'enderecos' | 'telefones' | 'emails'
  >;
};

export class ListarBrokersResponseEntity {
  constructor(
    public content: ListarBrokersContentEntity[],
    public page: PaginationEntity
  ) {}
}
