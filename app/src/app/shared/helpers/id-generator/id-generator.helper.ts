export class IdGeneratorHelper {
  private static readonly ID_LENGTH = 9;
  private static readonly SHORT_ID_LENGTH = 5;
  
  static generateInstanceId(prefix: string = 'instance'): string {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, this.ID_LENGTH);
    return `${prefix}-${timestamp}-${randomPart}`;
  }
  
  static generateShortId(prefix: string = 'id'): string {
    const randomPart = Math.random().toString(36).substr(2, this.SHORT_ID_LENGTH);
    return `${prefix}-${randomPart}`;
  }
  
  static generateFallbackId(): string {
    return this.generateInstanceId('fallback');
  }

  static generateId(prefix: string = 'id'): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${randomPart}`;
  }

  static generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static generateNumericId(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  static generateTimestampId(): string {
    return Date.now().toString();
  }

  static generateSequentialId(prefix: string = 'seq', counter: number): string {
    return `${prefix}-${counter.toString().padStart(6, '0')}`;
  }
}
