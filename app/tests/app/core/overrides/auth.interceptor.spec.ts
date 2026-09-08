import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from 'src/app/core/overrides/auth.interceptor';
import { ContextService } from 'src/app/shared/services/context.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let contextServiceMock: jest.Mocked<ContextService>;

  beforeEach(() => {
    contextServiceMock = {
      getBearerToken: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: ContextService, useValue: contextServiceMock },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('deve ser criado', () => {
    expect(interceptor).toBeTruthy();
  });

  it('deve adicionar o cabeçalho Authorization se houver token', () => {
    contextServiceMock.getBearerToken.mockReturnValue('meu-token-secreto');
    const request = new HttpRequest('GET', '/api/test');

    const next: HttpHandler = {
      handle: jest.fn((clonedReq: HttpRequest<any>) => {
        expect(clonedReq.headers.get('Authorization')).toBe(
          'Bearer meu-token-secreto'
        );
        return of({} as HttpEvent<any>);
      }),
    };

    interceptor.intercept(request, next).subscribe();
    expect(next.handle).toHaveBeenCalled();
  });

  it('não deve adicionar o cabeçalho Authorization se não houver token', () => {
    contextServiceMock.getBearerToken.mockReturnValue('');
    const request = new HttpRequest('GET', '/api/test');

    const next: HttpHandler = {
      handle: jest.fn((clonedReq: HttpRequest<any>) => {
        expect(clonedReq.headers.has('Authorization')).toBeFalsy();
        return of({} as HttpEvent<any>);
      }),
    };

    interceptor.intercept(request, next).subscribe();
    expect(next.handle).toHaveBeenCalled();
  });
});
