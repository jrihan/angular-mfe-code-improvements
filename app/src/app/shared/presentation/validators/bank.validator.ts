import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class BankValidators {
  
  // Validador de SWIFT (8 ou 11 caracteres alfanuméricos)
  static swiftValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Regex para SWIFT: 4 letras (banco) + 2 letras (país) + 2 alfanuméricos (cidade) + opcionalmente 3 alfanuméricos (agência)
      const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
      const isValid = swiftRegex.test(value.toUpperCase());

      return isValid ? null : { invalidSwift: true };
    };
  }

  // Validador de IBAN (algoritmo MOD 97)
  static ibanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Remove espaços e converte para maiúsculas
      const iban = value.replace(/\s+/g, '').toUpperCase();

      // Validação básica de tamanho e formato por país (exemplo genérico simplificado)
      if (iban.length < 15 || iban.length > 34) {
        return { invalidIban: true };
      }

      // Validação matemática oficial do IBAN (Módulo 97)
      if (!BankValidators.validateIbanChecksum(iban)) {
        return { invalidIban: true };
      }

      return null;
    };
  }

  private static validateIbanChecksum(iban: string): boolean {
    // 1. Move os 4 primeiros caracteres para o final da string
    const rearranged = iban.slice(4) + iban.slice(0, 4);

    // 2. Substitui cada letra por seu valor numérico (A=10, B=11, ..., Z=35)
    let numericIban = '';
    for (let i = 0; i < rearranged.length; i++) {
      const char = rearranged.charAt(i);
      const code = char >= 'A' && char <= 'Z' ? (char.charCodeAt(0) - 55).toString() : char;
      numericIban += code;
    }

    // 3. Calcula o resto sem converter a string inteira para um número grande.
    let remainder = 0;
    for (const digit of numericIban) {
      if (!/\d/.test(digit)) {
        return false;
      }
      remainder = (remainder * 10 + Number(digit)) % 97;
    }

    return remainder === 1;
  }
}