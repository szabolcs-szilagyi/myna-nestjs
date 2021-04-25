export function emailPurification(email: string) {
  if(!email || typeof email !== 'string') return email;
  return email
    .toLowerCase()
    .replace('/[^a-z0-9_@.-]+/g', '')
    .substr(0, 127);
}
