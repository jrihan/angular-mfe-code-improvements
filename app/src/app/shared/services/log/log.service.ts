import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomLogService {
  /** ID único da instância do LogService (gerado automaticamente) */
  debug(message: string, ...data: any[]): void {
    console.debug('[DEBUG]', message, ...data);
  }

  info(message: string, ...data: any[]): void {
    console.info('[INFO]', message, ...data);
  }

  notice(message: string, ...data: any[]): void {
    console.info('[NOTICE]', message, ...data);
  }

  warn(message: string, ...data: any[]): void {
    console.warn('[WARN]', message, ...data);
  }

  error(message: string, ...data: any[]): void {
    console.error('[ERROR]', message, ...data);
  }

  critical(message: string, ...data: any[]): void {
    console.error('[CRITICAL]', message, ...data);
  }

  alert(message: string, ...data: any[]): void {
    console.error('[ALERT]', message, ...data);
  }

  emergency(message: string, ...data: any[]): void {
    console.error('[EMERGENCY]', message, ...data);
  }

  ok(message: string, ...data: any[]): void {
    console.log('[OK]', message, ...data);
  }
}

export { CustomLogService as LogService };
