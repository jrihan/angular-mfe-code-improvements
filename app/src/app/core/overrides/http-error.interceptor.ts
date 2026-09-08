import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SnackbarService } from '../../shared/services/snackbar.service';

/**
 * Interface que representa o modelo de payload de erro padronizado retornado pela API de Resseguro
 */
export interface ApiErrorResponsePayload {
  detail?: string;
  instance?: string;
  status?: number;
  title?: string;
  type?: string;
  timestamp?: string;
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly snackbarService: SnackbarService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro inesperado.';

        if (error.error) {
          // Se o backend retornou o payload padronizado, priorizamos o campo 'detail' ou 'title'
          const apiError = error.error as ApiErrorResponsePayload;
          if (apiError.detail) {
            errorMessage = apiError.detail;
          } else if (apiError.title) {
            errorMessage = apiError.title;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Exibe um feedback visual amigável e unificado (Snackbar vermelho de erro) para todas as requisições falhas
        this.snackbarService.showSnackbar(errorMessage, 'error', 30000);

        // Repassa o erro empacotado para que as camadas superiores (Components/UseCases) também possam reagir se necessário
        return throwError(() => error);
      })
    );
  }
}
