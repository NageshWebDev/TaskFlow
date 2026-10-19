export function displayName(email?: string) {
  if (!email) return 'User';
  const local = email.split('@')[0] || 'User';
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function firstNameFromEmail(email?: string) {
  if (!email) return 'there';
  const local = email.split('@')[0] || 'there';
  const part = local.split(/[._-]/)[0] || local;
  return part.charAt(0).toUpperCase() + part.slice(1);
}
