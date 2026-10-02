/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";
const source = process.env.IRR_BACKEND_ENV;
if (!source)
  throw new Error(
    "Set IRR_BACKEND_ENV to the private local backend .env path.",
  );
const values = parseEnv(await readFile(source, "utf8"));
const keys = ["DEV_ADMIN_EMAIL", "DEV_ADMIN_PASSWORD"];
if (keys.some((key) => !values[key]))
  throw new Error("Development administrator credentials are missing.");
const content =
  "# Private development reference; not loaded by Vite. Never commit or use VITE_* keys.\n" +
  keys.map((key) => key + "=" + JSON.stringify(values[key])).join("\n") +
  "\n";
try {
  await writeFile(new URL("../.env-dev", import.meta.url), content, {
    flag: "wx",
  });
  console.log("Created private .env-dev. No credentials were printed.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("Private .env-dev already exists and was preserved.");
}
