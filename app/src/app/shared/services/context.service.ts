import { Injectable } from '@angular/core';
import { IContext, TokenObject } from '@quickweb/mfe-context';

@Injectable({ providedIn: 'root' })
export class ContextService {
  private _context: IContext<any> | null = null;

  setContext(context: IContext<any>): void {
    this._context = context;
  }

  getContext(): IContext<any> | null {
    return this._context;
  }

  /**
   * Resolve o Bearer token independentemente de o campo `token` ser
   * uma string simples ou um array de TokenObject.
   * Prioriza o item com `default: true`; caso não exista, usa o primeiro.
   */
  getBearerToken(): string {
    const token = this._context?.token;
    if (!token) return '';
    if (typeof token === 'string') return token;
    const defaultToken = (token as TokenObject[]).find((t) => t.default);
    return defaultToken?.value ?? (token as TokenObject[])[0]?.value ?? '';
  }
}
