import {
  ContaDadosCadastraisDto,
  DadosCadastraisDto,
  EmailDadosCadastraisDto,
  EnderecoDadosCadastraisDto,
  TelefoneDadosCadastraisDto,
  BuscarDadosCadastraisResponseDto,
} from '../dtos/buscar-dados-cadastrais.dto';
import {
  ContaDadosCadastraisEntity,
  DadosCadastraisEntity,
  BuscarDadosCadastraisResponseEntity,
  EmailDadosCadastraisEntity,
  EnderecoDadosCadastraisEntity,
  TelefoneDadosCadastraisEntity,
} from '../../domain/entities/buscar-dados-cadastrais.entity';

export class CompanhiaResseguradaMapper {
  static enderecoToEntity(
    dto: EnderecoDadosCadastraisDto
  ): EnderecoDadosCadastraisEntity {
    return {
      proposito_endereco: dto.proposito_endereco,
      uf: dto.uf,
      cidade: dto.cidade,
      complemento: dto.complemento,
      numero: dto.numero,
      logradouro: dto.logradouro,
      bairro: dto.bairro,
      cep: dto.cep,
      pais: dto.pais,
    };
  }

  static enderecoToDTO(
    entity: EnderecoDadosCadastraisEntity
  ): EnderecoDadosCadastraisDto {
    return {
      proposito_endereco: entity.proposito_endereco,
      uf: entity.uf,
      cidade: entity.cidade,
      complemento: entity.complemento,
      numero: entity.numero,
      logradouro: entity.logradouro,
      bairro: entity.bairro,
      cep: entity.cep,
      pais: entity.pais,
    };
  }

  static telefoneToEntity(
    dto: TelefoneDadosCadastraisDto
  ): TelefoneDadosCadastraisEntity {
    return {
      tipo_telefone: dto.tipo_telefone,
      ddi: dto.ddi,
      ddd: dto.ddd,
      numero: dto.numero,
      proposito_telefone: dto.proposito_telefone,
    };
  }

  static telefoneToDTO(
    entity: TelefoneDadosCadastraisEntity
  ): TelefoneDadosCadastraisDto {
    return {
      tipo_telefone: entity.tipo_telefone,
      ddi: entity.ddi,
      ddd: entity.ddd,
      numero: entity.numero,
      proposito_telefone: entity.proposito_telefone,
    };
  }

  static emailToEntity(
    dto: EmailDadosCadastraisDto
  ): EmailDadosCadastraisEntity {
    return {
      proposito_email: dto.proposito_email,
      departamento: dto.departamento,
      email: dto.email,
      nome_contato: dto.nome_contato,
    };
  }

  static emailToDTO(
    entity: EmailDadosCadastraisEntity
  ): EmailDadosCadastraisDto {
    return {
      proposito_email: entity.proposito_email,
      departamento: entity.departamento,
      email: entity.email,
      nome_contato: entity.nome_contato,
    };
  }

  static dadosCadastraisToEntity(
    dto: DadosCadastraisDto
  ): DadosCadastraisEntity {
    return {
      pais: dto.pais,
      nome_completo: dto.nome_completo,
      nome_fantasia: dto.nome_fantasia,
      enderecos: (dto.enderecos ?? []).map((endereco) =>
        this.enderecoToEntity(endereco)
      ),
      telefones: (dto.telefones ?? []).map((telefone) =>
        this.telefoneToEntity(telefone)
      ),
      emails: (dto.emails ?? []).map((email) => this.emailToEntity(email)),
      numero_documento: dto.numero_documento,
      tipo_documento: dto.tipo_documento,
      tipo_pessoa: dto.tipo_pessoa,
    };
  }

  static dadosCadastraisToDTO(
    entity: DadosCadastraisEntity
  ): DadosCadastraisDto {
    return {
      pais: entity.pais,
      nome_completo: entity.nome_completo,
      nome_fantasia: entity.nome_fantasia,
      enderecos: (entity.enderecos ?? []).map((endereco) =>
        this.enderecoToDTO(endereco)
      ),
      telefones: (entity.telefones ?? []).map((telefone) =>
        this.telefoneToDTO(telefone)
      ),
      emails: (entity.emails ?? []).map((email) => this.emailToDTO(email)),
      numero_documento: entity.numero_documento,
      tipo_documento: entity.tipo_documento,
      tipo_pessoa: entity.tipo_pessoa,
    };
  }

  static dadosContaToEntity(
    dto: ContaDadosCadastraisDto
  ): ContaDadosCadastraisEntity {
    return {
      codigo_banco: dto.codigo_banco,
      codigo_agencia: dto.codigo_agencia,
      tipo_conta: dto.tipo_conta,
      codigo_conta: dto.codigo_conta,
      dac: dto.dac,
      codigo_empresa: dto.codigo_empresa,
      id_conta: dto.id_conta,
      numero_unico_cliente: dto.numero_unico_cliente,
      segmento: dto.segmento,
    };
  }

  static dadosContaToDTO(
    entity: ContaDadosCadastraisEntity
  ): ContaDadosCadastraisDto {
    return {
      codigo_banco: entity.codigo_banco,
      codigo_agencia: entity.codigo_agencia,
      tipo_conta: entity.tipo_conta,
      codigo_conta: entity.codigo_conta,
      dac: entity.dac,
      codigo_empresa: entity.codigo_empresa,
      id_conta: entity.id_conta,
      numero_unico_cliente: entity.numero_unico_cliente,
      segmento: entity.segmento,
    };
  }

  static toEntity(
    dto: BuscarDadosCadastraisResponseDto | null
  ): BuscarDadosCadastraisResponseEntity | null {
    if (!dto || (!dto.dados_cadastrais && !dto.id_cliente)) return null;
    return {
      dados_cadastrais: this.dadosCadastraisToEntity(
        dto.dados_cadastrais ?? ({} as any)
      ),
      dados_conta: (dto.dados_conta ?? []).map((conta) =>
        this.dadosContaToEntity(conta)
      ),
      id_cliente: dto.id_cliente,
      situacao_cadastral: dto.situacao_cadastral,
    };
  }

  static toDTO(
    entity: BuscarDadosCadastraisResponseEntity
  ): BuscarDadosCadastraisResponseDto {
    return {
      dados_cadastrais: this.dadosCadastraisToDTO(entity.dados_cadastrais),
      dados_conta: (entity.dados_conta ?? []).map((conta) =>
        this.dadosContaToDTO(conta)
      ),
      id_cliente: entity.id_cliente,
      situacao_cadastral: entity.situacao_cadastral,
    };
  }
}
