import { AtualizarBrokerUseCaseImpl } from '../../../../../../src/app/features/brokers/application/usecases/atualizar_broker.app.usecase.impl';
import { BrokersRepository } from '../../../../../../src/app/features/brokers/domain/repositories/brokers.repository';
import { AtualizarBrokerRequestEntity } from '../../../../../../src/app/features/brokers/domain/entities/request/atualizar_broker_request.entity';
import { BankAccountEntityFactory } from '../../../../shared/factories/bank_account_entity.factory';
import { RegistrationDataEntityFactory } from '../../../../shared/factories/registration_data_entity.factory';
import { DocumentTypeEnum } from '../../../../../../src/app/shared/domain/enum/document_type.enum';
import { PersonTypeEnum } from '../../../../../../src/app/shared/domain/enum/person_type.enum';

describe('AtualizarBrokerUseCaseImpl', () => {
  let usecase: AtualizarBrokerUseCaseImpl;
  let repositoryMock: jest.Mocked<BrokersRepository>;

  const payload = new AtualizarBrokerRequestEntity({
    codigoTipoPersona: PersonTypeEnum.J,
    tipoDocumento: DocumentTypeEnum.CNPJ,
    numeroDocumento: '12345678000199',
    pais: 'BR',
    codigoSusep: 12345,
    dadosConta: BankAccountEntityFactory.create(),
    dadosCadastrais: RegistrationDataEntityFactory.create(),
  });

  beforeEach(() => {
    repositoryMock = {
      buscarBroker: jest.fn(),
      listarBrokers: jest.fn(),
      cadastrarBroker: jest.fn(),
      buscarDadosCadastrais: jest.fn(),
      buscarInstituicoesFinanceiras: jest.fn(),
      atualizarBroker: jest.fn(),
    } as any;

    usecase = new AtualizarBrokerUseCaseImpl(repositoryMock);
  });

  it('deve chamar o repository.atualizarBroker com o payload recebido e retornar o resultado', async () => {
    repositoryMock.atualizarBroker.mockResolvedValue(null);

    const result = await usecase.execute(payload);

    expect(repositoryMock.atualizarBroker).toHaveBeenCalledWith(payload);
    expect(result).toBeNull();
  });
});
