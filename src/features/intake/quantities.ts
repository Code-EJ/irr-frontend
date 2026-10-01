/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
/** Normalizes a localized decimal without binary floating-point conversion. */
export function decimal(
  value: string,
  integerDigits = 11,
  fractionDigits = 4,
  allowZero = false,
): string {
  const normalized = value.trim().replace(",", ".");
  if (
    !new RegExp(
      "^[0-9]{1," + integerDigits + "}(?:\\.[0-9]{1," + fractionDigits + "})?$",
    ).test(normalized) ||
    (!allowZero && !/[1-9]/.test(normalized))
  )
    throw new Error(
      "Informe um valor " +
        (allowZero ? "não negativo" : "positivo") +
        " com até " +
        fractionDigits +
        " casas decimais, sem separador de milhar.",
    );
  return normalized;
}
/** Required declared total only; the backend independently derives and validates inventory semantics. */
export function sumWeights(values: string[]): string {
  const total = values.reduce((sum, value) => {
    const [whole, fraction = ""] = decimal(value).split(".");
    return sum + BigInt(whole) * 10000n + BigInt(fraction.padEnd(4, "0"));
  }, 0n);
  return (
    (total / 10000n).toString() +
    "." +
    (total % 10000n).toString().padStart(4, "0")
  );
}
/** Presents exact wire values using a decimal comma, without rounding their precision. */
export function displayDecimal(value: string | undefined) {
  return value?.replace(".", ",") ?? "—";
}
export function localDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}
/** Retains the original instant, including sub-minute precision, when its displayed value is unchanged. */
export function submittedInstant(local: string, original?: string): string {
  return original && local === localDateTime(original)
    ? original
    : new Date(local).toISOString();
}
