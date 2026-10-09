/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
export type Appearance = { theme: "system" | "light" | "dark"; scale: 100 | 125 | 150 | 200; contrast: boolean };
export const defaultAppearance: Appearance = { theme: "system", scale: 100, contrast: false };
export const appearanceKey = "irr.appearance.v1";

/** Reads only validated visual preferences; unavailable browser storage remains non-fatal. */
export function readAppearance(): Appearance {
  try {
    const value = JSON.parse(localStorage.getItem(appearanceKey) ?? "null");
    if (!value) return { ...defaultAppearance };
    return {
      theme: ["system", "light", "dark"].includes(value.theme) ? value.theme : "system",
      scale: [100, 125, 150, 200].includes(value.scale) ? value.scale : 100,
      contrast: value.contrast === true,
    };
  } catch { return { ...defaultAppearance }; }
}

/** Applies appearance without altering browser zoom, identity, organization or API state. */
export function applyAppearance(value: Appearance) {
  const dark = value.theme === "dark" || (value.theme === "system" &&
    typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.dataset.contrast = value.contrast ? "high" : "normal";
  document.documentElement.style.fontSize = value.scale + "%";
}

export function saveAppearance(value: Appearance) {
  applyAppearance(value);
  try { localStorage.setItem(appearanceKey, JSON.stringify(value)); } catch { /* Keep session preferences when storage is unavailable. */ }
}
