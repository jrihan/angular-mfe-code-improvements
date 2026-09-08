import { CadastroCompanhiaResseguradaDto } from '../dtos/cadastro-companhia-ressegurada.dto';
import { CadastroCompanhiaResseguradaEntity } from '../../domain/entities/cadastro-companhia-ressegurada.entity';

export class CadastroCompanhiaResseguradaMapper {
  static toDTO(
    entity: CadastroCompanhiaResseguradaEntity
  ): CadastroCompanhiaResseguradaDto {
    return {
      tipo_documento: entity.tipo_documento,
      tipo_pessoa: CadastroCompanhiaResseguradaMapper.parseTipoPessoa(
        entity.tipo_pessoa
      ),
      pais: entity.pais,
      numero_documento: entity.numero_documento
        ? entity.numero_documento.replace(/\D/g, '')
        : '',
      codigo_susep: entity.codigo_susep,
      companhia_ressegurada: {
        codigo_companhia_ressegurada:
          entity.companhia_ressegurada.codigo_companhia_ressegurada,
        ...(
          entity.companhia_ressegurada.codigo_centro_custo ? {
            codigo_centro_custo:
              entity.companhia_ressegurada.codigo_centro_custo,
          }
            : {}
        ),
      },
      dados_conta: {
        codigo_banco: entity.dados_conta.codigo_banco,
        codigo_agencia: entity.dados_conta.codigo_agencia,
        codigo_tipo_conta:
          CadastroCompanhiaResseguradaMapper.parseCodigoTipoConta(
            entity.dados_conta.codigo_tipo_conta
          ),
        codigo_conta: entity.dados_conta.codigo_conta,
        dac: entity.dados_conta.dac,
      },
      dados_cadastrais: {
        nome_completo: entity.dados_cadastrais.nome_completo,
        nome_fantasia: entity.dados_cadastrais.nome_fantasia,
      },
    } as any;
  }

  private static parseTipoPessoa(tipo: string): string {
    if (!tipo) return '';
    const normalized = tipo.trim().toUpperCase();
    if (normalized.startsWith('J')) {
      return 'J';
    }
    if (normalized.startsWith('F')) {
      return 'F';
    }
    return tipo;
  }

  private static parseCodigoTipoConta(tipoConta: string): string {
    if (!tipoConta) return '';
    const normalized = tipoConta.trim().toLowerCase();

    // Se já for um código curto válido de 1 caracter, retorna ele mesmo em maiúsculo
    if (
      ['C', 'D', 'N', 'G', 'P', 'I', 'F', 'V'].includes(
        normalized.toUpperCase()
      )
    ) {
      return normalized.toUpperCase();
    }

    // Mapeia strings descritivas
    if (normalized.includes('corrente')) return 'C';
    if (normalized.includes('desativada')) return 'D';
    if (
      normalized.includes('não correntista') ||
      normalized.includes('nao correntista')
    )
      return 'N';
    if (normalized.includes('pagamento')) return 'G';
    if (normalized.includes('poupança') || normalized.includes('poupanca'))
      return 'P';
    if (normalized.includes('investimento')) return 'I';
    if (normalized.includes('financeira')) return 'F';
    if (normalized.includes('virtual')) return 'V';

    return tipoConta;
  }
}
