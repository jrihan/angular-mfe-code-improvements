class InstituicoesFinanceirasEntity {
  public readonly codigo: string;
  public readonly nome: string;

  constructor(props: Omit<InstituicoesFinanceirasEntity, 'copyWith'>) {
    this.codigo = props.codigo;
    this.nome = props.nome;
  }
}

export class BuscarInstituicoesFinanceirasResponseEntity {
  public readonly data: InstituicoesFinanceirasEntity[];

  constructor(
    props: Omit<BuscarInstituicoesFinanceirasResponseEntity, 'copyWith'>
  ) {
    this.data = (props.data || []).map(
      (instituicao) => new InstituicoesFinanceirasEntity(instituicao)
    );
  }
}
