/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const response = await fetch(process.env.OPENAPI_URL ?? 'http://localhost:9191/v3/api-docs');
if (!response.ok) throw new Error('OpenAPI capture failed: ' + response.status);
const spec = await response.json();
if (Object.keys(spec.paths).some(p => !p.startsWith('/api/v1/'))) throw new Error('Unversioned application contract');
const data = JSON.stringify(spec, null, 2) + '\n';
await fs.mkdir('docs/api', { recursive: true });
await fs.writeFile('docs/api/openapi.json', data);
await fs.writeFile('docs/api/baseline.json', JSON.stringify({backendCommit:'0dc0d1f576a72fd45df981cd8e290e98e82b990b', sha256:createHash('sha256').update(data).digest('hex'), source:'http://localhost:9191/v3/api-docs'},null,2)+'\n');
console.log('Captured ' + Object.keys(spec.paths).length + ' versioned paths. Review the diff before accepting a contract change.');

