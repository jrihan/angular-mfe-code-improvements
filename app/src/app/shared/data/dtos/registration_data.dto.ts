import { AddressDto } from './address.dto';
import { EmailDto } from './email.dto';
import { PhoneDto } from './phone.dto';

export interface RegistrationDataDto {
  nome_completo: string;
  nome_fantasia: string;
  tipo_documento: string;
  numero_documento: string;
  pais: string;
  enderecos?: AddressDto[];
  telefones?: PhoneDto[];
  emails?: EmailDto[];
}
