/**
 * Checks a deployed frontend/backend pair without changing accounts, memberships or business data.
 * Produces candidate evidence; operator approval and external email verification remain separate gates.
 * @author Enzo Ribas (https://github.com/oEnzoRibas)
 */
import fs from "node:fs/promises";
import path from "node:path";
import {createHash} from "node:crypto";

const local=process.env.IRR_VERIFICATION_MODE==="local";
const loopback=new Set(["localhost","127.0.0.1","[::1]"]);
/** Restricts verification to explicitly supplied public origins or an explicit loopback rehearsal. */
function target(name,api=false){
  const value=process.env[name];if(!value)throw new Error(`Set ${name}.`);
  const url=new URL(value);
  if(url.username||url.password||url.search||url.hash||url.hostname.endsWith(".railway.internal"))throw new Error(`Invalid public target: ${name}.`);
  if(local?!loopback.has(url.hostname)||!["http:","https:"].includes(url.protocol):url.protocol!=="https:"||loopback.has(url.hostname))throw new Error(`Use public HTTPS targets or explicitly select local loopback verification: ${name}.`);
  if(api?url.pathname.replace(/\/$/,"")!=="/api/v1":url.pathname!=="/")throw new Error(`Invalid target path: ${name}.`);
  return url;
}
const api=target("IRR_API_URL",true),frontend=target("IRR_FRONTEND_URL");
const apiBase=api.origin+"/api/v1";
const expected=JSON.parse(await fs.readFile("docs/api/openapi.json","utf8"));
const baseline=JSON.parse(await fs.readFile("docs/api/baseline.json","utf8"));
const frontendCommit=process.env.IRR_FRONTEND_COMMIT;
if(!/^[a-f0-9]{40}$/.test(frontendCommit??""))throw new Error("Set IRR_FRONTEND_COMMIT to the source SHA of the frontend image being checked.");
const results=[];
/** Limits redirects and never prints response payloads or credentials on failure. */
async function request(url,options={}){
  const response=await fetch(url,{...options,redirect:"error",signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error(`Verification failed: ${new URL(url).pathname} HTTP ${response.status}.`);
  return response;
}
/** Stable comparison ignores only environment-specific server origins, not schemas or security. */
function normalize(value){
  if(Array.isArray(value))return value.map(normalize);
  if(value&&typeof value==="object")return Object.fromEntries(Object.keys(value).sort().map(key=>[key,normalize(value[key])]));
  return value;
}
const digest=value=>{
  const contract={...value};delete contract.servers;
  return createHash("sha256").update(JSON.stringify(normalize(contract))).digest("hex");
};
for(const probe of ["/actuator/health/liveness","/actuator/health/readiness"]){
  const status=await (await request(api.origin+probe)).json();if(status.status!=="UP")throw new Error(`Health not UP: ${probe}.`);results.push(probe);
}
const spec=await (await request(api.origin+"/v3/api-docs")).json();
if(Object.keys(spec.paths??{}).some(endpoint=>!endpoint.startsWith("/api/v1/"))||digest(spec)!==digest(expected))throw new Error("Deployed contract differs from the pinned contract. Review differences before accepting a new baseline.");
results.push("Pinned OpenAPI schemas, operations and security match (environment server URLs excluded)");
const cors=await request(apiBase+"/session/authenticate",{method:"OPTIONS",headers:{Origin:frontend.origin,"Access-Control-Request-Method":"POST","Access-Control-Request-Headers":"content-type"}});
if(cors.headers.get("access-control-allow-origin")!==frontend.origin||!cors.headers.get("access-control-allow-methods")?.split(/\s*,\s*/).includes("POST"))throw new Error("CORS does not allow the exact frontend origin and POST method.");
results.push("Exact public frontend CORS preflight");
await request(frontend.origin+"/health");
let html="";
for(const route of ["/login","/reset-password","/organizations","/users","/routes","/routes/new","/route-executions","/route-executions/new","/intake/collections/new","/reports/operations","/reports/analytics","/sortings","/sortings/new","/pressings","/pressings/new","/inventory","/buyers","/sales","/sales/new"]){
  const response=await request(frontend.origin+route);const page=await response.text();
  if(!response.headers.get("content-type")?.includes("text/html")||!page.includes('id="root"'))throw new Error(`SPA route unavailable: ${route}.`);
  if(route==="/login")html=page;
}
results.push("Frontend health and direct SPA routes");
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)].map(match=>new URL(match[1],frontend));
if(!scripts.length||scripts.length>8||scripts.some(url=>url.origin!==frontend.origin||!url.pathname.startsWith("/assets/")))throw new Error("Unexpected frontend entry assets.");
const bundles=await Promise.all(scripts.map(async url=>(await request(url)).text()));
const content=bundles.join("\n");
if(!content.includes(apiBase)||content.includes("railway.internal")||!local&&/https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/api(?:\/|\b)/.test(content))throw new Error("Served frontend bundle has an incorrect API origin.");
results.push("Served assets use the configured API origin");
const report={verifiedAt:new Date().toISOString(),mode:local?"local-rehearsal":"deployed-candidate",apiOrigin:apiBase,frontendOrigin:frontend.origin,backendContractReference:baseline.backendCommit,frontendSourceCommit:frontendCommit,pinnedOpenapiSha256:baseline.sha256,deployedNormalizedContractSha256:digest(spec),checks:results,apiFrozen:false,remainingGates:["Operator approval and actual image digests/source verification","Database migration history and persistent upload storage verification","External sender/domain configuration and actual inbox recovery smoke","Authenticated global/local workflows, revocation and last administrator protection","Build dependency findings reviewed before release approval"]};
const output=path.resolve(".local/verification",local?"local-pair-verification.json":"deployed-candidate-verification.json");
await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(report,null,2)+"\n");
console.log(`${results.length} read-only integration checks passed; ${report.mode} evidence written under .local/verification. This does not freeze v1 or certify homologation.`);
