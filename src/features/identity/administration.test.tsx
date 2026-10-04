// @vitest-environment jsdom
/** @author Enzo Ribas (https://github.com/oEnzoRibas) */
import {StrictMode} from "react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {cleanup,render,screen,waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from "react-router-dom";
import {AxiosError,AxiosHeaders,type InternalAxiosRequestConfig} from "axios";
import {apiClient} from "../../shared/api/client";
import {session} from "../../shared/api/session";
import {SessionProvider,useSession} from "./SessionProvider";
import UserPage from "./UserPage";
import {ResponsibleOnboarding,OrganizationPage} from "./OrganizationsPage";
import RecoveryPage,{ResetPasswordPage} from "./RecoveryPage";

const actor={id:"global",fullName:"Global fixture",email:"global@example.test",userRole:"ADMINISTRATOR",mustChangePassword:false};
function response(config:InternalAxiosRequestConfig,data:unknown=null,status=200){return {config,data,status,statusText:"Fixture",headers:new AxiosHeaders()};}
function reject(config:InternalAxiosRequestConfig,status:number){return new AxiosError("Fixture failure",String(status),config,undefined,response(config,{},status));}
beforeEach(()=>{localStorage.clear();session.setToken("fixture-session");window.history.replaceState({},"","/");
  Object.defineProperty(HTMLDialogElement.prototype,"showModal",{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute("open","");}});
  Object.defineProperty(HTMLDialogElement.prototype,"close",{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute("open");}});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();session.clear();});

it("selects organizations for global administration without requesting a fabricated membership",async()=>{
  const paths:string[]=[];session.selectOrganization("org");
  apiClient.defaults.adapter=async config=>{paths.push(config.url!);return response(config,config.url==="/users/me"?actor:{content:[{id:"org",name:"Org"}],totalElements:1});};
  function Inspect(){const state=useSession();return <p>{state.loading?"Loading":`${state.canManage} / ${state.membership===null}`}</p>;}
  render(<SessionProvider><Inspect/></SessionProvider>);
  await screen.findByText("true / true");expect(paths).toEqual(["/users/me","/organizations"]);
});

it("keeps organization management permission local and checks membership for ordinary accounts",async()=>{
  session.selectOrganization("org");
  apiClient.defaults.adapter=async config=>response(config,config.url==="/users/me"?{...actor,userRole:"REPRESENTATIVE"}:config.url==="/organizations"?{content:[{id:"org"}],totalElements:1}:{organizationId:"org",role:"MEMBER",active:true});
  function Inspect(){const state=useSession();return <p>{state.loading?"Loading":`Manage: ${state.canManage}`}</p>;}
  render(<SessionProvider><Inspect/></SessionProvider>);await screen.findByText("Manage: false");
});

it("creates a global administrator through the same account contract",async()=>{
  let created=0;
  apiClient.defaults.adapter=async config=>{
    if(config.method==="post"){const input=JSON.parse(config.data);expect(input.userRole).toBe("ADMINISTRATOR");created++;return response(config,{id:"created"},201);}
    return response(config,config.url==="/users/me"?actor:{content:[],totalElements:0});
  };
  const user=userEvent.setup();render(<MemoryRouter initialEntries={["/users/new"]}><SessionProvider><Routes><Route path="/users/new" element={<UserPage/>}/><Route path="/users/created" element={<p>Created administrator</p>}/></Routes></SessionProvider></MemoryRouter>);
  await user.type(screen.getByLabelText("Nome completo"),"New administrator");await user.type(screen.getByLabelText("E-mail"),"new@example.test");await user.selectOptions(screen.getByLabelText("Perfil na plataforma"),"ADMINISTRATOR");
  await user.type(screen.getByLabelText("Senha"),"new-password");await user.type(screen.getByLabelText("Confirmar senha"),"new-password");await user.click(screen.getByRole("button",{name:"Criar usuário"}));
  await screen.findByText("Created administrator");expect(created).toBe(1);
});

it("displays the last-administrator conflict without hiding administrator lifecycle controls",async()=>{
  apiClient.defaults.adapter=async config=>{if(config.method==="delete")throw reject(config,409);return response(config,config.url==="/users/me"?actor:config.url==="/users/target"?{...actor,id:"target"}:{content:[],totalElements:0});};
  const user=userEvent.setup();render(<MemoryRouter initialEntries={["/users/target"]}><SessionProvider><Routes><Route path="/users/:id" element={<UserPage/>}/></Routes></SessionProvider></MemoryRouter>);
  await user.click(await screen.findByRole("button",{name:"Desativar usuário"}));await user.click(screen.getByRole("button",{name:"Confirmar desativação"}));
  expect((await screen.findByRole("alert")).textContent).toContain("último Administrador Geral");expect(session.getToken()).toBe("fixture-session");
});

it("creates an organization before responsible onboarding",async()=>{
  let creates=0;apiClient.defaults.adapter=async config=>{
    if(config.method==="post"){creates++;expect(JSON.parse(config.data)).toEqual({name:"New organization",organizationType:"COOPERATIVE"});return response(config,{id:"new-org",name:"New organization",organizationType:"COOPERATIVE"},201);}
    return response(config,config.url==="/users/me"?actor:{content:[],totalElements:0});
  };
  const user=userEvent.setup();render(<MemoryRouter><SessionProvider><OrganizationPage/></SessionProvider></MemoryRouter>);
  await user.type(screen.getByLabelText("Nome da organização"),"New organization");await user.click(screen.getByRole("button",{name:"Criar organização"}));
  await screen.findByRole("heading",{name:"Administrador da Organização"});expect(creates).toBe(1);expect(screen.getByLabelText("Nome da organização").matches(":disabled")).toBe(true);
});

it("retries a failed responsible grant without recreating the user",async()=>{
  let creates=0,grants=0,completed=0;
  apiClient.defaults.adapter=async config=>{
    if(config.method==="post"){creates++;return response(config,{id:"responsible",fullName:"Responsible",email:"responsible@example.test"},201);}
    if(config.method==="put"){grants++;expect(config.url).toBe("/organizations/org/members/responsible");expect(JSON.parse(config.data)).toEqual({role:"MANAGER"});if(grants===1)throw reject(config,409);return response(config,{role:"MANAGER",active:true});}
    return response(config,{content:[],totalPages:0,totalElements:0});
  };
  const user=userEvent.setup();render(<ResponsibleOnboarding organization={{id:"org",name:"Org"}} onComplete={()=>completed++}/>);
  await user.click(screen.getByRole("button",{name:"Criar responsável"}));await user.type(screen.getByLabelText("Nome do responsável"),"Responsible");await user.type(screen.getByLabelText("E-mail do responsável"),"responsible@example.test");await user.type(screen.getByLabelText("Senha inicial"),"new-password");await user.type(screen.getByLabelText("Confirmar senha inicial"),"new-password");
  await user.click(screen.getByRole("button",{name:"Criar conta do responsável"}));await user.click(await screen.findByRole("button",{name:"Confirmar responsável"}));await screen.findByRole("alert");
  await user.click(screen.getByRole("button",{name:"Confirmar responsável"}));await waitFor(()=>expect(completed).toBe(1));expect(creates).toBe(1);expect(grants).toBe(2);
});

it("requests recovery without bearer credentials and displays neutral success",async()=>{
  apiClient.defaults.adapter=async config=>{expect(config.headers.get("Authorization")).toBeUndefined();expect(config.url).toBe("/session/password-recovery/request");return response(config,null,202);};
  const user=userEvent.setup();render(<MemoryRouter><RecoveryPage/></MemoryRouter>);await user.type(screen.getByLabelText("E-mail"),"absent@example.test");await user.click(screen.getByRole("button",{name:"Enviar instruções"}));
  expect((await screen.findByRole("status")).textContent).toContain("Se houver uma conta ativa");expect(screen.queryByDisplayValue("absent@example.test")).toBeNull();
});

it("removes the reset fragment, validates confirmation and clears secrets after completion",async()=>{
  const token="a".repeat(43);window.history.replaceState({},"",`/reset-password#token=${token}`);let submissions=0;
  apiClient.defaults.adapter=async config=>{submissions++;expect(JSON.parse(config.data)).toEqual({token,newPassword:"new-password"});expect(config.headers.get("Authorization")).toBeUndefined();return response(config,null,204);};
  const user=userEvent.setup();render(<StrictMode><MemoryRouter initialEntries={["/reset-password"]}><Routes><Route path="/reset-password" element={<ResetPasswordPage/>}/><Route path="/login" element={<p>Login</p>}/></Routes></MemoryRouter></StrictMode>);
  expect(window.location.hash).toBe("");await user.type(screen.getByLabelText("Nova senha"),"new-password");await user.type(screen.getByLabelText("Confirmar nova senha"),"mismatch");await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));expect(submissions).toBe(0);
  await user.clear(screen.getByLabelText("Confirmar nova senha"));await user.type(screen.getByLabelText("Confirmar nova senha"),"new-password");await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));await screen.findByText("Login");expect(session.getToken()).toBeNull();expect(Object.values(localStorage)).not.toContain(token);
});

it("handles used recovery authorization without exposing provider diagnostics",async()=>{
  window.history.replaceState({},"",`/reset-password#token=${"b".repeat(43)}`);
  apiClient.defaults.adapter=async config=>{throw reject(config,400);};const user=userEvent.setup();render(<MemoryRouter><ResetPasswordPage/></MemoryRouter>);
  await user.type(screen.getByLabelText("Nova senha"),"new-password");await user.type(screen.getByLabelText("Confirmar nova senha"),"new-password");await user.click(screen.getByRole("button",{name:"Salvar nova senha"}));
  expect((await screen.findByRole("alert")).textContent).toContain("expirou ou já foi utilizado");expect(screen.queryByLabelText("Nova senha")).toBeNull();
});
