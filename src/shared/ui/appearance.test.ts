// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { applyAppearance, appearanceKey, readAppearance, saveAppearance } from "./appearance";
beforeEach(() => localStorage.clear());
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); document.documentElement.removeAttribute("style"); });
it("validates stored preferences without letting malformed values affect application state", () => {
  localStorage.setItem(appearanceKey, '{"theme":"invalid","scale":10000,"contrast":"yes"}');
  expect(readAppearance()).toEqual({theme:"system",scale:100,contrast:false});
  localStorage.setItem(appearanceKey, "broken");
  expect(readAppearance().scale).toBe(100);
});
it("uses device color preference and saves independent contrast/font choices", () => {
  vi.stubGlobal("matchMedia", () => ({matches:true}));
  applyAppearance({theme:"system",scale:150,contrast:true});
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(document.documentElement.dataset.contrast).toBe("high");
  expect(document.documentElement.style.fontSize).toBe("150%");
  saveAppearance({theme:"light",scale:200,contrast:false});
  expect(readAppearance()).toEqual({theme:"light",scale:200,contrast:false});
});
it("keeps appearance functional when browser storage throws", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {throw new Error("Unavailable");});
  expect(() => saveAppearance({theme:"dark",scale:125,contrast:true})).not.toThrow();
  expect(document.documentElement.dataset.theme).toBe("dark");
});
