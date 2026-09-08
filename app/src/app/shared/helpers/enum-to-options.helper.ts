import { IdsOption } from '@ids/angular';

export function enumToOptions(
  enumObject: Record<string, string>
): IdsOption[] {
  return Object.values(enumObject).map((value) => ({
    optLabel: value,
    optValue: value,
  }));
}
