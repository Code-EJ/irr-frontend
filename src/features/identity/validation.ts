/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
/** Mirrors the documented BCrypt input limit; server validation remains authoritative. */
export function passwordError(password: string, confirmation: string): string {
  if (password.length < 8 || new TextEncoder().encode(password).length >= 72)
    return "Use pelo menos 8 caracteres e menos de 72 bytes na senha.";
  if (password !== confirmation) return "As senhas não coincidem.";
  return "";
}
