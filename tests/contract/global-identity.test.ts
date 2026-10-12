/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {loadEnvFile} from "node:process";
import {randomUUID} from "node:crypto";
import {afterAll,beforeAll,expect,it,vi} from "vitest";
import {isAxiosError} from "axios";
import {apiClient} from "../../src/shared/api/client";
import {session} from "../../src/shared/api/session";
import {accounts,authenticate,currentAccount,organizations,organizationAdministration as administration,requestRecovery,confirmRecovery} from "../../src/features/identity/api";

if(!process.env.IRR_BACKEND_ENV)throw new Error("Set IRR_BACKEND_ENV to a private local rehearsal file.");
loadEnvFile(process.env.IRR_BACKEND_ENV);
const catcher=process.env.IRR_MAILPIT_URL??"http://localhost:8025";
if([apiClient.defaults.baseURL!,catcher].some(url=>!["localhost","127.0.0.1"].includes(new URL(url).hostname)))throw new Error("Identity verification is local-only.");
const storage=new Map<string,string>();
vi.stubGlobal("localStorage",{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key)});
let rootToken="";const userIds:string[]=[],organizationIds:string[]=[];
async function safe<T>(operation:Promise<T>):Promise<T>{try{return await operation;}catch(error){throw new Error(isAxiosError(error)?`Identity request failed: ${error.response?.status??"network"}`:"Identity verification failed");}}
async function status(operation:Promise<unknown>){try{await operation;return 200;}catch(error){return isAxiosError(error)?error.response?.status:0;}}
beforeAll(async()=>{rootToken=await safe(authenticate(process.env.DEV_ADMIN_EMAIL!,process.env.DEV_ADMIN_PASSWORD!));session.setToken(rootToken);});
afterAll(async()=>{session.setToken(rootToken);for(const id of userIds)await safe(accounts.deactivate(id));for(const id of organizationIds)await safe(administration.deactivate(id));session.clear();});

it("operates globally without membership and preserves local manager boundaries after demotion",async()=>{
  session.setToken(rootToken);const password=randomUUID(),email=`global-${randomUUID()}@example.test`;
  const administrator=await safe(accounts.create({fullName:"Global contract fixture",email,password,userRole:"ADMINISTRATOR"}));userIds.push(administrator.id!);
  const org=await safe(administration.create({name:`Global organization ${randomUUID()}`,organizationType:"COOPERATIVE"}));organizationIds.push(org.id!);
  const foreign=await safe(administration.create({name:`Foreign organization ${randomUUID()}`,organizationType:"ASSOCIATION"}));organizationIds.push(foreign.id!);
  session.setToken(await safe(authenticate(email,password)));session.selectOrganization(org.id!);
  expect((await safe(organizations())).some(value=>value.id===org.id)).toBe(true);
  expect(await status(apiClient.get("/vehicles",{headers:{"X-Organization-Id":org.id!}}))).toBe(200);
  expect(await status(apiClient.get(`/organizations/${org.id}/membership`))).toBe(404);
  session.setToken(rootToken);
  await safe(accounts.update(administrator.id!,{fullName:"Organization manager fixture",email,userRole:"REPRESENTATIVE"}));
  await safe(administration.grant(org.id!,administrator.id!,"MANAGER"));
  session.setToken(await safe(authenticate(email,password)));session.selectOrganization(org.id!);
  expect((await safe(organizations())).some(value=>value.id===foreign.id)).toBe(false);
  expect(await status(accounts.create({fullName:"Forbidden",email:`forbidden-${randomUUID()}@example.test`,password,userRole:"ADMINISTRATOR"}))).toBe(403);
  expect(await status(administration.create({name:"Forbidden",organizationType:"COOPERATIVE"}))).toBe(403);
  expect(await status(apiClient.get(`/organizations/${foreign.id}`))).toBe(404);
  session.selectOrganization(foreign.id!);
  expect(await status(apiClient.get("/vehicles",{headers:{"X-Organization-Id":foreign.id!}}))).toBe(404);
  session.setToken(rootToken);await safe(administration.update(org.id!,{name:"Updated contract organization",organizationType:"COOPERATIVE"}));
  expect((await safe(administration.get(org.id!))).name).toBe("Updated contract organization");
  await safe(administration.revoke(org.id!,administrator.id!));
  expect((await safe(administration.membership(org.id!,administrator.id!))).active).toBe(false);
});

/** Reads only isolated catcher messages and never puts a real token into assertion diagnostics. */
async function capturedToken(email:string){
  for(let attempt=0;attempt<30;attempt++){
    const response=await fetch(catcher+"/api/v1/messages");if(!response.ok)throw new Error("Local catcher unavailable");
    const body=await response.json() as {messages:{ID:string;To:{Address:string}[]}[]};
    const message=body.messages.find(item=>item.To?.some(recipient=>recipient.Address===email));
    if(message){const detail=await fetch(catcher+"/api/v1/message/"+message.ID);if(!detail.ok)throw new Error("Local message unavailable");
      const content=await detail.json() as {Text:string};const match=content.Text.match(/#token=([A-Za-z0-9_-]{43})/);if(!match)throw new Error("Recovery message missing a valid link");return match[1];}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw new Error("Local recovery delivery timed out");
}

it("changes credentials through a real captured email, rejects replay and revokes old login",async()=>{
  session.setToken(rootToken);const password=randomUUID(),replacement=randomUUID(),email=`recovery-${randomUUID()}@example.test`;
  const account=await safe(accounts.create({fullName:"Mail contract fixture",email,password,userRole:"REPRESENTATIVE"}));userIds.push(account.id!);
  const old=await safe(authenticate(email,password));session.setToken(old);
  await safe(requestRecovery(`absent-${randomUUID()}@example.test`));await safe(requestRecovery(email));
  const token=await capturedToken(email);await safe(confirmRecovery(token,replacement));
  expect(await status(confirmRecovery(token,randomUUID()))).toBe(400);
  expect(await status(currentAccount())).toBe(401);
  expect(await status(authenticate(email,password))).toBe(401);
  session.setToken(await safe(authenticate(email,replacement)));
  expect((await safe(currentAccount())).id).toBe(account.id);
});
