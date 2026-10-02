/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
const bytes = await fs.readFile("docs/api/openapi.json");
const baseline = JSON.parse(
  await fs.readFile("docs/api/baseline.json", "utf8"),
);
if (createHash("sha256").update(bytes).digest("hex") !== baseline.sha256)
  throw new Error(
    "Pinned OpenAPI digest mismatch. Review and capture the approved contract explicitly.",
  );
const spec = JSON.parse(bytes);
let operations = 0;
for (const [path, item] of Object.entries(spec.paths)) {
  if (!path.startsWith("/api/v1/"))
    throw new Error("Unversioned application path: " + path);
  for (const [method, operation] of Object.entries(item)) {
    if (
      !["get", "post", "put", "patch", "delete", "head", "options"].includes(
        method,
      )
    )
      continue;
    if (operation.deprecated)
      throw new Error("Deprecated operation: " + method + " " + path);
    operations++;
  }
}
console.log(
  `Verified ${operations} supported v1 operations at backend ${baseline.backendCommit.slice(0, 7)}.`,
);
