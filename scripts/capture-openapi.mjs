/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
const source = process.env.OPENAPI_URL ?? "http://localhost:9191/v3/api-docs";
const backendCommit = process.env.BACKEND_COMMIT;
if (!/^[a-f0-9]{40}$/.test(backendCommit ?? ""))
  throw new Error("Set BACKEND_COMMIT to the verified backend's full Git SHA.");
const response = await fetch(source);
if (!response.ok) throw new Error("OpenAPI capture failed: " + response.status);
const spec = await response.json();
if (Object.keys(spec.paths).some((p) => !p.startsWith("/api/v1/")))
  throw new Error("Unversioned application contract");
const data = JSON.stringify(spec, null, 2) + "\n";
await fs.mkdir("docs/api", { recursive: true });
await fs.writeFile("docs/api/openapi.json", data);
await fs.writeFile(
  "docs/api/baseline.json",
  JSON.stringify(
    {
      backendCommit,
      sha256: createHash("sha256").update(data).digest("hex"),
      source,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Captured " +
    Object.keys(spec.paths).length +
    " versioned paths. Review the diff before accepting a contract change.",
);
