import { SnackbarService } from '../../../../src/app/shared/services/snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    service = new SnackbarService();
  });

  it('deve iniciar com o snackbar oculto', (done) => {
    service.snackbar$.subscribe((data) => {
      expect(data.show).toBe(false);
      expect(data.message).toBe('');
      expect(data.duration).toBe(3000);
      expect(data.variant).toBe('info');
      done();
    });
  });

  it('deve exibir o snackbar usando os valores padrão de variant e duration', (done) => {
    service.showSnackbar('Mensagem');

    service.snackbar$.subscribe((data) => {
      expect(data.show).toBe(true);
      expect(data.message).toBe('Mensagem');
      expect(data.variant).toBe('info');
      expect(data.duration).toBe(3000);
      done();
    });
  });

  it('deve exibir o snackbar respeitando variant e duration informados', (done) => {
    service.showSnackbar('Erro', 'error', 5000);

    service.snackbar$.subscribe((data) => {
      expect(data.show).toBe(true);
      expect(data.message).toBe('Erro');
      expect(data.variant).toBe('error');
      expect(data.duration).toBe(5000);
      done();
    });
  });

  it('deve ocultar o snackbar mantendo os demais dados', (done) => {
    service.showSnackbar('Sucesso', 'success', 2000);
    service.hideSnackbar();

    service.snackbar$.subscribe((data) => {
      expect(data.show).toBe(false);
      expect(data.message).toBe('Sucesso');
      expect(data.variant).toBe('success');
      expect(data.duration).toBe(2000);
      done();
    });
  });
});
