/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { expect, it } from "vitest";
import {
  decimal,
  sumWeights,
  displayDecimal,
  localDateTime,
} from "./quantities";
it("preserves four decimal places and adds without binary rounding", () => {
  expect(decimal(" 0,1000 ")).toBe("0.1000");
  expect(sumWeights(["0.1000", "0.2000"])).toBe("0.3000");
  expect(sumWeights(["99999999999.9999", "0.0001"])).toBe("100000000000.0000");
  expect(displayDecimal("123.4500")).toBe("123,4500");
});
it.each(["-1", "0", "1e3", "NaN", "1.00001", "1.234,56", "100000000000", ""])(
  "rejects invalid or out-of-contract line quantity %s",
  (value) => {
    expect(() => decimal(value)).toThrow();
  },
);
it("allows zero distance but rejects more than three distance decimal places", () => {
  expect(decimal("0", 9, 3, true)).toBe("0");
  expect(() => decimal("1.0001", 9, 3, true)).toThrow();
});
it("converts an instant to local form time without changing its wall-clock meaning", () => {
  const value = "2026-09-28T12:30:00Z";
  const local = localDateTime(value);
  expect(new Date(local).getTime()).toBe(new Date(value).getTime());
});
