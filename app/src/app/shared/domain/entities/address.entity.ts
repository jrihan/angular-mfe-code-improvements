import { AddressTypeEnum } from '../enum/address_type.enum';

export class AddressEntity {
  public readonly propositoEndereco: AddressTypeEnum;
  public readonly logradouro: string;
  public readonly numero: string;
  public readonly complemento: string | null;
  public readonly bairro: string;
  public readonly cep: string | null;
  public readonly cidade: string;
  public readonly uf: string;
  public readonly pais: string;
  public readonly regiao?: string;
  public readonly codigoAreaPostal?: string;

  constructor(props: Omit<AddressEntity, 'copyWith'>) {
    this.propositoEndereco = props.propositoEndereco;
    this.logradouro = props.logradouro;
    this.numero = props.numero;
    this.complemento = props.complemento;
    this.bairro = props.bairro;
    this.cep = props.cep;
    this.cidade = props.cidade;
    this.uf = props.uf;
    this.pais = props.pais;
    this.regiao = props.regiao;
    this.codigoAreaPostal = props.codigoAreaPostal;
  }

  public copyWith(
    props: Partial<Omit<AddressEntity, 'copyWith'>>
  ): AddressEntity {
    return new AddressEntity({
      ...this,
      ...props,
    });
  }
}
