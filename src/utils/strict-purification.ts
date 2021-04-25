export function strictPurification(value: string) {
  if(!value || typeof value !== 'string') return value;
  return value
    .replace('/[^a-zA-Z0-9-]+/g', '')
}
