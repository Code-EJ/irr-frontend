/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { expect, it } from "vitest";
import { displayDuration } from "./duration";

it.each([
  ["0", "0 s"],
  ["59.999999", "59,999999 s"],
  ["60", "1 min 0 s"],
  ["63.485280", "1 min 3,48528 s"],
  ["3599.999999", "59 min 59,999999 s"],
  ["3600", "1 h 0 min"],
  ["3661", "1 h 1 min"],
  ["86399", "23 h 59 min"],
  ["86400", "1 dia 0 h 0 min"],
  ["176580", "2 dias 1 h 3 min"],
  ["2592000", "≈ 1 mês 0 h 0 min"],
  ["31536000", "≈ 1 ano 0 h 0 min"],
  ["34218000", "≈ 1 ano 1 mês 1 dia 1 h 0 min"],
  ["63072000", "≈ 2 anos 0 h 0 min"],
])("formats the duration boundary %s as %s", (value, expected) => {
  expect(displayDuration(value)).toBe(expected);
});

it("keeps large totals and tiny fractions exact", () => {
  expect(displayDuration("60.000001")).toBe("1 min 0,000001 s");
  expect(displayDuration("9007199254740993")).toContain("285616414 anos");
});

it.each(["", "-1", "NaN", "1e6", "1,5"])("rejects invalid contract seconds %s", value => {
  expect(displayDuration(value)).toBe("Sem informação");
});
