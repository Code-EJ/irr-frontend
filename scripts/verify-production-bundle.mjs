/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import fs from "node:fs/promises";
import {parseEnv} from "node:util";
const expected=process.env.VITE_API_BASE_URL;
if(!expected)throw new Error("Set the public production VITE_API_BASE_URL.");
const url=new URL(expected);
if(url.protocol!=="https:"||["localhost","127.0.0.1","[::1]"].includes(url.hostname)||url.hostname.endsWith(".railway.internal")||url.pathname!=="/api/v1")
  throw new Error("Production requires a public HTTPS /api/v1 origin.");
const files=(await fs.readdir("dist/assets")).filter(file=>/\.(js|css)$/.test(file));
const bundle=(await Promise.all(files.map(file=>fs.readFile("dist/assets/"+file,"utf8")))).join("\n");
if(!bundle.includes(expected)||bundle.includes("railway.internal")||/https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/api(?:\/|\b)/.test(bundle))
  throw new Error("Production API origin verification failed.");
// React Router retains a non-network localhost placeholder for relative-URL parsing. It is not an API endpoint.
for(const file of [".env-dev",process.env.IRR_BACKEND_ENV].filter(Boolean)){
  let text;try{text=await fs.readFile(file,"utf8");}catch(error){if(error.code==="ENOENT")continue;throw error;}
  const values=parseEnv(text);
  for(const [key,value] of Object.entries(values)){
    if(/PASSWORD|PRIVATE_KEY|API_KEY|DEV_ADMIN_EMAIL/.test(key)&&value.length>=8&&bundle.includes(value))
      throw new Error("A private development value was included in the bundle.");
  }
}
console.log("Public HTTPS API origin verified; no local API/internal hostname or supplied private credential in the bundle.");
