import { ContextService } from '../../../../src/app/shared/services/context.service';
import { IContext, TokenObject } from '@quickweb/mfe-context';

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(() => {
    service = new ContextService();
  });

  it('deve ser instanciado', () => {
    expect(service).toBeTruthy();
  });

  it('deve definir e recuperar o contexto', () => {
    const mockContext: IContext<any> = {
      token: 'jwt-token-string',
      user: { name: 'Teste' },
    } as any;

    service.setContext(mockContext);
    expect(service.getContext()).toEqual(mockContext);
  });

  describe('getBearerToken', () => {
    it('deve retornar string vazia se o contexto não for configurado ou não tiver token', () => {
      expect(service.getBearerToken()).toBe('');

      service.setContext({} as any);
      expect(service.getBearerToken()).toBe('');
    });

    it('deve retornar o token se ele for uma string simples', () => {
      const mockContext: IContext<any> = {
        token: 'token-string-direta',
      } as any;

      service.setContext(mockContext);
      expect(service.getBearerToken()).toBe('token-string-direta');
    });

    it('deve retornar o token marcado como default se o token for um array de TokenObject', () => {
      const tokens: TokenObject[] = [
        {
          name: 'Token 1',
          value: 'val-1',
          default: false,
          provider: 'mock-provider',
        },
        {
          name: 'Token 2',
          value: 'val-2',
          default: true,
          provider: 'mock-provider',
        },
        {
          name: 'Token 3',
          value: 'val-3',
          default: false,
          provider: 'mock-provider',
        },
      ];
      const mockContext: IContext<any> = {
        token: tokens,
      } as any;

      service.setContext(mockContext);
      expect(service.getBearerToken()).toBe('val-2');
    });

    it('deve retornar o primeiro token se nenhum estiver marcado como default', () => {
      const tokens: TokenObject[] = [
        {
          name: 'Token 1',
          value: 'val-1',
          default: false,
          provider: 'mock-provider',
        },
        {
          name: 'Token 2',
          value: 'val-2',
          default: false,
          provider: 'mock-provider',
        },
      ];
      const mockContext: IContext<any> = {
        token: tokens,
      } as any;

      service.setContext(mockContext);
      expect(service.getBearerToken()).toBe('val-1');
    });

    it('deve retornar string vazia se o array de tokens estiver vazio', () => {
      const mockContext: IContext<any> = {
        token: [],
      } as any;

      service.setContext(mockContext);
      expect(service.getBearerToken()).toBe('');
    });
  });
});
