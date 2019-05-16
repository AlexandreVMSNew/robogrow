export function removeNonDigitValues(value: string): string {
  return value ? value.replace(/[^0-9]/g, '').trim() : value;
}
