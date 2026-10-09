/** @author Enzo Ribas (https://github.com/oEnzoRibas) */

/**
 * Formats exact elapsed seconds without binary rounding. Seconds remain visible below an hour;
 * longer intervals show complete minutes. Months and years are fixed elapsed units (30/365 days),
 * not calendar dates. The report retains its exact seconds separately.
 */
export function displayDuration(value: string): string {
  if (!/^\d+(?:\.\d+)?$/.test(value)) return "Sem informação";
  const [whole, rawFraction = ""] = value.split(".");
  const seconds = BigInt(whole);
  const fraction = rawFraction.replace(/0+$/, "");
  const secondLabel = (amount: bigint) =>
    amount.toString() + (fraction ? "," + fraction : "") + " s";
  if (seconds < 60n) return secondLabel(seconds);
  if (seconds < 3600n) return `${seconds / 60n} min ${secondLabel(seconds % 60n)}`;

  let minutes = seconds / 60n;
  const parts: string[] = [];
  for (const [size, singular, plural] of [
    [525600n, "ano", "anos"],
    [43200n, "mês", "meses"],
    [1440n, "dia", "dias"],
  ] as const) {
    const amount = minutes / size;
    minutes %= size;
    if (amount) parts.push(`${amount} ${amount === 1n ? singular : plural}`);
  }
  parts.push(`${minutes / 60n} h`, `${minutes % 60n} min`);
  return (seconds >= 2592000n ? "≈ " : "") + parts.join(" ");
}
