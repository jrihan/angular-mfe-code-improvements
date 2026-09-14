export function formatSwift(value: string): string {
  if (!value) return '';
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
}

export function formatIban(value: string): string {
  if (!value) return '';
  const cleaned = value
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 34);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}