import { AtualizarResseguradorUseCaseImpl } from '../../../../../../src/app/features/resseguradores/application/usecases/atualizar_ressegurador.app.usecase.impl';
import { ResseguradoresRepository } from '../../../../../../src/app/features/resseguradores/domain/repositories/resseguradores.repository';
import { AtualizarResseguradorRequestEntity } from '../../../../../../src/app/features/resseguradores/domain/entities/request/atualizar_ressegurador_request.entity';
import { ReinsuranceEntityFactory } from '../../../../shared/factories/criar_ressegurador_request_entity.factory';
import { BankAccountEntityFactory } from '../../../../shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from '../../../../shared/factories/registration_data_entity.factory';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from '../../../../../../src/app/shared/domain/enum/person_type.enum';

describe('AtualizarResseguradorUseCaseImpl', () => {
  let usecase: AtualizarResseguradorUseCaseImpl;
  let repositoryMock: jest.Mocked<ResseguradoresRepository>;

  const payload = new AtualizarResseguradorRequestEntity({
    codigoTipoPersona: PersonTypeEnum.J,
    tipoDocumento: DocumentTypeEnum.CNPJ,
    numeroDocumento: '12345678000199',
    pais: 'BR',
    codigoSusep: 12345,
    ressegurador: ReinsuranceEntityFactory.create(),
    dadosConta: BankAccountEntityFactory.create(),
    dadosCadastrais: RegistrationDataEntityFactory.create(),
  });

  beforeEach(() => {
    repositoryMock = {
      buscarRessegurador: jest.fn(),
      listarResseguradores: jest.fn(),
      cadastrarRessegurador: jest.fn(),
      atualizarRessegurador: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
    } as any;

    usecase = new AtualizarResseguradorUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.atualizarRessegurador com o payload recebido e retornar o resultado', async () => {
    repositoryMock.atualizarRessegurador.mockResolvedValue(null);

    const result = await usecase.execute(payload);

    expect(repositoryMock.atualizarRessegurador).toHaveBeenCalledWith(payload);
    expect(result).toBeNull();
  });
});
