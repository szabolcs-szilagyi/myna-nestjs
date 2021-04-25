/**
 * removes special characters and also trims the value to set length
 * NOTE: maybe it does not remove anything
 */
export function mildPurification(value: string) {
  if(!value || typeof value !== 'string') return value;
  return value
    .replace('/[^a-zA-Z0-9_.,:;?!%@&=#*•äöüÄÖÜéáűőúóíÉÁŰŐÚÓÍß"<>\/\n\r -]+/g', '')
    .substr(0, 127);
}
